<template>
  <!-- Info modal -->
  <b-modal
    ref="modal-dependence"
    :id="form.modal"
    no-close-on-esc
    no-close-on-backdrop
    hide-footer>
    <template v-slot:modal-title>
      <i
        v-if="!viewOnlly && event"
        class="fas fa-plus-circle"/>
      <i
        v-else-if="!viewOnlly && !event"
        class="fas fa-edit"/>
      <i
        v-else
        class="fas fa-eye"/>
      {{ tittleModal }}
    </template>
    <b-form
      v-if="show"
      @submit="sendData">
      <b-form-group
        id="groupstate"
        label="Tipo:"
        label-for="type">
        <b-form-select
          id="type"
          :disabled="(viewOnlly)||(!persons) ? true : false"
          v-model="form.type"
          :class="{'is-invalid': $v.form.type.$error}"
          :options="types"
          @change="changeType"/>
        <template v-if="$v.form.type.$error">
          <div class="invalid-feedback" v-if="!$v.form.type.required">
            Seleccione el Tipo
          </div>
        </template>
      </b-form-group>
      <b-form-group
        id="groupstate"
        label="Tipo de identificación:"
        label-for="type_identification_id">
        <b-form-select
          id="type_identification_id"
          :disabled="viewOnlly ? true : false"
          v-model="form.type_identification_id">
          <b-form-select-option :value="null">Seleccionar...</b-form-select-option>
          <b-form-select-option
            v-for="(item, index) in typesIdentifications"
            v-if="(item.state)"
            :disabled="viewOnlly ? true : false"
            :key="index"
            :value="item.id">{{ item.name }}
          </b-form-select-option>
        </b-form-select>
      </b-form-group>
      <b-form-group
        id="groupinitial"
        label="Identificación:"
        label-for="identification">
        <b-form-input
          id="identification"
          :disabled="viewOnlly ? true : false"
          v-model="form.identification"
          :class="{'is-invalid': $v.form.identification.$error || errors.identification}"
          placeholder="Ingrese Identificación"/>
        <template v-if="$v.form.identification.$error">
          <div class="invalid-feedback" v-if="!$v.form.identification.maxLength">
            la Identificación Exede los 19 Caracteres
          </div>
        </template>
        <template v-if="errors.identification">
          <div class="invalid-feedback">
            {{ errors.identification[0] }}
          </div>
        </template>
      </b-form-group>
      <b-form-group
        id="groupname"
        label="Nombres:"
        label-for="names">
        <b-form-input
          id="names"
          :disabled="viewOnlly ? true : false"
          v-model="form.names"
          :class="{'is-invalid': $v.form.names.$error || errors.names}"
          placeholder="Ingrese Nombres"/>
        <template v-if="$v.form.names.$error">
          <div class="invalid-feedback" v-if="!$v.form.names.required">
            Digite los Nombres
          </div>
          <div class="invalid-feedback" v-if="!$v.form.names.maxLength">
            Los Nombres Exede los 200 Caracteres
          </div>
        </template>
      </b-form-group>
      <b-form-group
        v-if="form.type == 'person'"
        id="groupstate"
        label="Genero:"
        label-for="gender_id">
        <b-form-select
          id="gender_id"
          :disabled="viewOnlly ? true : false"
          v-model="form.gender_id"
          :class="{'is-invalid': $v.form.gender_id.$error}">
          <b-form-select-option :value="null">Seleccionar...</b-form-select-option>
          <b-form-select-option
            v-for="(item, index) in gender"
            v-if="(item.state)"
            :disabled="viewOnlly ? true : false"
            :key="index"
            :value="item.id">{{ item.name }}
          </b-form-select-option>
        </b-form-select>
        <template v-if="$v.form.gender_id.$error">
          <div class="invalid-feedback" v-if="!$v.form.gender_id.required">
            Seleccione Genero
          </div>
        </template>
      </b-form-group>
      <b-form-group
        v-if="form.type == 'person'"
        id="groupname"
        label="Telefono:"
        label-for="telephone">
        <b-form-input
          id="telephone"
          :disabled="viewOnlly ? true : false"
          v-model="form.telephone"
          type="number"
          placeholder="Ingrese telefono"
          :class="{'is-invalid': $v.form.telephone.$error}"/>
        <template v-if="$v.form.telephone.$error">
          <div class="invalid-feedback" v-if="!$v.form.telephone.required">
            Digite el Teléfono
          </div>
          <div class="invalid-feedback" v-if="!$v.form.telephone.maxLength">
            El Teléfono Exede los 11 Caracteres
          </div>
        </template>
      </b-form-group>
      <b-form-group
        v-if="form.type == 'person'"
        id="groupname"
        label="Dirección:"
        label-for="address">
        <b-form-input
          id="address"
          :disabled="viewOnlly ? true : false"
          v-model="form.address"
          :class="{'is-invalid': $v.form.address.$error}"
          placeholder="Ingrese dirección"/>
        <template v-if="$v.form.address.$error">
          <div class="invalid-feedback" v-if="!$v.form.address.required">
            Digite la Dirección
          </div>
          <div class="invalid-feedback" v-if="!$v.form.address.maxLength">
            La Dirección Exede los 99 Caracteres
          </div>
        </template>
      </b-form-group>
      <b-form-group
        v-if="form.type == 'dependence'"
        id="groupstate"
        label="Responsable:"
        label-for="boss">
        <b-form-select
          id="boss"
          :disabled="viewOnlly ? true : false"
          v-model="form.dependence_id"
          :class="{'is-invalid': $v.form.dependence_id.$error}">
          <b-form-select-option :value="null">Seleccionar...</b-form-select-option>
          <b-form-select-option
            v-for="(item, index) in dependence"
            v-if="(item.type=='person') && (item.state)"
            :disabled="viewOnlly ? true : false"
            :key="index"
            :value="item.id">{{ item.names }}
          </b-form-select-option>
        </b-form-select>
        <template v-if="$v.form.dependence_id.$error">
          <div class="invalid-feedback" v-if="!$v.form.dependence_id.required">
            Seleccione el Responsable
          </div>
        </template>
      </b-form-group>
      <b-form-group
        id="groupstate"
        label="Estado:"
        label-for="state">
        <b-form-select
          id="state"
          :disabled="viewOnlly ? true : false"
          v-model="form.state"
          :options="states"
          :class="{'is-invalid': $v.form.state.$error}"/>
        <template v-if="$v.form.state.$error">
          <div class="invalid-feedback" v-if="!$v.form.state.required">
            Seleccione el Estado
          </div>
        </template>
      </b-form-group>
      <div
        class="text-center">
        <b-button
          v-if="event && !viewOnlly"
          :disabled="sending"
          type="submit"
          variant="success">
          <span v-if="sending">
            <b-spinner
              small
              label="Spinning"/> Guardando...
          </span>
          <span v-else>
            <i class="fas fa-save"/> Guardar
          </span>
        </b-button>
        <b-button
          v-else-if="!event && !viewOnlly"
          :disabled="updating"
          type="submit"
          variant="success">
          <span v-if="updating">
            <b-spinner
              small
              label="Spinning"/> Actualizando...
          </span>
          <span v-else>
            <i class="fas fa-save"/> Actualizar
          </span>
        </b-button>
        <b-button
          variant="danger"
          @click="hideModal"><i class="fas fa-times-circle"/> Cancelar</b-button>
      </div>
    </b-form>
  </b-modal>
