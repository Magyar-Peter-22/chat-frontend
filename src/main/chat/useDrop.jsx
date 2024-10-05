import { useCallback } from "react";
import useWindowEvent from "./useWindowEvent";

export default (onFiles) => {
    const onDrop = useCallback((e) => {
        onFiles(e.dataTransfer.files);
    }, [])
    useWindowEvent("drop",onDrop);
}