import './page.css'
import {ARButtonFilled, ARButtonText} from "@pnnh/atom-react";

export default function Page() {
    return <div className={'pageContainer'}>
        <ARButtonFilled fill={'blue'}>Button</ARButtonFilled>
        <ARButtonText>Button</ARButtonText>
    </div>
}
