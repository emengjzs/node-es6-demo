import { Router } from "express";

const router = Router();

router.use("/tpi", require("./../../tpi/api").default);

export default router;