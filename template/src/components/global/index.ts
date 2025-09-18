/*
 * @Description:
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-08 14:49:16
 * @LastEditors: Jack Qi
 * @LastEditTime: 2025-02-17 10:52:28
 */
import { App } from 'vue'

export default {
  install: function (app: App) {
    const globalComponents = require.context('./', true, /index\.(vue|js)$/iu)
    globalComponents.keys().forEach((filePath: string) => {
      if (filePath === './index.js') return
      const component = globalComponents(filePath)
      let name = filePath.replace(/\.\/|\/index.vue/g, '')
      name = name.slice(0, 1).toUpperCase() + name.slice(1)
      app.component(`${name}`, component.default || component)
    })
  },
}
