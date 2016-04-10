'use strict'

let CalcNode = require('./CalcNode')
let operators = require('./operators')




/**
 * 标记如果计算变量为空，则条件表达式返回假
 * @type {Boolean}
 */
const NULL_AS_FALSE = false;

/**
 * [NULL_AS_TRUE 标记如果计算变量为空，则条件表达式返回真]
 * @type {Boolean}
 */
const NULL_AS_TRUE = true;











/**
 * 改变引号状态,1表示引号开始 0表示引号结束
 * @param  {number} qtStep
 * @return {number}
 */
function changeQuoteStat(qtStep) {
  if (qtStep == 1) {
    return 0;
  } else {
    return 1;
  }
}

/**
 * 从数组中截取数组
 * @param  {Array} expArray - an array
 * @param  {Number} startIdx - start index
 * @param  {Number} len - length of sliced array
 * @return {Array} new array
 */
function genArrayFromArray(expArray, startIdx, len) {
  var tmpArray = [];
  var i;
  for (i = 0; i < len; i += 1) {
    tmpArray.push(expArray[startIdx]);
    startIdx++;
  }
  return tmpArray;
}

/**
 * 尝试从输入对象中获取输入值（属性值）
 * @param  {Object} inputObj 
 * @param  {string} propName - 属性名
 * @return {Object}
 */
function tryGetEleValue(inputObj, propName) {
  var keyFirstChar = propName.substr(0, 1);

  // 如果是字符串，直接返回本身
  if (keyFirstChar == operators.charmap.quote ||
    keyFirstChar == operators.charmap.singleQuote) {
    return propName.replace(/^"*|"*$/g, "").replace(/^'*|'*$/g, "");
  }

  // 如果是数字，直接返回本身
  var num = parseFloat(propName);
  if (!isNaN(num)) {
    return num;
  }

  // 如果是true、false，则返回boolean值
  if (propName == "true") {
    return true;
  }
  if (propName == "false") {
    return false;
  }

  // 如果是空值或空字符串，依然返回。
  return inputObj[propName];
}

/**
 * 查找元素数组中的冒号
 * @param  {Array}
 * @return {number} 位置
 */
function findIFELSEColon(expArray) {
  var i;
  for (i = 0; i < expArray.length; i += 1) {
    if (expArray[i] == ":") {
      return i;
    }
  }
  return -1;
}

/**
 * 找到字符串中第一个左括号
 * @param  {Array}
 * @return {number}
 */
function findBKStart(expTmp) {
  var bkStart = -1;
  var qtStep = 0;
  var sqtStep = 0;
  var cIdx = 0;
  var c;

  while (cIdx < expTmp.length) {
    c = expTmp.substr(cIdx, 1);
    if (c == operators.charmap.quote) {
      qtStep = changeQuoteStat(qtStep);
    }

    if (c == operators.charmap.singleQuote) {
      sqtStep = changeQuoteStat(sqtStep);
    }

    if (c == operators.charmap.leftBracket && qtStep == 0 && sqtStep == 0) {
      bkStart = cIdx;
      return bkStart;
    }
    cIdx++;
  }

  return bkStart;
}

/**
 * 找到当前左括号对应的右括号
 * @param  {Array}
 * @param  {number} bkStartIdx - 起始位置
 * @return {number}
 */
function findBKEnd(expTmp, bkStartIdx) {
  var bkEnd = bkStartIdx;
  var qtStep = 0;
  var sqtStep = 0;
  var bkStep = 0;
  var c;
  var runBKAnalyze = true;
  bkStep += 1;
  do {
    bkEnd++;
    if (bkEnd >= expTmp.length) {
      break;
    }

    c = expTmp.substr(bkEnd, 1);

    if (c == operators.charmap.quote) {
      qtStep = changeQuoteStat(qtStep);
    }
    if (c == operators.charmap.singleQuote) {
      sqtStep = changeQuoteStat(sqtStep);
    }

    if (c == operators.charmap.leftBracket && qtStep == 0 && sqtStep == 0) {
      bkStep++;
    }
    if (c == operators.charmap.rightBracket && qtStep == 0 && sqtStep == 0) {
      bkStep--;
    }

    if (bkStep == 0) {
      runBKAnalyze = false;
    } else if (bkStep > 0) {
      runBKAnalyze = true;
    } else {
      break;
    }
  } while (runBKAnalyze);

  if (bkStep != 0) {
    throw new Error("JSParse Exception: Wrong bracket numbers!");
  }

  return bkEnd;
}

