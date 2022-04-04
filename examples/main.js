import Vue from 'vue'
import App from './App.vue'
import MyUI from '../packages'

Vue.use(MyUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
