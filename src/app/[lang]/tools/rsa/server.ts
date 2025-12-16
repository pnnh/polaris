'use server'

import {nodeDecodeRsa, nodeEncodeRsa} from "@/atom/server/crypto/rsa";

export async function rsaServerEncode(data: string, key: string): Promise<string> {
    return nodeEncodeRsa(data, key);
}

export async function rsaServerdecode(encryptedData: string, key: string): Promise<string> {
    return nodeDecodeRsa(encryptedData, key);
}
