<template>
  <div class="type_people">
    <b-card>
      <div>
        <b-button
          v-permission="'create_people_type'"
          variant="primary"
          @click="newTypePeople(false)"><i class="fas fa-plus-circle"/> Nuevo</b-button>
        <b-button variant="success" @click="exportToExcel">
          <i class="fas fa-file-csv" /> Exportar
        </b-button>
      </div>
      <div
        class="mt-2 pt-3 body_type_people">
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
              id="table-typePeople"
              :fields="fields"
              :items="typePeople"
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
                  v-permission="'edit_people_type'"
                  variant="warning"
                  @click="modalEdit(row.item, row.index, $event.target, false)"><i class="fas fa-edit mr-md-1"/><span class="d-none d-md-inline-block">Editar</span></b-button>
                <b-button
                  v-permission="'change_people_type_status'"
                  v-if="row.item.state == 1"
                  variant="danger"
                  @click="status(row.item.id, 'disable')"><i class="fas fa-times-circle mr-md-1"/><span class="d-none d-md-inline-block">Inactivar</span></b-button>
                <b-button
                  v-permission="'change_people_type_status'"
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
              aria-controls="table-typePeople"
            />
          </div>
        </template>
      </div>
      <!-- Info modal -->
      <b-modal
        ref="modal-typePeople"
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
            label="Nombres:"
            label-for="name">
            <b-form-input
              id="name"
              :disabled="viewOnlly ? true : false"
              v-model="form.name"
              :class="{'is-invalid': $v.form.name.$error || errors.name}"
              placeholder="Ingrese Nombres"/>
            <template v-if="$v.form.name.$error">
              <div
                v-if="!$v.form.name.required"
                class="invalid-feedback">
                Digite el Nombre
              </div>
              <div
                v-if="!$v.form.name.maxLength"
                class="invalid-feedback">
                El Nombre Exede los 200 Caracteres
              </div>
            </template>
            <template v-if="errors.name">
              <div class="invalid-feedback">
                {{ errors.name[0] }}
              </div>
            </template>
          </b-form-group>
          <b-form-group
            id="groupstate"
            label="Tipo:"
            label-for="type">
            <b-form-select
              id="type"
              :disabled="viewOnlly ? true : false"
              v-model="form.type"
              :class="{ 'is-invalid': $v.form.type.$error }"
              :options="types"/>
            <template v-if="$v.form.type.$error">
              <div
                v-if="!$v.form.type.required"
                class="invalid-feedback">
                Seleccione el Tipo
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
            <!-- <b-button
              v-else
              type="submit"
              variant="success"><i class="fas fa-sync-alt"/> Actualizar</b-button> -->
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
      types: [
        { value: null, text: 'Seleccionar...' },
        { value: true, text: 'Persona' },
        { value: false, text: 'Entidad' }
      ],
      show: true,
      fields: [
        {
          key: 'id',
          label: '#',
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
        modal: 'modal-typePeople',
        id: null,
        name: null,
        type: null,
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
        type: {
          required
        },
        state: {
          required
        }
      }
    }
    return form
  },
  computed: {
    apiUrl() {
      return process.env.FILES_BASE_URL
    },
    typePeople() {
      return this.$store.state.config.typePeople
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
    exportToExcel() { // On Click Excel download button
      let me = this
      me.$axios({
        method: 'get',
        url: 'type-people-export', /* enviamos la url de la api y la ruta con sus parametros para descargar el csv */
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
          XLSX.utils.book_append_sheet(wb, exportData, 'TipoPersona') // sheetAName is name of Worksheet
          // export Excel file
          XLSX.writeFile(wb, 'TipoPersona.xlsx') // name of the file is 'book.xlsx'
          me.$swal({
            title: "Descarga éxitosa!",
            icon: 'success',
            confirmButtonColor: '#4dbd74',
            confirmButtonText:
              '<i class="far fa-check-circle"></i> Aceptar',
            timer: 2000
          })
        }
      })
      .catch(error => {
        me.$swal({
          title: "Error al descargar, Reintentar!",
          icon: 'error',
          confirmButtonColor: '#4dbd74',
          confirmButtonText:
            '<i class="far fa-check-circle"></i> Aceptar',
          timer: 2000
        })
        //console.log(error);
      })
    },
    newTypePeople(view) {
      if (view) {
        this.viewOnlly = true
      } else {
        this.viewOnlly = false
      }
      this.$store.dispatch('api/clearErrors') //clean errors of back
      this.form.id = null
      this.form.name = null
      this.form.state = null
      this.form.type = null
      this.tittleModal = 'Nuevo Registro'
      this.event = 1
      this.sending = false
      this.updating = false
      this.$refs['modal-typePeople'].show()
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
      this.form.type = item.type
      this.event = 0
      this.sending = false
      this.updating = false
      this.$refs['modal-typePeople'].show()
    },
    hideModal() {
      this.$refs['modal-typePeople'].hide()
      setTimeout(() => {
        this.$v.$reset()
        this.viewOnlly = false
        this.form = {
          id: null,
          name: null,
          type: null,
          state: null
        }
        this.$store.dispatch('api/clearErrors') //clean errors of back
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
                url: `type-people-state/${id}`,
                action: 'config/getTypePeople'
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
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      } else {
        me.sending = true
        //Crear
        if (me.event) {
          let params = {
            url: 'type-people',
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
              me.$store.dispatch('config/getTypePeople')
              me.hideModal()
            }
          }, 2000)
          /*
          setTimeout(
            me.hideModal(),
            3000
          ) */
        } else {
          this.updating = true
          //actualizar
          let params = {
            url: `type-people/${me.form.id}`,
            data: me.form,
            action: 'config/getTypePeople'
          }
          me.$store.dispatch('api/update', params)
          setTimeout(() => {
            if (Object.keys(me.errors).length !== 0) {
              //validation back
              //console.log('Paso el front')
              this.updating = false
              return
            } else {
              //console.log('errors vacio')
              this.updating = false
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
    /* downloadExcel() {
      window.location.href = ``
    } */
  }
}
</script>
<style lang="scss">
.type_people {
  .body_type_people {
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
