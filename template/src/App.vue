<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2025-02-17 10:10:01
-->
<template>
  <el-config-provider :locale="locale" :size="size" :z-index="zIndex">
    <View v-if="!reload" />
  </el-config-provider>
</template>
<script>
import { computed, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'

import View from '@/components/view/index.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
export default defineComponent({
  components: { View },
  setup() {
    const store = useStore()
    store.dispatch('theme/getTheme')
    store.dispatch('settings/getLayout')
    const i18n = useI18n()
    const currentLanguage = computed(() => i18n.locale.value)
    // 配置element-plus的语言
    const locale = computed(() => {
      return currentLanguage.value == 'en' ? en : zhCn
    })
    const reload = computed({
      get: () => {
        return store.state.theme.reload
      },
      set: (val) => {
        store.dispatch('theme/setReload', val)
      },
    })

    const debounce = (fn, delay) => {
      let timer = null
      return function () {
        let context = this
        let args = arguments
        clearTimeout(timer)
        timer = setTimeout(function () {
          fn.apply(context, args)
        }, delay)
      }
    }
    const _ResizeObserver = window.ResizeObserver
    window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
      constructor(callback) {
        callback = debounce(callback, 16)
        super(callback)
      }
    }
    onMounted(async () => {})

    return {
      locale,
      size: 'default',
      zIndex: 2000,
      reload,
    }
  },
})
</script>

<style lang="scss">
@import '@/assets/sass/cu-global.scss';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
  display: flex;
  color: var(--el-text-color-primary);
  font-size: var(--el-font-size-base);
  will-change: transform;
  transform: translateZ(0);
  -webkit-transform: translate3d(0, 0, 0);
  -webkit-overflow-scrolling: touch;
}
@media screen and (max-width: 768px) {
  #app {
    width: 1920px;
    height: 5000px;
  }
}
.line {
  width: 100%;
  height: 10px;
  background-color: var(--gl-content-background-color);
}
.aLink {
  color: var(--el-button-text-color);
}
.title {
  font-size: 22px;
  font-weight: 600;
}
.el-dialog__title {
  font-weight: bold !important;
}
.el-dialog {
  border-radius: 10px !important;
}
.title-red {
  color: red;
}
.inlineBlock {
  display: inline-block;
  margin-left: 10px;
}
.el-form-item__label {
  font-weight: bold !important;
}
.el-drawer__title {
  font-weight: bold !important;
  color: #000;
}
.el-form-item__content .el-select .el-select__wrapper {
  width: 200px;
}

.el-descriptions__label:not(.is-bordered-label) {
  /* color: #000 !important; */
  font-weight: bold !important;
  /* vertical-align: top !important; */
}
.el-divider--horizontal {
  /* border-top: 1px solid #000 !important; */
  border-width: 2px !important;
}

.defaultColor {
  color: var(--el-color-primary);
}
.grayColor {
  color: var(--el-text-color-secondary);
}
.cursor-pointer {
  cursor: pointer;
}
.el-message-box__message {
  margin-left: 30px !important;
}
.el-form-item.is-required:not(.is-no-asterisk).asterisk-left
  > .el-form-item__label-wrap
  > .el-form-item__label:before,
.el-form-item.is-required:not(.is-no-asterisk).asterisk-left
  > .el-form-item__label:before {
  content: none !important;
}

.difficulty-1 {
  display: inline-block;
  background-color: #e0f7fa;
  width: 22px;
  height: 22px;
  border-radius: 5px;
  text-align: center;
  line-height: 22px;
  color: #15abbe;
}

.difficulty-2 {
  display: inline-block;

  background-color: #ffe0b2;
  width: 22px;
  height: 22px;
  border-radius: 5px;
  text-align: center;
  line-height: 22px;
  color: #ff7820;
}

.difficulty-3 {
  display: inline-block;

  background-color: #ffcdd2;
  width: 22px;
  height: 22px;
  border-radius: 5px;
  text-align: center;
  line-height: 22px;
  color: #eb1616;
}
.w-full-select .el-select__wrapper {
  width: 100% !important;
}
.w-full-select .el-cascader {
  width: 100% !important;
}
.cuSteps .el-step__title.is-process,
.cuSteps .el-step__head.is-process {
  color: var(--el-text-color-placeholder) !important;
  font-weight: normal !important;
}
.cuSteps .is-process .el-step__icon.is-text {
  border-color: var(--el-text-color-placeholder) !important;
}
.el-table__header-wrapper {
  border-radius: 8px !important;
}
.el-table th.el-table__cell.is-leaf {
  border-bottom: none !important;
}

.page-info {
  font-size: 22px;
  font-weight: 600;
}
</style>
<style scoped></style>
