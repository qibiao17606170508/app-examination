/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-11 10:52:04
 */

interface LanguageModule {
  chineseName: string
  englishName: string
  type: string
  path: string
  router: string
  routerLabel: string
  routerPlaceholder: string
  routerName: string
  routerNamePlaceholder: string
  authorizationMark: string
  icon: string
  sort: string
  menuBarDisplay: string
  yes: string
  no: string
  tabShow: string
  labelMultipleOpening: string
  whetherCacheIsSupported: string
  routerError: string
  authorizationMarkError: string
  pleaseEnterAChineseName: string
  pleaseEnterAEnglishName: string
  pleaseEnterRoutingPathError: string
}

const languageModule: LanguageModule = {
  chineseName: '名称',
  englishName: '英文名称',
  type: '类型',
  path: '组件Path（modules 为根目录可省略首个反斜杠，须省略组件文件的 .vue 后缀） / Http[s] URL',
  router: '路由Path / Http[s] URL',
  routerLabel: '路由Path（若为空则按照url路径处理）',
  routerPlaceholder: '路由Path',
  routerName: '路由Name（若为空则按照url路径处理）',
  routerNamePlaceholder: '路由Name',
  authorizationMark: '授权标识',
  icon: '图标',
  sort: '排序',
  menuBarDisplay: '是否在侧边菜单栏显示（如：个人中心，详情页都不需要显示）',
  yes: '是',
  no: '否',
  tabShow: '是否在tab页签显示',
  labelMultipleOpening:
    '是否支持tab页签多开（如：用户1的详情页、用户2的详情并存在tab页签）',
  whetherCacheIsSupported: '是否支持缓存',
  routerError: '请输入路由Path / Http[s] URL',
  authorizationMarkError: '请输入授权标识',
  pleaseEnterAChineseName: '请输入中文名称',
  pleaseEnterAEnglishName: '请输入英文名称',
  pleaseEnterRoutingPathError: '请输入路由Path / Http[s] URL',
}

export default languageModule
