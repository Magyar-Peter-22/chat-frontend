import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { lazy } from "react";
import RouteTransition from "./RouteTransition";
const ChatRoute = lazy(() => import("./routes/ChatRoute"));
const Welcome = lazy(() => import("./routes/Welcome"));
const NotFound = lazy(() => import("./routes/NotFound"));

export default () => {
    const location = useLocation();
    const topLocation = location.pathname.split("/")[1] ?? "";
    return (
        <AnimatePresence>
            <Routes location={location} key={topLocation}>
                <Route path={"/"} element={<RouteTransition><Welcome /></RouteTransition>} />
                <Route path={"/rooms/:room"} element={<RouteTransition> <ChatRoute /></RouteTransition>} />
                <Route path={"*"} element={<RouteTransition> <NotFound /></RouteTransition>} />
            </Routes>
        </AnimatePresence>
    )
}
