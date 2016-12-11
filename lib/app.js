import express from "express";

const app = express();

app.attach = httpServer => httpServer.on("request", app);
app.detach = httpServer => httpServer.off("request", app);

app.use("/api", require("./http/api").default);

export default app;