/**
 * 自定义函数参数分析
 * @param  {object}
 * @return {object}
 */
function funcParamsAnalyze(params) {
  var arParam = [];
  var paramNextCharIdx = 0;
  var paramNextSubStart = 0;
  var bkStep = 0;
  var qtStep = 0;
  var sqtStep = 0;
  var paramChar;
  var paramPart;

  // 如果参数是常量、变量则放入数组；
  // 如果是表达式或者仍为自定义函数，则不在此继续分析，整体放入数组。
  while (paramNextCharIdx < params.length) {
    paramChar = params.substr(paramNextCharIdx, 1);
    if (paramChar == operators.charmap.quote) {
      qtStep = changeQuoteStat(qtStep);
    }
    if (paramChar == operators.charmap.singleQuote) {
      sqtStep = changeQuoteStat(sqtStep);
    }

    if (paramChar == operators.charmap.leftBracket && qtStep == 0 && sqtStep == 0) {
      bkStep++;
    }
    if (paramChar == operators.charmap.rightBracket && qtStep == 0 && sqtStep == 0) {
      bkStep--;
    }

    if (paramChar == operators.charmap.comma &&
      qtStep == 0 && sqtStep == 0 && bkStep == 0) {
      // 将逗号之前的部分取出
      paramPart = params.substr(paramNextSubStart, paramNextCharIdx - paramNextSubStart);
      paramPart = paramPart.replace(/^\s+|\s+$/g, ""); // 去除首尾空格
      arParam.push(paramPart);
      paramNextSubStart = paramNextCharIdx + 1;
    }

    if (paramNextCharIdx == params.length - 1) {
      // 分析到最后一位时，没有逗号，直接截取到之前的逗号为最后一个参数
      paramPart = params.substr(paramNextSubStart, params.length - paramNextSubStart);
      paramPart = paramPart.replace(/^\s+|\s+$/g, ""); // 去除首尾空格
      arParam.push(paramPart);
    }

    paramNextCharIdx++;
  }

  return arParam;
}

/**
 * 判断表达式中的“-”是减号还是负号
 * @param  {Array}
 * @param  {number}
 * @return {object}
 */
function judgeNGorMINUS(expArray, i) {
  // 判断在该表达式元素中“-”为负号还是减号
  if (i == -1 ||
    expArray[i] == operators.charmap.leftBracket ||
    isLikeOperator(expArray[i], 0)) {
    return getOperatorByName("NG");
  }
  if (expArray[i] == operators.charmap.space) {
    judgeNGorMINUS(expArray, i - 1);
  } else {
    return getOperatorByName("MINUS");
  }
}




