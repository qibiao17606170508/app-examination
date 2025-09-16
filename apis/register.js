import request from "@/utils/request/index_base.js";

/**
 * 注册相关接口
 */

// 用户注册
export function registerApi(data) {
  return request.request({
    url: "common/register/register",
    method: "POST",
    data,
  });
}

// 发送短信验证码
export function sendSmsCodeApi(data) {
  return request.request({
    url: "common/register/sendCode",
    method: "POST",
    data,
  });
}

// 忘记密码
export function forgotPasswordApi(data) {
  return request.request({
    url: "common/register/forgotPassword",
    method: "POST",
    data,
  });
}

// 验证身份（找回密码第一步）
export function verifyIdentityApi(data) {
  return request.request({
    url: "common/register/verifyIdentity",
    method: "POST",
    data,
  });
}
