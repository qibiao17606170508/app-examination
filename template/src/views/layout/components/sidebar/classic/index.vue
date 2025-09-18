<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-04-03 09:47:26
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-22 09:20:23
-->
<template>
  <div class="sidebar-classic-container flex-box flex_d-column">
    <Logo :collapse="collapse" />
    <div class="info-container">
      <div class="info-container-inner-text-name pl-10">
        {{ administrator.nickname || administrator.username }}，欢迎您
      </div>
      <div
        class="pl-10 pr-10 mt-10 font-size-15 font-700"
        v-if="administrator.role_id === 2"
      >
        学校：{{ administrator.school_name }}
      </div>
      <div
        class="pl-10 pr-10 mt-10 font-size-15 font-700"
        v-if="administrator.role_id === 2"
      >
        学科：{{ administrator.subject_name }}
      </div>
      <div class="mt-8 info-container-inner-text-desc">
        {{ administrator.role_name }}
      </div>
      <el-dropdown v-if="false" trigger="click" @command="dropdownHandle">
        <div class="info-container-inner-container">
          <div class="info-container-inner">
            <!-- <el-avatar
              class="cursor-pointer"
              :src="
                administrator.portrait.indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + administrator.portrait
                  : administrator.portrait
              "
            >
              {{ administrator.nickname || administrator.username }}
            </el-avatar> -->
            <div class="info-container-inner-text ml-10">
              <div class="info-container-inner-text-name">
                {{ administrator.nickname || administrator.username }}，欢迎您
              </div>
              <div class="mt-8 info-container-inner-text-desc">
                {{ administrator.role_name }}
              </div>
            </div>
          </div>

          <div class="info-container-inner-arrow">
            <el-icon><ArrowRightBold /></el-icon>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item command="personal">
              {{ $t('layout/action.personalCenter') }}
            </el-dropdown-item> -->
            <el-dropdown-item command="logout">
              {{ $t('layout/action.logOut') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="pl-10 pr-10" v-if="administrator.role_id === 3">
        <el-dropdown trigger="click" @command="subjectHandle">
          <div class="cursor-pointer width-full font-700">
            {{ subject ? subject.name : '' }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in subjectList"
                :key="item.id"
                :command="item"
              >
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-scrollbar class="flex-item_f-1">
      <el-menu
        :default-active="active"
        :background-color="
          theme.backgroundColor.trim() !== '#fff' ? theme.backgroundColor : ''
        "
        :text-color="theme.textColor"
        :active-text-color="theme.activeTextColor"
        :unique-opened="true"
        :collapse="collapse"
      >
        <SubItem
          v-for="item in menus"
          :key="item.id"
          :data="item"
          :collapse="collapse"
        />
      </el-menu>
    </el-scrollbar>
    <div class="pb-40 text-align-center">
      <el-button type="primary" @click="dropdownHandle('logout')" link>
        <span class="font-700 font-size-16">退出登录</span>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { QINIU_IMAGE_SERVER } from '@/utils/constant'
import Logo from '../components/logo.vue'
import SubItem from '../components/sub-item.vue'
import { getSubjectApi } from '@/api/login'
export default defineComponent({
  components: { Logo, SubItem },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const theme = computed(() => store.state.theme.theme.menu)
    const menus = computed(() => store.getters['menu/menus'])
    const active = computed(() => store.state.menu.active)
    const collapse = computed(() => store.state.menu.collapse)
    const administrator = computed(() => store.state.menu.administrator)

    const data = reactive({
      subject: JSON.parse(sessionStorage.getItem('subject') || '{}'),
    })
    const subjectList = ref([])
    if (administrator.value.role_id === 3) {
      getSubjectApi({
        school_id: administrator.value.school_id,
      }).then((res) => {
        subjectList.value = res.data.list
        if (!data.subject || Object.keys(data.subject).length === 0) {
          ;(data.subject as any) = subjectList.value[0]
          console.log(data.subject)
          sessionStorage.setItem(
            'subject',
            JSON.stringify(subjectList.value[0])
          )
        }
      })
    }
    const dropdownHandle = async (command: string) => {
      switch (command) {
        case 'personal':
          router.push({ name: 'personal' })
          break
        case 'logout':
          await store.dispatch('administrator/logout')
          store.dispatch('logout')
          router.push({ name: 'login' })
          break
      }
    }
    const subjectHandle = (command: any) => {
      data.subject = command
      sessionStorage.setItem('subject', JSON.stringify(command))
      store.dispatch('settings/setRefresh', true)
      nextTick(() => {
        store.dispatch('settings/setRefresh', false)
      })
    }
    return {
      theme,
      menus,
      active,
      collapse,
      dropdownHandle,
      subjectHandle,
      administrator,
      QINIU_IMAGE_SERVER,
      subjectList,
      ...toRefs(data),
    }
  },
})
</script>

<style lang="scss" scoped>
.info-container {
  padding: 20px 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #e6e6e6;
}
.sidebar-classic-container {
  z-index: 10;
  background-color: var(--gl-sidebar-background-color);
  // box-shadow: var(--el-box-shadow-light);
  .el-menu:not(.el-menu--collapse) {
    width: var(--gl-sidebar-classic-width); // todo: 侧边栏的宽度
    margin: 0 15px;
  }
  .el-menu {
    border: none;
    :deep(.el-menu-item) {
      padding-right: 20px;
      color: #000;
      margin-top: 10px;
      border-radius: 15px;
      display: flex !important;
      align-items: center;
    }
    :deep(.el-menu-item:hover) {
      border-radius: 15px;
    }
    :deep(.el-sub-menu__title:hover) {
      border-radius: 15px;
    }
    :deep(.el-sub-menu__title) {
      border-radius: 15px;
    }
    :deep(.el-menu-item.is-active) {
      background-color: var(--el-color-primary);
      color: #fff;
      font-weight: 500;
      border-radius: 15px;
    }
    :deep(.el-menu-item.is-active svg) {
      fill: currentColor;
      color: #fff !important;
    }
    :deep(.el-menu-item svg) {
      margin-right: 5px;
    }
    :deep(.el-menu-item),
    :deep(.el-sub-menu),
    :deep(.el-sub-menu__title) {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      & > .el-sub-menu__icon-arrow {
        position: absolute;
        right: 8px;
      }
    }
  }
}
.info-container-inner {
  display: flex;
  align-items: center;
}
.info-container-inner-text-name {
  font-size: 17px;
  font-weight: 700;
  color: #000;
}
.info-container-inner-text-desc {
  font-size: 13px;
  color: #999;
}
.info-container-inner-arrow {
  margin-left: 10px;
  font-size: 12px;
  color: #999;
}
.info-container-inner-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 100%;
}
.el-dropdown {
  width: 100%;
}
</style>
