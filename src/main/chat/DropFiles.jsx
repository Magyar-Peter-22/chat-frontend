import FileUploadIcon from '@mui/icons-material/FileUpload';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
    const [dropping, setDroppping] = useState(false);
    const { t } = useTranslation(["main"]);

    const onDragEnter = useCallback((e) => {
        if (!e.fromElement)
            setDroppping(true);
    }, [])

    const onDragLeave = useCallback((e) => {
        if (!e.fromElement)
            setDroppping(false);
    }, [])

    const onDrop = useCallback((e) => {
        setDroppping(false);
        e.preventDefault();
    }, [])

    const onDrag = useCallback((e) => {
        e.preventDefault();
    }, [])

    const events = {
        dragenter: onDragEnter,
        dragleave: onDragLeave,
        drop: onDrop,
        dragover: onDrag
    }

    //add the events to the window
    useEffect(() => {
        Object.entries(events).forEach(([event, cb]) => {
            window.addEventListener(event, cb);
        });
        return () => {
            Object.entries(events).forEach(([event, cb]) => {
                window.removeEventListener(event, cb);
            });
        }
    }, [])

    return (
        <Dialog
            open={dropping}
            disableRestoreFocus
        >
            <DialogTitle>
                <Stack direction="row" gap={1} alignItems="center">
                    <FileUploadIcon />
                    {t("drop_files")}
                </Stack>
            </DialogTitle>
        </Dialog>
    )
}