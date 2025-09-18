/*
 * @Description: 文件
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-06-21 05:29:36
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-16 17:39:02
 */
import axios from 'axios'
import { parseJson2Param, getApiBaseUrl } from '@/utils'
import store from '@/store'
import { QINIU_TOKEN } from '@/utils/constant'
import service from '@/utils/request'
interface UploadParams {
  [key: string]: any
}

/**
 * @description: 上传
 * @param {UploadParams} params
 * @return {string}
 */
export function uploadUrlApi(params: any): Promise<any> {
  return service({
    url: 'common/file/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: params,
  })
}

/**
 * @description: 获取七牛token
 * @return {Promise<any>}
 */
export function getQiniuTokenApi(): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .get(`${QINIU_TOKEN}`, {
        headers: { uid: store.state.menu.administrator.uid },
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
