<template>
  <div class="type_identification">
    <b-card>
      <div>
        <b-button
          v-permission="'create_type_identification'"
          variant="primary"
          @click="newTypeIdentification(false)"><i class="fas fa-plus-circle"/> Nuevo</b-button>
        <!-- <b-button
          v-permission="'export_type_identification'"
          variant="success"><i class="fas fa-file-csv"/> Exportar</b-button> -->
        <b-button
          variant="success"
          @click="exportToExcel">
          <i class="fas fa-file-csv" /> Exportar
        </b-button>
      </div>
      <div
        class="mt-2 pt-3 body_type_identification">
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
              id="table-typeIdentification"
              :fields="fields"
              :items="typeIdentification"
              :per-page="perPage"
              :filter="filter"
              :current-page="currentPage"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              class="mt-2"
              striped
              small
              responsive
              @filtered="onFiltered"
            >
              <!-- se pinta el componente para el slot acciones -->
              <template v-slot:cell(acciones)="row">
                <b-button
                  variant="primary"
                  @click="modalEdit(row.item, row.index, $event.target, true)"><i class="fas fa-eye mr-md-1"/><span class="d-none d-md-inline-block">Ver</span></b-button>
                <b-button
                  v-permission="'edit_type_identification'"
                  variant="warning"
                  @click="modalEdit(row.item, row.index, $event.target, false)"><i class="fas fa-edit mr-md-1"/><span class="d-none d-md-inline-block">Editar</span></b-button>
                <b-button
                  v-permission="'change_status_type_identification'"
                  v-if="row.item.state == 1"
                  variant="danger"
                  @click="status(row.item.id, 'disable')"><i class="fas fa-times-circle mr-md-1"/><span class="d-none d-md-inline-block">Inactivar</span></b-button>
                <b-button
                  v-permission="'change_status_type_identification'"
                  v-if="row.item.state == 0"
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
              aria-controls="table-typeIdentification"
            />
          </div>
        </template>
      </div>
      <!-- Info modal -->
      <b-modal
        ref="modal-typeIdentification"
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
            id="groupname"
            label="Nombre:"
            label-for="name">
            <b-form-input
              id="name"
              :disabled="viewOnlly ? true : false"
              v-model="form.name"
              :class="{ 'is-invalid': $v.form.name.$error || errors.name }"
              placeholder="Ingrese Nombre"/>
            <template v-if="$v.form.name.$error">
              <div
                v-if="!$v.form.name.required"
                class="invalid-feedback">
                Digite el Nombre
              </div>
              <div
                v-if="!$v.form.name.maxLength"
                class="invalid-feedback">
                El nombre Exede los 200 Caracteres
              </div>
            </template>
            <template v-if="errors.name">
              <div class="invalid-feedback">
                {{ errors.name[0] }}
              </div>
            </template>
          </b-form-group>
          <b-form-group
            id="groupname"
            label="Iniciales:"
            label-for="initials">
            <b-form-input
              id="initials"
              :disabled="viewOnlly ? true : false"
              v-model="form.initials"
              :class="{ 'is-invalid': $v.form.initials.$error || errors.initials }"
              placeholder="Ingrese iniciales"/>
            <template v-if="$v.form.initials.$error">
              <div
                v-if="!$v.form.initials.required"
                class="invalid-feedback">
                Digite las Iniciales
              </div>
              <div
                v-if="!$v.form.initials.maxLength"
                class="invalid-feedback">
                Las Iniciales Exede los 5 Caracteres
              </div>
            </template>
            <template v-if="errors.initials">
              <div class="invalid-feedback">
                {{ errors.initials[0] }}
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
              :class="{ 'is-invalid': $v.form.state.$error }"
              :options="states"/>
            <template v-if="$v.form.state.$error">
              <div
                v-if="!$v.form.state.required"
                class="invalid-feedback">
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
import XLSX from 'xlsx'
import {
  required,
  minLength,
  maxLength,
  between,
  integer
} from 'vuelidate/lib/validators'
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
      show: true,
      fields: [
        {
          key: 'id',
          label: '#',
          sortable: true
        },
        {
          key: 'initials',
          label: 'Iniciales',
          sortable: true
        },
        {
          key: 'name',
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
          key: 'acciones',
          label: 'Acciones',
          visible: false,
          sortable: false
        }
      ],
      form: {
        modal: 'modal-typeIdentification',
        id: null,
        name: null,
        initials: null,
        state: null
      },
      rows: this.cantidad,
      tittleModal: '',
      event: null,
      viewOnlly: false
    }
  },
  validations() {
    let form = {
      form: {
        name: {
          required,
          maxLength: maxLength(200)
        },
        initials: {
          required,
          maxLength: maxLength(5)
        },
        state: {
          required
        }
      }
    }
    return form
  },
  computed: {
    typeIdentification() {
      return this.$store.state.config.typeIdentification
    },
    errors() {
      return this.$store.state.api.errors
    },
    apiUrl() {
      return process.env.FILES_BASE_URL
    }
  },
  watch: {
    /* cuando la variable sea afectada o tenga algun cambio ejecuta el proceso */
    cantidad() {
      this.rows = this.cantidad
    }
  },
  methods: {
    exportToExcel() {
      // On Click Excel download button
      let me = this
      me.$axios({
        method: 'get',
        url:
          'type-identification-export' /* enviamos la url de la api y la ruta con sus parametros para descargar el csv */
        /* responseType: 'blob' */
      })
        .then(res => {
          if (res.data.length) {
            // export json to Worksheet of Excel
            // only array possible
            var exportData = XLSX.utils.json_to_sheet(res.data)
            var wb = XLSX.utils.book_new() // make Workbook of Excel
            // add Worksheet to Workbook
            // Workbook contains one or more worksheets
            XLSX.utils.book_append_sheet(wb, exportData, 'TipoIdentificacion') // sheetAName is name of Worksheet
            // export Excel file
            XLSX.writeFile(wb, 'TipoIdentificacion.xlsx') // name of the file is 'book.xlsx'
            me.$swal({
              title: 'Descarga éxitosa!',
              icon: 'success',
              confirmButtonColor: '#4dbd74',
              confirmButtonText: '<i class="far fa-check-circle"></i> Aceptar',
              timer: 2000
            })
          }
        })
        .catch(error => {
          me.$swal({
            title: 'Error al descargar, Reintentar!',
            icon: 'error',
            confirmButtonColor: '#4dbd74',
            confirmButtonText: '<i class="far fa-check-circle"></i> Aceptar',
            timer: 2000
          })
          //console.log(error);
        })
    },
    newTypeIdentification(view) {
      if (view) {
        this.viewOnlly = true
      } else {
        this.viewOnlly = false
      }
      this.$store.dispatch('api/clearErrors') //clean errors of back
      this.form.id = null
      this.form.name = null
      this.form.initials = null
      this.form.state = null
      this.tittleModal = 'Nuevo Registro'
      this.event = 1
      this.sending = false
      this.updating = false
      this.$refs['modal-typeIdentification'].show()
    },
    modalEdit(item, index, button, view) {
      if (view) {
        this.tittleModal = 'Ver ' + item.name
        this.viewOnlly = true
      } else {
        this.viewOnlly = false
        this.tittleModal = 'Editar ' + item.name
      }
      this.$store.dispatch('api/clearErrors') //clean errors of back
      this.form.id = item.id
      this.form.name = item.name
      this.form.state = item.state
      this.form.initials = item.initials
      this.event = 0
      this.sending = false
      this.updating = false
      this.$refs['modal-typeIdentification'].show()
    },
    hideModal() {
      this.$refs['modal-typeIdentification'].hide()
      setTimeout(() => {
        this.viewOnlly = false
        this.$v.$reset()
        this.form = {
          id: null,
          name: null,
          state: null,
          initials: null
        }
      }, 500)
    },
    status(id, type) {
      let me = this
      try {
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
              let params = {
                url: `type-identifications-state/${id}`,
                action: 'config/getTypeIdentification'
              }
              me.$store.dispatch('api/status', params)
            }
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    sendData(evt) {
      evt.preventDefault()
      let me = this
      me.form.name = me.form.name ? me.form.name.toUpperCase() : ''
      me.form.initials = me.form.initials ? me.form.initials.toUpperCase() : ''
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      } else {
        me.sending = true
        //Crear
        if (me.event) {
          let params = {
            url: 'type-identifications',
            data: me.form,
            files: false
          }
          me.$store.dispatch('api/create', params)
          setTimeout(() => {
            if (Object.keys(me.errors).length >= 1) {
              //validation back
              me.sending = false
              return
            } else {
              me.sending = false
              me.$store.dispatch('config/getTypeIdentification')
              me.hideModal()
            }
          }, 2000)
        } else {
          me.updating = true
          //actualizar
          let params = {
            url: `type-identifications/${me.form.id}`,
            data: me.form,
            action: 'config/getTypeIdentification'
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
              //me.$store.dispatch('config/getTypeIdentification')
              me.hideModal()
            }
          }, 2000)
        }
      }
    },
    onFiltered(filteredItems) {
      // actualiza la paginacion cuando se usa el filtro
      this.rows = filteredItems.length
      this.currentPage = 1
    }
  }
}
</script>
<style lang="scss">
.type_identification {
  .body_type_identification {
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
