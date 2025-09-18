# `运行`
<!-- 条件 -->
> node版本需要>16.x
### 下载依赖包
```
yarn install 

npm install
```
### 本地运行`测试环境`
>终端运行以下代码
``` 
npm run dev
```
### 本地运行`正式环境`
>终端运行以下代码
``` 
npm run testApi
```

# `参数配置`
### 环境参数配置文件
- `.env.development`：开发环境配置文件，用于 `npm run dev` 命令
- `.env.production`：生产环境配置文件，用于 `npm run build:prod-upload` 命令
- `.env.testApi`：测试环境配置文件，用于 `npm run testApi` 命令

>参数

- VUE_APP_BASE_API 接口地址
- VUE_APP_WS_URL websocket地址（暂时未用到）
- VUE_APP_PORT  项目端口
- VUE_APP_PROXY 项目是否代理


> 在对应文件中修改相关参数，以适配不同环境需求

# `发布`
>终端运行以下代码会自动打包，把dist文件上传到服务器 
``` 
npm run build:prod
```

<!-- 另外可自定义打包dist -->
### 在package.json中修改参数
```
"build:prod": "vue-cli-service build --mode production",
"build:test": "vue-cli-service build --mode testApi",
.....
```
