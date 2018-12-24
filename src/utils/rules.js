// element-ui 自带的表单验证：
// 注意使用的时候，如果需要用this要bind(this)
import Base64 from "utils/base64"; // 最蠢的加密方式，没有之一

export function validateRESTful(rule, value, callback) {
  const re = /^[A-Za-z]\w+(?:\/\{?\w+\}?)*$/i;
  if (re.test(value)) {
    callback();
  } else {
    callback(new Error("地址不符合RESTful规范"));
  }
};
export function checkPwd(rule, value, callback) {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== this.passwordInfoForm.newPassword) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};
export function validatePassNew(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入新密码"));
  } else if (!/^[a-zA-Z0-9]{6,16}$/.test(value)) {
    callback(new Error("请输入字母或数字，长度在 6 到 16 个字符"));
  } else {
    callback();
  }
};
export function validatePassOld(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入旧密码"));
  } else if (/[\u4E00-\u9FA5]/.test(value)) {
    callback(new Error("不能包含中文"));
  } else if (
    Base64.encode(value) !== this.userInfoObj.password
  ) {
    callback(new Error("旧密码输入错误"));
  } else {
    callback();
  }
};
export function phoneCheck(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入号码"));
  } else if (!/^\d{11}$/.test(Number(value))) {
    callback(new Error("请输入11位有效手机号码"));
  } else {
    callback();
  }
};
export function emailCheck(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入邮箱"));
  } else if (
    !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value)
  ) {
    callback(new Error("请输入正确的邮箱"));
  } else {
    callback();
  }
};

// 数据源----------------------------
export function checkipv4(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入数据库IP"));
  } else if (
    !/^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/.test(value)
  ) {
    callback(new Error("请输入正确的IP地址"));
  } else {
    callback();
  }
};
export function checkPort(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入端口号"));
  } else if (
    !/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(value)
  ) {
    callback(new Error("端口号范围为0-65535"));
  } else {
    callback();
  }
};
export function checkUsername(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入用户名称"));
  } else if (!/^\w{1,50}$/.test(value)) {
    callback(new Error("请输入字母，数字或下划线, 长度在 1 到 50 个字符"));
  } else {
    callback();
  }
};
export function validatePassService(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (!/^[a-zA-Z0-9]{2,30}$/.test(value)) {
    callback(new Error("请输入字母或数字，长度在 2 到 30 个字符"));
  } else {
    callback();
  }
};

// application.vue
export function nameCheck(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入应用名称"));
  } else if (!/^.{1,50}$/.test(value)) {
    callback(new Error("长度在 1 到 50 个字符"));
  } else if (/\s+/.test(value)) {
    callback(new Error("不能包含空格"));
  } else {
    callback();
  }
};
export function descCheck(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入应用描述"));
  } else if (!/^.{1,50}$/.test(value)) {
    callback(new Error("长度在 1 到 300 个字符"));
  } else if (/\s+/.test(value)) {
    callback(new Error("不能包含空格"));
  } else {
    callback();
  }
};
// producer.vue
export function checkNumber(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入代码"));
  } else if (!/^\d+$/.test(value)) {
    callback(new Error("请输入数字值"));
  } else {
    callback();
  }
}

// user.vue
export function checkUsernameForUser(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入用户名称"));
  } else if (!/^\w{4,16}$/.test(value)) {
    callback(
      new Error("请输入字母，数字或下划线, 长度在 4 到 16 个字符")
    );
  } else {
    callback();
  }
};
export function validatePass(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (!/^[a-zA-Z0-9]{6,16}$/.test(value)) {
    callback(new Error("请输入字母或数字，长度在 6 到 16 个字符"));
  } else {
    callback();
  }
};
