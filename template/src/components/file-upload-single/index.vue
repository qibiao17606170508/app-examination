<!--
 * @Description: 文件上传（支持多个）
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-12-10 16:23:57
-->
<template>
  <el-upload
    class="update-container"
    :action="action"
    :headers="{ [tokenKey]: token }"
    ref="upload"
    :http-request="UploadFile"
    :before-upload="beforeUpload"
    :limit="limit || 1"
    :show-file-list="showFileList"
    :on-exceed="handleExceed"
    :file-list="fileList"
    :on-remove="handleRemove"
  >
    <template #trigger>
      <el-button :type="type" v-repeat>{{ showName }}</el-button>
    </template>
  </el-upload>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'
import { ElLoading, ElMessage } from 'element-plus'
import useModel from '@/mixins/model'
import { TOKEN_KEY, SUCCESS_CODE } from '@/utils/constant'
import { uploadUrlApi, getQiniuTokenApi } from '@/api/file'
import { useI18n } from 'vue-i18n'
import { UploadImage, parseDate2Str } from '@/utils/index'
interface FileItem {
  name: string
  url: string
}
interface Data {
  loading: any
  action: string
  tokenKey: string
  token: string
  fileList: FileItem[]
  showName: string
  showFileList: boolean
  pathFile: string
}
export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array] as unknown as () => string | string[],
      required: true,
      default: '',
    },
    size: {
      type: String,
      default: '100px',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 1,
    },
    pathFile: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    showName: {
      type: String,
      default: '',
    },
    showFileList: {
      type: Boolean,
      default: true,
    },
    clear: {
      type: Boolean,
      default: false,
    },
    query: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: 'primary',
    },
    noUpload: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const value = useModel(props)
    const upload = ref()
    const { t } = useI18n()
    const data = reactive<Data>({
      action: '',
      tokenKey: TOKEN_KEY,
      token: store.getters['administrator/tokenVal'],
      fileList: [] as FileItem[],
      showName: props.showName || t('modules/public.selectUpload'),
      showFileList: props.showFileList,
      pathFile: props.pathFile,
      loading: null,
    })

    const beforeUpload = () => {
      data.loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
    // 清除文件
    const clearFile = () => {
      upload.value.clearFiles()
    }
    const UploadFile = async (file: File) => {
      if (props.noUpload) {
        return
      }
      try {
        const res = await UploadImage(file, '', 'word')
        if (props.limit === 1) {
          value.value = res.url
          setTimeout(() => {
            emit('uploadChange', { file, url: value.value, query: props.query })
            if (props.clear) upload.value.clearFiles()
          }, 100)
        } else {
          data.fileList.push({ name: file.name, url: res.url })
          value.value = data.fileList.map((item) => item.url)
          setTimeout(() => {
            emit('uploadChange', data.fileList)
            if (props.clear) upload.value.clearFiles()
          }, 100)
        }
      } finally {
        data.loading.close()
      }
    }

    const handleExceed = (files: File[]) => {
      ElMessage.warning(`当前限制选择 ${props.limit} 个文件，请删除后进行操作`)
    }

    const handleRemove = (file: File, fileList: FileItem[]) => {
      data.fileList = data.fileList.filter((item) => item.name !== file.name)
      value.value = Array.isArray(value.value)
        ? data.fileList.map((item) => item.url)
        : ''
    }

    const successHandle = (result: any) => {
      if (result.success) {
        result.data = { code: 0, url: result.result }
      }
      if (SUCCESS_CODE.includes(result.code)) {
        value.value = result.data.url
      } else {
        ElMessage({ message: result.msg, type: 'warning' })
      }
    }

    onBeforeMount(() => {
      getQiniuTokenApi().then((res) => {
        data.token = res.data.data
      })
      if (props.limit === 1 && value.value) {
        if (Array.isArray(value.value) && value.value.length === 1) {
          data.fileList = [
            {
              name: props.fileName || value.value[0].split('/').pop()!,
              url: value.value[0],
            },
          ]
        } else if (
          !Array.isArray(value.value) &&
          typeof value.value === 'string'
        ) {
          data.fileList = [
            {
              name: props.fileName || value.value.split('/').pop()!,
              url: value.value,
            },
          ]
        }
      } else if (value.value) {
        if (Array.isArray(value.value)) {
          data.fileList = value.value.map((item) => ({
            name: item.split('/').pop()!,
            url: item,
          }))
        } else {
          if (typeof value.value === 'string') {
            data.fileList = [
              {
                name: props.fileName || value.value.split('/').pop()!,
                url: value.value,
              },
            ]
          }
        }
      }
    })

    return {
      value,
      ...toRefs(data),
      successHandle,
      beforeUpload,
      UploadFile,
      handleExceed,
      upload,
      handleRemove,
      clearFile,
    }
  },
})
</script>

<style lang="scss" scoped>
.update-container {
  width: 100%;
}
</style>
