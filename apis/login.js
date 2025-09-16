import request from "@/utils/request/index_base.js";

/**
 * 登录相关接口
 */

// 获取图形验证码
export function getCaptchaApi() {
  return request.request({
    url: "common/login/captcha",
    method: "GET",
  });
}

// 用户登录
export function loginApi(data) {
  return request.request({
    url: "common/login/login",
    method: "POST",
    data,
  });
}

// 用户退出
export function logoutApi() {
  return request.request({
    url: "common/login/logout",
    method: "POST",
  });
}
