import { Router } from "express";

import TpiInfoService from "../logic/TpiInfoService";

const tpiInfoService = new TpiInfoService();
const router = Router();

router.get("/info", async (req, res) => {

    const fromTimeStamp = parseInt(req.query.s);
    if (isNaN(fromTimeStamp))
    {
        res.status(400).json(errorMessage("Parameter s must be an integer"));
        return;
    }

    const toTimeStamp = parseInt(req.query.e);
    if (isNaN(toTimeStamp))
    {
        res.status(400).json(errorMessage("Parameter e must be an integer"));
        return;
    }


    if (toTimeStamp < fromTimeStamp)
    {
         res.status(400).json(errorMessage("The parameter e must be larger than s"));
         return;
    }

    try {
        const tpiInfoList = await tpiInfoService.getTpiInfoByTimeRange(
            new Date(fromTimeStamp),
            new Date(toTimeStamp)
        );
        const maxAge = 60 * 60 * 24;
        res.setHeader("Cache-Control", `max-age=${maxAge}`);
        res.json(successMessage(tpiInfoList));
    } 
    catch (err)
    {
        res.status(400).json(errorMessage(err.message)); 
        return;
    }


});

function successMessage(data, message = "")
{
    return {
        isSuccess: true,
        message: message,
        data: data
    }
}

function errorMessage(message)
{
    return {
        isSuccess: false,
        message: message,
    }
}

export default router;