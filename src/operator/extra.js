/**
 * 自定义运算
 * @module operator/extra 
 */

'use strict'


var testFunc = function(nullMode, v1, v2) {
    return v1 - v2;
};

var eleInArray = function(nullMode, arr, ele) {
    if (typeof ele == "undefined" || ele == null) {
        return nullMode;
    }

    var i;
    for (i = 0; i < arr.length; i += 1) {
        if (arr[i] == ele) {
            return true;
        }
    }

    return false;
};

var strLength = function(nullMode, str) {
    if (typeof str == "undefined" || str == null) {
        return 0;
    }

    return str.length;
};

var isNotNumber = function(nullMode, val) {
    return isNaN(val);
};

var parseToNumber = function(nullMode, val) {
    return Number(val);
};

var parseToInt = function(nullMode, str, radix) {
    return parseInt(str, radix);
};

var parseToFloat = function(nullMode, str) {
    return parseFloat(str);
};

