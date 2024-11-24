import './index.css';

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
import {WelcomePage} from "./welcome/welcome";
import {NewPage} from "@/welcome/new";
import {OpenPage} from "@/welcome/open";

const router = createBrowserRouter([
    {
        path: "/",
        element: (<ConsolePage/>),
    },
    {
        path: "/new",
        element: <NewPage/>,
    },
    {
        path: "/open",
        element: <OpenPage/>,
    },
    {
        path: "/about",
        element: <div>About</div>,
    },
    {
        path: "/console",
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
