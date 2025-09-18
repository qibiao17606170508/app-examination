/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:54:57
 */
interface Theme {
  tips: string
  pattern: string
  layout: string
  navigationBarMode: string
  sidebarMode: string
  classicMode: string
  columnMode: string
  contentContainerMode: string
  panelMode: string
  tab: string
  color: string
  sidebar: string
  backgroundColor: string
  fontColor: string
  selectedFontColor: string
  collapseExpandMenu: string
  fixedNavigation: string
  unfixedNavigation: string
  sizeChangesWithContent: string
  size_100: string
  totalSeparation: string
  leftAndRightSeparation: string
  noSeparation: string
}

const theme: Theme = {
  tips: '如需重置，可在导航栏进行清除缓存操作！',
  pattern: '模式',
  layout: '布局',
  navigationBarMode: '导航栏模式',
  sidebarMode: '侧边栏模式',
  classicMode: '经典模式',
  columnMode: '分栏模式',
  contentContainerMode: '内容容器模式',
  panelMode: '面板模式',
  tab: '标签页',
  color: '颜色',
  sidebar: '侧边栏',
  backgroundColor: '背景色',
  fontColor: '字体颜色',
  selectedFontColor: '选中字体颜色',
  collapseExpandMenu: '折叠/展开菜单',
  fixedNavigation: '固定导航',
  unfixedNavigation: '不固定导航',
  sizeChangesWithContent: '大小随内容变化',
  size_100: '大小100%(固定导航栏的情况下生效)',
  totalSeparation: '头部、主要内容、脚部、左侧分离',
  leftAndRightSeparation: '左右面板分离',
  noSeparation: '整个容器为面板',
}

export default theme
