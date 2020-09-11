<template>
  <div class="people">
    <b-card>
      <div>
        <b-button
          v-permission="'create_people'"
          variant="primary"
          @click="newPeople(false)"><i class="fas fa-plus-circle"/> Nuevo</b-button>
        <b-button
          v-permission="'export_people'"
          variant="success"><i class="fas fa-file-csv"/> Exportar</b-button>
      </div>
      <div
        v-if="people.length"
        class="mt-2 pt-3 body_people">
        <template>
          <div class="container-fluid overflow-auto">
            <b-row>
              <!-- sector de filtrar -->
              <b-col
                lg="4"
                class="my-1">
                <b-form-group
                  label="Filtrar:"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="mb"
                  label-for="filterInput"
                  class="mb-0"
                >
                  <b-input-group size="mb">
                    <b-form-input
                      id="filterInput"
                      v-model="filter"
                      type="search"
                      placeholder="Buscar..."
                    />
                    <b-input-group-append>
                      <b-button
                        :disabled="!filter"
                        @click="filter = ''">Limpiar</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <!-- Perpage -->
              <b-col
                lg="4"
                class="my-1">
                <b-form-group
                  label="Por página"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="mb"
                  label-for="perPageSelect"
                  class="mb-0"
                >
                  <b-form-select
                    id="perPageSelect"
                    v-model="perPage"
                    :options="pageOptions"
                    class="select_custom"
                    size="mb"/>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- Pintar Tabla -->
            <b-table
              id="table-people"
              :fields="fields"
              :items="people"
              :per-page="perPage"
              :filter="filter"
              :current-page="currentPage"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              class="mt-2"
              striped
              small
              responsive
              @filtered="onFiltered">
              <!-- se pinta el componente para el slot acciones -->
              <template v-slot:cell(acciones)="row">
                <b-button
                  variant="primary"
                  @click="modalEdit(row.item, row.index, $event.target, true)"><i class="fas fa-eye mr-md-1"/><span class="d-none d-md-inline-block">Ver</span></b-button>
                <b-button
                  v-permission="'edit_people'"
                  variant="warning"
                  @click="modalEdit(row.item, row.index, $event.target, false)"><i class="fas fa-edit mr-md-1"/><span class="d-none d-md-inline-block">Editar</span></b-button>
                <b-button
                  v-if="row.item.state == 1"
                  v-permission="'change_people_status'"
                  variant="danger"
                  @click="status(row.item.id, 'disable')"><i class="fas fa-times-circle mr-md-1"/><span class="d-none d-md-inline-block">Inactivar</span></b-button>
                <b-button
                  v-if="row.item.state == 0"
                  v-permission="'change_people_status'"
                  variant="success"
                  @click="status(row.item.id, 'enable')"><i class="fas fa-check-circle mr-md-1"/><span class="d-none d-md-inline-block">Activar</span></b-button>
              </template>
              <template v-slot:cell(state)="data">
                <h5 v-if="data.item.state">
                  <b-badge
                    variant="success">{{ data.item.state ? 'Activo' : 'Inactivo' }} </b-badge>
                </h5>
                <h5 v-else>
                  <b-badge
                    variant="danger">{{ data.item.state ? 'Activo' : 'Inactivo' }} </b-badge>
                </h5>
              </template>
            </b-table>
            <!-- Info Paginacion -->
            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="table-people"
            />
          </div>
        </template>
      </div>
      <!-- Info modal -->
      <b-modal
        ref="modal-people"
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
              :disabled="viewOnlly||!persons ? true : false"
              v-model="form.type"
              :options="types"
              :class="{'is-invalid': $v.form.type.$error}"
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
            id="groupname"
            label="Dirección:"
            label-for="address">
            <b-form-input
              id="address"
              :disabled="viewOnlly ? true : false"
              v-model="form.address"
              placeholder="Ingrese dirección"
              :class="{'is-invalid': $v.form.address.$error}"/>
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
            id="groupname"
            label="E-mail:"
            label-for="email">
            <b-form-input
              id="email"
              :disabled="viewOnlly ? true : false"
              v-model="form.email"
              placeholder="Ingrese E-mail"
              :class="{'is-invalid': $v.form.email.$error}"/>
            <template v-if="$v.form.email.$error">
              <div class="invalid-feedback" v-if="!$v.form.email.required">
                Digite el E-mail
              </div>
              <div class="invalid-feedback" v-if="!$v.form.email.maxLength">
                El E-mail Exede los 99 Caracteres
              </div>
              <div class="invalid-feedback" v-if="!$v.form.email.notGmail">
                No es un Correo Valido
              </div>
            </template>
          </b-form-group>
          <b-form-group
            v-if="form.type == 'company'"
            id="groupstate"
            label="Representante:"
            label-for="boss">
            <b-form-select
              id="boss"
              :disabled="viewOnlly ? true : false"
              v-model="form.people_id"
              :class="{'is-invalid': $v.form.people_id.$error}">
              <b-form-select-option :value="null">Seleccionar...</b-form-select-option>
              <b-form-select-option
                v-for="(item, index) in people"
                v-if="(item.type=='person') && (item.state)"
                :disabled="viewOnlly ? true : false"
                :key="index"
                :value="item.id">{{ item.names }}
              </b-form-select-option>
            </b-form-select>
            <template v-if="$v.form.people_id.$error">
              <div class="invalid-feedback" v-if="!$v.form.people_id.required">
                Seleccione el Representante
              </div>
            </template>
          </b-form-group>
          <b-form-group
            id="groupstate"
            label="Estado:"
            label-for="srate">
            <b-form-select
              id="state"
              :disabled="viewOnlly ? true : false"
              v-model="form.state"
              :class="{'is-invalid': $v.form.state.$error}"
              :options="states"/>
            <template v-if="$v.form.state.$error">
              <div class="invalid-feedback" v-if="!$v.form.state.required">
                Seleccione el Estado
              </div>
            </template>
          </b-form-group>
          <div
            class="text-center">
            <b-button
              v-if="event"
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
    </b-card>
  </div>
