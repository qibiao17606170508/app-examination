/*
 * @Description:
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-09 09:46:54
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 10:21:37
 */
declare module 'nprogress' {
  interface NProgress {
    start: () => void
    done: () => void
    set: (n: number) => void
    inc: (amount?: number) => void
    configure: (options: Partial<NProgressOptions>) => void
    status: null | number
  }

  interface NProgressOptions {
    minimum: number
    easing: string
    speed: number
    trickle: boolean
    trickleSpeed: number
    showSpinner: boolean
    barSelector: string
    spinnerSelector: string
    parent: string
    template: string
  }

  const nprogress: NProgress
  export default nprogress
}

declare module 'spark-md5' {
  export default class SparkMD5 {
    static hash(str: string, raw?: boolean): string
    static hashBinary(content: string, raw?: boolean): string
    append(str: string): SparkMD5
    appendBinary(contents: string): SparkMD5
    end(raw?: boolean): string
    reset(): SparkMD5
  }
}
