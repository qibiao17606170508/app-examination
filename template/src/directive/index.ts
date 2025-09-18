/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:50:00
 */
import { App, DirectiveBinding, VNode, nextTick } from 'vue'
import { havePermission } from '@/utils'

export default {
  install: function (app: App) {
    /**
     * @description: 权限控制指令
     * @param {*}
     * @return {*}
     * @author: qibiao
     */
    app.directive('permission', {
      mounted: (el: HTMLElement, binding: DirectiveBinding, vnode: VNode) => {
        const permission: string = binding.value
        const result: boolean = havePermission(permission)
        const tagName: string = el.localName
        if (!result) {
          switch (tagName) {
            case 'button': // 按钮权限控制-删除tag
              el.remove()
              break
            case 'div':
              if (
                vnode.props &&
                vnode.props.class &&
                (vnode.props.class as string).includes('el-switch')
              ) {
                // element-plus switch 组件权限控制
                nextTick(() => {
                  el.className += ' is-disabled' // 设置禁用样式
                  const tag = el.cloneNode(true) as HTMLElement // 深拷贝节点以解除绑定事件
                  const parent = el.parentNode
                  if (parent) {
                    el.remove()
                    parent.append(tag)
                  }
                })
              } else {
                // 普通div权限控制-删除tag
                el.remove()
              }
              break
          }
        }
      },
    })

    /**
     * @description: 表单防止重复提交指令
     * @param {*}
     * @return {*}
     * @author: qibiao
     */
    app.directive('repeat', {
      mounted(el: HTMLElement, binding: DirectiveBinding) {
        const button = el as HTMLButtonElement
        button.addEventListener('click', () => {
          if (!button.disabled) {
            button.disabled = true
            setTimeout(() => {
              button.disabled = false
            }, binding.value || 2000)
          }
        })
      },
    })
  },
}
