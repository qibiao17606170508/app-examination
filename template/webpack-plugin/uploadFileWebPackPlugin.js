/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2022-06-08 11:18:31
 * @LastEditors: qibiao
 * @LastEditTime: 2023-02-21 16:07:50
 */
/**
 * 上传打包后的文件到服务器上的webpack插件
 */
const { spawn } = require('child_process')
const uploadDir = require('./serverLib').UploadDir

class UploadFileWebPackPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    // 定义在打包后执行这个webpack插件
    // 需要用到对应的钩子函数
    compiler.hooks.done.tap('upload-file-plugin', async (status) => {
      // console.log('this.options: ', this.options);
      this.deploy()
    })
  }

  deploy() {
    const chmod = spawn('chmod', ['-R', '777', this.options.buildFolder])
    chmod.on('exit', (code, signal) => {
      console.log('\n----项目打包Start----\n')
      console.log('\n服务器授权成功,开始自动化部署...\n')
      uploadDir(this.options.serverConfig, this.options.buildFolder, this.options.servePath, (err) => {
        if (err) throw err
        console.log('\n----项目打包End----\n')
        console.log('\n自动化部署成功!\n')
        // 年月日时分秒
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        const timeStr = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${
          hour < 10 ? '0' + hour : hour
        }:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`
        console.log('\n' + timeStr + '\n')
      })
    })
  }
}
module.exports = UploadFileWebPackPlugin
