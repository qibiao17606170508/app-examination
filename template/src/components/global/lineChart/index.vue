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
  onBeforeMount,
  reactive,
  ref,
  toRefs,
  markRaw,
  onBeforeUnmount,
} from 'vue'
import * as echarts from 'echarts'
import useModel from '@/mixins/model'

interface DataItem {
  name: string
  data: Array<{ [key: string]: any }>
  dataName: string
}

interface Props {
  modelValue: string | Array<any> | object
  title: string
  xAxis: string | Array<any>
}

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array, Object] as unknown as () =>
        | string
        | string[]
        | object,
      required: true,
      default: () => '',
    },
    title: {
      type: String as unknown as () => string,
      default: '统计',
    },
    xAxis: {
      type: [String, Array] as unknown as () => string | string[],
      required: true,
      default: () => '',
    },
  },
  setup(props: Props) {
    const refEchart = ref<HTMLElement | null>(null)
    const value = useModel(props)
    const data = reactive({
      echart: null as echarts.ECharts | null,
      option: {
        title: {
          text: props.title,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: ['Search Engine'],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [] as Array<any>,
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [] as Array<any>,
      },
    })
    const getList = async () => {
      const datas = (value.value as Array<DataItem>).map((item) => {
        return {
          name: item.name,
          type: 'line',
          stack: 'Total',
          label: {
            show: false,
            position: 'top',
          },
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: item.data.map((item2) => {
            return item2[item.dataName]
          }),
        }
      })
      const xAxisData = [
        {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            fontSize: 11,
          },
          data: props.xAxis,
        },
      ]
      data.option.series = datas
      data.option.xAxis = xAxisData
      console.log(xAxisData)
      // 更新视图
      data.echart = markRaw(echarts.init(refEchart.value as HTMLElement))
      data.echart.setOption(data.option)
    }

    const init = async () => {
      await getList()
    }

    const resizeHandle = () => {
      if (data.echart) {
        data.echart.resize()
      }
    }
    onBeforeMount(() => {
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
