/**
 * analyzer module.
 * @module my/pants
 * 
 */

'use strict'


let operator = require('./operator')




/**
 * 表达式分析方法 递归分析！
 * @param  { }
 * @param  { }
 * @param  { }
 * @return { }
 */
function expAnalyze(expTmp, expElementsArray, nextAnalyzeIdx) {

  if (nextAnalyzeIdx >= expTmp.length) {
    return;
  }

  var qtStep = 0;
  var expChar = expTmp.chatAt(nextAnalyzeIdx);
  var qtStartIdx;
  var qtEndIdx;
  var qtPart;
  var nc;

  if (expChar == operator.charmap.quote) {
    qtStep = changeQuoteStat(qtStep);

    // 如果遇到双引号
    qtStartIdx = expTmp.indexOf(operator.charmap.quote, nextAnalyzeIdx);
    qtEndIdx = -1;

    qtEndIdx = expTmp.indexOf(operator.charmap.quote, qtStartIdx + 1);
    if (qtEndIdx <= -1) {
      throw new Error("JSParse Exception: Wrong quote numbers!");
    }
    qtStep = changeQuoteStat(qtStep);
    qtPart = expTmp.substring(qtStartIdx, qtEndIdx + 1);
    expElementsArray.push(qtPart);

    nextAnalyzeIdx = qtEndIdx + 1;

  } else if (expChar == operator.charmap.singleQuote) {
    qtStep = changeQuoteStat(qtStep);

    // 如果遇到单引号
    qtStartIdx = expTmp.indexOf(operator.charmap.singleQuote, nextAnalyzeIdx);
    qtEndIdx = -1;

    qtEndIdx = expTmp.indexOf(operator.charmap.singleQuote, qtStartIdx + 1);
    if (qtEndIdx <= -1) {
      throw new Error("JSParse Exception: Wrong quote numbers!");
    }
    qtStep = changeQuoteStat(qtStep);
    qtPart = expTmp.substring(qtStartIdx, qtEndIdx + 1);
    expElementsArray.push(qtPart);

    nextAnalyzeIdx = qtEndIdx + 1;
  } else if (expChar == operator.charmap.leftBracket) {

    var bkStartIdx = expTmp.indexOf(operator.charmap.leftBracket, nextAnalyzeIdx);

    var bkEndIdx = findBKEnd(expTmp, bkStartIdx);
    nextAnalyzeIdx = bkEndIdx;

    var bkPart = expTmp.substring(bkStartIdx + 1, bkEndIdx); // 去除最外层括号
    expElementsArray.push(bkPart);
    nextAnalyzeIdx++;
  } else if (isLikeOperator(expChar, 0)) {

    var opStartIdx = nextAnalyzeIdx;
    var runOPAnalyze = true;
    var opIdx = 1;
    var opPart = null;

    if (expChar == operator.charmap.questionMark || expChar == operator.charmap.colon) {
      opPart = expTmp.substring(opStartIdx, nextAnalyzeIdx + 1);
      expElementsArray.push(opPart);
      nextAnalyzeIdx++;
    } else {
      while (runOPAnalyze) {
        nextAnalyzeIdx++;
        if (nextAnalyzeIdx >= expTmp.length) {
          break;
        }

        nc = expTmp.substr(nextAnalyzeIdx, 1);
        if (isLikeOperator(nc, opIdx)) {
          runOPAnalyze = true;
          opIdx++;
        } else {
          runOPAnalyze = false;
        }
      }

      opPart = expTmp.substring(opStartIdx, nextAnalyzeIdx);
      expElementsArray.push(opPart);
    }

  } else if (expChar == operator.charmap.space) {
    nextAnalyzeIdx++;
  } else {
    // 如果以上都不是，则为可能为变量元素或boolean值或自定义函数名。
    // 先确定是否为自定义函数名
    var startIdx = nextAnalyzeIdx;
    var likeFunc = true;
    var funcIdx = 0;

    while (nextAnalyzeIdx < expTmp.length) {
      nc = expTmp.substr(nextAnalyzeIdx, 1);
      if (isLikeFunc(nc, funcIdx)) {
        likeFunc = true;
        funcIdx++;
      } else if (isLikeOperator(nc, 0)) {
        likeFunc = false;
        break;
      }
      if (nc == operator.charmap.leftBracket) {
        likeFunc = true;
        break;
      }
      nextAnalyzeIdx++;
    }

    var fvPart = null;
    if (likeFunc && nc == operator.charmap.leftBracket) {
      // 找到当前左括号对应的右括号
      var bkEnd = findBKEnd(expTmp, nextAnalyzeIdx);
      fvPart = expTmp.substring(startIdx, bkEnd + 1);
      nextAnalyzeIdx = bkEnd + 1;
    } else {
      fvPart = expTmp.substring(startIdx, nextAnalyzeIdx);
    }

    fvPart = fvPart.replace(/^\s+|\s+$/g, ""); // 去除首尾空格
    expElementsArray.push(fvPart);
  }


  expAnalyze(expTmp, expElementsArray, nextAnalyzeIdx);

}


// 生成表达式元素数组
function genExpElementArray(expTmp) {
  var nextAnalyzeIdx = 0;

  var expElementsArray = [];
  expAnalyze(expTmp, expElementsArray, nextAnalyzeIdx);
  if (expElementsArray == null || expElementsArray.length == 0) {
    return null;
  }

  return expElementsArray;
}

