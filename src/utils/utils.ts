import { Action } from "../typings/global";

export function sortArray(array: Action[]) {
    array.sort(function (previousEntry, nextEntry) {
        return new Date(previousEntry.createdAt).getTime() - new Date(nextEntry.createdAt).getTime()
    })
}

export function checkIfActionExists(action: string, set: Set<string>) {
    if (set.has(action)) {
        return true
    }
    return false
}