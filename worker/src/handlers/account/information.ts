
import {Request, Response} from "express";
import {SystemAccountService} from "@/business/server/content/account";

export async function accountInformation(request: Request, response: Response) {
    const accountService = new SystemAccountService()
    const result = await accountService.accountInformation()
    return response.json(result)
}
