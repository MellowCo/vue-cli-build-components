import Button from './src/main'

// 通过 vue.use(Button) 使用组件，按需导入
Button.install = function (Vue) {
  Vue.component(Button.name, Button)
}

export default Button
