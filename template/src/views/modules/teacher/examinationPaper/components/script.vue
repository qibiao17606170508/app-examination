<!--
 * @Description: 组件弹框Default
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2025-05-12 13:48:54
-->
<template>
  <el-dialog
    width="600px"
    :title="form.id ? '脚本导入' : '脚本导入'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <div style="max-height: 700px; overflow-y: auto" v-loading="loading">
      <el-form ref="refForm" :model="form" label-width="80px">
        <el-form-item label="cookie" prop="token">
          <el-input v-model="form.token" />
        </el-form-item>
        <el-form-item label="试卷地址" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <!-- 知识点ID -->
        <el-form-item label="知识点" prop="knowledge_id">
          <el-cascader
            style="width: 100%"
            v-model="form.knowledge_id"
            :options="knowledgeList"
            filterable
            :props="{
              checkStrictly: true,
              value: 'id',
              label: 'displayLabel',
            }"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, computed } from 'vue'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { importTopic, getKnowledge } from '@/api/teacher'
export default defineComponent({
  setup(props, { emit }) {
    const refForm = ref<InstanceType<typeof ElForm>>()
    const data = reactive({
      form: {
        id: '',
        url: '',
        token: '',
        knowledge_id: '',
      },
      visible: false,
      loading: false,
      knowledgeList: [],
    })
    const store = useStore()
    const router = useRouter()
    const administrator = computed(() => store.state.menu.administrator)
    const processKnowledgeList = (list: any) => {
      return list.map((node: any) => {
        const newNode = {
          ...node,
          displayLabel: `${node.id} - ${node.name}`,
        }
        if (node.children && node.children.length > 0) {
          newNode.children = processKnowledgeList(node.children)
        }
        return newNode
      })
    }
    const init = (row: any) => {
      getKnowledge({}).then((res: any) => {
        if (res.data && Object.keys(res.data).length !== 0) {
          data.knowledgeList = processKnowledgeList(res.data) || []
        }
      })
      data.visible = true
    }
    const submit = () => {
      // 校验
      if (!data.form.token) {
        ElMessage.error('请输入cookie')
        return
      }
      if (!data.form.url) {
        ElMessage.error('请输入试卷地址')
      }
      if (!data.form.knowledge_id) {
        ElMessage.error('请选择知识点')
      }
      let formData = new FormData()
      formData.append('token', data.form.token)
      formData.append('url', data.form.url)
      formData.append(
        'knowledge_id',
        data.form.knowledge_id[data.form.knowledge_id.length - 1]
      )

      data.loading = true
      axios
        .post(process.env.VUE_APP_BASE_API_SCRIPT + '/run_spider', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'arraybuffer', // 使用 arraybuffer 来接收二进制数据
        })
        .then((res) => {
          if (res.status == 200) {
            // 提示是否上传，上传则上传，否则下载
            ElMessageBox.confirm('是否上传？', '提示', {
              confirmButtonText: '上传',
              cancelButtonText: '下载',
            })
              .then(() => {
                // 1. 用 File 构造，模拟 input[type=file] 选中的文件
                const file = new File(
                  [res.data],
                  'api.xlsx', // 文件名
                  {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  }
                )
                importTopic(
                  {
                    papers_id: router.currentRoute.value.query.id,
                    file: file,
                  },
                  true
                ).then((r) => {
                  if (r.code == 0) {
                    data.visible = false
                    ElMessage.success('上传成功')
                    emit('refresh')
                  }
                })
              })
              .catch(() => {
                try {
                  // 检查响应头中的 Content-Type
                  const contentType = res.headers['content-type']
                  // 创建 Blob 对象
                  const blob = new Blob([res.data], {
                    type:
                      contentType ||
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  })

                  // 检查文件大小
                  if (blob.size === 0) {
                    ElMessage.error('下载的文件为空')
                    return
                  }

                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = '试卷.xlsx'
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)

                  ElMessage.success('文件下载成功')
                } catch (error) {
                  console.error('文件下载失败:', error)
                  ElMessage.error('文件下载失败')
                }
              })
            data.loading = false
          }
        })
        .catch((err) => {
          console.error('请求失败:', err)
          ElMessage.error('请求失败')
          data.loading = false
        })
    }

    const dialogClosedHandle = () => {
      refForm.value?.resetFields()
    }

    return {
      ...toRefs(data),
      refForm,
      submit,
      init,
      dialogClosedHandle,
      administrator,
    }
  },
})
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
