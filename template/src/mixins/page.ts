/*
 * @Description:分页配置
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-16 14:32:11
 */
import { reactive } from 'vue'

interface Page {
  page: number
  page_size: number
  total: number
  sizes: number[]
}

export default function () {
  const page: Page = reactive({
    page: 1,
    page_size: 10,
    total: 0,
    sizes: [10, 20, 30, 40, 50, 100, 200],
  })

  return {
    page,
  }
}
