import Card from './src/main'

// 通过 vue.use(Card) 使用组件，按需导入
Card.install = function (Vue) {
  Vue.component(Card.name, Card)
}

export default Card
