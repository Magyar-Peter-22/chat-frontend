import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from "axios";
import { enqueueSnackbar } from 'notistack';
import { memo, useCallback, useEffect, useRef } from 'react';
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { cloudKey, uploadUrl } from '../../cloud/general';
import MenuBorder from '../MenuBorder';
import MenuLayout from '../MenuLayout';
import useSocketMutation from '../useSocketMutation';
import FileDisplayer from './FileDisplayer';
import Upload from './Upload';
import useDrop from './useDrop';

export default memo(() => {
    const { t } = useTranslation("main");

    //the ref of the file displayer
    //it is used to update the progress bars when uploading via imperative handle
    const fileDisplayerRef = useRef()

    //alter the appearance and behaviour of the form depending on the width
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    //setup form
    const methods = useForm({
        defaultValues: {
            text: "",
            files: []
        }
    });
    const { register, handleSubmit, reset, getValues,setValue, formState: { isSubmitting } } = methods;

    //remove the pending status efter the files were successfully uploaded
    const finalizeMessage = useSocketMutation("finalize message");

    //after successful upload, upload the files if necessary then reset
    const onUpload = useCallback(async ({ isPending, ...data }) => {
        //if this message contains media, then it is pending until it's media files are uploaded
        //upload the images, then finalize the message
        if (isPending) {
            //get data from callback
            const { signatureDatas, messageId } = data;

            //get the files
            const files = getValues("files");

            console.log("\nuploading files:");
            console.log(files);

            console.log(`signatures for message "${messageId}" arrived:\n${JSON.stringify(signatureDatas)}"\nfile count:${files.length}`);

            try {
                const responses = await Promise.all(
                    files.map(async (file, i) => {
                        //get the signature of this file
                        //the signatures must in the same order as the files
                        const mySign = signatureDatas[i];

                        //if no signature, throw
                        if (!mySign)
                            throw new Error("")

                        //construct the form data form the file and signature
                        //each file has it's own form data
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("api_key", cloudKey);
                        //append all params of the signature object to the form
                        Object.entries(mySign).forEach(([key, value]) => {
                            formData.append(key, value);
                        })

                        //upload to server
                        const res = await axios.post(uploadUrl, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                            onUploadProgress: (e) => {
                                fileDisplayerRef.current.updateProgress(i, e.progress * 100);
                            }
                        });

                        return res.data;
                    })
                )

                console.log("responses arrived after uploading the signed files:");
                console.log(responses)

                //get the data that will be verified from each uploaded file
                //the recieved public id will be uploaded to the db
                const fileData = responses.map((res) => ({
                    name: res.original_filename,
                    type: res.resource_type,
                    public_id:res.public_id
                }));

                //upload the responses
                //if done, the message is no longer pending
                await finalizeMessage.mutateAsync({ messageId, fileData });

                //end
                reset();
            }
            catch (err) {
                console.log(err);
                const message=err.response?.data?.error?.message.toString()??err.toString();
                enqueueSnackbar(message, { variant: "error" });
            }
        }
        else
        //no media in this message
        //no other processes are necessary, clear the textfield
        {
            reset();
        }
    }, []);

    //send message to server
    //the message will be added to the chat based on the emit from the server
    const sendMessage = useSocketMutation("send message", { onSuccess: onUpload });

    //format text and send
    const onSubmit = handleSubmit(async (data) => {
        const { text, files } = data;

        //exit if empty
        if (text.length === 0)
            return;

        //info about the files to generate signatures
        const fileData = files.map((file) => {
            const type = getResourceType(file.type);
            return {
                name: file.name,
                type
            }
        });

        await sendMessage.mutateAsync({ text, fileData });
    });

    //check if the pressed enter can submit the form or not
    const canSubmit = useCallback((e) => e.key === 'Enter' && !e.shiftKey && !isMobile, [isMobile]);

    //submit form when enter is pressed and shift is not
    //enter never submits on mobile
    useEffect(() => {
        function down(e) {
            if (canSubmit(e)) {
                onSubmit();
            }
        }

        window.addEventListener('keydown', down);
        return (() => {
            window.removeEventListener('keydown', down);
        })
    }, [canSubmit])

    //if the form is submitted by pressing enter, do not add another line to the text
    const handleEnter = useCallback((e) => {
        if (canSubmit(e))
            e.preventDefault();
    }, [canSubmit]);

    //add the dropped files to the form data
    useDrop((droppedFiles)=>{setValue('files', [...getValues().files,...droppedFiles])})

    return (
        <FormProvider {...methods}>
            <div style={{ position: "relative" }}>
                <FileDisplayer ref={fileDisplayerRef} />

                <MenuBorder sx={{ zIndex: 2 }}>
                    <MenuLayout>
                        <Paper sx={{ height: "100%", px: 2, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center" }} >
                            <form>
                                <Stack direction="row" gap={1}>
                                    <TextField
                                        slotProps={{
                                            input: {
                                                readOnly: isSubmitting,
                                            },
                                        }}
                                        placeholder={t("write")}
                                        fullWidth
                                        autoComplete='off'
                                        multiline
                                        onKeyDown={handleEnter}
                                        variant="standard"
                                        autoFocus={true}
                                        {...register("text")}
                                    />

                                    <Upload disabled={isSubmitting} />

                                    {isMobile &&
                                        <IconButton
                                            disabled={isSubmitting}
                                            color="primary"
                                            aria-label="send message"
                                            onClick={onSubmit}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    }
                                </Stack>
                            </form>
                        </Paper>
                    </MenuLayout >
                </MenuBorder>
            </div>
        </FormProvider>
    );
});

function getResourceType(mimeType) {
    if (mimeType.startsWith("image"))
        return "image";
    if (mimeType.startsWith("video"))
        return "video";
    return "raw";
}