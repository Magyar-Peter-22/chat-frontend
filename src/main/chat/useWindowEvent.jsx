import { useEffect, useCallback } from "react";

export default (eventName,onEvent) => {
    const handleEvent = useCallback((e) => {
        onEvent(e);
    }, [])

    //add the events to the window
    useEffect(() => {
        window.addEventListener(eventName, handleEvent);
        return () => {
            window.removeEventListener(eventName, handleEvent);
        }
    }, [])
}