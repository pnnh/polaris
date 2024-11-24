import {NextRequest, NextResponse} from 'next/server'
import {loadSessions2} from "@/services/auth";

export async function GET(request: NextRequest) {
    console.debug('signup begin result:', request.url, request.nextUrl.pathname)

    const sessionList = await loadSessions2()
    return NextResponse.json({
        sessions: sessionList
    })
}