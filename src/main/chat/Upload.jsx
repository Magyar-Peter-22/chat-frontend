import FileUploadIcon from '@mui/icons-material/FileUpload';
import IconButton from '@mui/material/IconButton';
import { useCallback, useRef, memo } from 'react';
import { useFormContext, Controller } from "react-hook-form";


export default memo(({disabled}) => {
    const { control } = useFormContext();
    const inputRef = useRef();

    const openDialog = useCallback(() => {
        const current = inputRef.current;
        if (!current)
            return;
        current.click();
    }, []);

    return (
        <>
            <IconButton
                color="primary"
                aria-label="send message"
                onClick={openDialog}
                disabled={disabled}
            >
                <FileUploadIcon />
            </IconButton>

            <Controller
                name="files"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value, ref } }) => {
                    return (
                        <input
                            type="file"
                            name="files"
                            multiple
                            onChange={(event) => {
                                onChange([...value, ...Array.from(event.target.files)]);
                            }}
                            style={{ display: "none" }}
                            ref={(e) => {
                                ref(e);
                                inputRef.current = e;
                            }}
                            value={""}//make the same file uploadable multiple times. this is useful when the file is removed then uploaded again
                        />
                    );
                }}
            />
        </>
    )
})