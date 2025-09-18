/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:54:42
 */

interface ThemeTranslations {
  tips: string
  pattern: string
  layout: string
  sidebarMode: string
  navigationBarMode: string
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

const themeTranslations: ThemeTranslations = {
  tips: 'If You Need To Reset You Can Clear The Cache In The Navigation Bar',
  pattern: 'Pattern',
  layout: 'Layout',
  sidebarMode: 'Sidebar Mode',
  navigationBarMode: 'Navigation Bar Mode',
  contentContainerMode: 'Content Container Mode',
  panelMode: 'Panel Mode',
  tab: 'Tab',
  color: 'Color',
  sidebar: 'Sidebar',
  backgroundColor: 'Background Color',
  fontColor: 'Font Color',
  selectedFontColor: 'Selected Font Color',
  collapseExpandMenu: 'Collapse Expand Menu',
  fixedNavigation: 'Fixed Navigation',
  unfixedNavigation: 'Unfixed Navigation',
  sizeChangesWithContent: 'Size Changes With Content',
  size_100: 'Size 100 Effective When The Navigation Bar Is Fixed',
  totalSeparation: 'Separation Of Head Main Content Foot And Left Side',
  leftAndRightSeparation: 'Left And Right Panel Separation',
  noSeparation: 'The Entire Container Is A Panel',
}

export default themeTranslations
