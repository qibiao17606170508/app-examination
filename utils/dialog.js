/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2024-03-27 16:03:59
 * @LastEditors: qibiao
 * @LastEditTime: 2024-03-27 16:07:03
 */
// 引入vue
import vm from "vue";
// toast组件
import dialog from "@/components/dialog/index.vue";

export default {
  /**
   * 全局toast弹窗
   */
  dialog() {
    // 全局注册dialog组件
    const dialogCom = vm.component("dialog", dialog);
    // 获取uniapp根节点
    const uniappRoot = document.getElementsByTagName("uni-app")[0];
    // 初始化toast组件
    const dialogComp = new dialogCom();
    // 这里我每个组件内都有一个固定id，用来禁止同意组件生成多次
    if (document.getElementById(dialogComp.id)) {
      document.getElementById(dialogComp.id).remove();
    }
    // 将toast组件添加在uniapp根节点上
    uniappRoot.appendChild(dialogComp.$mount().$el);
    console.log("生成");
    return dialogComp;
  },
};
