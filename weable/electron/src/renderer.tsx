import './index.scss';

import * as React from "react";
import {createRoot} from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from "react-router-dom";
import {ConsolePage} from "./console/page";
import {RecoilRoot} from "recoil";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <div>
                <h1>Hello World</h1>
                <Link to="about">About Us</Link>&nbsp;
                <Link to="console">Console</Link>
            </div>
        ),
    },
    {
        path: "about",
        element: <div>About</div>,
    },
    {
        path: "console",
        element: <ConsolePage/>,
    }
]);

const rootElement = document.getElementById("root")
if (!rootElement) {
    throw new Error("Root element not found");
}

createRoot(rootElement).render(
    <RecoilRoot>
        <RouterProvider router={router}/>
    </RecoilRoot>
);
