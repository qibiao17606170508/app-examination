<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-16 17:35:54
-->
<template>
  <el-upload
    class="update-container"
    :style="{
      height: size,
      width: size,
      borderRadius: noRadius ? '0px' : '50%',
    }"
    :headers="{
      [tokenKey]: token,
    }"
    :http-request="UploadFile"
    :show-file-list="false"
    :disabled="disabled"
    accept="image/*"
    :before-upload="beforeUpload"
  >
    <img
      v-if="value"
      :src="value.indexOf('http') > -1 ? value : IMAGE_SERVER + value"
      class="height-full width-full"
    />
    <Iconfont name="plus" v-else />
  </el-upload>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
} from 'vue'
import { useStore } from 'vuex'
import useModel from '@/mixins/model'
import { TOKEN_KEY } from '@/utils/constant'
import { ElLoading } from 'element-plus'
import { uploadUrlApi } from '@/api/file'
import { UploadImage } from '@/utils/index'
import { IMAGE_SERVER } from '@/utils/constant'
export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array],
      required: true,
      default: () => '',
    },
    // 大小 默认 100px
    size: {
      type: String,
      default: () => '100px',
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
    pathFile: {
      type: String,
      default: () => '',
    },
    noRadius: {
      type: Boolean,
      default: () => true,
    },
  },
  setup(props) {
    const store = useStore()
    const value = useModel(props)
    const data = reactive({
      action: '',
      tokenKey: TOKEN_KEY,
      token: '',
      loading: null,
      pathFile: props.pathFile,
    })

    const UploadFile = (file) => {
      UploadImage(file).then((res) => {
        value.value = res.url
        data.loading.close()
      })
    }
    const beforeUpload = () => {
      data.loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
    onBeforeMount(() => {})
    return {
      value,
      ...toRefs(data),
      beforeUpload,
      UploadFile,
      IMAGE_SERVER,
    }
  },
})
</script>

<style lang="scss" scoped>
:deep(.el-upload),
:deep(.el-upload-list) {
  height: 100%;
  width: 100%;
}
:deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
  }
}
.update-container {
  img {
    object-fit: contain;
  }
}
</style>
