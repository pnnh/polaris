'use server'

import {nodeDecodeAes, nodeEncodeAes, nodeGenerateAesKey} from "@/atom/server/crypto/aes";

export async function aesServerGenerateKey(): Promise<string> {
    return nodeGenerateAesKey()
}

export async function aesServerEncode(data: string, key: string): Promise<string> {
    return nodeEncodeAes(data, key);
}

export async function aesServerDecode(encryptedData: string, key: string): Promise<string> {
    return nodeDecodeAes(encryptedData, key);
}
