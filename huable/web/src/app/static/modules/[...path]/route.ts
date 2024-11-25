import {NextRequest, NextResponse} from 'next/server'

import {isProd, useServerConfig} from "@/services/server/config";
import path from "path";
import * as fs from "node:fs";
import {getType} from "atom";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest,
                          {params}: { params: { path: string[] } },
) {
    console.log('GET', params)
    const basePath = isProd() ? '.next/static/modules' : 'node_modules'
    const filePath = path.join(basePath, params.path.join('/'))
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath)
        const mimeType = getType(filePath)
        return new Response(data, {headers: {'Content-Type': mimeType}})
    }
    return new Response('NotFound', {
        status: 404,
    })
}
