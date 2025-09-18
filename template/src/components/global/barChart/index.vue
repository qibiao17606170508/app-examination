<template>
  <div class="panel padding-15">
    <div class="panel-content">
      <div class="height-full width-full" ref="refEchart" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRefs,
  markRaw,
  onBeforeUnmount,
} from 'vue'
import * as echarts from 'echarts'
import useModel from '@/mixins/model'

interface ChartData {
  echart: echarts.ECharts | null
  option: {
    tooltip: any
    title: any
    xAxis: any
    yAxis: any
    series: any
  }
}

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array] as unknown as () => string | string[],
      required: true,
      default: () => '',
    },
    seriesName: {
      type: String,
      required: true,
      default: () => '标题',
    },
    dataName: {
      type: [String, Array] as unknown as () => string | string[],
      required: true,
      default: () => '',
    },
  },
  setup(props) {
    const refEchart = ref<HTMLElement | null>(null)
    const value = useModel(props)
    const data = reactive<ChartData>({
      echart: null,
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        title: {
          text: props.seriesName,
          left: 'center',
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)',
            },
          },
        ],
      },
    })

    const getList = async () => {
      data.option.xAxis.data = props.dataName as string[]
      data.option.series[0].data = value.value as number[]
      // 更新视图
      if (refEchart.value) {
        data.echart = markRaw(echarts.init(refEchart.value))
        data.echart.setOption(data.option)
      }
    }

    const init = async () => {
      await getList()
    }

    const resizeHandle = () => {
      if (data.echart) {
        data.echart.resize()
      }
    }

    onMounted(() => {
      nextTick(() => {
        init()
        window.addEventListener('resize', resizeHandle)
      })
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeHandle)
    })

    return {
      refEchart,
      getList,
      ...toRefs(data),
      value,
    }
  },
})
</script>

<style lang="scss" scoped>
.panel {
  height: fit-content;
  min-width: 400px;
  border-radius: var(--el-border-radius-base);
  background-color: var(--gl-content-panel-background-color);
  &-title {
    font-weight: 700;
  }
  &-content {
    height: 400px;
  }
}
</style>
