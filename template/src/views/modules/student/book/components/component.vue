<!--
 * @Description: 组件弹框Default
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-03-10 13:39:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2025-01-15 09:15:07
-->
<template>
  <el-dialog
    width="650px"
    :title="form.id ? '编辑' : '新增'"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
    :close-on-press-escape="false"
    :before-close="beforeCloseHandle"
  >
    <template #header>
      <div class="dialog-header">
        {{ title }}
        <span class="pl-10">{{ index + 1 }}/{{ total }}</span>
      </div>
    </template>
    <div class="dialog-content">
      <div class="content-item">
        <div class="item-title font-600">
          <el-tag type="primary" class="mb-5">
            {{
              form.type == 1
                ? '选择题'
                : form.type == 2
                ? '填空题'
                : form.type == 3
                ? '应用题'
                : '判断题'
            }}
          </el-tag>
          <span
            class="pl-10"
            v-html="form.title_content"
            style="white-space: pre-wrap; line-height: 1.5"
          ></span>
        </div>
        <div class="item-content font-600 mt-10">
          <!-- {{ form.title_content }} -->
        </div>
        <div class="item-answer-img mt-10 mb-10" v-if="form.image">
          <el-image style="max-height: 250px" :src="form.image"></el-image>
        </div>
        <div class="mt-10" v-if="form.type === 1 || form.type === 4">
          <div class="item-answer">
            <div class="answer-content">
              <div
                v-for="(item, index) in JSON.parse(form.title_content_extend)"
                :key="index"
                class="answer-item cursor-pointer mt-10"
                :class="{
                  active: item.active,
                  errorActive:
                    item.active &&
                    form.answer_content &&
                    form.answer_content !== form.answer &&
                    form.submit,
                  successActive:
                    form.answer_content &&
                    form.answer_content === form.answer &&
                    item.active &&
                    form.submit,
                }"
                @click="answerItemClickHandle(item)"
              >
                <div>
                  <span class="answer-item-text">{{ item.key }}</span>
                  <span class="answer-item-desc">{{ item.value }}</span>
                </div>
                <div
                  v-if="
                    form.answer_content &&
                    form.answer_content === form.answer &&
                    item.active &&
                    form.submit
                  "
                >
                  <el-icon class="success"><Select /></el-icon>
                </div>
                <div
                  v-if="
                    form.answer_content &&
                    form.answer_content !== form.answer &&
                    item.active &&
                    form.submit
                  "
                >
                  <el-icon class="error"><CloseBold /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-10" v-if="form.type === 2">
          <div class="item-answer">
            <el-input
              v-model="form.answer_content"
              placeholder="请输入您的答案"
              :suffix-icon="
                form.submit && form.answer_content == form.answer
                  ? 'Select'
                  : form.submit && form.answer_content !== form.answer
                  ? 'CloseBold'
                  : ''
              "
              :disabled="form.submit"
              :class="{
                success:
                  form.answer_content &&
                  form.answer_content === form.answer &&
                  form.submit,
                error:
                  form.answer_content &&
                  form.answer_content !== form.answer &&
                  form.submit,
              }"
            ></el-input>
          </div>
        </div>
        <div class="mt-10" v-if="form.type === 3">
          <div class="item-answer">
            <el-input
              v-model="form.answer_content"
              placeholder="请输入您的答案"
              :disabled="form.submit"
              type="textarea"
              :rows="5"
            ></el-input>
          </div>
        </div>
        <div class="result">
          <div
            class="result-item true"
            v-if="
              form.answer_content &&
              form.answer_content === form.answer &&
              form.submit
            "
          >
            🎉恭喜你，回答正确！
          </div>
          <div
            v-if="
              form.answer_content &&
              form.answer_content !== form.answer &&
              form.type != 3 &&
              form.submit
            "
            class="result-item false"
            :style="{
              borderBottom: form.analysis
                ? '1px solid #ccc'
                : '1px solid transparent',
              paddingBottom: '15px',
            }"
          >
            😔很遗憾，回答错误。正确答案是
            <span class="success" v-html="form.answer"></span>
          </div>
          <div
            class="result-item false"
            :style="{
              borderBottom: form.analysis
                ? '1px solid #ccc'
                : '1px solid transparent',
              paddingBottom: '15px',
            }"
            v-if="
              (form.type == 3 && form.submit) ||
              (!form.answer_content && form.submit)
            "
          >
            正确答案是
            <span class="success" v-html="form.answer"></span>
          </div>
          <div
            class="result-item analysis"
            v-if="
              (form.analysis &&
                form.answer != form.answer_content &&
                form.submit) ||
              (form.analysis && form.type == 3 && form.submit) ||
              (form.analysis && form.submit)
            "
          >
            解析：
            <span v-html="form.analysis"></span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex-box flex_j_c-space-between">
        <div class="dialog-footer">
          <el-button @click="topicHandle('prev')" v-if="index > 0">
            上一题
          </el-button>
          <el-button @click="topicHandle('next')" v-if="index < total - 1">
            下一题
          </el-button>
        </div>
        <div class="dialog-footer">
          <el-button @click="closeHandle" v-if="form.submit || total == 1">
            退出
          </el-button>
          <el-button @click="noAnswerHandle" v-if="!form.submit">
            不会
          </el-button>
          <el-button
            v-repeat
            type="primary"
            v-if="form.submit && index < total - 1"
            @click="topicHandle('next')"
          >
            继续
          </el-button>
          <div v-else class="inline-block ml-10">
            <el-button
              v-repeat
              type="primary"
              v-if="!form.submit"
              @click="submit(form)"
            >
              提交
            </el-button>
          </div>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeMount,
  reactive,
  ref,
  toRefs,
} from 'vue'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
import { CloseBold, Select } from '@element-plus/icons-vue'
import { getPracticeListRandom, setPracticeAdd } from '@/api/student'
interface Form {
  id?: string
  xx?: string
  // 其他表单字段
}

