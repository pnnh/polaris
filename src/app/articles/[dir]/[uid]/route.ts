import {permanentRedirect, redirect, RedirectType} from 'next/navigation';
import {NextRequest} from "next/server";

export async function GET(request: NextRequest) {
    const newUrl = `/${langEn}${request.nextUrl.pathname}${request.nextUrl.search}`;

    permanentRedirect(newUrl, RedirectType.replace);
}
