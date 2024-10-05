import { AdvancedImage, AdvancedVideo, lazyload, placeholder, responsive } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { useRef, useContext } from 'react';
import { ModalContext } from '../Modals';
import FullscreenImage, { dialogProps } from './FullscreenImage';
import fileDownload from "js-file-download";
import axios from "axios";
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const cld = new Cloudinary({ cloud: { cloudName: 'dhfm5s5x8' } });

//the last played video
let playingVideoRef;

function ImageDisplayer({ fileData: { name, public_id } }) {
    const img = cld.image(public_id);
    const { Show } = useContext(ModalContext);

    const fullscreen = () => {
        Show(<FullscreenImage cldImg={img} />, dialogProps);
    }

    return (
        <AdvancedImage
            cldImg={img}
            plugins={[
                lazyload(),
                responsive({ steps: 200 }),
                placeholder({ mode: 'predominant-color' })
            ]}
            onClick={fullscreen}
            style={{ width: "100%", height: "100%", objectFit: "contain", cursor: "pointer" }}
            alt={name}
        />
    );
}

function VideoDisplayer({ fileData: { name, public_id } }) {
    const videoRef = useRef();

    //only one video can play at the same time
    //stop the previus video when another is played
    function handlePlay() {
        if (playingVideoRef && playingVideoRef.current && playingVideoRef !== videoRef)
            playingVideoRef.current.pause();
        playingVideoRef = videoRef;
    }

    const vid = cld.video(public_id);
    return (
        <AdvancedVideo
            cldVid={vid}
            onPlay={handlePlay}
            innerRef={videoRef}
            controls
            plugins={[
                lazyload(),
                placeholder({ mode: 'predominant-color' })
            ]}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            alt={name}
        />
    );
}

function RawDisplayer({ fileData: { name, public_id } }) {
    const url = `https://res.cloudinary.com/${cld.getConfig().cloud.cloudName}/raw/upload/v1/${public_id}`;
    const extension = public_id.match(/\.[0-9a-z]+$/i)[0] ?? "";
    const nameWithExtension = name + extension;

    const handleDownload = () => {
        axios
            .get(url, {
                responseType: "blob"
            })
            .then((res) => {
                fileDownload(res.data, nameWithExtension);
            });
    };

    return (
        <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{
                maxWidth:'100%'
            }}
        >
            <div
                style={{
                    overflowX: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {nameWithExtension}
            </div>
        </Button>
    )
}

function AutoDisplayer({ fileData, fileData: { type } }) {
    return (
        type === "image" ? (
            <ImageDisplayer
                fileData={fileData}
            />
        ) : (
            <VideoDisplayer
                fileData={fileData}
            />
        )
    )
}

export default AutoDisplayer;
export { RawDisplayer }