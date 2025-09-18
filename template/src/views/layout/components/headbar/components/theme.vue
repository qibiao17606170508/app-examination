<template>
  <el-drawer v-model="visible" :with-header="false" append-to-body>
    <el-scrollbar>
      <div class="tips-box">{{ $t('layout/theme.tips') }}</div>
      <el-form label-width="100px">
        <el-divider>{{ $t('layout/theme.pattern') }}</el-divider>
        <el-form-item :label="$t('layout/action.themeSettings')">
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
        </el-form-item>
        <el-divider>{{ $t('layout/theme.layout') }}</el-divider>
        <el-form-item :label="$t('layout/theme.sidebarMode')">
          <el-select v-model="sidebar">
            <el-option
              :value="item.value"
              :label="item.label"
              v-for="item in sidebars"
              :key="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('layout/theme.navigationBarMode')">
          <el-select v-model="navigation">
            <el-option
              :value="item.value"
              :label="item.label"
              v-for="item in navigations"
              :key="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('layout/theme.contentContainerMode')">
          <el-select v-model="contanier">
            <el-option
              :value="item.value"
              :label="item.label"
              v-for="item in contaniers"
              :key="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('layout/theme.panelMode')">
          <el-select v-model="panel">
            <el-option
              :value="item.value"
              :label="item.label"
              v-for="item in panels"
              :key="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('layout/theme.tab')">
          <el-switch
            class="margin_r-15"
            v-model="tabs"
            inline-prompt
            :active-color="mode === ThemeMode.DARK ? '#222222' : ''"
          />
        </el-form-item>

        <el-divider>{{ $t('layout/theme.color') }}</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Primary">
              <el-color-picker v-model="colorPrimary" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Success">
              <el-color-picker v-model="colorSuccess" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Warning">
              <el-color-picker v-model="colorWarning" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Danger">
              <el-color-picker v-model="colorDanger" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Error">
              <el-color-picker v-model="colorError" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Info">
              <el-color-picker v-model="colorInfo" />
            </el-form-item>
          </el-col>
        </el-row>
        <!--
 <el-divider>字体颜色</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Primary">
              <el-color-picker v-model="textPrimary" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Regular">
              <el-color-picker v-model="textRegular" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Secondary">
              <el-color-picker v-model="textSecondary" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Placeholder">
              <el-color-picker v-model="textPlaceholder" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Disabled">
              <el-color-picker v-model="textDisabled" />
            </el-form-item>
          </el-col>
        </el-row>
-->
        <el-divider>{{ $t('layout/theme.sidebar') }}</el-divider>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('layout/theme.backgroundColor')">
              <el-color-picker v-model="menuBackgroundColor" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('layout/theme.fontColor')">
              <el-color-picker v-model="menuTextColor" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('layout/theme.selectedFontColor')">
              <el-color-picker v-model="menuActiveTextColor" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-scrollbar>
  </el-drawer>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { ThemeMode } from '@/utils/dictionary'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface SidebarOption {
  label: string
  value: number
}

interface NavigationOption {
  label: string
  value: number
}

interface ContainerOption {
  label: string
  value: number
}

interface PanelOption {
  label: string
  value: number
}

