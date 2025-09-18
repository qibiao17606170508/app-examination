/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 10:09:24
 */
// todo系统管理Start:------------------------------------------------------------------------------------
// 活动状态
interface ActivityStatus {
  label: string
  label_en: string
  value: number
  textType: string
}

export const activityStatus: ActivityStatus[] = [
  { label: '开启', label_en: 'Open', value: 0, textType: 'greenYellow' },
  { label: '关闭', label_en: 'Close', value: 1, textType: 'red' },
]
