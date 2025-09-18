/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-09 11:28:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-30 14:20:17
 */

interface SelectOption {
  label: string
  value: string | number
}

interface FormConfig {
  searchType: string
  searchName: string
  label: string
  placeholder: string
  selectOptions?: SelectOption[]
  remote?: boolean
  remoteMethod?: (query: string, row: any, index: number) => void
  picker?: string
  'start-placeholder'?: string
  'end-placeholder'?: string
}

export const listConfig = [
  {
    label: '名称',
    name: 'name',
  },
  {
    label: '时间',
    name: 'time',
    sortable: 'custom',
  },
]
export const listConfigDetails = [
  {
    label: '题目编号',
    name: 'number',
  },
  {
    label: '题目内容',
    name: 'title_content',
  },
  {
    label: '图片',
    name: 'image',
    type: 'image',
  },
  {
    label: '答案',
    name: 'answer',
  },
  {
    label: '解析',
    name: 'analysis',
  },
  {
    label: '知识点',
    name: 'knowledge_name',
  },
  {
    label: '难度',
    name: 'difficulty',
    difficulty: [
      {
        label: '1',
        value: 1,
        textType: 'difficulty-1',
      },
      {
        label: '2',
        value: 2,
        textType: 'difficulty-2',
      },
      {
        label: '3',
        value: 3,
        textType: 'difficulty-3',
      },
    ],
  },

  // 题目类型 1：选择题 2：填空题 3：应用题
  {
    label: '题目类型',
    name: 'type',
    options: [
      {
        label: '选择题',
        value: 1,
      },
      {
        label: '填空题',
        value: 2,
      },
      {
        label: '应用题',
        value: 3,
      },
      {
        label: '判断题',
        value: 4,
      },
    ],
  },
]
export const listDialogConfig: any[] = []

export const formConfig: FormConfig[] = [
  {
    searchType: 'input',
    searchName: 'keywords',
    label: '关键字',
    placeholder: '请输入关键字111',
  },
  {
    searchType: 'select',
    searchName: 'status',
    label: '状态',
    placeholder: '请输入2222',
    selectOptions: [
      {
        label: '全部',
        value: '',
      },
      {
        label: '启用',
        value: 1,
      },
      {
        label: '禁用',
        value: 0,
      },
    ],
  },
  {
    searchType: 'date',
    searchName: 'dateTime',
    picker: 'monthrange',
    label: '时间',
    placeholder: '请输入3333',
    'start-placeholder': '开始时间',
    'end-placeholder': '结束时间',
  },
  {
    searchType: 'select',
    searchName: 'status',
    label: '搜索的',
    placeholder: '可搜索的',
    selectOptions: [],
    remote: true,
    remoteMethod: (query, row, index) => {
      console.log(query)
    },
  },
]
