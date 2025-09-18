<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 17:33:28
-->
<template>
  <el-upload
    :before-upload="beforeUpload"
    class="update-container"
    drag
    :limit="limit ? limit : 1"
    :auto-upload="false"
    :on-change="handleChange"
    :on-exceed="handleExceed"
    ref="uploadRef"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      在这里拖放文件或单击
      <em>上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        <slot name="tip"></slot>
      </div>
    </template>
  </el-upload>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onBeforeMount,
  ref,
  nextTick,
} from 'vue'
import { useStore } from 'vuex'
import { ElLoading, ElMessage, ElUpload, genFileId } from 'element-plus'
import useModel from '@/mixins/model'
import { TOKEN_KEY, SUCCESS_CODE } from '@/utils/constant'
import { uploadUrlApi, getQiniuTokenApi } from '@/api/file'
import { UploadImage, parseDate2Str } from '@/utils/index'

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array, Object] as unknown as () =>
        | string
        | Array<any>
        | Record<string, any>,
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
    limit: {
      type: Number,
      default: () => 1,
    },
    pathFile: {
      type: String,
      default: () => '',
    },
  },
  setup(props) {
    const store = useStore()
    const value = useModel(props)
    const uploadRef = ref<InstanceType<typeof ElUpload>>()
    const data = reactive({
      token: store.getters['administrator/tokenVal'] as string,
      pathFile: props.pathFile,
      loading: null as any, // 使用LoadingInstance类型
    })
    const beforeUpload = () => {
      data.loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
    const UploadFile = (file: File) => {
      UploadImage(
        file,
        'tradeAider-cms/' +
          data.pathFile +
          '/' +
          parseDate2Str(new Date(), '{y}/{M}/{d}'),
        data.token
      ).then((res: { url: string }) => {
        value.value = res.url
        data.loading.close()
      })
    }
    const handleExceed = (files: any) => {
      uploadRef.value?.clearFiles()
      const file = files[0]
      file.uid = genFileId()
      uploadRef.value?.handleStart(file)
    }
    const handleChange = (file: { raw: File }) => {
      value.value = file.raw
    }
    onBeforeMount(() => {})
    return {
      value,
      ...toRefs(data),
      beforeUpload,
      UploadFile,
      handleChange,
      handleExceed,
      uploadRef,
    }
  },
})
</script>

<style lang="scss" scoped></style>
