import Image from 'next/image'
import React from "react";
import {UserActionDropdown} from "@/components/client/userActionDropdown";
import {PSLanguageSelector} from "@/components/server/content/partials/language";
import {ThemeSwitch} from "@/components/server/content/partials/theme";
import {getServerTheme} from "@/components/server/theme";
import {AccountModel} from "@/components/common/models/account/account";
import {getSearchString} from "@/components/server/pathname";

export async function ConsoleNavbar({pathname, searchParams, lang, userInfo}: {
    pathname: string,
    searchParams: Record<string, string>,
    lang: string,
    userInfo: AccountModel | undefined
}) {
    const searchString = await getSearchString()
    const currentUrl = `${pathname}${searchString}`
    const themeName = await getServerTheme()

    return (
        <div className="flex flex-row h-12 items-center w-full">
            {/* ── Left brand section — same width as sidebar (w-64) ── */}
            <div
                className="flex items-center gap-3 px-4 h-full flex-shrink-0"
                style={{
                    width: "16rem",
                    borderRight: "1px solid var(--sidebar-border)",
                }}
            >
                <a
                    href="/"
                    className="relative flex-shrink-0 rounded-md overflow-hidden"
                    style={{width: "1.75rem", height: "1.75rem"}}
                >
                    <Image
                        src='/images/logo.png'
                        alt='logo'
                        priority={false}
                        fill={true}
                        sizes="28px"
                    />
                </a>
                <span
                    className="text-sm font-semibold tracking-wide truncate"
                    style={{color: "var(--text-primary-color)"}}
                >
                    控制台
                </span>
            </div>

            {/* ── Right actions section ── */}
            <div className="flex-1 flex items-center justify-end gap-2 px-4">
                <ThemeSwitch lang={lang} themeName={themeName}/>
                <div
                    className="w-px h-4 flex-shrink-0"
                    style={{background: "var(--sidebar-border)"}}
                />
                <PSLanguageSelector lang={lang} currentUrl={currentUrl}/>
                <div
                    className="w-px h-4 flex-shrink-0"
                    style={{background: "var(--sidebar-border)"}}
                />
                <UserActionDropdown lang={lang} userInfo={userInfo}/>
            </div>
        </div>
    )
}
