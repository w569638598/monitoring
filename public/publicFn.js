import {
    wgs84tobd09
} from "../src/assets/coordinate";


function getToDay() {
    let a = new Date();
    a = a.getFullYear() + "-" + ((a.getMonth() + 1) > 9 ? (a.getMonth() + 1) : "0" + (a.getMonth() + 1)) + "-" + (a.getDate() > 9 ? a.getDate() : "0" + a.getDate())
    return a
}

function formatNum(f, digit) {
    var m = Math.pow(10, digit);
    return parseInt(f * m, 10) / m;
}

function parsePath(arr) {
    var scopePath = [];
    arr.forEach((el, i) => {
        var pathobj = wgs84tobd09(el.lon / 600000, el.lat / 600000);
        scopePath.push(pathobj);
    });
    return scopePath
}

function intercept(obj, num) {
    let arr = []
    obj.forEach(el => {
        if (el.length > num) {
            arr.push(el.replace(el.slice(num), "..."));
            return
        }
        arr.push(el)
    })
    return arr;
}
export default {
    getToDay,
    formatNum,
    parsePath,
    intercept
}