import Request from "./request.js";
// import store from '@/store/index.js'
// import {auth} from '@/apis/employee.js'
import configApi from "@/config/index.js";
// need to change baseUrl
const baseUrl = process.env.NODE_ENV === "development" ? configApi.apiDev : configApi.apiPro;

const config = {
  baseUrl: `${baseUrl}/`,
  timeout: 2000,
};

export let base = baseUrl;

const reqInterceptor = async (options) => {
  // 参考PC端request.ts的请求拦截器逻辑

  // 设置默认请求头
  options.header = {
    "content-type": "application/json",
    ...options.header,
  };

  // Token处理 - 参考PC端逻辑，不包含login接口时添加token
  const token = uni.getStorageSync("token");
  if (!options.url.includes("login") && token) {
    // 使用Bearer Token格式，与PC端保持一致
    options.header["Authorization"] = `Bearer ${token}`;
  }

  // 语言设置 (如果需要国际化)
  const lang = uni.getStorageSync("lang") || "zh";
  options.header["Accept-Language"] = lang === "en" ? "en-US" : "zh-CN";

  // Loading处理
  options.hideLoading = options.hideLoading !== undefined ? options.hideLoading : false;
  if (!options.hideLoading) {
    uni.showLoading({
      title: "加载中...",
      mask: true,
    });
  }

  return options;
};

const resInterceptor = (response, conf = {}) => {
  // 先隐藏loading
  uni.hideLoading();

  // 参考PC端request.ts的响应处理逻辑
  if (process.env.NODE_ENV === "development") {
    console.log(`[REQUEST] response received:`, {
      statusCode: response.statusCode,
      data: response.data,
      url: conf.url,
    });
  }

  // 获取响应数据
  const { data } = response;
  const { code, msg, message } = data || {};

  // HTTP状态码检查
  if (response.statusCode !== 200) {
    let errorMsg = "网络请求失败";
    switch (response.statusCode) {
      case 404:
        errorMsg = "请求的资源不存在";
        break;
      case 500:
        errorMsg = "服务器内部错误";
        break;
      case 502:
        errorMsg = "网关错误";
        break;
      case 503:
        errorMsg = "服务不可用";
        break;
      default:
        errorMsg = `请求失败 (${response.statusCode})`;
    }

    setTimeout(() => {
      uni.showToast({
        icon: "none",
        title: errorMsg,
        duration: 2000,
      });
    }, 100);

    return {
      wakaryReqToReject: true,
      msg: errorMsg,
      res: response,
    };
  }

  // 没有响应数据或数据为空
  if (!data) {
    setTimeout(() => {
      uni.showToast({
        icon: "none",
        title: "服务器响应异常",
        duration: 2000,
      });
    }, 100);

    return {
      wakaryReqToReject: true,
      msg: "服务器响应异常",
      res: response,
    };
  }

  // Token相关错误处理
  if (msg === "token过期" || code === 401 || code === 4001) {
    setTimeout(() => {
      uni.showToast({
        icon: "none",
        title: "登录超时，请重新登录！",
        duration: 2000,
      });
    }, 100);

    // 清除本地存储
    uni.clearStorageSync();
    // 跳转到登录页
    setTimeout(() => {
      uni.reLaunch({
        url: "/pages/index/login",
      });
    }, 1500);

    return {
      wakaryReqToReject: true,
      msg: "登录超时",
      res: response,
    };
  }

  // 业务状态码处理 - 只有当code存在且不为0时才是错误
  if (code !== undefined && code !== 0) {
    const errorMsg = msg || message || "请求失败";

    console.log(`[REQUEST] 业务错误 - code: ${code}, msg: ${errorMsg}`);

    // 特殊错误码处理
    switch (code) {
      case -3:
        setTimeout(() => {
          uni.showToast({
            icon: "none",
            title: "登录超时，请重新登录！",
            duration: 2000,
          });
        }, 100);

        uni.clearStorageSync();
        setTimeout(() => {
          uni.reLaunch({
            url: "/pages/index/login",
          });
        }, 1500);
        break;
      default:
        // 延迟显示toast，确保loading已完全隐藏
        setTimeout(() => {
          uni.showToast({
            icon: "none",
            title: errorMsg,
            duration: 2000,
          });
        }, 100);
    }

    return {
      wakaryReqToReject: true,
      msg: errorMsg,
      code: code,
      res: response,
    };
  }

  // 成功响应，返回数据
  return data;
};

const req = new Request(config, reqInterceptor, resInterceptor);

// response log - 现在仅用于记录，loading在resInterceptor中处理
function _responseLog(res, conf = {}, describe = null) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[REQUEST LOG] ${describe}:`, {
      statusCode: res.statusCode,
      data: res.data,
      url: conf.url,
      timestamp: new Date().toLocaleTimeString(),
    });
  }
}

export default req;
