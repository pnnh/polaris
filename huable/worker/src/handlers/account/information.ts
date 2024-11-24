import {SystemAccountService} from "@/services/server/domain/system/account";
import {Request, Response} from "express";

export async function accountInformation(request: Request, response: Response) {
    const accountService = new SystemAccountService()
    const result = await accountService.accountInformation()
    return response.json(result)
}
