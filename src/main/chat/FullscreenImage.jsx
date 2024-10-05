import { AdvancedImage, placeholder } from '@cloudinary/react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { forwardRef, useCallback, useContext } from "react";
import { ModalContext } from '../Modals';
import useWindowEvent from './useWindowEvent';

export default ({ cldImg }) => {
    const { Close } = useContext(ModalContext);

    const handleKey = useCallback((e) => {
        console.log(e.key);
    }, []);
    useWindowEvent("keydown", handleKey);

    return (
        <div style={{ width: "100%", height: "100%", position: "relative",overflow:"hidden" }}>
            <AdvancedImage
                cldImg={cldImg}
                plugins={[
                    placeholder({ mode: 'predominant-color' })
                ]}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    pointerEvents: "none"
                }}
            />
            <IconButton
                sx={{ position: "absolute", left: 10, top: 10 }}
                onClick={Close}
            >
                <CloseIcon />
            </IconButton>
        </div>
    );
}

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const dialogProps = {
    TransitionComponent: Transition,
    fullScreen: true
}

export { dialogProps };

