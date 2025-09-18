<template>
  <div
    class="action-container flex-item_f-1 flex-box flex_j_c-flex-end flex_a_i-center"
  >
    <el-tooltip
      :content="$t('layout/action.fullScreen')"
      placement="bottom"
      :show-after="500"
    >
      <Iconfont
        class="margin_r-15 cursor-pointer"
        size="16px"
        :name="`full-screen-${!fullScreen}`"
        @click="iconfontClickHandle('full-screen')"
      />
    </el-tooltip>
    <el-tooltip
      :content="$t('layout/action.refreshPage')"
      placement="bottom"
      :show-after="500"
    >
      <Iconfont
        class="margin_r-15 cursor-pointer"
        size="16px"
        name="refresh"
        @click="iconfontClickHandle('refresh')"
      />
    </el-tooltip>
    <!-- <el-tooltip
      :content="$t('layout/action.themeSettings')"
      placement="bottom"
      :show-after="500"
    >
      <Iconfont
        class="margin_r-15 cursor-pointer"
        size="16px"
        name="set"
        @click="iconfontClickHandle('setting')"
      />
    </el-tooltip> -->
    <el-tooltip
      :content="$t('layout/action.cleanCache')"
      placement="bottom"
      :show-after="500"
    >
      <Iconfont
        class="margin_r-15 cursor-pointer"
        size="16px"
        name="clear"
        @click="iconfontClickHandle('clear')"
      />
    </el-tooltip>
    <!-- <el-tooltip
      :content="$t('layout/action.ThemeMode')"
      placement="bottom"
      :show-after="500"
    >
      <el-switch
        class="margin_r-15"
        v-model="mode"
        :active-value="ThemeMode.DARK"
        :inactive-value="ThemeMode.LIGHT"
        inline-prompt
        :active-text="$t('layout/action.black')"
        :inactive-text="$t('layout/action.light')"
        active-color="#222222"
      />
    </el-tooltip> -->
    <!-- <el-dropdown trigger="click" @command="langChange">
      <Iconfont class="margin_r-15 cursor-pointer" size="16px" name="fanyi" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :disabled="currentLanguage == 'en'" command="en">
            English
          </el-dropdown-item>
          <el-dropdown-item :disabled="currentLanguage == 'zh'" command="zh">
            中文
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->
    <el-dropdown trigger="click" @command="dropdownHandle">
      <el-avatar
        class="cursor-pointer"
        :src="
          administrator.portrait.indexOf('http') === -1
            ? QINIU_IMAGE_SERVER + administrator.portrait
            : administrator.portrait
        "
      >
        {{ administrator.nickname || administrator.username }}
      </el-avatar>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="personal">
            {{ $t('layout/action.personalCenter') }}
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            {{ $t('layout/action.logOut') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <Theme ref="refTheme" v-if="visible" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import screenfull from 'screenfull'
import { ElMessage } from 'element-plus'
import Theme from './theme.vue'
import { ThemeMode } from '@/utils/dictionary'
import { useI18n } from 'vue-i18n'
import { LANG_ZH, LANG_EN } from '@/utils/constant'
import { QINIU_IMAGE_SERVER } from '@/utils/constant'

export default defineComponent({
  components: { Theme },
  setup() {
    const store = useStore()
    const router = useRouter()
    const refTheme = ref<InstanceType<typeof Theme>>()
    const data = reactive({
      visible: false,
    })
    const fullScreen = computed(() => store.state.settings.fullScreen)
    const administrator = computed(() => store.state.menu.administrator)
    const i18n = useI18n()
    const { t } = useI18n()
    const mode = computed({
      get: () => {
        return store.state.theme.mode
      },
      set: (val: string) => {
        store.dispatch('theme/setMode', val)
      },
    })
    const iconfontClickHandle = (type: string) => {
      switch (type) {
        case 'full-screen':
          if (screenfull.isEnabled) {
            screenfull.toggle()
            store.dispatch('settings/setFullScreen', !screenfull.isFullscreen)
          } else {
            ElMessage({
              message: `Your browser doesn't support full screen`,
              type: 'warning',
            })
          }
          break
        case 'refresh':
          store.dispatch('settings/setRefresh', true)
          nextTick(() => {
            store.dispatch('settings/setRefresh', false)
          })
          break
        case 'setting':
          data.visible = true
          nextTick(() => {
            refTheme.value?.init()
          })
          break
        case 'clear':
          store.dispatch('clear')
          break
      }
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
    const currentLanguage = computed(() => i18n.locale.value)
    const langChange = (command: string) => {
      i18n.locale.value = command
      store.dispatch('settings/setLang', command)
      localStorage.setItem('lang', command)
      // 修改当前路由的params
      router.replace({
        name: router.currentRoute.value.name,
        params: {
          lang: command == 'en' ? LANG_EN : LANG_ZH,
        },
      })
      // 刷新当前页面
      store.dispatch('settings/setRefresh', true)
      nextTick(() => {
        store.dispatch('settings/setRefresh', false)
      })
    }
    return {
      refTheme,
      ...toRefs(data),
      ThemeMode,
      fullScreen,
      administrator,
      mode,
      iconfontClickHandle,
      dropdownHandle,
      langChange,
      currentLanguage,
      QINIU_IMAGE_SERVER,
    }
  },
})
</script>

<style lang="scss" scoped>
.action-container {
  .iconfont {
    // margin-right: 15px;
  }
}
</style>
