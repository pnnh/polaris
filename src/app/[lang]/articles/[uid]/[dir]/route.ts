import {permanentRedirect, redirect, RedirectType} from 'next/navigation';
import {NextRequest} from "next/server";

export async function GET(request: NextRequest, {params}: { params: { dir: string, uid: string } }) {
    let newUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;

    newUrl = newUrl.replace(`/${params.uid}/`, '/')
    permanentRedirect(newUrl, RedirectType.replace);
}