// 表达式语法树构建方法
function genExpSynTaxTree(expArray, pNode, expression) {

  var expTempArray = [];
  var minRankOp = null;
  var minRankOpIdx = 0;
  var qMarkOpIdx = 0;
  var colonOpIdx = 0;
  var cNodeArray = [];
  var i, j, k;
  var array, leftArray, rightArray, middleArray;
  var op;
  var arParam;

  if (expArray.length == 1) {
    // 如果数组中只有一个元素，那么则可能是叶子节点或未分析完成的表达式,或是自定义函数
    // 尝试继续分析该“叶子节点”
    expTempArray = genExpElementArray(expArray[0]); // 如果是表达式，通过递归分析可以将所有括号去除并找到叶子节点
    if (expTempArray.length == 1) {
      // 如果分析后数组中真的只有一个元素，则为叶子节点或自定义函数
      // 先判断是否为自定义函数（判断是否存在引号外的括号）
      var funcBKStart = findBKStart(expArray[0]); // 如果此时仍存在真括号，则一定只有是自定义函数的可能
      if (funcBKStart > 0) {
        var funcName = expArray[0].substr(0, funcBKStart);
        var funcObj = getFuncByName(funcName);
        if (funcObj == null) {
          throw new Error("JSParse Exception: Wrong function name!");
        }

        // 截取倒数第二位到左括号之后一位的部分
        var params = expArray[0].substr(funcBKStart + 1, expArray[0].length - (funcBKStart + 2));

        expTempArray = funcParamsAnalyze(params);
        minRankOp = funcObj;
      } else {
        var tmpNode = createNode(expArray[0]);
        if (pNode == null || pNode.selfObj == null) {
          pNode = tmpNode;
          pNode.rootExpression = expression;
        } else {
          pNode.addNode(tmpNode);
        }
        return pNode;
      }
    }
    expArray = expTempArray;
  }

  // 找出当前表达式元素数组中优先级最低的操作符
  for (i = 0; i < expArray.length; i += 1) {
    op = getOperatorBySymbol(expArray[i]);
    if (op == null) {
      continue; //如果不是操作符则继续寻找
    }

    if (op.symbol == "-") {
      // 如果运算符为“-”，那么要确定此时为负号还是减号以计算确定优先级
      op = judgeNGorMINUS(expArray, i - 1);
    }


    if (op.symbol == "?") {
      // 如果运算符为“?”，数组中必须含有“:”，否则表达式语法错误

      colonOpIdx = findIFELSEColon(expArray);
      if (colonOpIdx == -1) {
        throw new Error("JSParse Exception: Wrong expression!");
      }

      minRankOp = getOperatorBySymbol("?:");
      qMarkOpIdx = i;
      break;
    }


    if (minRankOp == null) {
      minRankOp = op;
      minRankOpIdx = i;
    } else {
      if (op.rank <= minRankOp.rank) { //比较操作符优先级，找出最低者
        minRankOp = op;
        minRankOpIdx = i;
      }
    }
  }

  if (minRankOp == null) {
    throw new Error("JSParse Exception: Wrong expressions!");
  }

  var cNode = createNode(minRankOp);
  if (pNode == null || pNode.selfObj == null) {
    pNode = cNode;
    pNode.rootExpression = expression;
  } else {
    pNode.addNode(cNode);
  }

  if (cNode.selfObj.optype == 1) {
    // 1目运算符只生成一个子节点
    array = genArrayFromArray(expArray, minRankOpIdx + 1, expArray.length - (minRankOpIdx + 1));
    cNodeArray.push(array);
  } else if (cNode.selfObj.optype == 2) {
    // 2目运算符生成两个子节点
    leftArray = genArrayFromArray(expArray, 0, minRankOpIdx);
    rightArray = genArrayFromArray(expArray, minRankOpIdx + 1, expArray.length - (minRankOpIdx + 1));
    cNodeArray.push(leftArray);
    cNodeArray.push(rightArray);
  } else if (cNode.selfObj.optype == 3) {
    // 3目运算符生成三个子节点
    leftArray = genArrayFromArray(expArray, 0, qMarkOpIdx);
    middleArray = genArrayFromArray(expArray, qMarkOpIdx + 1, colonOpIdx - (qMarkOpIdx + 1));
    rightArray = genArrayFromArray(expArray, colonOpIdx + 1, expArray.length - (colonOpIdx + 1));
    cNodeArray.push(leftArray);
    cNodeArray.push(middleArray);
    cNodeArray.push(rightArray);
  } else if (cNode.selfObj.optype == "N") {
    for (j = 0; j < expArray.length; j += 1) {
      arParam = [expArray[j]]; // 同运算符逻辑保持一致，即使自定义函数参数都作为一个元素整体处理，仍然放到数组中。
      cNodeArray.push(arParam);
    }
  }

  for (k = 0; k < cNodeArray.length; k += 1) {
    genExpSynTaxTree(cNodeArray[k], cNode, expression);
  }
  return pNode;
}

/**
 * 根据表达式生成可计算的语法树
 * @param  {string} expression - 表达式
 * @return {object}
 */
function buildSyntaxTree(expression) {
  if (!expression) {
    return new CalcNode(getOperatorByName("NOP"), expression);
  }
  var expArray = genExpElementArray(expression);
  return genExpSynTaxTree(expArray, null, expression);
}



exports.build = buildSyntaxTree;




