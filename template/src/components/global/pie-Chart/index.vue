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

interface Props {
  modelValue: string | Array<any>
  seriesName: string
  dataName: string | Array<string>
}

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array] as unknown as () => string | Array<any>,
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
  setup(props: Props) {
    const refEchart = ref<HTMLElement | null>(null)
    const value = useModel(props)
    const data = reactive({
      echart: null as echarts.ECharts | null,
      option: {
        title: {
          text: props.seriesName,
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            name: props.seriesName,
            type: 'pie',
            radius: '50%',
            data: [] as Array<{ name: string; value: any }>,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
    })

    const getList = async () => {
      const datas = (value.value as Array<any>).map((item, index) => {
        return {
          name: (props.dataName as Array<string>)[index],
          value: item,
        }
      })
      data.option.series[0].data = datas
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
