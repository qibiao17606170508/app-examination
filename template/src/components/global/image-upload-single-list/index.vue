<!--
 * @Description: 
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-01-09 11:15:02
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 09:38:59
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
    accept="image/*"
    list-type="picture-card"
    :before-upload="beforeUpload"
    :limit="limit"
    :class="[disabled ? 'hide' : '']"
  >
    <!-- <img v-if="value" :src="value" class="height-full width-full" /> -->
    <Iconfont name="plus" />
    <template #file="{ file }">
      <div>
        <a :href="file.url" target="_blank">
          <img
            class="el-upload-list__item-thumbnail"
            style="width: 100%; height: 100%"
            :src="file.url"
            alt=""
          />
        </a>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete" @click="Move(file, 0)">
            <el-icon><ArrowLeftBold /></el-icon>
          </span>
          <!-- <span
            class="el-upload-list__item-delete"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><ZoomIn /></el-icon>
          </span> -->
          <span
            class="el-upload-list__item-delete delete-icon"
            v-if="!disabled && delFlag"
            @click="handleRemove(file)"
          >
            <!-- <Iconfont name="delete"></Iconfont> -->
            <el-icon><Delete /></el-icon>
          </span>
          <span
            class="el-upload-list__item-delete"
            v-if="rotate"
            @click="handleRote(file)"
          >
            <el-icon><RefreshRight /></el-icon>
          </span>
          <!-- <span
            class="el-upload-list__item-delete"
            v-if="file.flag"
            @click="UploadFileRotate(file)"
          >
            <el-icon><Select /></el-icon>
          </span> -->
          <span class="el-upload-list__item-delete" @click="Move(file, 1)">
            <el-icon><ArrowRightBold /></el-icon>
          </span>
        </span>
      </div>
    </template>
    <el-dialog v-model="dialogVisible" width="950px" append-to-body>
      <img style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
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
import { rotateImage } from '@/utils'

