import {Link} from "react-router-dom";
import * as React from "react";
import {css} from "@emotion/css";
import {Button} from "@mui/material";

export function WelcomePage() {
    return <div className={styleWelcome}>
        <h1>欢迎使用</h1>
        <div className={styleTips}>请新建资料库或打开已有资料库</div>
        <div className={styleActions}>
            <Button variant={"contained"} href={'/new'}>新建资料库</Button>
            <Button variant={'contained'}>打开资料库</Button>
        </div>
    </div>
}

const styleWelcome = css`
    width: 640px;
    margin: 0 auto;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`
const styleTips = css`
    margin-top: 1rem;
    font-size: 1rem;
    color: #666;
`
const styleActions = css`
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 2rem;
`
