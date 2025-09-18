/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2025-02-17 10:47:42
 */
import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/sass/index.scss' // 全局样式
import components from '@/components/global/index' // 全局自定义组件
// import customCom from '@/components/public/index' // 全局自定义组件
import Directive from '@/directive' // 自定义指令
import i18n from '@/i18n' // 使用i18n
import BaiduMap from 'vue-baidu-map'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'testApi'
) {
}
const req = require.context('./assets/icons/svg', false, /\.svg$/)
// 解析获取的.svg文件的文件名称并返回
const requireAll = (requireContext: any) => {
  return requireContext.keys().map(requireContext)
}
requireAll(req)
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app
  .use(router)
  .use(store)
  .use(i18n)
  .use(components)
  .use(Directive)
  .mount('#app')
