import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { forwardRef, memo, useImperativeHandle, useState } from 'react';
import { useFormContext, useWatch } from "react-hook-form";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useKeyGen } from 'react-key-from-object';

//create urls from files and display them
export default memo(forwardRef((_, ref) => {
    //get files
    const { control } = useFormContext();
    const files = useWatch({ control, name: "files" })
    const [progress, setProgress] = useState({});
    const keyGen = useKeyGen();

    useImperativeHandle(ref, () => {
        return {
            updateProgress(index, progress) {
                setProgress(prevProgress => {
                    prevProgress[index] = progress;
                    return { ...prevProgress };
                })
            }
        }
    }, []);

    //invisible when there are no files
    if (files.length == 0)
        return;

    return (
        <Box sx={{ position: "absolute", bottom: "100%", width: "100%", maxHeight: "50vh", overflowY: "auto", direction: "rtl", px: 1, boxSizing: "border-box" }}>
            <Stack direction="row" style={{ direction: "ltr", flexWrap: "wrap", gap: 10 }}>
                {files.map((file, i) => <Preview file={file} progress={progress[i]} key={keyGen.getKey(file)} />)}
            </Stack>
        </Box>
    )
}));

const Preview = memo(({ file, progress }) => {
    return (
        <Box sx={{ height: 100, width: 100, borderRadius: 2, overflow: "hidden", background: "black", position: "relative" }}>
            <File file={file} />
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%" }}>
                <Progress progress={progress} />
            </div>
        </Box>
    )
});

const File = memo(({ file }) => {
    const url = URL.createObjectURL(file);
    const type = file.type;

    return (
        <>
            {
                type.startsWith("image") ? (
                    <img src={url} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                ) : type.startsWith("video") ? (
                    <video src={url} style={{ width: "100%", height: "100%", objectFit: "contain" }} controls />
                ) : (
                    <Typography sx={{ width: "100%", height: "100%", p: 1, boxSizing: "border-box", color: "white" }}>
                        {file.name}
                    </Typography>
                )
            }
            <Remove file={file} />
        </>
    )
})

function Remove({ file }) {
    const { setValue, getValues,formState: { isSubmitting } } = useFormContext();

    const handleRemove = () => {
        const allFiles = getValues().files;
        const myIndex = allFiles.findIndex(el => el === file);
        allFiles.splice(myIndex,1);
        setValue("files", [...allFiles]);
    }

    return (
        <IconButton size="small"
            style={{
                position: "absolute",
                right: 5,
                top: 5,
                backgroundColor: "rgb(0,0,0,0.75)",
                color: "white"
            }}
            onClick={handleRemove}
            disabled={isSubmitting}
        >
            <CloseIcon />
        </IconButton>
    )
}

function Progress({ progress = 0 }) {
    return (
        Boolean(progress) && <LinearProgress variant="determinate" value={progress} />
    );
}