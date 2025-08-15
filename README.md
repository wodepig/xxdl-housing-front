## CI/CD
commit信息中包含: 部署, 会自动更新后端代码
包含 tauri, 会自动打包exe并上传到UpgradeLink

nuxt 项目
node: 20.12.2

有时候node版本不对, 写法也会报错. 

**警告**
不要把sqlite.db放在根目录下, 会报错 ELIFECYCLE  Command failed with exit code 3221225477.和503 服务不可用
参考: https://github.com/nuxt/nuxt/issues/29813

## 参考项目

## 技术栈
nuxt3
nuxt-ui-pro
[nuxt-ui-pro](https://ui.nuxt.com/)
[trpc](https://trpc.io/)
[trpc-nuxt](https://github.com/wobsoriano/trpc-nuxt)
https://trpc.nodejs.cn/
[zod](https://zod.nodejs.cn/v4)
https://zod.nodejs.cn/v4

### drizzle-orm
**配置**

**迁移教程**
使用数据库优先的模式, 以库中数据作为来源, 迁移到代码中
1. 先在数据库中创建表结构
2. 执行pnpm run pull 命令
3. 自动生成./server/db/out的文件
4. 配置中的schema是读取的意思, 所以要把out目录中的schema.ts移动到配置中的路径上去

## 目录结构
/api/trpc/routers: 这里放后端路由, 按模块名新建对应的目录, 比如 /routers/58/account和 /routers/58/house
对应的模块下有三个文件:
* index.ts:
写路由和简单的接口, 比如crud和列表查询, 可以直接调用service和mappers的方法. 不建议直接调用db.xxx, 建议在mappers里面写好, 然后给index调用
* services.ts
写复杂的业务实现, 比如新增用户时需要校验部门是否存在/执行初始化操作, 可直接调用mappers的方法
* mappers.ts
写一下复杂的sql实现, 比如联合查询, 这里不做逻辑处理, 直接调用drizzle的方法

**模块相互调用**
可以在index中调用services或mappers的方法, 从上向下调用, 不要跨层调用, 比如services不建议调用index的方法.
