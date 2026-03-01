import {getPathname} from "@/components/server/pathname";
import {getServerTheme} from "@/components/server/theme";

export default async function () {
    const pathname = await getPathname()
    const isThunder = pathname.startsWith('/thunder')
    if (isThunder) {
        return <></>
    }
    const themeName = await getServerTheme()
    let isDarkTheme = themeName === 'dark'

    return <>
    </>
}