</template>
<script>
import { required, minLength, maxLength, between, email } from 'vuelidate/lib/validators'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['cantidad'],
  data() {
    return {
      sending: false,
      updating: false,
      sortBy: 'id',
      sortDesc: false,
      filter: null,
      pageOptions: [10, 20, 30],
      perPage: 10,
      currentPage: 1,
      states: [
        { value: null, text: 'Seleccionar...' },
        { value: true, text: 'Activo' },
        { value: false, text: 'Inactivo' }
      ],
      types: [
        { value: null, text: 'Seleccionar...' },
        { value: 'person', text: 'Persona' },
        { value: 'company', text: 'Compañia' }
      ],
      show: true,
      fields: [
        {
          key: 'id',
          label: '#',
          sortable: true
        },
        {
          key: 'identification',
          label: 'Id/Nit',
          sortable: true
        },
        {
          key: 'names',
          label: 'Nombre',
          sortable: true
        },
        {
          key: 'state',
          label: 'Estado',
          sortable: true,
          formatter: value => {
            return value ? 'Activo' : 'Inactivo'
          }
        },
        {
          key: 'type',
          label: 'Tipo',
          sortable: true,
          formatter: value => {
            return value == 'person' ? 'Persona' : 'Compañia'
          }
        },
        {
          key: 'acciones',
          label: 'Acciones',
          visible: false,
          sortable: false
        }
      ],
      form: {
        modal: 'modal-people',
        id: null,
        identification: null,
        names: null,
        telephone: null,
        address: null,
        email: null,
        state: null,
        type: null,
        people_id: null,
        type_identification_id: null,
        gender_id: null
      },
      rows: this.cantidad,
      tittleModal: '',
      event: null,
      person: true,
      viewOnlly: false,
      persons: true
    }
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
          gender_id: {
            required
          },
          telephone: {
            required,
            maxLength: maxLength(11)
          },
          address: {
            required,
            maxLength: maxLength(99)
          },
          email: {
            required,
            maxLength: maxLength(129),
            email
          },
          state: {
            required
          }
        }
      }
      return form
    }else if (this.form.type === 'company') {
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
          telephone: {
            required,
            maxLength: maxLength(11)
          },
          address: {
            required,
            maxLength: maxLength(99)
          },
          email: {
            required,
            maxLength: maxLength(129),
            email,
          },
          people_id: {
            required
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
          type_identification_id: {

          },
          identification: {
            maxLength: maxLength(19)
          },
          names: {
            required,
            maxLength: maxLength(200)
          },
          telephone: {
            required,
            maxLength: maxLength(11)
          },
          address: {
            required,
            maxLength: maxLength(99)
          },
          email: {
            required,
            maxLength: maxLength(129),
            email
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
    people() {
      return this.$store.state.config.people
    },
    typesIdentifications() {
      return this.$store.state.config.typeIdentification
    },
    gender() {
      return this.$store.state.config.gender
    },
    errors() {
      return this.$store.state.api.errors
    }
  },
  watch: {
    /* cuando la variable sea afectada o tenga algun cambio ejecuta el proceso */
    cantidad() {
      this.rows = this.cantidad
    }
  },
  methods: {
    changeType() {
      this.$v.$reset()
    },
    newPeople(view) {
      let contador = 0
      let co = 0
      this.people.forEach(element => {
        if (this.people[co].type == 'person' && this.people[co].state) {
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
      if (view) {
        this.viewOnlly = true
      } else {
        this.viewOnlly = false
      }
      this.$store.dispatch('api/clearErrors') //clean errors of back
      this.$store.dispatch('config/getGender')
      this.$store.dispatch('config/getTypeIdentification')
      this.form.id = null
      this.form.identification = null
      this.form.names = null
      this.form.telephone = null
      this.form.address = null
      this.form.email = null
      this.form.state = null
      this.form.people_id = null
      this.form.type_identification_id = null
      this.form.gender_id = null
      this.tittleModal = 'Nuevo Registro'
      this.event = 1
      this.sending = false
      this.updating = false
      this.$refs['modal-people'].show()
    },
    modalEdit(item, index, button, view) {
      if (view) {
        this.tittleModal = 'Ver ' + item.names
        this.viewOnlly = true
      } else {
        this.viewOnlly = false
        this.tittleModal = 'Editar ' + item.names
      }
      this.$store.dispatch('api/clearErrors') //clean errors of back
      this.$store.dispatch('config/getGender')
      this.$store.dispatch('config/getTypeIdentification')
      this.form.id = item.id
      this.form.identification = item.identification
      this.form.names = item.names
      this.form.telephone = item.telephone
      this.form.address = item.address
      this.form.email = item.email
      this.form.state = item.state
      this.form.type = item.type
      this.form.people_id = item.people_id
      this.form.type_identification_id = item.type_identification_id
      this.form.gender_id = item.gender_id
      this.event = 0
      this.sending = false
      this.updating = false
      this.$refs['modal-people'].show()
    },
    hideModal() {
      this.$refs['modal-people'].hide()
      setTimeout(() => {
        this.$v.$reset()
        this.viewOnlly = false
        this.form = {
          id: null,
          identification: null,
          names: null,
          telephone: null,
          address: null,
          email: null,
          state: null,
          type: null,
          people_id: null,
          type_identification_id: null,
          gender_id: null
        }
        this.$store.dispatch('api/clearErrors') //clean errors of back
      }, 500)
    },
    status(id, type) {
      let me = this
      this.$swal({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4dbd74',
        cancelButtonColor: '#d33',
        confirmButtonText:
          type == 'disable'
            ? '<i class="far fa-check-circle"></i> Si, Inactivar!'
            : '<i class="far fa-check-circle"></i> Si, Activar!',
        cancelButtonText: '<i class="far fa-times-circle"></i> Cancelar'
      }).then(result => {
        if (result.value) {
          //Inactivar
          if (id) {
            let url = `people-state/${id}`
            me.$store.dispatch('api/state', url)
            this.$store.dispatch('config/getPeople', false)
            me.hideModal()
            //alert(JSON.stringify(params))
          }
        }
      })
    },
    sendData(evt) {
      evt.preventDefault()
      let me = this
      me.form.names = me.form.names ? me.form.names.toUpperCase() : ''
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      } else {
        if (me.form.type == 'person') {
          me.form.people_id = null
        } else {
          me.form.gender = null
        }
        me.sending = true
        //Crear
        if (me.event) {
          let params = {
            url: 'people',
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
              me.$store.dispatch('config/getPeople', false)
              me.hideModal()
            }
          }, 2000)
          //alert(JSON.stringify(params))
        } else {
          me.updating = true
          //actualizar
          let params = {
            url: `people/${me.form.id}`,
            data: me.form
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
              me.$store.dispatch('config/getPeople', false)
              me.hideModal()
            }
          }, 1000)
        }
        /* alert(JSON.stringify(this.form)) */
      }
    },
    onFiltered(filteredItems) {
      // actualiza la paginacion cuando se usa el filtro
      this.rows = filteredItems.length
      this.currentPage = 1
    },
  }
}
</script>
<style lang="scss">
.people {
  .body_people {
    border-top: 1px solid gray;
  }
  .overflow-auto {
    padding: 0 20px;
  }
  .select_custom {
    width: 50%;
  }
}
</style>
