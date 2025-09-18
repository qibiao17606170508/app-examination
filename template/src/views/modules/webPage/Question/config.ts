/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-09 11:28:10
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-11-11 14:31:47
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
  {
    label: '上传老师',
    name: 'teacher_nickname',
  },
  {
    label: '公开状态',
    name: 'is_public',
    switch: true,
    true: 1,
    false: 0,
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

export const formConfig = [
  {
    searchType: 'input',
    searchName: 'keyword',
    label: '关键字',
    placeholder: '请输入关键字',
  },
  {
    searchType: 'select',
    searchName: 'difficulty',
    label: '难度',
    selectOptions: [
      {
        label: '1',
        value: 1,
      },
      {
        label: '2',
        value: 2,
      },
      {
        label: '3',
        value: 3,
      },
    ],
  },
]
