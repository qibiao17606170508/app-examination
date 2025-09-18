<!--
 * @Description: 
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-08 14:49:16
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-28 14:53:05
-->
<template>
  <div>
    <div class="header-container">
      <div>
        <div class="page-info mb-20 flex-alc">
          <span class="page-text">
            {{ router.currentRoute.value.meta.title_cn }}
          </span>
        </div>
      </div>
      <slot name="header" />
    </div>
    <div
      :class="`
    container-sidebar
    flex-box
    overflow-auto
    ${panelMode === 3 ? 'container-sidebar-panel' : ''}`"
      style="height: 94%"
    >
      <el-scrollbar
        class="sidebar-container margin_r-10"
        v-if="scroll && slots.sidebar"
      >
        <div class="padding-10">
          <slot name="sidebar" />
        </div>
      </el-scrollbar>
      <div
        class="sidebar-container margin_r-10"
        v-if="!scroll && slots.sidebar"
      >
        <div class="padding-10 height-full">
          <slot name="sidebar" />
        </div>
      </div>
      <Container
        ref="refContainer"
        class="container flex-item_f-1 overflow-auto"
        :mode="panelMode"
        :showTitle="false"
      >
        <!-- <template #header v-if="slots.header">
        <slot name="header" />
      </template> -->
        <template #default v-if="slots.default">
          <slot />
        </template>
        <template #footer v-if="slots.footer">
          <slot name="footer" />
        </template>
      </Container>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default defineComponent({
  props: {
    mode: {
      type: Number as () => number | null,
      default: null,
    },
    scroll: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const { slots } = getCurrentInstance()!

    const refContainer = ref<any>() // 使用 any 类型

    const panelMode = computed(
      () => props.mode ?? store.state.settings.panelMode
    )

    const setScrollTop = (top: number = 0) => {
      refContainer.value?.setScrollTop(top)
    }

    return {
      slots,
      panelMode,
      refContainer,
      setScrollTop,
      router,
    }
  },
})
</script>

<style lang="scss" scoped>
.container-sidebar {
  border-radius: var(--el-border-radius-base);
  &-panel {
    background-color: var(--gl-content-panel-background-color);
    .sidebar-container {
      margin-right: 0;
    }
  }
  .sidebar-container {
    background-color: var(--gl-content-panel-background-color);
    border-radius: var(--el-border-radius-base);
  }
}
$padding: 15px;

.header-container,
.content-container,
.footer-container {
  background-color: var(--gl-content-panel-background-color);
  border-radius: var(--el-border-radius-base);
}
.header-container {
  background: transparent;
}
// todo: 主要处理左侧菜单折叠起来后再展开表格宽度不缩减问题
.header-container {
  padding: $padding $padding 0 0;
  :deep(.el-form-item) {
    margin-bottom: $padding;
  }
}
.content-wrap {
  padding: $padding;
}
.page-info {
  font-size: 22px;
  font-weight: 600;
}
</style>
