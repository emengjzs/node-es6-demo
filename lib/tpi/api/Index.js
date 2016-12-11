import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    console.log("ddd");
    res.send("Hello, world!");
});

export default router;