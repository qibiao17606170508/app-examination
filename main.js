/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2024-03-18 09:25:14
 * @LastEditors: qibiao
 * @LastEditTime: 2024-03-27 16:09:30
 */
import App from "./App";

/* 全局挂载请求库 */
import GraceRequest from "@/Grace6/js/request.js";
uni.gRequest = GraceRequest;

// #ifndef VUE3
import Vue from "vue";
Vue.config.productionTip = false;
import config from "@/utils/config.js";
import moment from "moment";
// 使用方法 this.$moment(time).format('YYYY-MM-DD')
Vue.prototype.$moment = moment;
Vue.prototype.$config = config;

App.mpType = "app";
const app = new Vue({
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from "vue";
import * as config from "@/utils/config.js";
import moment from "moment";
export function createApp() {
  const app = createSSRApp(App);
  app.config.globalProperties.$config = config;
  app.config.globalProperties.$moment = moment;
  return {
    app,
  };
}
// #endif
