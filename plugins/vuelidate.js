/* import Vue from 'vue'
import VeeValidate from 'vee-validate'
Vue.use(VeeValidate, {
  // This is the default
  inject: true,
  // Important to name this something other than 'fields'
  fieldsBagName: 'veeFields',
  // This is not required but avoids possible naming conflicts
  errorBagName: 'veeErrors'
}) */

/* import Vue from 'vue'
import es from 'vee-validate/dist/locale/es'
// Importa VeeValidate y el Validator
import VeeValidate, { Validator } from 'vee-validate'
Vue.use(VeeValidate, {
  // This is the default
  inject: true,
  // Important to name this something other than 'fields'
  fieldsBagName: 'veeFields',
  // This is not required but avoids possible naming conflicts
  errorBagName: 'veeErrors'
})
// Indicar uso de idioma español
Validator.localize('es', es) */

import Vue from 'vue'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
