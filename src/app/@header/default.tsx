import {getPathname} from "@/components/server/pathname";
import {getServerTheme} from "@/components/server/theme";
import {GoogleAnalytics} from "~/@next/third-parties/dist/google";
import {isProd} from "@/components/server/config";

export default async function () {
    const pathname = await getPathname()
    const isThunder = pathname.startsWith('/thunder')
    if (isThunder) {
        return <></>
    }
    const themeName = await getServerTheme()
    let isDarkTheme = themeName === 'dark'

    return <>
        {isProd() && <GoogleAnalytics gaId="G-Z98PEGYB12"/>}
        {isDarkTheme ?
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/themes/prism-dark.min.css"
                  integrity="sha512-Njdz7T/p6Ud1FiTMqH87bzDxaZBsVNebOWmacBjMdgWyeIhUSFU4V52oGwo3sT+ud+lyIE98sS291/zxBfozKw=="
                  crossOrigin="anonymous" referrerPolicy="no-referrer"/> :
            <link rel="stylesheet"
                  href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/themes/prism-solarizedlight.min.css"
                  integrity="sha512-fibfhB71IpdEKqLKXP/96WuX1cTMmvZioYp7T6I+lTbvJrrjEGeyYdAf09GHpFptF8toQ32woGZ8bw9+HjZc0A=="
                  crossOrigin="anonymous" referrerPolicy="no-referrer"/>
        }
    </>
}
