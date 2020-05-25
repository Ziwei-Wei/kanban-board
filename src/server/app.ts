/*
 * app
 * author: ziwei wei
 */
import express from "express";
import passport from "passport";
import logger from "morgan";
import cors from "cors";

import User from "./api/user";
import kanban from "./api/kanban";
import Index from "./api";

require("./utility/passport").setup();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger("dev"));
app.use(passport.initialize());

app.use("/api", User);
app.use("/api", kanban);
app.use(Index);

export default app;
