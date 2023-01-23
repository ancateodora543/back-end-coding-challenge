import { Router, Request, Response, } from 'express'
import { Action, MapTraversed, ReferralMapping, User } from './typings/global'
import { checkIfActionExists, sortArray } from './utils/utils'
import { validateInput } from './middlewares'
import { REFER_USER } from './utils/constants'

const router = Router()

router.get('/users/:id', validateInput, (request: Request, response: Response) => {
    const id = Number(request.params.id)
    const users: User[] = response.locals.usersFile
    const user = users.find((entry: User) => entry.id === id)
    if (user) {
        response.status(200).json(user)
    } else {
        response.status(200).send("User was not found")
    }
})

router.get('/user-actions/:id', validateInput, (request: Request, response: Response) => {
    const userId = Number(request.params.id)
    const actions: Action[] = response.locals.actionsFile
    const totalActionsOfUser = actions.filter((en: Action) => en.userId === userId)

    response.status(200).json({ count: totalActionsOfUser?.length })
})

router.get('/actions-probability/:actionType', (request: Request, response: Response) => {
    const actions: Action[] = response.locals.actionsFile
    const actionType = request.params.actionType
    const userActionsMap = new Map()
    const setTypes: Set<string> = new Set()
    actions.forEach((action: Action) => {
        setTypes.add(action.type)
        if (userActionsMap.has(action.userId)) {
            const actionsArrayForUser: Action[] = userActionsMap.get(action.userId)
            actionsArrayForUser.push(action)
            userActionsMap.set(action.userId, actionsArrayForUser)
        } else {
            userActionsMap.set(action.userId, [action])
        }
    })
    if (!checkIfActionExists(actionType, setTypes)) {
        const errorInputString = Array.from(setTypes).join(", ")
        response.status(400).send(`ActionType is not valid, please choose from the following options: ${errorInputString}`)
        return
    }

    const values = userActionsMap.values()
    let actionsSortedByUserByDate: Action[] = []
    for (const value of values) {
        sortArray(value)
        actionsSortedByUserByDate = actionsSortedByUserByDate.concat(value)
    }
    let actionTypeProbabilitiesMap = new Map()
    let totalCounter = 0
    actionsSortedByUserByDate.filter((filteredEntry: Action, index: number) => {
        if (filteredEntry.type === actionType) {
            if (index + 1 < actionsSortedByUserByDate.length && filteredEntry.userId === actionsSortedByUserByDate[index + 1].userId) {
                const nextType = actionsSortedByUserByDate[index + 1].type
                if (actionTypeProbabilitiesMap.has(nextType)) {
                    actionTypeProbabilitiesMap.set(nextType, actionTypeProbabilitiesMap.get(nextType) + 1)
                } else {
                    actionTypeProbabilitiesMap.set(nextType, 1)
                }
                totalCounter++
                return true
            }
        }
        return false

    })

    let responseJson: any

    actionTypeProbabilitiesMap = new Map([...actionTypeProbabilitiesMap.entries()].sort((a, b) => b[1] - a[1]));

    for (const [key, value] of actionTypeProbabilitiesMap.entries()) {
        responseJson = {
            ...responseJson,
            [key]: Number((value / totalCounter).toFixed(2))
        }
    }
    for (const element of setTypes) {
        if (!actionTypeProbabilitiesMap.has(element)) {
            responseJson = {
                ...responseJson,
                [element]: 0
            }
        }
    }

    response.status(200).json(responseJson)
})

router.get('/referral-index', (request: Request, response: Response) => {
    const actions: Action[] = response.locals.actionsFile
    const users: User[] = response.locals.usersFile
    const referralActions: Action[] = actions.filter((action: Action) => action.type === REFER_USER)

    const mapReferral = new Map()
    for (const referralAction of referralActions) {
        if (mapReferral.has(referralAction.userId)) {
            const targetUsers: number[] = mapReferral.get(referralAction.userId)
            targetUsers.push(referralAction.targetUser)
            mapReferral.set(referralAction.userId, targetUsers)
        } else {
            mapReferral.set(referralAction.userId, [referralAction.targetUser])
        }
    }


    const resultMap = new Map()

    for (const [key, value] of mapReferral.entries()) {
        const stack = value
        const traversed: MapTraversed = {}
        let children = 0
        let curr
        while (stack.length) {
            curr = stack.pop();
            children += 1
            traversed[curr] = true
            if (mapReferral.has(curr)) {
                const values = mapReferral.get(curr)
                for (const valueEntry of values) {
                    if (!traversed[valueEntry]) {
                        stack.push(valueEntry)
                    }
                }
            }
        }
        resultMap.set(key, children)
    }
    let responseJson: ReferralMapping = {}
    for (const user of users) {
        if (!resultMap.has(user.id)) {
            responseJson = {
                ...responseJson,
                [Number(user.id)]: 0
            }
        } else {
            responseJson = {
                ...responseJson,
                [Number(user.id)]: resultMap.get(user.id)
            }
        }
    }
    response.status(200).json(responseJson)

})



export default router
