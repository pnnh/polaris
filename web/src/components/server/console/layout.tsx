import React from 'react'
import './layout.scss'
import {ConsoleFeature} from "@/components/client/console/partials/feature";
import {HtmlLayout} from '../layout';
import {NavigatorBar} from "@/components/client/console/partials/navigator";
import {FileToolsBar} from "@/components/client/console/partials/filetools";

export function ConsoleLayout({
                                  children
                              }: {
    children: React.ReactNode
}) {
    return (<HtmlLayout metadata={{}}>
            <div className={'consolePage'}>
                <div className={'locationContainer'}>
                    <NavigatorBar/>
                </div>
                <div className={'toolsContainer'}>
                    <FileToolsBar/>
                </div>
                <div className={'mainContainer'}>
                    {/*<div className={'leftNav'}>*/}
                    {/*    <ConsoleFeature/>*/}
                    {/*</div>*/}
                    <div className={'rightBody'}>
                        {children}
                    </div>
                </div>
            </div>
        </HtmlLayout>
    )
}
