import express from "express";

import app from "./lib/app";
import httpServer from "./lib/http/server";

app.attach(httpServer);
app.use(express.static("public"));

const port = 8000;
httpServer.listen(port, () => {
    console.log(`The server is now listening on ${port}`);
});




