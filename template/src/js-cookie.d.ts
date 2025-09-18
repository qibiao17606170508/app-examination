/*
 * @Description:
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-09 10:17:47
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 10:18:01
 */
declare module 'js-cookie' {
  interface CookieAttributes {
    expires?: number | Date
    path?: string
    domain?: string
    secure?: boolean
    [property: string]: any
  }

  interface CookiesStatic {
    get(name: string): string | undefined
    get(): { [key: string]: string }
    set(name: string, value: string | object, options?: CookieAttributes): void
    remove(name: string, options?: CookieAttributes): void
  }

  const Cookies: CookiesStatic
  export default Cookies
}
