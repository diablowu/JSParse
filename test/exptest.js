'use strict'



class ExpTest {
  constructor(expression, expectValue) {
    this.expression = expression;
    this.expectResult = expectValue;
  }
}

  
/**
 * 测试期待值与实际值是否相等（类型、值）
 */
function expTestResult(expect, real) {
  return expect === real ? "通过" : "未通过";
}


