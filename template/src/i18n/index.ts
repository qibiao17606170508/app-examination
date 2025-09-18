/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:19:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-19 15:16:19
 */
import { createI18n } from 'vue-i18n'
import messages from './language/index'

const getCurrentLanguage = (): string => {
  const UAlang: string = localStorage.getItem('lang') || navigator.language // 默认设置中文 zh-CN
  const langCode: string = UAlang.indexOf('zh') !== -1 ? 'zh' : 'en'
  // const langCode: string = 'zh'
  localStorage.setItem('lang', langCode)
  return langCode
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'zh',
  // locale: getCurrentLanguage() || 'zh',
  messages,
})

export default i18n
