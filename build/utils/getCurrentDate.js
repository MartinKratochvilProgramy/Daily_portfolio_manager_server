"use strict";
exports.__esModule = true;
exports.getCurrentDate = void 0;
var getCurrentDate = function () {
    // returns current date in format yyyy-mm-dd
    var currentdate = new Date();
    var today = currentdate.getFullYear() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getDate();
    // + " "  
    // + currentdate.getHours() + ":"  
    // + (currentdate.getMinutes() < 10 ? "0"+currentdate.getMinutes() : currentdate.getMinutes())
    return today;
};
exports.getCurrentDate = getCurrentDate;
