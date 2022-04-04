# vue-cli-build-components

>  使用`vue-cli`打包组件库，发布`npm`

## 创建项目

```shell
vue create vue-cli-build-components
```



---

## 目录调整

**参考element的目录结构，按实际情况调整**

> 　将`src`目录更名为`examples`，用于测试组件。

<img src="https://mellow-notebook-img.oss-cn-shanghai.aliyuncs.com/2022/202204041229780.png" alt="image-20220404122932692" style="zoom: 67%;" />

> 将`vue-cli`默认启动入口设置为`examples`,修改`vue.config.js`

[配置参考 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/config/#pages)

```js
module.exports = {
  pages: {
    index: {
      // 
      entry: 'examples/main.js',
    },
  }
}
```



---

> 新建`packages`目录，存放自定义组件

组件目录可按照如下

![image-20220404130156738](https://mellow-notebook-img.oss-cn-shanghai.aliyuncs.com/2022/202204041301757.png)

* mian.vue，组件代码逻辑

```vue
<template>
  <button class="l-button">这是一个按钮</button>
</template>
<script>
export default {
  name: 'LButton'
}
</script>

<style lang="less" scoped>
.l-button {
  padding: 15px;
  background-color: cadetblue;
  color: #fff;
}
</style>
```

* index.js，用于导出组件

```js
import Button from './src/main'

// 通过 vue.use(Button) 使用组件，按需导入
Button.install = function (Vue) {
  Vue.component(Button.name, Button);
};

export default Button
```



---

## 统一导出

> 在`packages`下创建`index.js`统一导出所有组件

<img src="https://mellow-notebook-img.oss-cn-shanghai.aliyuncs.com/2022/202204041412531.png" alt="image-20220404141253501" style="zoom:67%;" />

> 使用 [require.context](https://webpack.js.org/guides/dependency-management/#requirecontext) 自动导出所有组件

index.js

```js
const componentsContext = require.context('./', true, /\.js$/)
const components = {}

const formatContext = function () {
  // components.keys() => ['./button/index.js', './card/index.js', './index.js']
  componentsContext.keys().forEach(key => {
    // 为当前目录 不处理
    if (key === './index.js') { return }
    // 获取导入的组件module
    const component = componentsContext(key).default
    const { name } = component
    // components => { LButton: xxx, ... }
    components[name] = component
  })
}

const install = function (Vue) {
  for (const name in components) {
  // 将组件绑定到Vue上
    Vue.component(name, components[name])
  }
}

formatContext()

export default {
  install,
  ...components
}
```



---

> 在`examples`下测试统一导出

<img src="https://mellow-notebook-img.oss-cn-shanghai.aliyuncs.com/2022/202204041412083.png" alt="image-20220404141236054" style="zoom:67%;" />

main.js

```js
import Vue from 'vue'
import App from './App.vue'
import MyUI from '../packages'

Vue.use(MyUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
```



App.vue

```vue
	<template>
  <div id="app">
    <LHeader />
    <LButton />
    <LCard />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
#app {
  margin-top: 60px;
  text-align: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
```

> 通过`yarn serve`,启动服务，出现组件，说明导出成功

<img src="https://mellow-notebook-img.oss-cn-shanghai.aliyuncs.com/2022/202204041414194.png" alt="image-20220404141428136" style="zoom:50%;" />



---

## umd common打包

> 生成`umd`和`common`可直接使用`vue-cli`的命令进行打包

[构建目标 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/build-targets.html#应用)

> 在`package.json`中，新建一条`scripts`

```json
"build:lib": "vue-cli-service build --target lib --name index packages/index.js --dest lib"
```

* `--target`: 打包模式
* `--name`: 打包的js文件名称
* `[entry]  packages/index.js `: 打包的文件入口
* `--dest`: 打包的文件夹名称



​	<img src="https://mellow-notebook-img.oss-cn-shanghai.aliyuncs.com/2022/202204041433701.png" alt="image-20220404143310673" style="zoom: 67%;" />



> 修改`package.json`

* 通过`files`设置需要发布到`npm`的文件

* 通过`main`设置入口文件，选择`common`

```json
"files": [
    "packages",
    "lib"
  ],
  "main": "lib/meoc-ui.common.js",
```



## 发布

> 可以使用[bumpp](https://www.npmjs.com/package/bumpp)发布

```shell
yarn add  bumpp -D
```

在`package.json`中，添加发布的`release`,按实际需求更改

```json
"release": "bumpp --commit --push --tag && npm publish"
```

> 使用`yarn release`，就可以完成`version`自动修改与发布

![image-20220404145822239](https://mellow-notebook-img.oss-cn-shanghai.aliyuncs.com/2022/202204041458275.png)



---

## 测试

> 新建一个`vue`项目

### 完整导入

> 导入发布的组件库

main.js

```js
import Vue from 'vue'
import App from './App.vue'
import MyUI from 'vue-cli-build-components'
import 'vue-cli-build-components/lib/meoc-ui.css'

Vue.use(MyUI)

Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount('#app')
```

App.vue

```vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <LButton />
    <LHeader />
    <LCard />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
```

> 测试成功

![image-20220404151227527](https://mellow-notebook-img.oss-cn-shanghai.aliyuncs.com/2022/202204041512612.png)

