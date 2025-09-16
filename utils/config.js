import App from "../App";
import { createSSRApp } from "vue";
var that = createSSRApp(App).config.globalProperties;
import moment from "moment";
import config from "@/config/index.js";
const configData = {
  loadText: {
    loadmore: "点击加载更多",
    loading: "努力加载中",
    nomore: "没有更多数据了",
  },
  // #ifdef H5
  baseURL: "/api", //baseURL/
  // #endif
  // #ifdef MP-WEIXIN
  baseURL: "http://bolv.iqibiao.cn", //baseURL
  // #endif
};
const imgUrl = "https://rs-poject.oss-cn-hangzhou.aliyuncs.com/boniu/";
const backPage = () => {
  // 返回页面
  let pages = getCurrentPages();
  if (pages.length === 1) {
    uni.switchTab({
      url: "/pages/index/index",
    });
  } else {
    uni.navigateBack({
      //uni.navigateTo跳转的返回，默认1为返回上一级
      delta: 1,
    });
  }
};
const getToken = () => {
  return uni.getStorageSync("token");
};
// 加载中...
const loading = (title) => {
  uni.showLoading({
    title: title || "加载中",
    mask: true,
    fail: (err) => {},
  });
};
// 格式化金额
const formatPrice = (num) => {
  return (num + "").replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
};
// 提示框
const Toast = (title, flag) => {
  uni.showToast({
    title: title || "功能暂未开放",
    icon: flag ? "success" : "none",
  });
};
// 数据结构拼接
const apiObj = (obj) => {
  let str = "";
  if (typeof obj == "object" && Object.keys(obj).length > 0) {
    let i = 0;
    for (let key in obj) {
      if (i === 0) {
        str += `?${key}=${obj[key]}`;
      } else {
        str += `&${key}=${obj[key]}`;
      }
      i++;
    }
  }
  return str;
};
// 金额格式化 保留后两位
const price = (num) => {
  return parseFloat(num).toFixed(2);
};
// 跳转
const goUrl = (url, obj, type) => {
  let urltype = type ? type : "navigateTo";
  let str = "";
  let urlVal = "";
  if (typeof obj == "object" && Object.keys(obj).length > 0) {
    let i = 0;
    for (let key in obj) {
      if (i === 0) {
        str += `?${key}=${obj[key]}`;
      } else {
        str += `&${key}=${obj[key]}`;
      }
      i++;
    }
  }
  if (typeof obj != "undefined" && typeof obj == "string") {
    urlVal = url + "?value=";
  }
  if (url) {
    uni[urltype]({
      url: typeof obj == "object" && Object.keys(obj).length > 0 ? `${url}${str}` : typeof obj != "undefined" && typeof obj == "string" ? `${urlVal}${obj}` : url,
      success: () => {
        // store.navFlag = false;
      },
      fail: (err) => {
        console.log("页面跳转失败", err);
      },
    });
  } else {
    uni.showToast({
      title: "链接无效",
      icon: "none",
    });
  }
};
// 预览图片
const previewImage = (imgList, index) => {
  if (!imgList) {
    this.Toast("查看图片错误");
    return false;
  }
  index || 0;
  // 预览图片
  uni.previewImage({
    current: index || 0,
    urls: imgList,
    indicator: "number",
    fail: (err) => {},
    longPressActions: {
      success: function (data) {},
      fail: function (err) {},
    },
  });
};
/*
 *
 * 七牛云上传接口封装
 * @param {Number} count 限制上传张数 默认1
 * @param {Array} sourceType 从相册中选择 默认 从相册选择和相机
 * @param {Array} sizeType 指定图片类型 默认 原图、压缩图
 *
 */
