<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-11 09:23:56
-->
<template>
  <ContainerCustom>
    <template #default>
      <div class="personal-container margin-10 flex-box flex_w-wrap">
        <div class="panel flex-item_f-2 margin-10 padding-30">
          <div class="flex-box flex_d-column flex_a_i-center">
            <el-avatar
              :size="120"
              :src="
                administrator.portrait.indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + administrator.portrait
                  : administrator.portrait
              "
              v-if="administrator.portrait"
            />
            <h2>{{ administrator.nickname }}</h2>
          </div>
          <el-descriptions :column="1" class="padding-n-30">
            <el-descriptions-item>
              <template #label>
                <Iconfont name="account" />
              </template>
              {{ administrator.username }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <Iconfont name="mobile" />
              </template>
              {{ administrator.phone || '-' }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <Iconfont name="email" />
              </template>
              {{ administrator.email }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="panel flex-item_f-5 margin-10 padding-30">
          <el-tabs v-model="active" class="demo-tabs">
            <el-tab-pane
              :label="$t('modules/personal/index.basic')"
              name="basic"
            >
              <BasicInfo :administrator="administrator" />
            </el-tab-pane>
            <el-tab-pane
              :label="$t('modules/personal/index.changePassword')"
              name="password"
              v-if="havePermission('administrator:password')"
            >
              <EditPassword />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </template>
  </ContainerCustom>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import ContainerCustom from '@/components/container-custom/index.vue'
import BasicInfo from './components/basic-info.vue'
import EditPassword from './components/edit-password.vue'
import { havePermission } from '@/utils'
import { QINIU_IMAGE_SERVER } from '@/utils/constant'

interface Administrator {
  portrait: string
  nickname: string
  username: string
  phone?: string
  email: string
}

export default defineComponent({
  name: 'personal',
  components: {
    ContainerCustom,
    BasicInfo,
    EditPassword,
  },
  setup() {
    const store = useStore()
    const administrator = computed<Administrator>(
      () => store.state.menu.administrator
    )
    const data = reactive({
      active: 'basic',
    })
    return {
      administrator,
      ...toRefs(data),
      havePermission,
      QINIU_IMAGE_SERVER,
    }
  },
})
</script>

<style lang="scss" scoped>
.personal-container {
  & > div:first-child {
    height: fit-content;
    min-width: 350px;
  }
  .panel {
    border-radius: var(--el-border-radius-base);
    background-color: var(--gl-content-panel-background-color);
  }
}
</style>
