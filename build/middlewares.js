"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = exports.readFiles = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const readFiles = (request, response, next) => {
    const usersFile = JSON.parse((0, fs_1.readFileSync)(path_1.default.join(__dirname, "users.json"), 'utf-8'));
    const actionsFile = JSON.parse((0, fs_1.readFileSync)(path_1.default.join(__dirname, "actions.json"), 'utf-8'));
    response.locals.usersFile = usersFile;
    response.locals.actionsFile = actionsFile;
    next();
};
exports.readFiles = readFiles;
const validateInput = (request, response, next) => {
    const id = Number(request.params.id);
    console.log("🚀 ~ file: middlewares.ts:17 ~ validateInput ~ id", id);
    console.log("🚀 ~ file: middlewares.ts:19 ~ validateInput ~ Number.isInteger(id)", Number.isInteger(id));
    if (!Number.isInteger(id)) {
        response.status(400).send('UserId is not valid');
    }
    else {
        next();
    }
};
exports.validateInput = validateInput;
