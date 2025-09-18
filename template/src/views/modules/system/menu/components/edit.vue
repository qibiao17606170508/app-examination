<template>
  <el-dialog
    width="450px"
    :title="$t('modules/public.edit')"
    v-model="visible"
    :close-on-click-modal="false"
    @closed="dialogClosedHandle"
    append-to-body
    draggable
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="refForm"
      @keyup.enter="submit()"
      label-position="top"
    >
      <el-form-item
        :label="$t('modules/system/menu.chineseName')"
        prop="nameCn"
      >
        <el-input
          v-model="form.nameCn"
          :placeholder="$t('modules/public.pleaseInput')"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="$t('modules/system/menu.icon')"
        prop="icon"
        v-if="row.type == 0 || row.type == 1"
      >
        <IconSelectInput v-model="form.icon" />
      </el-form-item>
      <el-form-item :label="$t('modules/system/menu.sort')" prop="sort">
        <el-input-number
          v-model="form.sort"
          :min="1"
          controls-position="right"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">
          {{ $t('modules/public.cancel') }}
        </el-button>
        <el-button v-repeat type="primary" @click="submit()">
          {{ $t('modules/public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import IconSelectInput from '@/components/icon-select-input/index.vue'
import { updateApi } from '@/api/enterprise-menu'
import { useI18n } from 'vue-i18n'

interface Form {
  id: number | null
  nameCn: string
  nameEn: string
  icon: string
  sort: number | string
}

interface Data {
  visible: boolean
  form: Form
  row: any
}

export default defineComponent({
  components: { IconSelectInput },
  setup() {
    const refForm = ref<any>()
    const { t } = useI18n()
    const data = reactive<Data>({
      visible: false,
      form: {
        id: null,
        nameCn: '',
        nameEn: '',
        icon: '',
        sort: '',
      },
      row: null,
    })

    const rules = reactive({
      nameCn: [
        {
          required: true,
          message: t('modules/system/menu.chineseNameError'),
          trigger: 'blur',
        },
      ],
      nameEn: [
        {
          required: true,
          message: t('modules/system/menu.englishNameError'),
          trigger: 'blur',
        },
      ],
      icon: [
        {
          required: true,
          message: t('modules/system/menu.selectIcon'),
          trigger: 'blur',
        },
      ],
    })

    const init = (row: any) => {
      data.visible = true
      data.row = row
      data.form.id = row.id
      data.form.nameCn = row.nameCn
      data.form.nameEn = row.nameEn
      data.form.icon = row.icon
      data.form.sort = row.sort
    }

    const submit = () => {
      refForm.value.validate((valid: boolean) => {
        if (valid) {
          updateApi(data.form).then((r: any) => {
            if (r) {
              ElMessage({
                message: t('modules/public.operationSucceeded'),
                type: 'success',
              })
              data.row.nameCn = data.form.nameCn
              data.row.nameEn = data.form.nameEn
              data.row.icon = data.form.icon
              data.row.sort = data.form.sort
              data.visible = false
            }
          })
        }
      })
    }

    const dialogClosedHandle = () => {
      refForm.value.resetFields()
    }

    return {
      refForm,
      ...toRefs(data),
      rules,
      init,
      submit,
      dialogClosedHandle,
    }
  },
})
</script>
