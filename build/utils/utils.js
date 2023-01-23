"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfActionExists = exports.sortArray = void 0;
function sortArray(array) {
    array.sort(function (previousEntry, nextEntry) {
        return new Date(previousEntry.createdAt).getTime() - new Date(nextEntry.createdAt).getTime();
    });
}
exports.sortArray = sortArray;
function checkIfActionExists(action, set) {
    if (set.has(action)) {
        return true;
    }
    return false;
}
exports.checkIfActionExists = checkIfActionExists;
