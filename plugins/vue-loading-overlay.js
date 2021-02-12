import Vue from 'vue'
// Import component
import Loading from 'vue-loading-overlay'
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css'
// Init plugin
Vue.use(Loading, {
  // props
  loader: 'dots',
  color: '#9e0101'
})
