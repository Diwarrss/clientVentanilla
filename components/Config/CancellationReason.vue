<template>
  <div class="gender">
    <b-card>
      <!-- zona de botones -->
      <div>
        <b-button
          v-permission="'create_cancellation_reason'"
          variant="primary"
          @click="newCancellationReason(false)"><i class="fas fa-plus-circle"/> Nuevo</b-button>
        <!-- <b-button
          v-permission="'export_cancellation_reason'"
          variant="success"><i class="fas fa-file-csv"/> Exportar</b-button> -->
        <b-button variant="success" @click="exportToExcel">
          <i class="fas fa-file-csv" /> Exportar
        </b-button>
      </div>
      <div
        class="mt-2 pt-3 body_cancellation_reason">
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
              v-if="cancellationReason.length"
              id="table-cancellation-reason"
              :fields="fields"
              :items="cancellationReason"
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
                  v-permission="'edit_cancellation_reason'"
                  variant="warning"
                  @click="modalEdit(row.item, row.index, $event.target, false)"><i class="fas fa-edit mr-md-1"/><span class="d-none d-md-inline-block">Editar</span></b-button>
                <b-button
                  v-permission="'change_cancellation_reason_status'"
                  v-if="row.item.state == 1"
                  variant="danger"
                  @click="status(row.item.id, 'disable')"><i class="fas fa-times-circle mr-md-1"/><span class="d-none d-md-inline-block">Inactivar</span></b-button>
                <b-button
                  v-permission="'change_cancellation_reason_status'"
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
              aria-controls="table-cancellation-reason"
            />
          </div>
        </template>
      </div>
      <!-- Info modal -->
      <b-modal
        ref="modal-cancellation-reason"
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
              name="name"
              aria-describedby="input-name"
              placeholder="Ingrese Nombre"
              data-vv-as="nombre"/>
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
            label="Estado:"
            label-for="srate">
            <b-form-select
              id="state"
              :disabled="viewOnlly ? true : false"
              v-model="form.state"
              :class="{ 'is-invalid': $v.form.state.$error }"
              :options="states"
              name="state"
              aria-describedby="input-state"
              data-vv-as="estado"/>
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
              v-if="!event && !viewOnlly"
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
import { required,minLength,maxLength,between,integer } from 'vuelidate/lib/validators' /* importamos las propiedades de la validación */
export default {
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
      /* información de encabezado de la tabla */
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
        modal: 'modal-cancellation-reason',
        id: null,
        name: null,
        state: true
      },
      rows: this.cantidad,
      tittleModal: '',
      event: null,
      viewOnlly: false,
      showmodal: false
    }
  },
  /* validación dinamica de los formularios activos */
  validations() {
    let form = {
      form: {
        name: {
          required,
          maxLength: maxLength(200)
        },
        state: {
          required
        }
      }
    }
    return form
  },
  computed: {
    cancellationReason() {
      return this.$store.state.config.cancellationReason
    },
    errors() {
      return this.$store.state.api.errors
    },
    apiUrl() {
      return process.env.FILES_BASE_URL
    }
  },
  watch: {
    /* cuando la variable sea afectada o tenga algun cambio ejecuta el proceso, para paginar la tabla */
    cantidad() {
      this.rows = this.cantidad
    }
  },
  methods: {
    exportToExcel() { // On Click Excel download button
      console.log('exporttoexcel')
      let me = this
      me.$axios({
        method: 'get',
        url: 'cancellation-reasons-export', /* enviamos la url de la api y la ruta con sus parametros para descargar el csv */
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
          XLSX.utils.book_append_sheet(wb, exportData, 'MotivosCancelacion') // sheetAName is name of Worksheet
          // export Excel file
          XLSX.writeFile(wb, 'MotivosCancelacion.xlsx') // name of the file is 'book.xlsx'
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
    newCancellationReason(view) {
      if (view) {
        this.viewOnlly = true
      } else {
        this.viewOnlly = false
      }
      this.$store.dispatch('api/clearErrors') //clean errors of back
      this.form.id = null
      this.form.name = null
      this.form.state = true
      this.tittleModal = 'Nuevo Registro'
      this.event = 1
      this.sending = false
      this.updating = false
      this.$refs['modal-cancellation-reason'].show()
    },
    modalEdit(item, index, button, view) {
      this.showmodal = true
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
      this.event = 0
      this.sending = false
      this.updating = false
      this.$refs['modal-cancellation-reason'].show()
    },
    hideModal() {
      this.$refs['modal-cancellation-reason'].hide()
      setTimeout(() => {
        this.viewOnlly = false
        this.showmodal = false
        this.$v.$reset()//resetea las validaciones del formulario
        this.form = {
          id: null,
          name: null,
          state: true
        }
      }, 500)
    },
    status(id, type) {
      try {
        let me = this
        //me.$store.dispatch('api/clearResult')
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
                url: `cancellation-reasons-state/${id}`,
                action: 'config/getCancellationReason'
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
      if (this.$v.$invalid) { //verifica los resultados de la validación
        return
      } else {
        //Crear nuevo registro
        me.sending = true
        if (me.event) {
          let params = {
            url: 'cancellation-reasons',
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
              me.$store.dispatch('config/getCancellationReason')
              me.hideModal()
            }
          }, 2000)
        } else {
          me.updating = true
          //actualizar registro existente
          let params = {
            url: `cancellation-reasons/${me.form.id}`,
            data: me.form,
            files: false,
            action: 'config/getCancellationReason'
          }
          me.$store.dispatch('api/update', params)
          setTimeout(() => {
            if (Object.keys(me.errors).length !== 0) {
              //validation back
              me.updating = false
              //console.log('Paso el front')
              return
            } else {
              //console.log('errors vacio')
              me.updating = false
              //me.$store.dispatch('config/getCancellationReason')
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
.gender {
  .body_cancellation_reason {
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