export default defineComponent({
  setup() {
    const store = useStore()
    const i18n = useI18n()
    const currentLanguage = computed(() => i18n.locale.value)
    const { t } = useI18n()

    const paramsHandle = (
      type: 'color' | 'text' | 'menu',
      key: string,
      value: string
    ) => {
      const theme = {
        color: {
          ...store.state.theme.theme.color,
        },
        text: {
          ...store.state.theme.theme.text,
        },
        menu: {
          ...store.state.theme.theme.menu,
        },
      }
      theme[type][key] = value
      return theme
    }

    const mode = computed<string>({
      get: () => {
        return store.state.theme.mode
      },
      set: (val) => {
        store.dispatch('theme/setMode', val)
      },
    })

    const sidebar = computed<number>({
      get: () => {
        return store.state.settings.sidebarMode
      },
      set: (val) => {
        store.dispatch('settings/setSidebarMode', val)
      },
    })

    const navigation = computed<number>({
      get: () => {
        return store.state.settings.navigationMode
      },
      set: (val) => {
        store.dispatch('settings/setNavigationMode', val)
      },
    })

    const contanier = computed<number>({
      get: () => {
        return store.state.settings.contanierMode
      },
      set: (val) => {
        store.dispatch('settings/setContanierMode', val)
      },
    })

    const panel = computed<number>({
      get: () => {
        return store.state.settings.panelMode
      },
      set: (val) => {
        store.dispatch('settings/setPanelMode', val)
      },
    })

    const tabs = computed<boolean>({
      get: () => {
        return store.state.settings.showTabs
      },
      set: (val) => {
        store.dispatch('settings/setShowTabs', val)
      },
    })

    const colorPrimary = computed<string>({
      get: () => {
        return store.state.theme.theme.color.primary
      },
      set: (val) => {
        const theme = paramsHandle('color', 'primary', val)
        store.dispatch('theme/setTheme', theme)
      },
    })

    const colorSuccess = computed<string>({
      get: () => {
        return store.state.theme.theme.color.success
      },
      set: (val) => {
        const theme = paramsHandle('color', 'success', val)
        store.dispatch('theme/setTheme', theme)
      },
    })

    const colorWarning = computed<string>({
      get: () => {
        return store.state.theme.theme.color.warning
      },
      set: (val) => {
        const theme = paramsHandle('color', 'warning', val)
        store.dispatch('theme/setTheme', theme)
      },
    })

    const colorDanger = computed<string>({
      get: () => {
        return store.state.theme.theme.color.danger
      },
      set: (val) => {
        const theme = paramsHandle('color', 'danger', val)
        store.dispatch('theme/setTheme', theme)
      },
    })

    const colorError = computed<string>({
      get: () => {
        return store.state.theme.theme.color.error
      },
      set: (val) => {
        const theme = paramsHandle('color', 'error', val)
        store.dispatch('theme/setTheme', theme)
      },
    })

    const colorInfo = computed<string>({
      get: () => {
        return store.state.theme.theme.color.info
      },
      set: (val) => {
        const theme = paramsHandle('color', 'info', val)
        store.dispatch('theme/setTheme', theme)
      },
    })

    const menuBackgroundColor = computed<string>({
      get: () => {
        return store.state.theme.theme.menu.backgroundColor
      },
      set: (val) => {
        const theme = paramsHandle('menu', 'backgroundColor', val)
        store.dispatch('theme/setTheme', theme)
      },
    })

    const menuTextColor = computed<string>({
      get: () => {
        return store.state.theme.theme.menu.textColor
      },
      set: (val) => {
        const theme = paramsHandle('menu', 'textColor', val)
        store.dispatch('theme/setTheme', theme)
      },
    })

    const menuActiveTextColor = computed<string>({
      get: () => {
        return store.state.theme.theme.menu.activeTextColor
      },
      set: (val) => {
        const theme = paramsHandle('menu', 'activeTextColor', val)
        store.dispatch('theme/setTheme', theme)
      },
    })

    const data = reactive({
      visible: false,
      sidebars: [
        { label: t('layout/theme.classicMode'), value: 1 },
        { label: t('layout/theme.columnMode'), value: 2 },
      ] as SidebarOption[],
      navigations: [
        { label: t('layout/theme.fixedNavigation'), value: 1 },
        { label: t('layout/theme.unfixedNavigation'), value: 2 },
      ] as NavigationOption[],
      contaniers: [
        { label: t('layout/theme.sizeChangesWithContent'), value: 1 },
        { label: t('layout/theme.size_100'), value: 2 },
      ] as ContainerOption[],
      panels: [
        { label: t('layout/theme.totalSeparation'), value: 1 },
        { label: t('layout/theme.leftAndRightSeparation'), value: 2 },
        { label: t('layout/theme.noSeparation'), value: 3 },
      ] as PanelOption[],
    })

    const init = () => {
      data.visible = true
    }

    return {
      mode,
      navigation,
      contanier,
      panel,
      tabs,
      sidebar,
      colorPrimary,
      colorSuccess,
      colorWarning,
      colorDanger,
      colorError,
      colorInfo,
      currentLanguage,
      menuBackgroundColor,
      menuTextColor,
      menuActiveTextColor,
      ...toRefs(data),
      ThemeMode,
      init,
    }
  },
})
</script>

<style lang="scss" scoped>
.tips-box {
  width: fit-content;
  margin: 0 auto;
  padding: 15px 15px 15px 20px;
  font-size: 14px;
  color: var(--el-color-warning);
  background-color: var(--el-color-warning-light-9);
  border-radius: var(--el-border-radius-base);
  border-color: var(--el-color-warning-light-8);
}
</style>
