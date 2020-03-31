import {
    wgs84tobd09
} from "../src/assets/coordinate";

/**
 * 获取今日日期格式
 */
function getToDay() {
    let a = new Date();
    a = a.getFullYear() + "-" + ((a.getMonth() + 1) > 9 ? (a.getMonth() + 1) : "0" + (a.getMonth() + 1)) + "-" + (a.getDate() > 9 ? a.getDate() : "0" + a.getDate())
    return a
}

function formatNum(f, digit) {
    var m = Math.pow(10, digit);
    return parseInt(f * m, 10) / m;
}

/**
 * 解析路径             转换为百度地图路径
 * @param {*} arr 路径数组
 */
function parsePath(arr) {
    var scopePath = [];
    arr.forEach((el, i) => {
        var pathobj = wgs84tobd09(el.lon / 600000, el.lat / 600000);
        scopePath.push(pathobj);
    });
    return scopePath
}
/**
 * 
 * @param {*} obj 需要替换的对象
 * @param {*} num 截取的长度
 */
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
/**时间戳转换日期
 * @param a 时间戳
 */
function parseDate(a) {
    var date = new Date(a);
    return date.getFullYear() + "-" + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate())
}

/**
 * loading动画函数
 */
function loading(){
    this.$loading({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  setTimeout(() => {
    loading.close();
  }, 2000);
}


const getVenderId = function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
         }
         if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
         }
     }
    return "";
  }

export default {
    getToDay,
    formatNum,
    parsePath,
    intercept,
    parseDate,
    loading,
    getVenderId,
    // API_URL: process.env.NODE_ENV === "production" ? "http://39.105.172.118:81/" : "http://192.168.1.149:81/",
    API_URL: "http://192.168.1.16:81/",
    towAPIUrl: "http://192.168.1.16:8080/"
}

//http://39.105.172.118:81/
//http://123.56.207.6:81/