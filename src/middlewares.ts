import { Request, Response, NextFunction } from 'express'
import { readFileSync } from 'fs'
import path from 'path'
import { Action, User } from './typings/global'

export const readFiles = (request: Request, response: Response, next: NextFunction) => {
    const usersFile: User[] = JSON.parse(readFileSync(path.join(__dirname, "users.json"), 'utf-8'))
    const actionsFile: Action[] = JSON.parse(readFileSync(path.join(__dirname, "actions.json"), 'utf-8'))
    response.locals.usersFile = usersFile
    response.locals.actionsFile = actionsFile

    next()
}

export const validateInput = (request: Request, response: Response, next: NextFunction) => {
    const id = Number(request.params.id)
    if (!Number.isInteger(id)) {
        response.status(400).send('UserId is not valid')
    } else {
        next()
    }
}

