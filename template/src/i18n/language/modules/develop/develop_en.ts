/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 13:23:40
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:55:16
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
  chineseName: 'Chinese Name',
  englishName: 'English Name',
  type: 'Type',
  path: 'Component Path Modules Are The Root Directory The First Backslash Can Be Omitted And The Vue Suffix Of The Component File Must Be Omitted Http S Url',
  router: 'Route Path Http S Url',
  routerLabel:
    'Routing Path If It Is Empty It Will Be Processed According To The Url Path',
  routerPlaceholder: 'Route Path',
  routerName:
    'Route Name If It Is Empty It Will Be Processed According To The Url Path',
  routerNamePlaceholder: 'Route Name',
  authorizationMark: 'Authorization Mark',
  icon: 'Icon',
  sort: 'Sort',
  menuBarDisplay:
    'Whether It Is Displayed In The Side Menu Bar For Example The Personal Center And The Details Page Do Not Need To Be Displayed',
  yes: 'Yes',
  no: 'No',
  tabShow: 'Display On Tab',
  labelMultipleOpening:
    'Whether Multiple Tab Opening Is Supported For Example User 1 S Details Page And User 2 S Details Page Exist',
  whetherCacheIsSupported: 'Whether Cache Is Supported',
  routerError: 'Please Enter Route Path Http S Url',
  authorizationMarkError: 'Please Enter The Authorization Id',
  pleaseEnterAChineseName: 'Please Enter A Chinese Name',
  pleaseEnterAEnglishName: 'Please Enter English Name',
  pleaseEnterRoutingPathError: 'Please Enter Route Path Http S Url',
}

export default languageModule
