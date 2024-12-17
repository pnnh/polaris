import {SystemAccountService} from "@pnnh/polaris-business";
import {Request, Response} from "express";

export async function accountInformation(request: Request, response: Response) {
    const accountService = new SystemAccountService()
    const result = await accountService.accountInformation()
    return response.json(result)
}
