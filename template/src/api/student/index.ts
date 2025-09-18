/*
 * @Description: 首页数据
 * @Author: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2020-12-28 16:25:18
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-29 13:22:20
 */
import service from '@/utils/request'

/**
 * @description: 获取试卷 student/RegisterTopic/getPapers
 * @return {Promise<any>}
 * @author: qibiao
 */
export function getPracticeList(data: any): Promise<any> {
  return service({
    url: 'student/RegisterTopic/getPapers',
    method: 'POST',
    data,
  })
}
/**
 * @description: 获取题目 student/RegisterTopic/getTopics
 * @return {*}
 * @author: Jack Qi
 */
export function getPracticeTopics(data: any): Promise<any> {
  return service({
    url: 'student/RegisterTopic/getTopics',
    method: 'POST',
    data,
  })
}
/**
 * @description: 登记错题 student/RegisterTopic/setTopics
 * @return {*}
 * @author: Jack Qi
 */
export function setPracticeTopics(data: any): Promise<any> {
  return service({
    url: 'student/RegisterTopic/setTopics',
    method: 'POST',
    data,
  })
}
/**
 * @description: 错题分析查询 student/Analyze/getAnalyze
 * @return {*}
 * @author: Jack Qi
 */
export function getPracticeAnalyze(data: any): Promise<any> {
  return service({
    url: 'student/Analyze/getAnalyze',
    method: 'POST',
    data,
  })
}
/**
 * @description: 错题分析 student/Analyze/setAnalyze
 * @return {*}
 * @author: Jack Qi
 */
export function setPracticeAnalyze(data: any): Promise<any> {
  return service({
    url: 'student/Analyze/setAnalyze',
    method: 'POST',
    data,
  })
}
/**
 * @description: 练习历史 student/PracticeLog/list
 * @return {*}
 * @author: Jack Qi
 */
export function getPracticeLog(data: any): Promise<any> {
  return service({
    url: 'student/PracticeLog/list',
    method: 'POST',
    data,
  })
}
/**
 * @description: 习题查询 student/PracticeStatistics/list
 * @return {*}
 * @author: Jack Qi
 */
export function getPracticeStatistics(data: any): Promise<any> {
  return service({
    url: 'student/PracticeStatistics/list',
    method: 'POST',
    data,
  })
}
/**
 * @description: 随机获取练习题 student/Practice/list
 * @return {*}
 * @author: Jack Qi
 */
export function getPracticeListRandom(data: any): Promise<any> {
  return service({
    url: 'student/Practice/list',
    method: 'POST',
    data,
  })
}
/**
 * @description: 习题提交 student/Practice/add
 * @return {*}
 * @author: Jack Qi
 */
export function setPracticeAdd(data: any): Promise<any> {
  return service({
    url: 'student/Practice/add',
    method: 'POST',
    data,
  })
}
