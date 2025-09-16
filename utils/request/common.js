/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2021-07-23 10:08:58
 * @LastEditors: qibiao
 * @LastEditTime: 2024-04-07 15:50:55
 */
const whiteList = ["api/login/wxLogin"];
export async function requestConfig(ins, options, successHandler = null, failHandler = null, completeHandler = null) {
  const notNeed = whiteList.includes(options.url);
  const token = uni.getStorageSync("token");
  if (!notNeed && !token) {
    // uni.reLaunch({ url: "/pages/login/login" });
  }
  // base
  ins.header = options.header || ins.header;
  ins.baseUrl = options.baseUrl || ins.baseUrl;
  // config base
  let config = {
    url: ins.baseUrl + options.url,
    header: ins.header,
  };
  if (ins.requestInterceptor) {
    // do the request interceptor and get the new config. we just we Object.assign, no need to deep copy
    let _cg = null;
    try {
      _cg = await ins.requestInterceptor(Object.assign({}, options, config));
    } catch (e) {
      //TODO handle the exception
      return false;
    }
    // if the config is false or null, just return, no need to request
    if (!_cg || typeof _cg !== "object") {
      return false;
    }
    // renew options
    Object.assign(options, _cg);
    // renew base. we can also change the url and header in interceptors
    config.url = options.url;
    config.header = options.header;
  }

  const type = options.type || "request";
  // config detail, we do not use options directly => remove unneeded props
  if (type === "request") {
    let _data = options.data || options.params || {};
    config["data"] = _data;
    config["method"] = options.method || "GET";
    config["dataType"] = options.dataType || "json";
    config["responseType"] = options.responseType || "text";
  } else if (type === "upload") {
    config["filePath"] = options.filePath;
    config["name"] = options.name;
    config["method"] = options.method || "POST";
    config["formData"] = options.formData;
    // fileType for alipay
    config["fileType"] = options.fileType || "image";
    // reinforce the Content-Type
    // we should delete the content-type header since it will lose info if set
    // delete config.header['Content-Type']
  } // download need nothing else to config
  return config;
}

function _isPromise(obj) {
  return obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}
