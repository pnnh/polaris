import {NextRequest} from "~/next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    return new Response(
        JSON.stringify({status: '410'}),
        {
            status: 410,
            headers: {'Content-Type': 'application/json'},
        }
    );
}
