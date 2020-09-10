import Vue from 'vue'
import drag from '@branu-jp/v-drag'
Vue.use(drag, {
  eventClass: {
    down: "is-pressed",
    move: "is-moving"
  }
});
