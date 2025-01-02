import {NextRequest} from "next/server";

export async function GET(request: NextRequest) {
    console.log('Hello, Turnstile!')


    return new Response('Hello, world!')
}
