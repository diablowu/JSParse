/**
 * 基本运算
 * @module operator/basic
 */

'use strict'



/**
 * 运算符nop算法
 * @param  {Boolean} nullMode
 * @return {Boolean}
 */
exports.NOP = function (nullMode) {
    return nullMode;
};

/**
 * 运算符 “!” 算法
 * @param  { }
 * @param  { }
 * @return {Boolean}
 */
exports.NOT = function (nullMode, varArray) {
    if (isUndefinedOrNullOrEmpty(varArray[0])) {
        return nullMode;
    } else {
        return !varArray[0];
    }
};

/**
 * 运算符 “-”（负号） 算法
 * @param { }
 * @param { } varArray
 */
exports.NG = function (nullMode, varArray) {
    return -varArray;
};

/**
 * 运算符 “*” 算法
 * @param { }
 * @param { } varArray
 */
exports.MULTI = function (nullMode, varArray) {
    return varArray[0] * varArray[1];
};

/**
 * 运算符 “/” 算法
 * @param { }
 * @param { } varArray
 */
exports.DIV = function (nullMode, varArray) {
    return varArray[0] / varArray[1];
};

/**
 * 运算符 “+” 算法
 * @param { }
 * @param { } varArray
 */
exports.PLUS = function (nullMode, varArray) {
    return varArray[0] + varArray[1];
};

/**
 * 运算符 “-”（减号） 算法
 * @param  { }
 * @param  { } varArray
 * @return {Boolean}
 */
exports.MINUS = function (nullMode, varArray) {
    return varArray[0] - varArray[1];
};

/**
 * 运算符 “<” 算法
 * @param  { }
 * @param  { } varArray
 * @return {Boolean}
 */
exports.LT = function (nullMode, varArray) {
    if (isUndefinedOrNullOrEmpty(varArray[0]) ||
        isUndefinedOrNullOrEmpty(varArray[1])) {
        return nullMode;
    } else {
        return varArray[0] < varArray[1];
    }
};

/**
 * 运算符 “<=” 算法
 * @param  { }
 * @param  { } varArray
 * @return {Boolean}
 */
exports.LE = function (nullMode, varArray) {
    if (isUndefinedOrNullOrEmpty(varArray[0]) ||
        isUndefinedOrNullOrEmpty(varArray[1])) {
        return nullMode;
    } else {
        return varArray[0] <= varArray[1];
    }
};

/**
 * 运算符 “>” 算法
 * @param  { }
 * @param  { } varArray
 * @return {Boolean}
 */
exports.GT = function (nullMode, varArray) {
    if (isUndefinedOrNullOrEmpty(varArray[0]) ||
        isUndefinedOrNullOrEmpty(varArray[1])) {
        return nullMode;
    } else {
        return varArray[0] > varArray[1];
    }
};

/**
 * 运算符 “>=” 算法
 * @param  { }
 * @param  { } varArray
 * @return {Boolean}
 */
exports.GE = function (nullMode, varArray) {
    if (isUndefinedOrNullOrEmpty(varArray[0]) ||
        isUndefinedOrNullOrEmpty(varArray[1])) {
        return nullMode;
    } else {
        return varArray[0] >= varArray[1];
    }
};

/**
 * 运算符 “==” 算法
 * @param  { }
 * @param  { } varArray
 * @return {Boolean}
 */
exports.EQ = function (nullMode, varArray) {
    if (isUndefinedOrNullOrEmpty(varArray[0]) ||
        isUndefinedOrNullOrEmpty(varArray[1])) {
        return nullMode;
    } else {
        return varArray[0] == varArray[1];
    }
};

/**
 * 运算符 “!=” 算法
 * @param  { }
 * @param  { } varArray
 * @return {Boolean}
 */
exports.NEQ = function (nullMode, varArray) {
    if (isUndefinedOrNullOrEmpty(varArray[0]) ||
        isUndefinedOrNullOrEmpty(varArray[1])) {
        return nullMode;
    } else {
        return varArray[0] != varArray[1];
    }
};

/**
 * 运算符 “&&” 算法
 * @param  { }
 * @param  { } varArray
 * @return {boolean}
 */
exports.AND = function (nullMode, varArray) {
    if (isUndefinedOrNullOrEmpty(varArray[0]) ||
        isUndefinedOrNullOrEmpty(varArray[1])) {
        return nullMode;
    } else {
        return varArray[0] && varArray[1];
    }

};

/**
 * 运算符 “||” 算法
 * @param  { }
 * @param  { } varArray
 * @return {boolean}
 */
exports.OR = function (nullMode, varArray) {
    if (isUndefinedOrNullOrEmpty(varArray[0]) ||
        isUndefinedOrNullOrEmpty(varArray[1])) {
        return nullMode;
    } else {
        return varArray[0] || varArray[1];
    }
};

/**
 * 运算符“?:”算法
 * @param  { }
 * @param  { } varArray
 * @return {boolean}
 */
exports.IFELSE = function (nullMode, varArray) {
    if (isUndefinedOrNullOrEmpty(varArray[0])) {
        varArray[0] = true;
    }
    return varArray[0] ? varArray[1] : varArray[2];
};
