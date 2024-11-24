import {Request, Response} from "express";
import {SystemAccountService} from "@/services/server/account";

export async function GET(request: Request, response: Response) {
    const accountService = new SystemAccountService()
    const result = await accountService.accountInformation()
    return response.json(result)
}
