import Vue from 'vue'
import Login from './views/Login.vue'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import axios from 'axios'
// import './iview/index.js'
Vue.use(ViewUI)
Vue.config.productionTip = false
Vue.prototype.$curl = axios
new Vue({
  render: (h) => h(Login),
}).$mount('#login')
