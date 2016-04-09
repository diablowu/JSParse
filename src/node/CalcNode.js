/**
 * 节点相关
 * @module node
 */

'use strict'

/**
 *  node节点对象构造函数
 */
class CalcNode {

  /**
   * @param  {object} 
   * @param  {string}
   */
  constructor(obj, expression) {
    this.selfObj = obj;
    this.rootExpression = expression;
    this.pChildNodes = [];
  }


  /**
   *  在节点下添加节点
   * @param {Object} value
   */
  addNode(value) {
    if (value === this.selfObj) {
      return this;
    }
    this.pChildNodes.push(value);
  }


  toString() {
    return this.rootExpression;
  }


  /**
   * 表达式计算方法
   * @param  {object} 
   * @param  {Array} inputObj - 输入参数
   * @return {object} 计算结果
   */
  calcExp(nullMode, inputObj) {
    var pNode = this; // 该方法必须通过Node对象调用

    // 如果节点没有子节点，那么获取节点值准备计算
    if (pNode.pChildNodes == null || pNode.pChildNodes.length <= 0) {
      // 如果该节点是对象，则一定是运算符NOP，直接放回NOP计算结果
      if (typeof pNode.selfObj == "object") {
        return pNode.selfObj.func(nullMode);
      }
      // 将叶子节点的变量替换为参数输入值以准备计算
      var paramValue = tryGetEleValue(inputObj, pNode.selfObj);

      if (typeof paramValue == "undefined" &&
        pNode.rootExpression == pNode.selfObj) {
        return nullMode;
      }

      return paramValue;
    }

    // 如果有子节点说明该节点为操作符
    var pOP = getOperatorByName(pNode.selfObj.name);
    if (pOP == null) {
      throw new Error("JSParse Exception: Wrong operator!");
    }

    var varArray = [];

    if (pOP.optype == "N") {
      varArray.push(nullMode);
    }

    var i;
    var cNode;
    var result;
    for (i = 0; i < pNode.pChildNodes.length; i += 1) {
      cNode = pNode.pChildNodes[i];
      result = cNode.calc(nullMode, inputObj); //递归计算子节点

      // 执行具备短路判断的运算符进行短路判断
      if (!isUndefinedOrNullOrEmpty(pOP.sfunc)) {
        if (pOP.sfunc(result)) {
          return result;
        }
      }
      varArray.push(result);
    }

    var rs = null;
    if (pOP.optype == "N") {
      rs = pOP.func.apply(this, varArray);
    } else {
      rs = pOP.func(nullMode, varArray);
    }

    return rs;
  }

}



module.exports = CalcNode;
