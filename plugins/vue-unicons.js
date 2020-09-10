import Vue from 'vue'
import Unicon from 'vue-unicons/dist/vue-unicons-ssr.common.js'
import {
  uniSignoutMonochrome,
  uniUserCircle,
  uniFileExport
} from 'vue-unicons/src/icons'
import 'vue-unicons/dist/vue-unicons-ssr.css'

Unicon.add([uniSignoutMonochrome, uniUserCircle, uniFileExport])
Vue.use(Unicon)
