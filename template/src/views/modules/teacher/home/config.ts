/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-09 11:28:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-25 09:45:22
 */

interface ListConfig {
  label: string
  name: string
  width: string
}

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
    label: '学号',
    name: 'student_number',
  },
  {
    label: '姓名',
    name: 'nickname',
    type: 'click',
  },

  {
    label: '性别',
    name: 'sex',
    options: [
      {
        label: '未知',
        value: 0,
      },
      {
        label: '男',
        value: 1,
      },
      {
        label: '女',
        value: 2,
      },
    ],
  },
  {
    label: '累计练习次数',
    name: 'practice_num',
  },
  {
    label: '问题知识点TOP3',
    name: 'knowledge_name',
  },
]
export const listDialog1: any[] = [
  {
    label: '知识点大类',
    name: 'level1_name',
  },
  {
    label: '知识点二类',
    name: 'level2_name',
  },
  {
    label: '知识点',
    name: 'name',
  },
  {
    label: '累计练习次数',
    name: 'practice_total_num',
    sortable: 'custom',
  },
  {
    label: '有问题学生数量',
    name: 'problem_student_num',
    sortable: 'custom',
  },
]
export const listDialogConfig: any[] = [
  {
    label: '时间',
    name: 'time',
  },
  {
    label: '题目',
    name: 'title_content',
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
  {
    label: '答题情况',
    name: 'is_correct',
    options: [
      {
        label: '未知',
        value: 0,
      },
      {
        label: '正确',
        value: 1,
      },
      {
        label: '错误',
        value: 2,
      },
    ],
  },
]

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
