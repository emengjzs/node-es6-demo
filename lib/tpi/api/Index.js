import { Router } from "express";

import TpiInfoService from "../logic/TpiInfoService";

const tpiInfoService = new TpiInfoService();
const router = Router();

router.get("/info", async (req, res) => {

    const fromTimeStamp = parseInt(req.query.s);
    if (isNaN(fromTimeStamp))
    {
        res.status(400).json({
            isSuccess: false,
            message: "Parameter s must be an integer"
        });
        return;
    }

    const toTimeStamp = parseInt(req.query.e);
    if (isNaN(toTimeStamp))
    {
        res.status(400).json({
            isSuccess: false,
            message: "Parameter e must be an integer"
        });
        return;
    }


    if (toTimeStamp < fromTimeStamp)
    {
         res.status(400).json({
            isSuccess: false,
            message: "The parameter e must be larger than s"
         });
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
    catch(err)
    {
        res.status(400).json(errorMessage(err)); 
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

function errorMessage(err, message)
{
    return {
        isSuccess: false,
        message: err  || message,
    }
}

export default router;