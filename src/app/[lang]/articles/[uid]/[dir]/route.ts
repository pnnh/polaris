import {permanentRedirect, redirect, RedirectType} from 'next/navigation';
import {NextRequest} from "next/server";

export async function GET(request: NextRequest, {params}: { params: Promise<{ dir: string, uid: string }> }) {
    let newUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    const {uid, dir} = await params;

    newUrl = newUrl.replace(`/${uid}/`, '/')
    permanentRedirect(newUrl, RedirectType.replace);
}
