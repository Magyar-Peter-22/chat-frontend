import Box from '@mui/material/Box';
import {
    useInfiniteQuery,
    useQueryClient
} from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { AnimatePresence, motion } from "framer-motion";
import React, { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import handleRealtime from './HandleRealtime';
import ListMessage from './ListMessage';
import Message from './Message';
import UpdateUser from './UpdateUser';
import { SocketContext } from '../Connected';
import { useTranslation } from 'react-i18next';
import constants from '../constants';

const Chat = forwardRef(({ sx, room, ...props }, ref) => {
    const queryKey = useMemo(() => ["messages", room], [room]);
    const parentRef = useRef(null);
    const prevIdRef = useRef(0);
    const [toBottom, setToBottom] = useState(true);
    const [realTime, setRealtime] = useState([]);
    const queryClient = useQueryClient();
    const { t } = useTranslation(["main"]);
    const socket=useContext(SocketContext);

    ////handle infinite list queries
    const {
        status,
        data,
        error,
        isFetchingNextPage,
        isFetchingPreviousPage,
        hasPreviousPage,
        fetchPreviousPage,
    } = useInfiniteQuery({
        queryKey: queryKey,
        queryFn: async(ctx)=>fetchMessages(ctx,socket),
        getNextPageParam: (lastPage) => lastPage?.nextParam,
        getPreviousPageParam: (firstPage) => firstPage?.prevParam,
        initialPageParam: { offset: 0 },
        gcTime: 0,
    })

    //array of all rows generated from the infinite list data
    //add the realtime rows to the end
    //do not add the realtime rows until the first fetch is done
    const allRows = useMemo(() => {
        if (!data)
            return [];
        return data.pages.flatMap((page) => page.rows).concat(realTime)
    }, [data, realTime]);

    //add a new message and scroll to the bottom when necessary
    const addMessage = useCallback((newMessage, forceScroll) => {
        setRealtime(prev => [...prev, newMessage]);

        //if the user made this message, or the view is scrolled near the bottom, go to the bottom after the message was added
        if (forceScroll || isAtBottom(virtualizer))
            setToBottom(true);
    }, [])

    //update all rows with a map function
    const updateRows = useCallback((fn) => {
        //update query data
        queryClient.setQueryData(queryKey, (data) => {
            //replace user on id
            data.pages.forEach(page => {
                page.rows = page.rows.map(fn)
            });
            return {
                ...data,
                lastUpdate: Date.now()//this will cause the data objects to change state, normally it would be the same object as before despite that a new object is assigned bere
            };
        });

        //update realtime rows
        setRealtime(prev => prev.map(fn));
    }, []);

    //update the user of the messages when matching the id
    const updateUser = UpdateUser(updateRows);

    //handle realtime changes
    handleRealtime(addMessage, updateUser);

    //external functions
    useImperativeHandle(ref, () => ({
        addMessage,
        updateUser,
        updateRows
    }));

    //handle virtualizer
    const itemSize = 700;
    const virtualizer = useVirtualizer({
        count: allRows.length,
        estimateSize: () => itemSize,
        overscan: 5,
        getScrollElement: () => parentRef.current,
        paddingStart: 10,
        paddingEnd: 10,
        getItemKey: useCallback((index) => allRows[index]._id, [allRows]),
    })

    //keeping of the offset of the top id
    const firstId = data?.pages[0].prevParam?.offset ?? 0;
    const addedToTheBeginning = firstId < prevIdRef.current;
    prevIdRef.current = firstId;

    //compensating the offset of the top id
    if (addedToTheBeginning) {
        const offset = (virtualizer.scrollOffset + (data?.pages[0].rows ?? []).length * itemSize);
        virtualizer.scrollOffset = offset;
        virtualizer.calculateRange();
        virtualizer.scrollToOffset(offset, { align: 'start' });
    }

    //the visible rows
    const items = virtualizer.getVirtualItems();

    //fetch when reaching end
    useEffect(() => {
        //do not fetch the top until the first fetch is complete and the list is scrolled to the bottom
        if (items.length === 0 || toBottom || !hasPreviousPage || isFetchingPreviousPage)
            return;
        if (items[0].index === 0)
            fetchPreviousPage();
    }, [items, isFetchingNextPage, toBottom])

    //scroll to bottom when requested
    useEffect(() => {
        if (toBottom && allRows.length > 0) {
            virtualizer.scrollToIndex(allRows.length - 1, { align: "middle", behavior: "auto" });
            setToBottom(false);
        }
    }, [toBottom, allRows])

    return (
        <Box sx={{ position: "relative", height: "100%", ...sx }} {...props}>
            <AnimatePresence>
                {
                    status === 'pending' ? (
                        <FadeoutLoading key="message"/>
                    ) : status === 'error' ? (
                        <ListMessage key="message">Error: {error.toString()}</ListMessage>
                    ) : allRows.length === 0 ? (
                        <ListMessage key="message">{t("no messages yet")}</ListMessage>
                    ) : (
                        <Box
                            key="loaded"
                            ref={parentRef}
                            sx={{
                                overflowY: "scroll",
                                height: "100%",
                                contain: 'strict',
                                boxSizing: "border-box",
                                px: 2,
                                position: "relative",
                            }}
                        >
                            {/*indicate loading on the top*/}
                            {
                                //deleted because it's visible for a moment after the loading is done and the rows are rendered, causing a small movement when switching between rooms
                                //{isFetchingPreviousPage &&
                                //    <ListMessage>
                                //        Loading more...
                                //    </ListMessage>
                                //}
                            }

                            {/*the visible rows*/}
                            <div
                                style={{
                                    height: `${virtualizer.getTotalSize()}px`,
                                    width: '100%',
                                    position: 'relative',
                                }}
                            >
                                {
                                    items.map((virtualRow) => {
                                        return (
                                            <div
                                                key={virtualRow.key}
                                                data-index={virtualRow.index}
                                                ref={virtualizer.measureElement}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
                                                }}
                                            >
                                                <Message message={allRows[virtualRow.index]} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </Box>
                    )
                }
            </AnimatePresence >
        </Box>
    )
});

const fetchMessages = async (ctx,socket) => {
    return new Promise((res, rej) => {
        const { offset, startTime } = ctx.pageParam;
        //the first fetch is always forward
        //get more rows on the first fetch by using "first" as the "more" param of the event
        const first = ctx.direction === "forward";
        socket.emit("load messages", -offset, startTime, first, (err, data) => {
            if (err)
                return rej(err);
            const { messages, newStartTime, end } = data;
            res({
                rows: messages,

                //offset is negative because the messages are fetched backwards
                prevParam: end ? null : {
                    offset: offset - messages.length,
                    startTime: newStartTime
                },
            });
        });
    });
}

function isAtBottom(virtualizer) {
    const el = virtualizer.scrollElement;
    if (!el)
        return false;
    //if the bottom of the list and and the bottom of the visible area is close enough, return true
    return el.scrollHeight - (el.scrollTop + el.offsetHeight) < 50;
}

function FadeoutLoading() {
    const { t } = useTranslation(["main"]);
    return (
        <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: constants.animation }}
            style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                left: 0,
                top: 0,
                zIndex:1
            }}
        >
            <Box style={{ height: "100%" }} bgcolor="grey.A100">
                <ListMessage>{t("loading messages")}</ListMessage>
            </Box>
        </motion.div>
    );
}

export default Chat;