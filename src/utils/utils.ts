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

export function getHighestNumberinAnArray(array: unknown[]) {

    let max = -Infinity

    array.forEach((element) => {
        if (typeof element !== 'number' || !Number.isInteger(element)) {
            throw TypeError('The array has element that are not integers!')
        }
        if (element > max) {
            max = element
        }
    })

    return max
}

export function recursionGetHighestNumber(array: unknown[]): number {
    if (!array.length) {
        return -Infinity
    }

    const firstElement = array.shift()
    if (isInteger(firstElement)) {
        const secondElement: number = recursionGetHighestNumber(array)

        return firstElement > secondElement ? firstElement : secondElement
    }

    return -Infinity
}

function isInteger(element: unknown): element is number {
    if (typeof element !== 'number' || !Number.isInteger(element)) {
        throw TypeError('The array has element that are not integers!')
    }
    return true
}