/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-09 11:28:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-06 10:28:39
 */

interface ListConfig {
  label: string
  label_en: string
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
    label: '学校名称',
    name: 'name',
  },
  {
    label: '所在省份',
    name: 'province_name',
  },
  {
    label: '所在城市',
    name: 'city_name',
  },
  {
    label: '所在地区',
    name: 'area_name',
  },
]
export const listConfig1 = [
  {
    label: '班级名称',
    name: 'name',
  },
  {
    label: '年级',
    name: 'grade_name',
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
