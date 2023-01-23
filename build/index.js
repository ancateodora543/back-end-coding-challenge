"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const middlewares_1 = require("./middlewares");
const app = (0, express_1.default)();
const port = 3000;
app.use(middlewares_1.readFiles);
app.use(routes_1.default);
app.listen(port, () => {
    console.log(`Server listening at port ${port}.`);
});