interface FileItem {
  url: string
  name?: string
  response?: { result: string }
  file?: File
  index?: number
  flag?: boolean
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
    pathName: {
      type: String,
      default: () => '',
    },
    fileName: {
      type: String,
      default: () => '',
    },
    limit: {
      type: Number,
      default: () => 9,
    },
    rotate: {
      type: Boolean,
      default: () => false,
    },
    delFlag: {
      type: Boolean,
      default: () => true,
    },
  },

  setup(props) {
    const store = useStore()
    const internalInstance = getCurrentInstance()
    const value = useModel(props)
    const data = reactive({
      action: uploadUrlApi({}),
      tokenKey: TOKEN_KEY,
      token: '',
      fileList: [] as FileItem[],
      loading: null as any,
      pathName: props.pathName,
      fileName: props.fileName,
      limit: props.limit,
      dialogVisible: false,
      dialogImageUrl: '',
      rotate: props.rotate,
      delFlag: props.delFlag,
      pathFile: props.pathFile,
    })

    watch(
      () => value.value,
      (val) => {
        if (Array.isArray(val)) {
          data.fileList = val.map((item: any) => {
            if (!item.url) {
              return {
                url: data.pathName
                  ? item[data.pathName].indexOf('http') == -1
                    ? QINIU_IMAGE_SERVER + item[data.pathName]
                    : item[data.pathName]
                  : item.indexOf('http') == -1
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
                ? item[data.pathName].indexOf('http') == -1
                  ? QINIU_IMAGE_SERVER + item[data.pathName]
                  : item[data.pathName]
                : item.indexOf('http') == -1
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

    const handleRemove = (uploadFile: FileItem) => {
      let index = -1
      if (uploadFile.response && uploadFile.response.result) {
        index = data.fileList.findIndex(
          (item) => item.response?.result === uploadFile.response!.result
        )
      } else {
        index = data.fileList.findIndex((item) => item.url === uploadFile.url)
      }
      if (index !== -1) {
        data.fileList.splice(index, 1)
        if (Array.isArray(value.value)) {
          value.value.splice(index, 1)
        } else {
          value.value = null
        }
      }
    }

    const Move = (uploadFile: FileItem, val: number) => {
      let index = 0
      if (uploadFile.response && uploadFile.response.result) {
        index = data.fileList.findIndex(
          (item: any) => item.response?.result === uploadFile.response!.result
        )
      } else {
        index = data.fileList.findIndex((item) => item.url === uploadFile.url)
      }
      if (val == 0) {
        if (index == 0) {
          ElMessage({
            message: '已经是第一个了',
            type: 'warning',
          })
          return
        }
        let temp = data.fileList[index]
        data.fileList[index] = data.fileList[index - 1]
        data.fileList[index - 1] = temp
        if (Array.isArray(value.value)) {
          let temp1 = value.value[index]
          value.value[index] = value.value[index - 1]
          value.value[index - 1] = temp1
        } else {
          if (Array.isArray(value.value)) {
            let temp1 = value.value[index]
            value.value[index] = value.value[index - 1]
            value.value[index - 1] = temp1
          } else {
            if (Array.isArray(value.value)) {
              let temp1 = value.value[index]
              value.value[index] = value.value[index - 1]
              value.value[index - 1] = temp1
            }
          }
        }
      } else {
        if (index == data.fileList.length - 1) {
          ElMessage({
            message: '已经是最后一个了',
            type: 'warning',
          })
          return
        }
        let temp = data.fileList[index]
        data.fileList[index] = data.fileList[index + 1]
        data.fileList[index + 1] = temp
        if (Array.isArray(value.value)) {
          let temp1 = value.value[index]
          value.value[index] = value.value[index + 1]
          value.value[index + 1] = temp1
        } else {
          if (Array.isArray(value.value)) {
            let temp1 = value.value[index]
            value.value[index] = value.value[index + 1]
            value.value[index + 1] = temp1
          }
        }
      }
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
        if (typeof value.value === 'string') {
          value.value = res.url
        } else {
          if (data.pathName) {
            let obj: any = {}
            obj.extension = file.file.name.split('.')[1]
            obj.size = parseFloat((file.file.size / 1024 / 1024).toFixed(2))
            obj[data.pathName] = res.url
            if (Array.isArray(value.value)) {
              value.value.push(obj)
            } else {
              value.value = [obj]
            }
          }
          if (Array.isArray(value.value)) {
            value.value.push(data.pathName ? res[data.pathName] : res.url)
          } else {
            value.value = [data.pathName ? res[data.pathName] : res.url]
          }
        }
        data.loading.close()
      })
    }

    const UploadFileRotate = (file: FileItem) => {
      let index = data.fileList.findIndex(
        (item) => item.response?.result === file.response?.result
      )
      UploadImage(
        file.file!,
        'tradeAider-cms/' + parseDate2Str(new Date(), '{y}/{M}/{d}'),
        data.token
      ).then((res: any) => {
        data.fileList[index].url = QINIU_IMAGE_SERVER + res.url
        data.fileList[index].flag = false
        data.fileList[index].response!.result = res.url
        if (data.pathName) {
          if (Array.isArray(value.value)) {
            value.value[index][data.pathName] = res.url
          }
        } else {
          if (Array.isArray(value.value)) {
            value.value[index] = res.url
          } else {
            value.value = res.url
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
                  ? item[data.pathName].indexOf('http') == -1
                    ? QINIU_IMAGE_SERVER + item[data.pathName]
                    : item[data.pathName]
                  : item.indexOf('http') == -1
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
                  ? item[data.pathName].indexOf('http') == -1
                    ? QINIU_IMAGE_SERVER + item[data.pathName]
                    : item[data.pathName]
                  : item.indexOf('http') == -1
                  ? QINIU_IMAGE_SERVER + item
                  : item,
                response: {
                  result: data.pathName ? item[data.pathName] : item,
                },
              }
            } else {
              return data.pathName
                ? item[data.pathName].indexOf('http') == -1
                  ? QINIU_IMAGE_SERVER + item[data.pathName]
                  : item[data.pathName]
                : item.indexOf('http') == -1
                ? QINIU_IMAGE_SERVER + item
                : item
            }
          })
        }
      }
      getQiniuTokenApi().then((res: any) => {
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

    const handleRote = (file: FileItem) => {
      data.loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      const index = data.fileList.findIndex((item) => {
        if (
          item.response &&
          item.response.result &&
          file.response &&
          file.response.result
        ) {
          return item.response.result === file.response.result
        } else if (!item.response && !file.response) {
          return item.url === file.url
        }
      })

      if (!file.index) {
        file.index = 1
      }
      let url = ''
      if (data.pathName) {
        if (Array.isArray(value.value)) {
          url =
            value.value[index][data.pathName].indexOf('http') == -1
              ? QINIU_IMAGE_SERVER + value.value[index][data.pathName]
              : value.value[index][data.pathName]
        }
      } else {
        if (Array.isArray(value.value)) {
          url =
            value.value[index].indexOf('http') == -1
              ? QINIU_IMAGE_SERVER + value.value[index]
              : value.value[index]
        }
      }
      rotateImage(url, data.fileList[index].index!).then((res: any) => {
        data.loading.close()
        data.fileList[index].file = res
        data.fileList[index].url = URL.createObjectURL(res)
        data.fileList[index].index = 1
        data.fileList[index].flag = true
        if (data.pathName) {
          if (Array.isArray(value.value)) {
            value.value[index][data.pathName] = data.fileList[index].url
            value.value[index].file = data.fileList[index].file
            value.value[index].rotateFlag = true
          }
        } else {
          if (Array.isArray(value.value)) {
            value.value[index] = data.fileList[index].url
            value.value[index].rotateFlag = true
            value.value[index].file = data.fileList[index].file
          }
        }
      })
      setTimeout(() => {
        data.loading.close()
      }, 10000)
    }

    const handlePictureCardPreview = (file: FileItem) => {
      window.open(file.url, '_blank')
    }

    return {
      value,
      ...toRefs(data),
      successHandle,
      handleRemove,
      internalInstance,
      beforeUpload,
      UploadFile,
      handleRote,
      handlePictureCardPreview,
      UploadFileRotate,
      QINIU_IMAGE_SERVER,
      Move,
    }
  },
})
</script>

<style lang="scss" scoped>
.hide .el-upload--picture-card {
  display: none;
}
/* :deep(.delete-icon .icon-delete) {
  font-size: 17px !important;
} */
:deep(.el-upload-list--picture-card .el-upload-list__item-actions) {
  opacity: 1 !important;
  height: auto !important;
  top: inherit !important;
  bottom: 0;
}
:deep(.el-upload-list--picture-card .el-upload-list__item-actions span) {
  display: block;
}
:deep(.el-upload-list--picture-card .el-upload-list__item-actions span + span) {
  margin-left: 0.8rem;
}
/* :deep(.hide .el-upload--picture-card) {
  display: none !important;
} */
</style>
