<template>
  <el-drawer
    width="400px"
    :title="form.id ? '编辑题目' : '新建题目'"
    v-model="visible"
    @closed="dialogClosedHandle"
    append-to-body
    direction="rtl"
  >
    <el-form
      ref="refForm"
      :model="form"
      label-width="80px"
      :label-position="'top'"
      :rules="rules"
    >
      <!-- 题目编号 -->
      <el-form-item label="题目编号" prop="number">
        <el-input v-model="form.number" placeholder="请输入题目编号" />
      </el-form-item>
      <!-- 题目类型 -->
      <el-form-item label="题目类型" prop="type">
        <el-radio-group @change="getOption" v-model="form.type">
          <el-radio :label="1">选择题</el-radio>
          <el-radio :label="2">填空题</el-radio>
          <el-radio :label="3">应用题</el-radio>
          <el-radio :label="4">判断题</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 题目内容 -->
      <el-form-item label="题目内容" prop="title_content">
        <el-input
          type="textarea"
          v-model="form.title_content"
          placeholder="请输入题目内容"
          :rows="8"
        />
      </el-form-item>
      <el-form-item
        prop="title_content_extend"
        v-if="form.type == 1 || form.type == 4"
      >
        <div
          v-for="(item, index) in form.title_content_extend"
          :key="index"
          class="flex-box flex-alc flex_a_c-center mt-10"
        >
          <el-icon
            v-if="form.type == 1"
            @click="deleteOption(index)"
            class="cursor-pointer"
          >
            <Remove />
          </el-icon>
          <el-input
            class="ml-10"
            v-model="item.value"
            :disabled="form.type == 4"
            placeholder="请输入选项"
          >
            <template #prepend>
              <span>{{ String.fromCharCode(65 + index) }}</span>
            </template>
          </el-input>
        </div>
        <div style="width: 100%">
          <el-button v-if="form.type != 4" @click="addOption" class="mt-10">
            增加选项
          </el-button>
        </div>
      </el-form-item>
      <!-- 答案 -->
      <el-form-item
        label="答案"
        prop="answer"
        v-if="form.type != 1 && form.type != 4"
      >
        <el-input v-model="form.answer" placeholder="请输入答案" />
      </el-form-item>
      <!-- 答案 -->
      <el-form-item
        label="答案"
        prop="answer"
        v-if="form.type == 1 || form.type == 4"
      >
        <el-select
          style="width: 100%"
          v-model="form.answer"
          placeholder="请选择答案"
        >
          <el-option
            v-for="(item, index) in form.title_content_extend"
            :key="index"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
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

      <!-- 难度 -->
      <el-form-item label="难度" prop="difficulty">
        <el-radio-group v-model="form.difficulty">
          <el-radio :label="1"><div class="difficulty-1">1</div></el-radio>
          <el-radio :label="2"><div class="difficulty-2">2</div></el-radio>
          <el-radio :label="3"><div class="difficulty-3">3</div></el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 图片 -->
      <el-form-item label="图片" prop="image">
        <image-upload-single v-model="form.image" />
      </el-form-item>

      <!-- 解析 -->
      <el-form-item label="解析" prop="analysis">
        <el-input
          type="textarea"
          v-model="form.analysis"
          placeholder="请输入解析"
          :rows="8"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, computed } from 'vue'
