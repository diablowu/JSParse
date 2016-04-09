/**
 * 运算符相关
 * @module operator
 */

'use strict'

let basic = require('./baisc')
let extra = require('./extra')
let _ = require('lodash')



let operators = [
    // 空运算符
    {
      "name": "NOP",
      "symbol": "nop",
      "rank": "0",
      "optype": "0",
      "func": basic.NOP
    },

    // 常规运算符
    {
      "name": "NOT",
      "symbol": "!",
      "rank": "80",
      "optype": "1",
      "func": basic.NOT
    }, {
      "name": "NG",
      "symbol": "-",
      "rank": "80",
      "optype": "1",
      "func": basic.NG
    }, {
      "name": "MULTI",
      "symbol": "*",
      "rank": "70",
      "optype": "2",
      "func": basic.MULTI
    }, {
      "name": "DIV",
      "symbol": "/",
      "rank": "70",
      "optype": "2",
      "func": basic.DIV
    }, {
      "name": "PLUS",
      "symbol": "+",
      "rank": "60",
      "optype": "2",
      "func": basic.PLUS
    }, {
      "name": "MINUS",
      "symbol": "-",
      "rank": "60",
      "optype": "2",
      "func": basic.MINUS
    }, {
      "name": "LT",
      "symbol": "<",
      "rank": "50",
      "optype": "2",
      "func": basic.LT
    }, {
      "name": "LE",
      "symbol": "<=",
      "rank": "50",
      "optype": "2",
      "func": basic.LE
    }, {
      "name": "GT",
      "symbol": ">",
      "rank": "50",
      "optype": "2",
      "func": basic.GT
    }, {
      "name": "GE",
      "symbol": ">=",
      "rank": "50",
      "optype": "2",
      "func": basic.GE
    }, {
      "name": "EQ",
      "symbol": "==",
      "rank": "40",
      "optype": "2",
      "func": basic.EQ
    }, {
      "name": "NEQ",
      "symbol": "!=",
      "rank": "40",
      "optype": "2",
      "func": basic.NEQ
    }, {
      "name": "AND",
      "symbol": "&&",
      "rank": "30",
      "optype": "2",
      "func": basic.AND,
      "sfunc": function(p) {
        if (!p) {
          return true;
        } else {
          return false;
        }
      }
    }, {
      "name": "OR",
      "symbol": "||",
      "rank": "20",
      "optype": "2",
      "func": basic.OR,
      "sfunc": function(p) {
        if (p) {
          return true;
        } else {
          return false;
        }
      }
    }, {
      "name": "IFELSE-1",
      "symbol": "?",
      "rank": "10",
      "optype": "3",
      "func": basic.IFELSE
    }, {
      "name": "IFELSE-2",
      "symbol": ":",
      "rank": "10",
      "optype": "3",
      "func": basic.IFELSE
    }, {
      "name": "IFELSE",
      "symbol": "?:",
      "rank": "10",
      "optype": "3",
      "func": basic.IFELSE
    },

    // 自定义运算符（函数）
    {
      "name": "testFunc",
      "symbol": "testFunc",
      "rank": "100",
      "optype": "N",
      "func": extra.testFunc
    }, {
      "name": "in",
      "symbol": "in",
      "rank": "100",
      "optype": "N",
      "func": extra.eleInArray
    }, {
      "name": "length",
      "symbol": "length",
      "rank": "100",
      "optype": "N",
      "func": extra.strLength
    }, {
      "name": "isNaN",
      "symbol": "isNaN",
      "rank": "100",
      "optype": "N",
      "func": extra.isNotNumber
    }, {
      "name": "Number",
      "symbol": "Number",
      "rank": "100",
      "optype": "N",
      "func": extra.parseToNumber
    }, {
      "name": "parseInt",
      "symbol": "parseInt",
      "rank": "100",
      "optype": "N",
      "func": extra.parseToInt
    }, {
      "name": "parseFloat",
      "symbol": "parseFloat",
      "rank": "100",
      "optype": "N",
      "func": extra.parseToFloat
    }
];

exports.charmap = {
  // 左括号
  "leftBracket": "(",

  // 右括号
  "rightBracket": ")",

  // 双引号
  "quote": "\"",

  // 单引号
  "singleQuote": "\'",

  // 空格
  "space": " ",

  // 逗号（自定义函数参数分隔符）
  "comma": ",",

  // 问号
  "questionMark": "?",

  // 冒号
  "colon": ":"

}


/**
 * 根据操作符符号获取操作符json对象
 * @method [getOperatorBySymbol]
 * 
 * @param  {string} symbol - 符号
 * @return {object}
 */
exports.getOperatorBySymbol = function (symbol) {
  return _.find(operators, function(ele){
    return ele.symbol === symbol
  });
}


/**
 * 根据操作符名称获取操作符json对象
 * @param  {string} name - 名称
 * @return {object}
 */
exports.getOperatorByName = function (name) {
  return _.find(operators, function(ele){
    return ele.name === name
  })[0];
}


/**
 * 判断字符是否与运算符的第index个字符相等
 * @param  {string} c - 比较的字符
 * @param  {number} index - 字符位置
 * @return {Boolean}
 */
exports.isLikeOperator = function (c, index) {
  return !!(_.find(operators, function(ele){
    return ele.symbol.chatAt(index) === c && ele.optype != 'N'
  }));
}

/**
 * 判断字符是否与函数的第index个字符相等
 * @param  {string} c - 比较的字符
 * @param  {number} index - 字符位置
 * @return {Boolean}
 */
exports.isLikeFunc = function (c, index) {
  return !!(_.find(operators, function(ele){
    return ele.symbol.chatAt(index) === c && ele.optype == 'N'
  }));
}

/**
 * 根据自定义函数名称获取函数预算对象
 * @param  {string} funcName - 方法名称
 * @return {Boolean}
 */
exports.getFuncByName = function (funcName) {
  return _.filter(operators, function(ele){
    return ele.name == funcName && ele.optype == 'N'
  })[0];
}


