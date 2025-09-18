<!--
 * @Description: 文件上传（支持多个）
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-12-08 19:09:56
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-21 16:17:40
-->
<template>
  <el-upload
    class="update-container"
    :action="action"
    :headers="{
      [tokenKey]: token,
    }"
    ref="upload"
    :http-request="UploadFile"
    :before-upload="beforeUpload"
    :limit="limit ? limit : 1"
    :show-file-list="true"
    :on-exceed="handleExceed"
    :file-list="fileList"
    :on-remove="handleRemove"
    :on-preview="handlePreview"
    :disabled="disabled"
  >
    <template #trigger>
      <el-button v-if="!disabled" type="primary" v-repeat>
        {{ selectUpload }}
      </el-button>
    </template>
  </el-upload>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'
import { ElLoading, ElMessage, genFileId } from 'element-plus'
import useModel from '@/mixins/model'
import { TOKEN_KEY, SUCCESS_CODE, QINIU_IMAGE_SERVER } from '@/utils/constant'
import { uploadUrlApi, getQiniuTokenApi } from '@/api/file'
import { UploadImage, parseDate2Str } from '@/utils/index'

interface FileItem {
  name: string
  url: string
  size?: number
}

interface Data {
  action: string
  tokenKey: string
  token: string
  fileList: FileItem[]
  selectUpload: string
  pathFile: string
  loading?: any
}

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array] as unknown as () => string | Array<any>,
      required: true,
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
      default: () => 'name',
    },
    path: {
      type: String,
      default: () => 'url',
    },
    selectUpload: {
      type: String,
      default: () => '选择上传',
    },
  },
  setup(props) {
    const store = useStore()
    const value = useModel(props)
    const upload = ref()
    const data = reactive<Data>({
      action: '',
      tokenKey: TOKEN_KEY,
      token: store.getters['administrator/tokenVal'],
      fileList: [],
      selectUpload: props.selectUpload,
      pathFile: props.pathFile,
    })
    uploadUrlApi({ path: props.pathFile }).then((url) => {
      data.action = url
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
        'tradeAider-cms/' +
          data.pathFile +
          '/' +
          parseDate2Str(new Date(), '{y}/{M}/{d}'),
        data.token
      ).then((res: any) => {
        if (props.limit == 1) {
          value.value = res.url
        } else {
          data.fileList.push({
            name: file.file.name,
            url: res.url,
            size: parseFloat((res.size / 1024 / 1024).toFixed(2)),
          })
          value.value = data.fileList
          console.log(data.fileList)
        }
        data.loading.close()
      })
    }
    const handleExceed = (files: any) => {
      ElMessage.warning(`当前限制选择 ${props.limit} 个文件，请删除后进行操作`)
    }
    const handleRemove = (files: any, filesList: any) => {
      data.fileList.forEach((item, index) => {
        if (item.name == files.name) {
          data.fileList.splice(index, 1)
        }
      })
      if (Array.isArray(value.value)) {
        value.value = data.fileList.map((item) => {
          return item.url
        })
      } else {
        value.value = ''
      }
    }
    const successHandle = (result: any) => {
      var r = result
      if (r.success) {
        r.data = {
          code: 0,
          url: result.result,
        }
      }
      if (SUCCESS_CODE.includes(r.code)) {
        value.value = r.data.url
      } else {
        ElMessage({
          message: r.msg,
          type: 'warning',
        })
      }
    }
    onBeforeMount(() => {
      getQiniuTokenApi().then((res: any) => {
        data.token = res.data.data
      })
      if (
        props.limit == 1 &&
        typeof value.value != 'undefined' &&
        value.value != ''
      ) {
        if (Array.isArray(value.value)) {
          value.value.forEach((item: any) => {
            data.fileList.push({
              name: item[props.fileName],
              url: item[props.path],
            })
          })
        } else {
          // 确保 value.value 是一个字符串
          if (typeof value.value === 'string') {
            data.fileList = [
              {
                name: value.value.substring(
                  value.value.lastIndexOf('/') + 1,
                  value.value.length
                ),
                url: value.value,
              },
            ]
          }
        }
      } else {
        if (typeof value.value != 'undefined' && value.value != '') {
          if (Array.isArray(value.value)) {
            value.value.forEach((item: any) => {
              data.fileList.push({
                name: item[props.fileName],
                url: item[props.path],
              })
            })
          } else {
            if (typeof value.value === 'string') {
              data.fileList = [
                {
                  name: value.value.substring(
                    value.value.lastIndexOf('/') + 1,
                    value.value.length
                  ),
                  url: value.value,
                },
              ]
            }
          }
        }
      }
    })
    const handlePreview = (file: any) => {
      if (file.url.indexOf('http') == -1) {
        window.open(QINIU_IMAGE_SERVER + file.url, '_blank')
      } else {
        window.open(file.url, '_blank')
      }
    }
    return {
      value,
      ...toRefs(data),
      successHandle,
      beforeUpload,
      UploadFile,
      handleExceed,
      upload,
      handleRemove,
      handlePreview,
    }
  },
})
</script>

<style lang="scss" scoped>
.update-container {
  width: 100%;
}
</style>