import { ElForm, ElMessage, ElNotification } from 'element-plus'
import { useStore } from 'vuex'
import { addTopic, editTopic } from '@/api/teacher'
import { getKnowledge } from '@/api/teacher'
export default defineComponent({
  setup(props, { emit }) {
    const refForm = ref<InstanceType<typeof ElForm>>()
    const data = reactive({
      form: {
        papers_id: '',
        number: '',
        title_content: '',
        answer: '',
        knowledge_id: '',
        difficulty: 1,
        type: 1,
        image: '',
        analysis: '',
        name: '',
        time: '',
        id: '',
        title_content_extend: [] as any,
      },
      knowledgeList: [],
      visible: false,
    })
    const store = useStore()
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
      data.visible = true
      refForm.value?.resetFields()
      data.form = row ? JSON.parse(JSON.stringify(row)) : { type: 1 }
      if (
        ((data.form.type == 1 || data.form.type == 4) &&
          !data.form.title_content_extend) ||
        ((data.form.type == 1 || data.form.type == 4) &&
          data.form.title_content_extend &&
          JSON.parse(data.form.title_content_extend).length == 0)
      ) {
        addOption()
      } else {
        if (data.form.title_content_extend) {
          data.form.title_content_extend = JSON.parse(
            data.form.title_content_extend
          )
        } else {
          data.form.type = 1
          data.form.title_content_extend = []
          addOption()
        }
      }

      getKnowledge({}).then((res: any) => {
        if (res.data && Object.keys(res.data).length !== 0) {
          data.knowledgeList = processKnowledgeList(res.data) || []
        }
      })
    }

    const rules = {
      number: [{ required: true, message: '请输入题目编号' }],
      title_content: [{ required: true, message: '请输入题目内容' }],
      answer: [{ required: true, message: '请输入答案' }],
      knowledge_id: [{ required: true, message: '请选择知识点ID' }],
      difficulty: [{ required: true, message: '请输入难度' }],
      type: [{ required: true, message: '请输入题目类型' }],
    }
    const submit = () => {
      refForm.value?.validate((valid) => {
        if (valid) {
          let params = {
            number: data.form.number,
            title_content: data.form.title_content,
            answer: data.form.answer,
            papers_id: data.form.papers_id,
            knowledge_id: Array.isArray(data.form.knowledge_id)
              ? data.form.knowledge_id[data.form.knowledge_id.length - 1]
              : data.form.knowledge_id,
            difficulty: data.form.difficulty,
            type: data.form.type,
            image: data.form.image,
            analysis: data.form.analysis,
            id: data.form.id,
            title_content_extend: JSON.stringify(
              data.form.title_content_extend
            ),
          }
          if ((data.form as any).id) {
            editTopic(params).then((r) => {
              if (r.code == 0) {
                ElMessage.success('修改成功')
                data.visible = false
                emit('refresh')
              }
            })
          } else {
            addTopic(params).then((r) => {
              if (r.code == 0) {
                ElMessage.success('添加成功')
                data.visible = false
                emit('refresh')
              }
            })
          }
        }
      })
    }
    const getOption = () => {
      data.form.title_content_extend = []
      addOption()
    }
    const dialogClosedHandle = () => {
      refForm.value?.resetFields()
    }
    const addOption = () => {
      if (data.form.type == 1) {
        if (!data.form.title_content_extend) {
          data.form.title_content_extend = []
        }
        data.form.title_content_extend = [
          ...data.form.title_content_extend,
          {
            key: String.fromCharCode(
              65 + data.form.title_content_extend.length
            ),
            value: '',
          },
          {
            key: String.fromCharCode(
              65 + data.form.title_content_extend.length
            ),
            value: '',
          },
        ]
      } else if (data.form.type == 4) {
        if (!data.form.title_content_extend) {
          data.form.title_content_extend = []
        }
        data.form.title_content_extend = [
          ...data.form.title_content_extend,
          {
            key: 'A',
            value: '对',
          },
          {
            key: 'B',
            value: '错',
          },
        ]
      }
    }
    const deleteOption = (index: number) => {
      if (data.form.title_content_extend.length > 2) {
        data.form.title_content_extend.splice(index, 1)
      } else {
        ElMessage.warning('至少需要保留2个选项')
      }
    }
    return {
      ...toRefs(data),
      refForm,
      submit,
      init,
      dialogClosedHandle,
      administrator,
      rules,
      addOption,
      getOption,
      deleteOption,
    }
  },
})
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
:deep(.el-form-item__content .el-select .el-select__wrapper) {
  width: 100%;
}
</style>
