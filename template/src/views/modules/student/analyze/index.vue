<!--
 * @Description: 
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-25 09:59:23
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-30 14:15:27
-->
<template>
  <Container>
    <template #header></template>
    <template #default>
      <div v-if="noData" class="no-data">
        <img src="@/assets/images/analyze.png" alt="No Data" />
        <p>您尚未分析过错题</p>
        <el-button type="primary" @click="analyzeErrors">分析错题</el-button>
      </div>
      <div v-else class="analyze-list">
        <div class="mb-10">
          <span class="title">{{ administrator.nickname }}的错题分析报告</span>
        </div>
        <div v-for="item in list" :key="item.id">
          <div class="mb-10 time_diff">
            <span class="time_diff">{{ item.time_diff }}</span>
            <span class="time">{{ item.time }}</span>
          </div>
          <div
            v-html="item.details"
            style="width: 100%; white-space: pre-wrap; line-height: 1.5"
          ></div>
        </div>
        <div class="text-center">
          <el-button class="mt-50" type="primary" @click="analyzeErrors">
            再次分析
          </el-button>
        </div>
      </div>
    </template>
  </Container>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import { getPracticeAnalyze, setPracticeAnalyze } from '@/api/student'
interface Data {
  list: Array<any>
  noData: boolean
}

export default defineComponent({
  name: '',
  setup() {
    const data = reactive<Data>({
      list: [],
      noData: false,
    })
    const store = useStore()
    const subject = computed(() =>
      JSON.parse(sessionStorage.getItem('subject') || '{}')
    )
    const administrator = computed(() => store.state.menu.administrator)
    console.log(administrator.value)
    /**
     * @description: 获取列表
     * @param {*} val
     * @return {*}
     * @author: qibiao
     */
    const getList = (val: Record<string, any>, flag: boolean) => {
      getPracticeAnalyze({ subject_id: subject.value.id }).then((r) => {
        if (r.code == 0) {
          data.list = r.data.list
          data.noData = r.data.list.length == 0
        }
      })
    }

    const analyzeErrors = () => {
      // 在这里添加分析错题的逻辑
      setPracticeAnalyze({ subject_id: subject.value.id }).then((r) => {
        if (r.code == 0) {
          ElMessage.success('分析成功')
          getList({}, true)
        }
      })
    }

    onMounted(() => {
      getList({}, true)
    })

    return {
      ...toRefs(data),
      analyzeErrors,
      administrator,
    }
  },
})
</script>

<style lang="scss" scoped>
.no-data {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 240px;
    height: auto;
  }
  button {
    margin-top: 20px;
  }
}
.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.time {
  font-size: 16px;
  color: #999;
  font-weight: 500;
  margin-left: 10px;
}
.analyze-list {
  padding: 20px;
  box-sizing: border-box;
}
.time_diff {
  font-size: 16px;
  color: #000;
  font-weight: bold;
  margin-top: 30px;
}
</style>
