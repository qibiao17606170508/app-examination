/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-09 11:28:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-30 09:23:32
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

export const listConfig: any[] = [
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
    type: 'num',
  },
  {
    label: '难度1正确率',
    name: 'difficulty1_percentage',
    sortable: 'custom',
    button: true,
    buttonValue: 1,
    buttonText: '去练习',
  },
  {
    label: '难度2正确率',
    name: 'difficulty2_percentage',
    sortable: 'custom',
    button: true,
    buttonValue: 2,
    buttonText: '去练习',
  },
  {
    label: '难度3正确率',
    name: 'difficulty3_percentage',
    sortable: 'custom',
    button: true,
    buttonValue: 3,
    buttonText: '去练习',
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
        label: 1,
        value: 1,
        textType: 'difficulty-1',
      },
      {
        label: 2,
        value: 2,
        textType: 'difficulty-2',
      },
      {
        label: 3,
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
        label: '正确',
        value: 1,
        textType: '#000',
      },
      {
        label: '错误',
        value: 2,
        textType: '#EB1616',
      },
    ],
  },
]

export const formConfig: FormConfig[] = []
