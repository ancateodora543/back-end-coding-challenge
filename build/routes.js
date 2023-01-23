"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils_1 = require("./utils/utils");
const middlewares_1 = require("./middlewares");
const router = (0, express_1.Router)();
router.get('/users/:id', middlewares_1.validateInput, (request, response) => {
    const id = Number(request.params.id);
    const users = response.locals.usersFile;
    const user = users.find((entry) => entry.id === id);
    if (user) {
        response.status(200).json(user);
    }
    else {
        response.status(200).send("User was not found");
    }
});
router.get('/user-actions/:id', middlewares_1.validateInput, (request, response) => {
    const userId = Number(request.params.id);
    const actions = response.locals.actionsFile;
    const totalActionsOfUser = actions.filter((en) => en.userId === userId);
    response.status(200).json({ count: totalActionsOfUser === null || totalActionsOfUser === void 0 ? void 0 : totalActionsOfUser.length });
});
router.get('/actions-probability/:actionType', (request, response) => {
    const actions = response.locals.actionsFile;
    const actionType = request.params.actionType;
    const actionsMap = new Map();
    const setTypes = new Set();
    actions.forEach((action) => {
        setTypes.add(action.type);
        if (actionsMap.has(action.userId)) {
            const actionsArrayForUser = actionsMap.get(action.userId);
            actionsArrayForUser.push(action);
            actionsMap.set(action.userId, actionsArrayForUser);
        }
        else {
            actionsMap.set(action.userId, [action]);
        }
    });
    if (!(0, utils_1.checkIfActionExists)(actionType, setTypes)) {
        const errorInputString = Array.from(setTypes).join(", ");
        response.status(400).send(`ActionType is not valid, please choose from the following options: ${errorInputString}`);
        return;
    }
    const values = actionsMap.values();
    let actionsSortedByUserByDate = [];
    for (const value of values) {
        (0, utils_1.sortArray)(value);
        actionsSortedByUserByDate = actionsSortedByUserByDate.concat(value);
    }
    let actionTypeProbabilitiesMap = new Map();
    let totalCounter = 0;
    actionsSortedByUserByDate.filter((filteredEntry, index) => {
        if (filteredEntry.type === actionType) {
            if (index + 1 < actionsSortedByUserByDate.length && filteredEntry.userId === actionsSortedByUserByDate[index + 1].userId) {
                const nextType = actionsSortedByUserByDate[index + 1].type;
                if (actionTypeProbabilitiesMap.has(nextType)) {
                    actionTypeProbabilitiesMap.set(nextType, actionTypeProbabilitiesMap.get(nextType) + 1);
                }
                else {
                    actionTypeProbabilitiesMap.set(nextType, 1);
                }
                totalCounter++;
                return true;
            }
        }
        return false;
    });
    let responseJson;
    actionTypeProbabilitiesMap = new Map([...actionTypeProbabilitiesMap.entries()].sort((a, b) => b[1] - a[1]));
    for (const [key, value] of actionTypeProbabilitiesMap.entries()) {
        responseJson = Object.assign(Object.assign({}, responseJson), { [key]: Number((value / totalCounter).toFixed(2)) });
    }
    for (const element of setTypes) {
        if (!actionTypeProbabilitiesMap.has(element)) {
            responseJson = Object.assign(Object.assign({}, responseJson), { [element]: 0 });
        }
    }
    response.status(200).json(responseJson);
});
router.get('/referral-index', (request, response) => {
    const actions = response.locals.actionsFile;
    const users = response.locals.usersFile;
    const referralActions = actions.filter((action) => action.type === 'REFER_USER');
    const mapReferral = new Map();
    for (const referralAction of referralActions) {
        if (mapReferral.has(referralAction.userId)) {
            const targetUsers = mapReferral.get(referralAction.userId);
            targetUsers.push(referralAction.targetUser);
            mapReferral.set(referralAction.userId, targetUsers);
        }
        else {
            mapReferral.set(referralAction.userId, [referralAction.targetUser]);
        }
    }
    const resultMap = new Map();
    for (const [key, value] of mapReferral.entries()) {
        const stack = value;
        const traversed = {};
        let children = 0;
        let curr;
        while (stack.length) {
            curr = stack.pop();
            children += 1;
            traversed[curr] = true;
            if (mapReferral.has(curr)) {
                const values = mapReferral.get(curr);
                for (const valueEntry of values) {
                    if (!traversed[valueEntry]) {
                        stack.push(valueEntry);
                    }
                }
            }
        }
        resultMap.set(key, children);
    }
    let responseJson = {};
    for (const user of users) {
        if (!resultMap.has(user.id)) {
            responseJson = Object.assign(Object.assign({}, responseJson), { [Number(user.id)]: 0 });
        }
        else {
            responseJson = Object.assign(Object.assign({}, responseJson), { [Number(user.id)]: resultMap.get(user.id) });
        }
    }
    response.status(200).json(responseJson);
});
exports.default = router;