const upLoadImg = (count = 1, token, sourceType = ["album", "camera"], sizeType = ["original", "compressed"]) => {
  return new Promise((resolve, reject) => {
    let urlArr = [];
    uni.chooseImage({
      count: count,
      sizeType: sizeType,
      sourceType: sourceType,
      success: async (res) => {
        uni.showLoading({
          title: "Loading...",
        });
        for (let i = 0, len = res.tempFiles.length; i < len; i++) {
          console.log(res.tempFiles);
          // 命名
          const tmpcnt = res.tempFiles[i].path.lastIndexOf(".");
          // 后缀
          res.tempFiles[i].fileType = res.tempFiles[i].path.substring(tmpcnt + 1);
          // 文件名
          res.tempFiles[i].fileKey = getUploadFileName("weChat/upload", res.tempFiles[i].fileType);
          await uni.uploadFile({
            url: "https://upload.qiniup.com/",
            filePath: res.tempFiles[i]["path"],
            name: "file",
            method: "POST",
            formData: {
              files: res.tempFiles[i],
              token: token, //七牛云token值
            },
            success: (uploadFileRes) => {
              let strToObj = JSON.parse(uploadFileRes.data);
              let backUrl = config.QINIU_IMAGE_SERVER + strToObj.key;
              urlArr.push(backUrl);
              if (res.tempFiles.length - 1 == i) {
                uni.hideLoading();
                resolve(urlArr);
              }
            },
            fail: (fail) => {
              uni.showToast({
                title: "网络错误",
                icon: "none",
              });
              uni.hideLoading();
            },
          });
        }
      },
    });
  });
};
const parseDate2Str = (time = new Date(), format = "{y}-{M}-{d} {h}:{m}:{s}") => {
  let result = "";
  let date = new Date();
  const type = typeof time;
  if (type === "object") {
    date = time;
  } else if (type === "number") {
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  result = format.replace(/\{[yMdhmsa]+\}/g, (val) => {
    const key = val.replace(/\{|\}/g, "");
    const value = formatObj[key];
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return result;
};
// oss上传
const upLoadImgOSS = (count = 1, token = "token", sourceType = ["album", "camera"], sizeType = ["original", "compressed"]) => {
  return new Promise((resolve, reject) => {
    let urlArr = [];
    uni.chooseImage({
      count: count,
      sizeType: sizeType,
      sourceType: sourceType,
      success: async (res) => {
        uni.showLoading({
          title: "上传中...",
        });
        for (let i = 0, len = res.tempFilePaths.length; i < len; i++) {
          await uni.uploadFile({
            url: config.OSS_UPLOAD_URL,
            filePath: res.tempFilePaths[i],
            name: "files",
            method: "POST",
            header: {
              token: uni.getStorageSync("token"),
            },
            success: (uploadFileRes) => {
              let strToObj = JSON.parse(uploadFileRes.data);
              let backUrl = strToObj.data;
              urlArr.push(backUrl);
              if (res.tempFiles.length - 1 == i) {
                setTimeout(() => {
                  uni.hideLoading();
                  resolve(urlArr);
                }, 1000);
              }
            },
            fail: (fail) => {
              uni.showToast({
                title: "网络错误",
                icon: "none",
              });
              uni.hideLoading();
              reject(fail);
            },
          });
        }
      },
    });
  });
};
// 分，时，天，周，半个月，一个月
const formatMsgTime = (dateTimeStamp) => {
  var dateTimeStamp = dateTimeStamp;
  var result;
  var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime(); //获取当前时间毫秒
  var oldTime = dateTimeStamp;
  var diffValue = now - oldTime; //时间差
  if (diffValue < 0) {
    return;
  }
  var minC = diffValue / minute; //计算时间差的分，时，天，周，月
  var hourC = diffValue / hour;
  var dayC = diffValue / day;
  var weekC = diffValue / week;
  var monthC = diffValue / month;
  if (monthC >= 1 && monthC <= 3) {
    result = " " + parseInt(monthC) + "月前";
  } else if (weekC >= 1 && weekC <= 3) {
    result = " " + parseInt(weekC) + "周前";
  } else if (dayC >= 1 && dayC <= 6) {
    result = " " + parseInt(dayC) + "天前";
  } else if (hourC >= 1 && hourC <= 23) {
    result = " " + parseInt(hourC) + "小时前";
  } else if (minC >= 1 && minC <= 59) {
    result = " " + parseInt(minC) + "分钟前";
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = "刚刚";
  } else {
    var datetime = new Date();
    datetime.setTime(dateTimeStamp);
    var Nyear = datetime.getFullYear();
    var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    result = Nyear + "-" + Nmonth + "-" + Ndate;
  }
  return result;
};
/*
 * upload/yyyy/MM/dd/uuid.{png,jpg,3pg}
 * @param {String} prefix 前缀
 * @param {String} extension 扩展名
 */
const getUploadFileName = (prefix, extension) => {
  const result = prefix + "/" + moment(new Date()).format("yyyy/MM/dd") + "/" + uuid() + "." + extension;
  return result;
};

/**
 * 获取uuid
 * @param {Number} len 长度
 * @param {Number} radix 基数
 */

function uuid(len = 32, radix = 16) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  var uuid = [];
  var i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data. At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
}
// 判断是否登陆 如果没有登录则跳转到登录页面
const isLogin = () => {
  let token = uni.getStorageSync("token");
  if (!token) {
    uni.reLaunch({
      url: "/pages/login/login",
    });
    return false;
  } else {
    return true;
  }
};
// 清除本地所有缓存 并退出登录
const logout = () => {
  uni.showModal({
    title: "提示", //提示标题
    content: "确定退出吗", //提示内容
    showCancel: true, //是否显示取消按钮，默认ture
    success: function (res) {
      if (res.confirm) {
        //confirm为ture，代表点击了确定
        uni.clearStorageSync();
        uni.reLaunch({
          url: "/pages/login/login",
        });
      } else if (res.cancel) {
        //cancel为ture，代表点击了取消
      }
    },
  });
};
// 去登录
const goLogin = () => {
  // uni.reLaunch({
  //   url: "/pages/login/login",
  // });
  uni.navigateTo({
    url: "/pages/login/login",
  });
};
// 字符串转数组
const strToArr = (val) => {
  if (val) {
    return val.split(",");
  } else {
    return [];
  }
};
const toPath = (item, typeName = "type") => {
  console.log(item.url);
  switch (item[typeName]) {
    case 1:
      // 判断url 是否是tabbar里的路径
      if (item.url.indexOf("pages/index/index") > -1 || item.url.indexOf("pages/store/index") > -1 || item.url.indexOf("pages/user/service") > -1 || item.url.indexOf("pages/user/index") > -1) {
        uni.switchTab({ url: item.url });
      } else {
        uni.navigateTo({
          url: item.url,
        });
      }
      break;
    case 2:
      uni.navigateTo({
        url: "/pages/web/web?url=" + item.url,
      });
      break;
  }
};
//  拼接阿里云的图片压缩参数
const formatOssImgUrl = (url, width = 160, height = 120) => {
  if (!url) {
    return "";
  }
  return url + `?x-oss-process=image/resize,w_${width}`;
};
export { configData, strToArr, goLogin, getToken, imgUrl, backPage, loading, formatPrice, Toast, apiObj, goUrl, price, previewImage, formatMsgTime, upLoadImg, isLogin, upLoadImgOSS, logout, parseDate2Str, uuid, toPath, formatOssImgUrl };
