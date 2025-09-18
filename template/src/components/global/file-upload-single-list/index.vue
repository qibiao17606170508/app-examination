<!--
 * @Description: 文件上传
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-01-09 11:15:02
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-21 16:17:51
-->
<template>
  <el-upload
    v-model:file-list="fileList"
    class="update-container"
    :headers="{
      [tokenKey]: token,
    }"
    ref="uploadRef"
    :http-request="UploadFile"
    :show-file-list="true"
    :disabled="disabled"
    :before-upload="beforeUpload"
  >
    <template #file="{ file }">
      <div>
        <el-button type="primary">上传</el-button>
        <img
          class="el-upload-list__item-thumbnail"
          style="width: 100%; height: 100%"
          :src="file.url"
          alt=""
        />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <Iconfont name="delete"></Iconfont>
          </span>
        </span>
      </div>
    </template>
  </el-upload>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  reactive,
  toRefs,
  ref,
  getCurrentInstance,
  watch,
} from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElLoading } from 'element-plus'
import useModel from '@/mixins/model'
import { TOKEN_KEY, SUCCESS_CODE, QINIU_IMAGE_SERVER } from '@/utils/constant'
import { UploadImage, parseDate2Str } from '@/utils/index'
import { uploadUrlApi, getQiniuTokenApi } from '@/api/file'
import { isArray } from 'element-plus/es/utils'
interface FileData {
  url: string
  name?: string
  response?: { result: string }
}

interface Data {
  action: string
  tokenKey: string
  token: string
  fileList: FileData[]
  loading: any
  pathName: string
  pathFile: string
  fileName: string
}

export default defineComponent({
  props: {
    modelValue: {
      type: Array as () => Array<any>,
      required: true,
      default: () => [],
    },
    size: {
      type: String,
      default: '100px',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    pathFile: {
      type: String,
      default: '',
    },
    pathName: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
  },

  setup(props) {
    const store = useStore()
    const internalInstance = getCurrentInstance()
    const value = useModel(props)
    const data = reactive<Data>({
      action: '',
      tokenKey: TOKEN_KEY,
      token: '',
      fileList: [],
      loading: null,
      pathName: props.pathName,
      pathFile: props.pathFile,
      fileName: props.fileName,
    })

    watch(
      () => value.value,
      (val) => {
        if (Array.isArray(val)) {
          data.fileList = val.map((item: any) => {
            if (!item.url) {
              return {
                url: data.pathName
                  ? item[data.pathName].indexOf('http') === -1
                    ? QINIU_IMAGE_SERVER + item[data.pathName]
                    : item[data.pathName]
                  : item.indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + item
                  : item,
                name: data.fileName ? item[data.fileName] : item,
                response: {
                  result: data.pathName ? item[data.pathName] : item,
                },
              }
            } else {
              if (!item.response) {
                item.response = {
                  result: data.pathName ? item[data.pathName] : item,
                }
              }
              return data.pathName
                ? item[data.pathName].indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + item[data.pathName]
                  : item[data.pathName]
                : item.indexOf('http') === -1
                ? QINIU_IMAGE_SERVER + item
                : item
            }
          })
        }
      }
    )

    const successHandle = (r: any) => {
      if (SUCCESS_CODE.includes(r.code)) {
        if (Array.isArray(value.value)) {
          value.value.push(r.result)
        } else {
          value.value = r.result
        }
        data.loading.close()
      } else {
        ElMessage({
          message: r.msg,
          type: 'warning',
        })
      }
    }

    const handleRemove = (uploadFile: any) => {
      const index =
        uploadFile.response && uploadFile.response.result
          ? data.fileList.findIndex(
              (item) => item.response?.result === uploadFile.response.result
            )
          : data.fileList.findIndex((item) => item.url === uploadFile.url)
      data.fileList.splice(index, 1)
      if (Array.isArray(value.value)) {
        value.value.splice(index, 1)
      } else {
        value.value = null
      }
    }

    const UploadFile = (file: any) => {
      UploadImage(
        file,
        `tradeAider-cms/${data.pathFile}/${parseDate2Str(
          new Date(),
          '{y}/{M}/{d}'
        )}`,
        data.token
      ).then((res: any) => {
        if (typeof value.value === 'string') {
          value.value = res.url
        } else {
          if (data.pathName) {
            const obj: any = {
              size: parseFloat((file.file.size / 1024 / 1024).toFixed(2)),
              [data.pathName]: res.url,
            }
            if (Array.isArray(value.value)) {
              value.value.push(obj)
            } else {
              value.value = obj
            }
          }
          if (Array.isArray(value.value)) {
            value.value.push(data.pathName ? res[data.pathName] : res.url)
          } else {
            value.value = data.pathName ? res[data.pathName] : res.url
          }
        }
        data.loading.close()
      })
    }

    onBeforeMount(() => {
      if (typeof value.value === 'string') {
        value.value = JSON.parse(value.value)
        if (Array.isArray(value.value)) {
          data.fileList = value.value.map((item: any) => {
            if (!item.url) {
              return {
                name: data.pathName
                  ? item[data.pathName].indexOf('http') === -1
                    ? QINIU_IMAGE_SERVER + item[data.pathName]
                    : item[data.pathName]
                  : item.indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + item
                  : item,
                url: data.pathName ? item[data.pathName] : item,
              }
            } else {
              return data.pathName ? item[data.pathName] : item
            }
          })
        }
      } else {
        if (Array.isArray(value.value)) {
          data.fileList = value.value.map((item: any) => {
            if (!item.url) {
              return {
                name: data.pathName ? item[data.pathName] : item,
                url: data.pathName
                  ? item[data.pathName].indexOf('http') === -1
                    ? QINIU_IMAGE_SERVER + item[data.pathName]
                    : item[data.pathName]
                  : item.indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + item
                  : item,
                response: {
                  result: data.pathName ? item[data.pathName] : item,
                },
              }
            } else {
              return data.pathName
                ? item[data.pathName].indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + item[data.pathName]
                  : item[data.pathName]
                : item.indexOf('http') === -1
                ? QINIU_IMAGE_SERVER + item
                : item
            }
          })
        }
      }
      getQiniuTokenApi().then((res) => {
        data.token = res.data.data
      })
    })

    const beforeUpload = () => {
      data.loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }

    return {
      value,
      ...toRefs(data),
      successHandle,
      handleRemove,
      internalInstance,
      beforeUpload,
      UploadFile,
    }
  },
})
</script>

<style lang="scss" scoped></style>
