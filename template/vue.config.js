const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const fs = require('fs')
const serviceConfig = {}
const serviceConfigArr = []
function resolve(dir) {
  return path.join(__dirname, dir)
}
/**
 * 自动化部署代码引入  start
 */
// 引入自己写的webpack插件
const UploadFileWebPackPlugin = require('./webpack-plugin/uploadFileWebPackPlugin')
// 获取运行命令的参数
const deployArgv = process.argv.pop()
// 通过参数判断是否要执行上传插件
let isNeedUpload = false
let uploadServerConfig = {}

if (deployArgv === '-upload') {
  isNeedUpload = true
  uploadServerConfig = {
    host: serviceConfigArr[0], //测试服务器地址
    port: serviceConfigArr[1], //端口
    username: serviceConfigArr[2], //账号
    password: serviceConfigArr[3], //密码
  }
}
/**
 * 自动化部署代码引入  end
 */
const webpackConfig = defineConfig({
  // 部署应用时的基本路径.
  publicPath: './',
  // build时构建文件的目录,构建时传入 --no-clean 可关闭该行为.
  outputDir: 'dist',
  // build时放置生成的静态资源(js、css、img、fonts)的(相对于 outputDir 的)目录.
  assetsDir: 'static',
  // 指定生成的index.html的输出路径(相对于 outputDir ),也可以是一个绝对路径.
  indexPath: 'index.html',
  // 默认在生成的静态资源文件名中包含hash以控制缓存.
  filenameHashing: true,
  // 是否在开发环境下通过eslint-loader在每次保存时lint代码(在生产构建时禁用 eslint-loader).
  lintOnSave: process.env.NODE_ENV === 'false',
  // 是否使用包含运行时编译器的Vue构建版本.
  runtimeCompiler: false,
  // Babel显式转译列表.
  transpileDependencies: true,
  // 如果你不需要生产环境的source map,可以将其设置为 false 以加速生产环境构建.
  productionSourceMap: false,
  // productionSourceMap: process.env.NODE_ENV !== 'production',
  // 设置类型是Sring，设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性(仅影响构建时注入的标签).
  // crossorigin: '',
  // 在生成的HTML中的<link rel="stylesheet">和<script>标签上启用Subresource Integrity(SRI).
  integrity: false,
  // 所有webpack-dev-server的选项都支持.
  devServer: {
    // 是否自动打开浏览器.
    open: false,
    // 局域网和本地访问.
    host: '0.0.0.0',
    // 端口.
    port: process.env.VUE_APP_PORT || 9585,
    client: {
      webSocketURL: `ws://0.0.0.0:${process.env.VUE_APP_PORT || 9585}/ws`,
    },
    // 代理.
    proxy:
      process.env.NODE_ENV.VUE_APP_PROXY === 'false'
        ? null
        : {
            '/proxy': {
              // 目标代理服务器地址.
              target: process.env.VUE_APP_BASE_API,
              // 是否允许跨域.
              changeOrigin: true,
              secure: true,
              pathRewrite: {
                '^/proxy': '/',
              },
            },
            '/scriptApi': {
              // 目标代理服务器地址.
              target: process.env.VUE_APP_BASE_API_SCRIPT,
              // 是否允许跨域.
              changeOrigin: true,
              secure: true,
              pathRewrite: {
                '^/scriptApi': '/',
              },
            },
          },
  },
  configureWebpack: {
    plugins: [
      // 按需引入Element-plus
      AutoImport({
        resolvers: [ElementPlusResolver({ importStyle: false })],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      fallback: { path: require.resolve('path-browserify') },
    },
  },
  /*
   * 如果你需要基于环境有条件地配置行为,或者想要直接修改配置,那就换成一个函数(该函数会在环境变量被设置之后懒执行).
   * 该方法的第一个参数会收到已经解析好的配置.
   * 在函数内,你可以直接修改配置,或者返回一个将会被合并的对象.
   */

  // 对内部的webpack配置(比如修改、增加Loader选项)(链式操作).
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src'))
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons')) // 存放 svg 目录的目录
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons')) // 存放 svg 目录的目录
      .end()
      .use('svg-sprite-loader')
      .tap((options) => ({
        ...options,
        plugins: [{ removeAttrs: { attrs: 'fill' } }],
      }))
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
    config.optimization.splitChunks({
      // 优化块：all-所有 async-异步 initial-同步
      chunks: 'all',
      // 按需加载时的最大并行请求数。
      maxAsyncRequests: 30,
      // 入口点的最大并行请求数。
      maxInitialRequests: 30,
      // 在拆分之前，模块必须在块之间共享的最少次数。
      minChunks: 1,
      // 在为按 maxSize 分割的部分创建名称时防止暴露路径信息。
      hidePathInfo: true,
      // 要生成的块的最小大小（以字节为单位）。
      minSize: 30000,
      // maxSize: 50000,
      // name: true,
      cacheGroups: {
        apis: {
          // 当它是初始块时才允许覆盖文件名
          name: 'chunk-apis',
          // 控制此缓存组选择哪些模块
          test: resolve('src/apis'),
          // 在拆分之前，模块必须在块之间共享的最少次数。
          minChunks: 1,
          // 优先级
          priority: 10,
          // 如果当前块包含已经从主包中分离出来的模块，它将被重用，而不是生成一个新的。
          reuseExistingChunk: true,
        },
        components: {
          name: 'chunk-components',
          test: resolve('src/components'),
          minChunks: 1,
          priority: 10,
          reuseExistingChunk: true,
        },
        quill: {
          name: 'chunk-quill',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?quill(.*)/,
        },
        elementPlus: {
          name: 'chunk-elementPlus',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?element-plus(.*)/,
        },
        elementIcon: {
          name: 'chunk-elementIcon',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?@element-plus(.*)/,
        },
        echarts: {
          name: 'chunk-echarts',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?echarts(.*)/,
        },
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 5,
          chunks: 'initial',
        },
      },
    })
    // 页面太多会导致很多无意义的请求
    config.plugins.delete('prefetch')
  },
  // css相关配置.
  css: {
    // css文件名是否可省略module,默认为false.
    // requireModuleExtension: false,
    // 是否使用css分离插件 默认生产环境下是true, 开发环境下是false.
    extract: false,
    // 是否为CSS开启source map.设置为true之后可能会影响构建的性能.
    sourceMap: false,
    // 向CSS相关的loader传递选项(支持:css-loader postcss-loader sass-loader less-loader stylus-loader).
    /* loaderOptions: {
      sass: {
        // 引入全局scss全局样式
        prependData: `@import '~@/assets/sass/element.scss';`
      }
    } */
  },
})
if (process.env.NODE_ENV === 'production' && isNeedUpload) {
  webpackConfig.configureWebpack.plugins.push(
    new UploadFileWebPackPlugin({
      // 服务器的配置信息
      serverConfig: uploadServerConfig,
      // 本地打包输出的文件夹路径
      buildFolder: 'dist/',
      // 上传到服务器上的路径
      servePath: '/www/wwwroot/sj.chinzee.cn',
    })
  )
} else if (process.env.NODE_ENV === 'testApi' && isNeedUpload) {
  webpackConfig.configureWebpack.plugins.push(
    new UploadFileWebPackPlugin({
      // 服务器的配置信息
      serverConfig: uploadServerConfig,
      // 本地打包输出的文件夹路径
      buildFolder: 'dist/',
      // 测试环境
      servePath: '/www/wwwroot/sj.chinzee.cn',
    })
  )
}
module.exports = webpackConfig
