import {permanentRedirect, redirect, RedirectType} from 'next/navigation';
import {NextRequest} from "next/server";
import {langEn} from "@/atom/common/language";

export async function GET(request: NextRequest) {
    const newUrl = `/${langEn}${request.nextUrl.pathname}${request.nextUrl.search}`;

    permanentRedirect(newUrl, RedirectType.replace);
}