export default defineComponent({
  emits: ['refresh'],
  setup(_props, { emit }) {
    const refForm = ref<InstanceType<typeof ElForm>>()
    const data = reactive({
      loading: false,
      visible: false,
      total: 0,
      index: 0,
      title: '',
      // 题目类型 1：选择题 2：填空题 3：应用题
      form: {
        submit: false,
        id: 1,
        answer: 'A',
        title: '给出以下集合：',
        answer_content: '',
        is_correct: 0,
        subject_id: 0,
        content:
          '①M={x|x²+2x+a=0，a∈R} ②N={x|-x²+x-2＞0} ③P={x|y=lg(-x)}∩{y|y=lg(-x)} ④Q={y|y=x²}∩{y|y=x-4} 其中一定是空集的有( )。',
        type: 3,
        img: 'https://img1.baidu.com/it/u=1785251835,550483492&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=375',
        analysis: `12312`,
        title_content_extend: [
          {
            id: 1,
            title: 'A',
            desc: '0个',
          },
          {
            id: 2,
            title: 'B',
            desc: '0个',
          },
          {
            id: 3,
            title: 'C',
            desc: '0个',
          },
          {
            id: 4,
            title: 'D',
            desc: '0个',
          },
        ] as any,
      },
      params: {},
      topic_list: [],
    })

    const rules = reactive(
      (function () {
        return {
          // name: [{ required: true, message: t('modules/system/administrator.nameErr'), trigger: 'blur' }]
        }
      })()
    )

    const init = async (item: any) => {
      data.loading = true
      data.title = item.name
      data.index = 0
      data.params = {
        subject_id: item.subject_id,
        knowledge_id: item.id,
        difficulty: item.difficulty,
      }
      getPracticeListRandomFn()
    }
    const getPracticeListRandomFn = async () => {
      getPracticeListRandom(data.params).then((res: any) => {
        console.log(res)
        if (res && res.code == 0) {
          if (res.data.total == 0) {
            ElMessage.warning('该知识点没有题目')
            return
          }
          data.total = res.data.total
          data.topic_list = res.data.list
          data.form = data.topic_list[data.index]
          data.visible = true
          nextTick(() => {
            data.loading = false
          })
        }
      })
    }
    /**
     * @description: 表单验证提交
     * @param {*}
     * @return {*}
     */
    const submit = (item: any) => {
      // 判断是否有选择
      let flag = false
      if (data.form.type === 1 || data.form.type === 4) {
        JSON.parse(data.form.title_content_extend).forEach((item: any) => {
          if (item.active) {
            flag = true
          }
        })
      }
      if (
        (data.form.type === 2 || data.form.type === 3) &&
        data.form.answer_content
      ) {
        flag = true
      }
      if (!flag) {
        ElMessageBox.confirm(
          data.form.type == 1 || data.form.type == 4
            ? '选择答案之后才能提交'
            : '填写答案之后才能提交',
          '',
          {
            confirmButtonText: '我知道了',
            showCancelButton: false,
            type: 'warning',
          }
        )
          .then(() => {
            return
          })
          .catch(() => {
            return
          })
      } else {
        if (data.form.answer_content == data.form.answer) {
          data.form.is_correct = 1
        } else {
          data.form.is_correct = 2
        }
        let params = {
          topic_id: data.form.id,
          is_correct: data.form.is_correct,
          subject_id: data.form.subject_id,
          answer_content: data.form.answer_content,
        }
        if (data.form.type == 1 || data.form.type == 4) {
          data.form.submit = true
          JSON.parse(data.form.title_content_extend).forEach((item: any) => {
            if (item.active) {
              data.form.answer_content = item.key
            }
          })
        } else if (data.form.type == 2 || data.form.type == 3) {
          data.form.submit = true
        }
        setPracticeAdd(params).then((res: any) => {
          if (res && res.code == 0) {
            console.log(res)
          }
        })
      }
    }
    const noAnswerHandle = () => {
      data.form.answer_content = ''
      console.log(data.form.analysis)
      data.form.submit = true
    }
    onBeforeMount(() => {})
    const beforeCloseHandle = () => {
      closeHandle()
    }
    const answerItemClickHandle = (item: any) => {
      // 给当前id的active设置为true
      const titleContentExtend = JSON.parse(data.form.title_content_extend)
      titleContentExtend.forEach((items: any) => {
        items.active = false
        if (item.key == items.key) {
          items.active = true
          data.form.answer_content = item.key
        }
      })
      data.form.title_content_extend = JSON.stringify(titleContentExtend)
    }
    /**
     * @description: 弹窗关闭动画结束时的回调
     * @param {*}
     * @return {*}
     */
    const dialogClosedHandle = () => {
      // refForm.value?.resetFields()
    }
    const topicHandle = async (type: string) => {
      if (type == 'prev') {
        await data.index--
      } else {
        await data.index++
      }
      data.form = data.topic_list[data.index]
      // await getPracticeListRandomFn()
    }
    const closeHandle = () => {
      data.visible = false
      emit('refresh')
    }
    return {
      refForm,
      ...toRefs(data),
      rules,
      init,
      submit,
      dialogClosedHandle,
      answerItemClickHandle,
      topicHandle,
      Select,
      CloseBold,
      beforeCloseHandle,
      getPracticeListRandomFn,
      closeHandle,
      noAnswerHandle,
    }
  },
})
</script>
<style scoped lang="scss">
:deep(.upload-cu .el-upload-list__item) {
  width: 100px;
  height: 100px;
}
:deep(.upload-cu .el-upload--picture-card) {
  width: 100px;
  height: 100px;
}
.tips {
  color: rgba(136, 136, 136, 1);
  font-size: 12px;
}