</template>
<script>
import { EventBus } from '~/plugins/event-bus'
import { required, minLength, maxLength, between, integer } from 'vuelidate/lib/validators'
export default {
  props: {
    toEntryFiling: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      show: true,
      sending: false,
      updating: false,
      form: {
        modal: 'modal-dependence',
        id: null,
        identification: null,
        names: null,
        telephone: null,
        address: null,
        state: true,
        type: null,
        dependence_id: null,
        people_id: null,
        type_identification_id: null,
        gender_id: null
      },
      states: [
        { value: null, text: 'Seleccionar...' },
        { value: true, text: 'Activo' },
        { value: false, text: 'Inactivo' }
      ],
      types: [
        { value: null, text: 'Seleccionar...' },
        { value: 'person', text: 'Persona' },
        { value: 'dependence', text: 'Dependencia' }
      ],
      viewOnlly: false,
      persons: true
    }
  },
  created() {
    EventBus.$on('showModalNewDependence', () => {
      setTimeout(() => {
        this.$refs['modal-dependence'].show()
      }, 500)
    })
    let contador = 0
      let co = 0
      this.viewOnlly = false
      this.dependence.forEach(element => {
        /* verifica si existe alguna persona en la tabla dependencias,
        si no obliga a crear una persona antes que a una dependencia */
        if (this.dependence[co].type == 'person' && this.dependence[co].state) {
          contador++
        }
        co++
      })
      if (contador == 0) {
        this.form.type = 'person'
        this.persons = false
      } else {
        this.form.type = null
        this.persons = true
      }
      this.$store.dispatch('api/clearErrors') //clean errors of back
      this.$store.dispatch('config/getGender')
      this.$store.dispatch('config/getTypeIdentification')
      this.form.id = null
      this.form.identification = null
      this.form.names = null
      this.form.telephone = null
      this.form.address = null
      this.form.state = true
      //this.form.type = null
      this.form.dependence_id = null
      this.form.type_identification_id = null
      this.form.gender_id = null
      this.tittleModal = 'Nuevo Registro'
      this.event = 1
      this.sending = false
      this.updating = false
  },
  validations() {
    if (this.form.type === 'person') {
      let form = {
        form: {
          type: {
            required
          },
          type_identification_id: {

          },
          identification: {
            maxLength: maxLength(19)
          },
          names: {
            required,
            maxLength: maxLength(200)
          },
          gender_id: {},
          telephone: {
            maxLength: maxLength(11)
          },
          address: {
            maxLength: maxLength(99)
          },
          state: {
            required
          }
        }
      }
      return form
    }else if (this.form.type === 'dependence') {
      let form = {
        form: {
          type: {
            required
          },
          type_identification_id: {

          },
          identification: {
            maxLength: maxLength(19)
          },
          names: {
            required,
            maxLength: maxLength(200)
          },
          dependence_id: {
          },
          state: {
            required
          }
        }
      }
      return form
    }else {
      let form = {
        form: {
          type: {
            required
          },
          identification: {
            maxLength: maxLength(19)
          },
          names: {
            required,
            maxLength: maxLength(200)
          },
          state: {
            required
          }
        }
      }
      return form
    }
  },
  computed: {
    dependence() {
      return this.$store.state.config.dependence
    },
    typesIdentifications() {
      return this.$store.state.config.typeIdentification
    },
    gender() {
      return this.$store.state.config.gender
    },
    errors() {
      return this.$store.state.api.errors
    },
  },
  methods: {
    async sendData(evt) {
      evt.preventDefault()
      let me = this
      me.form.names = me.form.names ? me.form.names.toUpperCase() : ''
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      } else {
        if (me.form.type == 'person') {
          me.form.dependence_id = null
        } else {
          me.form.telephone = null
          me.form.address = null
        }
        me.sending = true
        //Crear
        if (me.event) {
          let params = {
            url: 'dependences',
            data: me.form,
            files: false
          }
          me.$store.dispatch('api/create', params)
          setTimeout(() => {
            if (Object.keys(me.errors).length !== 0) {
              //validation back
              //console.log('Paso el front')
              me.sending = false
              return
            } else {
              //console.log('errors vacio')
              me.sending = false
              me.$store.dispatch('config/getDependence', 0)
              me.hideModal()
              //guardar en tabla people tambien
              if (me.form.type == 'dependence') {
                me.form.type == 'company'
              }
              if (me.form.type == 'person') {
                me.form.people_id = null
              } else {
                me.form.gender = null
              }
              me.sending = true
              //Crear
              let params = {
                url: 'people',
                data: me.form,
                message: true,
                files: false
              }
              me.$store.dispatch('api/create', params)
              setTimeout(() => {
                if (Object.keys(me.errors).length !== 0) {
                  //validation back
                  //console.log('Paso el front')
                  me.sending = false
                  return
                } else {
                  //console.log('errors vacio')
                  me.sending = false
                  //me.$store.dispatch('config/getPeople', false)
                  //me.hideModal()
                }
              }, 2000)
              //alert(JSON.stringify(params))
              if (this.toEntryFiling) {
                this.$store.dispatch('config/getDependence', 1)
                this.$store.dispatch('config/getPeople', true)
              }
            }
          }, 2000)
          //alert(JSON.stringify(params))
        } else {
          me.updating = true
          //actualizar
          let params = {
            url: `dependences/${me.form.id}`,
            data: me.form,
            action: 'config/getDependence',
            dispatchParams: true,
            actionDispatch: 0
          }
          me.$store.dispatch('api/update', params)
          setTimeout(() => {
            if (Object.keys(me.errors).length !== 0) {
              //validation back
              //console.log('Paso el front')
              me.updating = false
              return
            } else {
              //console.log('errors vacio')
              me.updating = false
              //me.$store.dispatch('config/getDependence', 0)
              me.hideModal()
            }
          }, 2000)
        }
      }
    },
    changeType() {
      this.$v.$reset()//limpia los resultados de la validación
    },
    hideModal() {
      this.$refs['modal-dependence'].hide()
      setTimeout(() => {
        this.$v.$reset()
        this.viewOnlly = false
        this.form = {
          id: null,
          identification: null,
          names: null,
          telephone: null,
          address: null,
          state: null,
          type: null,
          dependence_id: null,
          type_identification_id: null,
          gender_id: null
        }
        this.$store.dispatch('api/clearErrors') //clean errors of back
      }, 500)
    }
  }
}
</script>
