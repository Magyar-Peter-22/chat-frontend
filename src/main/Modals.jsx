import Dialog from '@mui/material/Dialog';
import * as React from 'react';
import { createContext, useCallback, useState, Suspense ,useRef} from "react";

const ModalContext = createContext();

function ModalProvider({ children }) {
    const [content, setContent] = useState(null);
    const [props,setProps]=useState();

    const Show = useCallback((content,dialogProps) => {
        setContent(content);
        setProps(dialogProps);
    }, [])

    const Close = useCallback(() => {
        setContent(null);
    }, []);

    //store the values on a ref to prevent the re-render on the element with usecontext on state change
    const valueRef=useRef({Show,Close});

    return (
        <ModalContext.Provider value={valueRef.current}>
            <Suspense>
                <Dialog
                    open={Boolean(content)}
                    onClose={Close}
                    disableRestoreFocus
                    {...props}
                >
                    {content}
                </Dialog>
            </Suspense>
            {children}
        </ModalContext.Provider>
    )
}

export { ModalContext, ModalProvider };
