import './page.css'
import React from "react";
import {ARButtonFilled} from "atom";
import {ARButtonText} from "atom";

export default function Page() {
    return <div className={'pageContainer'}>
        <ARButtonFilled fill={'blue'}>Button</ARButtonFilled>
        <ARButtonText>Button</ARButtonText>
    </div>
}
