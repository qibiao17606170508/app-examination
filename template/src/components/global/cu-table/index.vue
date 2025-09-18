<!--
 * @Description: 表格
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-01-31 15:10:30
 * @LastEditors: Jack Qi
 * @LastEditTime: 2025-02-17 11:31:59
-->
<template>
  <div class="filter-table">
    <!-- 表格 -->
    <div class="text-align-left">
      <!-- 正在条件查询的的标签 -->
      <el-tag
        class="margin_r-5 margin_b-5"
        v-for="(tag, index) in tags"
        :key="tag.label"
        size="large"
        @close="tagClose(tag, index)"
        closable
      >
        {{ tag.label + ':' + tag.value }}
      </el-tag>
    </div>
    <!-- v-loading="loading" -->
    <el-table
      ref="tableRef"
      :data="tableData"
      style="width: 100%"
      stripe
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      :height="heightFlag ? tabHeight : maxHeight ? maxHeight : null"
      :cell-style="styleBack"
      :show-header="showHeader"
      @row-click="rowClickFn"
      :header-cell-style="headerCellStyle"
      @sort-change="sortMethod"
    >
      <!-- 是否可以选择 -->
      <!-- <el-table-column type="selection" width="50" align="center" v-if="multiple">
        <template #default="{ row, $index }">
          <div v-if="columnCheckedId == row.id || checkedList[$index]" @click.stop>
            <el-checkbox v-model="checkedList[$index]"></el-checkbox>
          </div>
          <span v-else>{{ $index + 1 }}</span>
        </template>
      </el-table-column> -->
      <template #empty v-if="tableData.length === 0">
        <div class="empty-data">
          <img src="../../../assets/images/empty.png" alt="No Data" />
        </div>
      </template>
      <el-table-column
        :selectable="selectEnable"
        type="selection"
        align="center"
        v-if="multiple"
      />
      <el-table-column
        :label="$t('modules/public.serial')"
        width="60"
        v-if="serial"
      >
        <template #default="{ $index }">
          <span>{{ (page.page - 1) * page.page_size + $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in finallyColumns"
        :key="item.id + item.label + index"
        :label="item.label"
        :fixed="item.fixed ? item.fixed : null"
        :prop="item.name"
        :show-overflow-tooltip="overflow"
        :sortable="item.sortable ? item.sortable : false"
      >
        <!-- :min-width="item.width ? item.width : '180'" -->
        <template #header>
          <el-popover
            v-if="item.searchName"
            placement="bottom"
            :width="'inherit'"
            :visible-arrow="false"
            trigger="click"
            popper-class="select-popover"
          >
            <div class="pop-li pl-5">
              <!-- 条件查询 -->
              <el-date-picker
                v-if="item.searchType && item.searchType.indexOf('date') !== -1"
                v-model="search[item.searchName]"
                :type="item.searchType"
                @change="searchHandler(item)"
                :placeholder="item.placeholder"
                :start-placeholder="item['start-placeholder']"
                :end-placeholder="item['end-placeholder']"
                clearable
                :value-format="item['value-format']"
              ></el-date-picker>
              <el-select
                v-else-if="item.searchType === 'select'"
                v-model="search[item.searchName]"
                :multiple="item.multiple"
                clearable
                filterable
                :remote="item.remote"
                :remote-method="
                  item.remote
                    ? (query) => {
                        remoteMethod(query, item, index)
                      }
                    : null
                "
                :placeholder="item.placeholder"
                @change="searchHandler(item)"
              >
                <el-option
                  v-for="(optionItem, optionIndex) in item.searchOptions"
                  :key="optionIndex"
                  :label="
                    item.searchOptionsName
                      ? optionItem[item.searchOptionsName]
                      : optionItem.label
                  "
                  :value="
                    item.searchOptionsValue
                      ? optionItem[item.searchOptionsValue]
                      : optionItem.value
                  "
                />
              </el-select>
              <div v-else>
                <span
                  class="width-200 margin_r-5"
                  style="display: inline-block"
                >
                  <el-input
                    width="200"
                    :placeholder="item.placeholder"
                    clearable
                    v-model="search[item.searchName]"
                    @clear="searchHandler(item, 'onlyClear')"
                  ></el-input>
                </span>
                <el-button
                  type="text"
                  v-repeat
                  size="medium"
                  @click="searchHandler(item)"
                >
                  搜索
                </el-button>
              </div>
            </div>
            <!-- table表头文字显示-->
            <template #reference>
              <div class="table-cell-label" style="cursor: pointer">
                <span class="table-cell-label-text">
                  {{ item.label }}
                </span>
                <el-icon style="vertical-align: middle"><ArrowDown /></el-icon>
              </div>
            </template>
          </el-popover>
          <span v-else class="table-cell-label">
            <span class="table-cell-label-text">
              {{ currentLanguage == 'en' ? item.label_en : item.label }}
            </span>
          </span>
        </template>
        <template #default="{ row }">
          <!-- 这里准备做判断显示内容 -->
          <span
            v-if="item.options"
            :style="{
              color:
                item.options.filter((filterItem) => {
                  return filterItem.value == row[item.name]
                }).length > 0
                  ? item.options.filter((filterItem) => {
                      return filterItem.value == row[item.name]
                    })[0].textType
                  : '',
            }"
          >
            {{
              item.options.filter((filterItem) => {
                return filterItem.value == row[item.name]
              }).length > 0
                ? item.options.filter((filterItem) => {
                    return filterItem.value == row[item.name]
                  })[0].label
                : '-'
            }}
          </span>
          <span v-else-if="item.switch">
            <el-switch
              v-model="row[item.name]"
              :active-value="item.true"
              :inactive-value="item.false"
              :active-text="item.trueText"
              :inactive-text="item.falseText"
              @change="switchChange(row, item)"
            />
          </span>
          <span
            v-else-if="item.difficulty"
            :class="
              item.difficulty.filter((filterItem) => {
                return filterItem.value == row[item.name]
              }).length > 0
                ? item.difficulty.filter((filterItem) => {
                    return filterItem.value == row[item.name]
                  })[0].textType
                : ''
            "
          >
            {{
              item.difficulty.filter((filterItem) => {
                return filterItem.value == row[item.name]
              }).length > 0
                ? item.difficulty.filter((filterItem) => {
                    return filterItem.value == row[item.name]
                  })[0].label
                : '-'
            }}
          </span>
          <span
            v-else-if="item.optionsColor"
            :style="{
              color:
                item.optionsColor.filter((filterItem) => {
                  return filterItem.value == row[item.colorName]
                }).length > 0
                  ? item.optionsColor.filter((filterItem) => {
                      return filterItem.value == row[item.colorName]
                    })[0].textType
                  : '',
            }"
          >
            {{
              item.typeName
                ? item.typeName
                : row[item.name]
                ? row[item.name]
                : item.titleName
                ? item.titleName
                : item.empty
                ? item.empty
                : '-'
            }}
          </span>
          <!-- 判断是否是图片 -->
          <span v-else-if="item.type === 'image'">
            <el-image
              v-if="row[item.name]"
              :preview-teleported="true"
              :preview-src-list="[
                row[item.name] && row[item.name].indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + row[item.name]
                  : row[item.name],
              ]"
              style="width: 100px; height: 100px"
              :style="{ borderRadius: item.radius ? item.radius : '3px' }"
              :src="
                row[item.name] && row[item.name].indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + row[item.name]
                  : row[item.name]
              "
              :fit="'cover'"
            />

            <span v-else>-</span>
          </span>
          <!-- 判断是否是图片，如果是图片 则显示image的内容 如果不是图片 则显示 type=url的内容 -->
          <span v-else-if="item.type === 'imageOrUrl'">
            <el-image
              v-if="row[item.name] && isImageUrl(row[item.name])"
              :preview-teleported="true"
              :preview-src-list="[
                row[item.name] && row[item.name].indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + row[item.name]
                  : row[item.name],
              ]"
              style="width: 50px; height: 50px"
              :style="{ borderRadius: item.noRadius ? '0%' : '50%' }"
              :src="
                row[item.name] && row[item.name].indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + row[item.name]
                  : row[item.name]
              "
              :fit="'cover'"
            />
            <a
              v-else-if="row[item.name]"
              :href="
                row[item.name] && row[item.name].indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + row[item.name]
                  : row[item.name]
              "
              target="_blank"
            >
              {{ item.typeName ? item.typeName : row[item.urlName] }}
            </a>
            <span v-else>-</span>
          </span>
          <!-- 
              跳转外部链接
              name: 字段名,
              typeName: 显示的文字
          -->
          <span v-else-if="item.type === 'url'">
            <a
              v-if="row[item.name]"
              :href="
                row[item.name] && row[item.name].indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + row[item.name]
                  : row[item.name]
              "
              target="_blank"
            >
              {{ item.typeName ? item.typeName : row[item.urlName] }}
            </a>
            <span v-else>-</span>
          </span>
          <!-- 
              跳转外部链接
              name: 字段名,
              typeName: 显示的文字
          -->
          <span v-else-if="item.type === 'urlOption'">
            <a
              v-if="row[item.name]"
              :href="
                row[item.name] && row[item.name].indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + row[item.name]
                  : row[item.name]
              "
              target="_blank"
            >
              {{ item.typeName ? item.typeName : row[item.urlName] }}
            </a>
            <span v-else>
              {{
                item.urlOptionsData.filter((filterItem) => {
                  return filterItem.value == row[item.optionsName]
                }).length > 0
                  ? item.urlOptionsData.filter((filterItem) => {
                      return filterItem.value == row[item.optionsName]
                    })[0].label
                  : '-'
              }}
            </span>
          </span>
          <!-- 
              点击事件
              typeName: 显示的文字
              默认显示数据name字段
          -->
          <span
            v-else-if="item.type === 'click'"
            @click="tbClick(row)"
            class="defaultColor cursor-pointer"
          >
            {{ item.typeName ? item.typeName : row[item.name] }}
          </span>
          <!-- 
              跳转项目中某个路径
              path: 路径名称 是name 不是 path
              query: 路径参数 ['id','name']
              disabled: 是否禁用跳转
          -->
          <span v-else-if="item.type === 'path'">
            <div v-if="row[item.name]">
              <el-button
                link
                type="primary"
                size="small"
                v-if="!row[item.disabled]"
                @click="goPath(row, item.path, item.query, item.cuQuery)"
              >
                {{ item.typeName ? item.typeName : row[item.name] }}
              </el-button>
              <span v-else>
                {{ item.typeName ? item.typeName : row[item.name] }}
              </span>
              <div>
                <el-button
                  link
                  type="primary"
                  size="small"
                  v-if="item.copy"
                  @click="goCopy(row, item)"
                >
                  复制
                </el-button>
              </div>
            </div>
            <span v-else>-</span>
          </span>
          <span v-else-if="item.type === 'copy'">
            <div v-if="row[item.name]">
              <el-button
                link
                type="primary"
                size="small"
                v-if="!row[item.disabled]"
                @click="goCopy(row, item)"
              >
                {{ item.typeName ? item.typeName : row[item.name] }}
              </el-button>
              <span v-else>
                {{ item.typeName ? item.typeName : row[item.name] }}
              </span>
            </div>
            <span v-else>-</span>
          </span>
          <!-- 
              数组回显
              name: 字段名,
              typeName: 数组中的对象的字段名
              typeNameSuffix: 数组中的对象的字段名 后缀拼接两个字段
          -->
          <span v-else-if="item.type === 'array'">
            <div v-if="row[item.name] && row[item.name].length > 0">
              <div
                v-for="(childItem, childIndex) in row[item.name].slice(
                  0,
                  item.typeIndex ? item.typeIndex : row[item.name].length
                )"
                :key="childIndex"
              >
                {{
                  item.typeName && item.typeNameSuffix
                    ? childItem[item.typeName] +
                      ' ' +
                      childItem[item.typeNameSuffix]
                    : item.typeName && !item.typeNameSuffix
                    ? childItem[item.typeName]
                    : childItem
                }}
              </div>
              <div>
                {{
                  item.typeIndex && row[item.name].length > item.typeIndex
                    ? '...'
                    : ''
                }}
              </div>
            </div>
            <span v-else>-</span>
          </span>
          <!-- 
              图片集合展示
              name: 字段名,
              imgName: 图片是否有字段名,
              imgProp: 数组中的对象的字段名
          -->
          <span v-else-if="item.type === 'imageArray' && row[item.name]">
            <!-- <a :href="item.imgName ? img[item.imgProp] : img" target="_blank"> -->
            <el-image
              :preview-teleported="true"
              v-for="(img, imgIndex) in JSON.parse(row[item.name])"
              :key="imgIndex"
              style="width: 50px; height: 50px"
              :src="
                item.imgName
                  ? img[item.imgProp] &&
                    img[item.imgProp].indexOf('http') === -1
                    ? img[item.imgProp]
                    : img[item.imgProp]
                  : img[item.imgProp] &&
                    img[item.imgProp].indexOf('http') === -1
                  ? img && img.indexOf('http') === -1
                  : img
              "
              :fit="'cover'"
              :preview-src-list="srcList"
              @click="
                vbs(
                  item.imgName
                    ? img[item.imgProp] &&
                      img[item.imgProp].indexOf('http') === -1
                      ? img[item.imgProp]
                      : img[item.imgProp]
                    : img[item.imgProp] &&
                      img[item.imgProp].indexOf('http') === -1
                    ? img && img.indexOf('http') === -1
                    : img
                )
              "
            />
            <!-- </a> -->
          </span>
          <span v-else-if="item.type === 'imageDataArray' && row[item.name]">
            <!-- <a :href="item.imgName ? img[item.imgProp] : img" target="_blank"> -->
            <el-image
              :preview-teleported="true"
              v-for="(img, imgIndex) in row[item.name]"
              :key="imgIndex"
              style="width: 50px; height: 50px"
              :src="
                item.imgName
                  ? img[item.imgProp] &&
                    img[item.imgProp].indexOf('http') === -1
                    ? QINIU_IMAGE_SERVER + img[item.imgProp]
                    : img[item.imgProp]
                  : img && img.indexOf('http') === -1
                  ? QINIU_IMAGE_SERVER + img
                  : img
              "
              :fit="'cover'"
              :preview-src-list="srcList"
              @click="
                vbs(
                  item.imgName
                    ? img[item.imgProp] &&
                      img[item.imgProp].indexOf('http') === -1
                      ? img[item.imgProp]
                      : img[item.imgProp]
                    : img[item.imgProp] &&
                      img[item.imgProp].indexOf('http') === -1
                    ? img && img.indexOf('http') === -1
                    : img
                )
              "
            />
            <!-- </a> -->
          </span>
          <!-- 时间 -->
          <span v-else-if="item.type === 'date*1000' && row[item.name]">
            {{ row[item.name] ? parseDate2Str(row[item.name] * 1000) : '-' }}
          </span>
          <span v-else-if="item.type === 'dateTime' && row[item.name]">
            {{ row[item.name] ? parseDate2Str(row[item.name]) : '-' }}
          </span>
          <!-- 默认展示 -->
          <span v-else-if="item.type === 'num'">
            {{ row[item.name] ? row[item.name] : 0 }}
          </span>
          <span v-else-if="item.type === 'numFixed'">
            {{
              row[item.name] ? parseFloat(row[item.name]).toFixed(2) : '0.00'
            }}
          </span>
          <span v-else-if="item.type === 'numFixed4'">
            {{
              row[item.name] ? parseFloat(row[item.name]).toFixed(4) : '0.0000'
            }}
          </span>
          <span v-else-if="item.type === 'numFixedPrice'">
            ￥{{
              row[item.name] ? parseFloat(row[item.name]).toFixed(2) : '0.00'
            }}
          </span>
          <span v-else-if="item.type === 'numFixedPriceUSA'">
            ${{
              row[item.name] ? parseFloat(row[item.name]).toFixed(2) : '0.00'
            }}
          </span>
          <!-- 只判断某个字段是否有固定某个值 有的话展示默认名称 -->
          <span v-else-if="item.type === 'defaultShow'">
            {{
              row[item.name] == item.defaultValue
                ? item.defaultName
                : row[item.name]
            }}
          </span>
          <span v-else-if="item.type === 'color'">
            <span class="color-text">
              {{ item.typeName ? item.typeName : row[item.name] }}
            </span>
          </span>
          <span style="white-space: pre-wrap" :class="[item.color]" v-else>
            <span
              v-html="
                item.typeName
                  ? item.typeName
                  : row[item.name]
                  ? row[item.name]
                  : item.titleName
                  ? item.titleName
                  : item.empty
                  ? item.empty
                  : '-'
              "
            ></span>
            <el-button
              type="primary"
              v-if="item.button"
              size="small"
              link
              @click="buttonChangle(row, item.buttonValue)"
            >
              {{ item.buttonText }}
            </el-button>
          </span>
        </template>
      </el-table-column>
      <!-- 放入操作插槽 -->
      <!-- fixed="right" -->
      <el-table-column
        v-if="operations"
        align="left"
        :fixed="fixed"
        :label="$t('modules/public.operation')"
        :min-width="rightWidth ? rightWidth : 'auto'"
      >
        <!-- :min-width="rightWidth ? rightWidth : '130'" -->
        <template #default="scope">
          <slot name="operations" :row="scope.row" :index="scope.$index"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  toRefs,
  onMounted,
  nextTick,
  watch,
  ref,
} from 'vue'
import { LocationQueryRaw, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { QINIU_IMAGE_SERVER } from '@/utils/constant'
import { parseDate2Str } from '@/utils'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
interface TableData {
  page: { page_size: number; page: number }
  columnCheckedId: string
  multipleSelection: any[]
  checkedList: boolean[]
  toDetailsQuery: Record<string, any>
  search: Record<string, any>
  tags: { label: string; keyName: string; value: string }[]
  srcList: string[]
  tabHeight: number | null
  heightFlag: boolean
  showHeader: boolean
  overflow: boolean
  fixed: boolean | string
  selectedItems: any[]
}

export default defineComponent({
  props: {
    showHeader: { type: Boolean, default: true },
    tableData: { type: Array, default: () => [] },
    finallyColumns: { type: Array, default: () => [] },
    multiple: { type: Boolean, default: false },
    detailsPath: { type: String, default: '' },
    maxHeight: { type: String, default: '' },
    defaultPageImgUrl: { type: String, default: '' },
    defaultPageTips: { type: String, default: '' },
    page: { type: Object, default: () => ({ page_size: 50, page: 1 }) },
    selectionName: { type: String, default: '' },
    selectionValue: { type: Array, default: () => [] },
    rightWidth: { type: String, default: '' },
    operations: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    serial: { type: Boolean, default: true },
    heightFlag: { type: Boolean, default: true },
    isDelName: { type: String, default: '' },
    isDelVal: { type: Number, default: 0 },
    rowClick: { type: Boolean, default: false },
    rowClickPath: { type: String, default: '' },
    rowClickQuery: { type: Array, default: () => [] },
    overflow: { type: Boolean, default: false },
    selectListData: { type: Array, default: () => [] },
    listId: { type: String, default: '' },
    selectId: { type: String, default: '' },
    fixed: { type: [Boolean, String], default: false },
  },
  emits: [
    'selectList',
    'rowClick',
    'search',
    'tbClick',
    'sortChange',
    'switchChange',
    'buttonChangle',
  ],

  setup(props, { emit }) {
    const headerCellStyle = {
      backgroundColor: '#f7f7f7', // 设置背景颜色
      color: 'rgba(0, 0, 0, 0.6)', // 设置文字颜色
    }
    const router = useRouter()
    const i18n = useI18n()
    const currentLanguage = computed(() => i18n.locale.value)
    const store = useStore()
    const data = reactive<TableData>({
      page: { page_size: props.page.page_size, page: props.page.page },
      columnCheckedId: '',
      multipleSelection: [],
      checkedList: [],
      toDetailsQuery: {} as Record<string, any>,
      search: {},
      tags: [],
      srcList: [],
      tabHeight: null as any,
      heightFlag: props.heightFlag,
      showHeader: props.showHeader,
      overflow: props.overflow,
      fixed: props.fixed,
      selectedItems: [],
    })
    const tableData = computed(() => props.tableData)
    const finallyColumns = computed(() => props.finallyColumns)
    const tableRef = ref()

    finallyColumns.value.forEach((item: any) => {
      if (item.searchName) {
        data.search[item.searchName] = ''
      }
    })

    watch(
      () => props.tableData,
      (newVal) => {
        nextTick(() => {
          if (props.selectListData.length > 0) {
            props.selectListData.forEach((row: any) => {
              newVal.forEach((item: any) => {
                if (props.listId && props.selectId) {
                  if (row[props.selectId] === item[props.listId]) {
                    tableRef.value?.toggleRowSelection(item, true)
                  }
                }
              })
            })
          }
        })
      },
      { deep: true }
    )
    watch(
      () => props.selectListData,
      (newVal) => {
        // 如果没有数据 则取消勾选
        if (newVal.length == 0) {
          props.tableData.forEach((item: any) => {
            tableRef.value?.toggleRowSelection(item, false)
          })
        }
      }
    )

    const handleSelectionChange = (list: any, item: any) => {
      let val = [] as any
      if (list.includes(item)) {
        // 勾选操作
        data.selectedItems.push(item)
      } else {
        // 移除未选中的项
        data.selectedItems = data.selectedItems.filter(
          (items: any) => items[props.selectId] !== item[props.selectId]
        )
      }
      // 更新当前页的选中项
      data.multipleSelection = val

      emit('selectList', data.selectedItems)
    }
    const handleSelectAll = (list: any) => {
      if (list.length > 0) {
        // 全选的数据 把数据添加到selectedItems 去重
        data.selectedItems = [...new Set([...data.selectedItems, ...list])]
      } else {
        // 取消全选 把selectedItems 里 存在的tableData的数据从selectedItems移除
        data.selectedItems = data.selectedItems.filter((item: any) => {
          // 筛选出不存在tableData的数据
          return !tableData.value.some(
            (tableItem: any) =>
              tableItem[props.selectId] === item[props.selectId]
          )
        })
      }
      emit('selectList', data.selectedItems)
    }
    const searchHandler = (row: any, clickType?: string) => {
      let labelArr =
        row.searchOptions?.filter((item: any) => {
          return row.searchOptionsValue
            ? item[row.searchOptionsValue] == data.search[row.searchName]
            : item.value == data.search[row.searchName]
        }) || []

      const obj = {
        label: row.label,
        keyName: row.searchName,
        value: row.searchOptions
          ? row.searchOptionsName
            ? labelArr.length > 0
              ? labelArr[0][row.searchOptionsName]
              : ''
            : labelArr.length > 0
            ? labelArr[0].label
            : ''
          : data.search[row.searchName],
      }

      const index = data.tags.findIndex((val) => val.label === obj.label)
      if (clickType !== 'onlyClear') {
        if (index !== -1) {
          if (!obj.value) {
            data.tags.splice(index, 1)
          } else {
            data.tags.splice(index, 1, obj)
          }
        } else {
          data.tags.push(obj)
        }
        emit('search', data.search)
      }
    }

    const remoteMethod = (query: string, row: any, index: number) => {
      row.remoteMethod(query, row, index)
    }

    const tagClose = (tag: any, index: number) => {
      data.tags.splice(index, 1)
      delete data.search[tag.keyName]
      emit('search', data.search)
    }

    const vbs = (val: string) => {
      data.srcList = [val]
    }

    const goPath = (
      item: any,
      path: string,
      query: string[],
      cuQuery?: Record<string, any>
    ) => {
      if (item.disabled) return
      const obj = query.reduce((acc, val) => {
        acc[val] = item[val]
        return acc
      }, {} as Record<string, any>)
      if (cuQuery) Object.assign(obj, cuQuery)
      router.push({ name: path, query: obj })
    }

    const goCopy = (row: any, item: any) => {
      navigator.clipboard
        .writeText(row[item.copyName])
        .then(() => {
          ElMessage.success('复制成功!')
        })
        .catch(console.error)
    }

    const selectEnable = (row: any) => {
      return props.selectionName && props.selectionValue
        ? !props.selectionValue.includes(row[props.selectionName])
        : true
    }

    const styleBack = (row: any) => {
      return props.isDelName && row.row[props.isDelName] == props.isDelVal
        ? { backgroundColor: '#f0f0f0', color: 'red' }
        : {}
    }

    const rowClickFn = (row: any) => {
      if (props.rowClick) {
        if (props.rowClickPath) {
          const toDetailsQuery = props.rowClickQuery.reduce(
            (acc: any, val: any) => {
              acc[val] = row[val]
              return acc
            },
            {} as Record<string, any>
          )
          router.push({
            name: props.rowClickPath,
            query: toDetailsQuery as LocationQueryRaw,
          })
        } else {
          emit('rowClick', row)
        }
      }
    }

    const tbClick = (row: any) => {
      emit('tbClick', row)
    }

    onMounted(() => {
      nextTick(() => {
        const contentContainer = document.querySelector(
          '.content-container'
        ) as HTMLElement
        if (store.state.settings.contanierMode === 2) {
          data.tabHeight = contentContainer?.offsetHeight
            ? contentContainer.offsetHeight - 30
            : null
        }
        const cuBox = document.querySelector('.cu-box') as HTMLElement
        if (cuBox) {
          data.tabHeight = cuBox.offsetHeight
            ? data.tabHeight
              ? data.tabHeight - cuBox.offsetHeight
              : data.tabHeight
            : null
        }
      })
    })

    const isImageUrl = (url: string) =>
      /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url)
    const sortMethod = (a: any, b: any, c: any) => {
      emit(
        'sortChange',
        {
          sort: true,
          prop: a.prop,
          order: a.order == 'ascending' ? 'asc' : 'desc',
        },
        true
      )
    }
    const switchChange = (row: any, item: any) => {
      emit('switchChange', row, item)
    }
    const buttonChangle = (row: any, item: any) => {
      emit('buttonChangle', row, item)
    }
    return {
      ...toRefs(data),
      checkValue: (val: any) =>
        typeof val === 'object' && !Array.isArray(val) && val !== null,
      goPath,
      handleSelectionChange,
      tableData,
      finallyColumns,
      searchHandler,
      tagClose,
      remoteMethod,
      vbs,
      currentLanguage,
      QINIU_IMAGE_SERVER,
      parseDate2Str,
      selectEnable,
      styleBack,
      rowClickFn,
      tableRef,
      tbClick,
      goCopy,
      isImageUrl,
      headerCellStyle,
      sortMethod,
      switchChange,
      handleSelectAll,
      buttonChangle,
    }
  },
})
</script>
<style scoped lang="scss">
:deep(.el-popper) {
  max-width: 800px !important;
}
.empty-data {
  width: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
  }
}
.color-text {
  color: var(--el-color-primary);
  font-weight: 500;
}
</style>