.dialog-header {
  font-weight: bold;
  margin-bottom: 10px;
  span {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    font-weight: normal;
  }
}
.item-content {
  line-height: 24px;
  white-space: pre-wrap;
}
.dialog-content {
  max-height: 700px;
  overflow-y: auto;
}
.item-answer {
  .answer-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover {
      background-color: #f7f7f7;
    }
    .answer-item-text {
      font-size: 14px;
      border: 1px solid #ccc;
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      display: inline-block;
      border-radius: 3px;
      margin-right: 10px;
    }
  }
  .answer-item.active {
    .answer-item-text {
      background: rgba(15, 171, 190, 0.2);
      color: #15abbe;
      border: 1px solid #15abbe;
    }
  }
  .answer-item.errorActive {
    .answer-item-text {
      background: rgba(235, 22, 22, 1);
      color: #fff;
      border: 1px solid #eb1616;
    }
  }
  .answer-item.successActive {
    .answer-item-text {
      background: rgba(15, 171, 190, 1);
      color: #fff;
      border: 1px solid #15abbe;
    }
  }
}
.success {
  color: #15abbe;
}
.error {
  color: #eb1616;
}
.result {
  margin-top: 20px;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: #f7f7f7;
  color: #000;
  .true {
    padding: 15px;
    border-radius: 5px;
    background-color: rgba(15, 171, 190, 0.5);
  }
  .false {
    padding: 15px;
    border-bottom: 1px solid #ccc;
  }
  .analysis {
    padding: 15px;
  }
}
:deep(.success .el-input__icon) {
  color: #15abbe;
}
:deep(.success .el-input__wrapper) {
  border: 1px solid #15abbe;
}
:deep(.error .el-input__icon) {
  color: #eb1616;
}
:deep(.error .el-input__wrapper) {
  border: 1px solid #eb1616;
}
</style>
