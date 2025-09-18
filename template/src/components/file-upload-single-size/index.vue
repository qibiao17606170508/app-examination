<!--
 * @Description: 文件上传（支持多个）
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-21 16:15:35
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
    :show-file-list="true"
    :on-exceed="handleExceed"
    :file-list="fileList"
    :on-remove="handleRemove"
    :accept="accept"
  >
    <template #trigger>
      <el-button type="primary" v-repeat>
        {{ $t('modules/public.selectUpload') }}
      </el-button>
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
import { UploadImage, parseDate2Str } from '@/utils/index'

interface FileData {
  name: string
  url: string
  size?: number
}

interface Data {
  action: string
  tokenKey: string
  token: string
  fileList: FileData[]
  pathFile: string
  loading?: any
}

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array, Object],
      required: true,
      default: () => '',
    },
    accept: {
      type: String,
      default: () => '',
    },
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
    fileName: {
      type: String,
      default: () => '',
    },
  },
  setup(props, { emit }) {
    const store = useStore()
    const value = useModel(props)
    const upload = ref()
    const data = reactive<Data>({
      action: '',
      tokenKey: TOKEN_KEY,
      token: store.getters['administrator/tokenVal'],
      fileList: [],
      pathFile: props.pathFile,
    })

    const beforeUpload = () => {
      data.loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }

    const UploadFile = (file: any) => {
      UploadImage(
        file,
        `tradeAider-cms/${data.pathFile}/${parseDate2Str(
          new Date(),
          '{y}/{M}/{d}'
        )}`,
        data.token
      ).then((res) => {
        const fileData: FileData = {
          name: file.file.name,
          url: res.url,
          size: parseFloat((file.file.size / 1024 / 1024).toFixed(2)),
        }
        if (props.limit === 1) {
          value.value = fileData
          emit('getFileName', file.file.name)
        } else {
          data.fileList.push(fileData)
          value.value = data.fileList.map((item) => item.url)
        }
        data.loading.close()
      })
    }

    const handleExceed = () => {
      ElMessage.warning(`当前限制选择 ${props.limit} 个文件，请删除后进行操作`)
    }

    const handleRemove = (file: FileData) => {
      data.fileList = data.fileList.filter((item) => item.name !== file.name)
      value.value = Array.isArray(value.value)
        ? data.fileList.map((item) => item.url)
        : ''
    }

    const successHandle = (result: any) => {
      if (result.success) {
        result.data = { code: 0, url: result.result }
      }
      if (SUCCESS_CODE.includes(result.data.code)) {
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
        } else {
          if (Array.isArray(value.value)) {
            value.value.forEach((item: string) => {
              data.fileList.push({ name: item.split('/').pop()!, url: item })
            })
          }
        }
      } else if (value.value) {
        if (Array.isArray(value.value)) {
          value.value.forEach((item: string) => {
            data.fileList.push({ name: item.split('/').pop()!, url: item })
          })
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
    }
  },
})
</script>

<style lang="scss" scoped>
.update-container {
  width: 100%;
}
</style>
