/*
 * @Description:
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-14 10:34:01
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-14 11:57:26
 */
// 获取当前目录所有为.svg的文件
const req = require.context('./svg', false, /\.svg$/)
// 解析获取的.svg文件的文件名称并返回
const requireAll = (requireContext) => {
  return requireContext.keys().map(requireContext)
}
requireAll(req)
