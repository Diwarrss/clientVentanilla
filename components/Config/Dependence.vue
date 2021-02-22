<template>
  <div class="dependence">
    <b-card>
      <div>
        <b-button
          variant="primary"
          v-permission="'create_dependence'"
          @click="newDependence(false)"><i class="fas fa-plus-circle"/> Nuevo</b-button>
        <!-- <b-button
          v-permission="'export_dependence'"
          variant="success"><i class="fas fa-file-csv"/> Exportar</b-button> -->
        <b-button variant="success" @click="exportToExcel">
          <i class="fas fa-file-csv" /> Exportar
        </b-button>
      </div>
      <div
        v-if="dependence.length"
        class="mt-2 pt-3 body_dependence">
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
              id="table-dependence"
              :fields="fields"
              :items="dependence"
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
                  v-permission="'edit_dependence'"
                  variant="warning"
                  @click="modalEdit(row.item, row.index, $event.target, false)"><i class="fas fa-edit mr-md-1"/><span class="d-none d-md-inline-block">Editar</span></b-button>
                <b-button
                  v-if="row.item.state == 1"
                  v-permission="'change_status_dependence'"
                  variant="danger"
                  @click="status(row.item.id, 'disable')"><i class="fas fa-times-circle mr-md-1"/><span class="d-none d-md-inline-block">Inactivar</span></b-button>
                <b-button
                  v-if="row.item.state == 0"
                  v-permission="'change_status_dependence'"
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
              aria-controls="table-dependence"
            />
          </div>
        </template>
      </div>
      <ModalNewDependence :toEntryFiling="true" :viewOnlly="viewOnlly" :event="event" :tittleModal="tittleModal" :allData="allData"/>
    </b-card>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import ModalNewDependence from '~/components/Config/Modal/ModalNewDependence'
import { EventBus } from '~/plugins/event-bus'
import { required, minLength, maxLength, between, integer } from 'vuelidate/lib/validators'
export default {
  components: {
    ModalNewDependence
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['cantidad'],
  data() {
    return {
      sortBy: 'id',
      sortDesc: false,
      filter: null,
      pageOptions: [10, 20, 30],
      perPage: 10,
      currentPage: 1,
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
          key: 'type_person',
          label: 'Tipo',
          sortable: true,
          formatter: value => {
            return value.name
          }
        },
        {
          key: 'acciones',
          label: 'Acciones',
          visible: false,
          sortable: false
        }
      ],
      rows: this.cantidad,
      tittleModal: '',
      event: null,
      person: true,
      viewOnlly: false,
      persons: true,
      allData: {}
    }
  },
  computed: {
    dependence() {
      return this.$store.state.config.dependence
    },
    apiUrl() {
      return process.env.FILES_BASE_URL
    }
  },
  created() {
    this.$store.dispatch('config/getDependence')
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
        url: 'dependence-export', /* enviamos la url de la api y la ruta con sus parametros para descargar el csv */
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
          XLSX.utils.book_append_sheet(wb, exportData, 'Dependencias') // sheetAName is name of Worksheet
          // export Excel file
          XLSX.writeFile(wb, 'Dependencias.xlsx') // name of the file is 'book.xlsx'
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
    newDependence(view) {
      let contador = 0
      let co = 0
      if (view) {
        this.viewOnlly = true
      } else {
        this.viewOnlly = false
      }
      this.$store.dispatch('api/clearErrors') //clean errors of back
      this.$store.dispatch('config/getGender')
      this.$store.dispatch('config/getTypeIdentification')
      this.$store.dispatch('config/getTypePeople')
      this.tittleModal = 'Nuevo Registro'
      this.event = true,
      this.allData = {}
      EventBus.$emit('showModalNewDependence')
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
      this.$store.dispatch('config/getTypePeople')
      this.event = false
      this.allData = item
      EventBus.$emit('showModalNewDependence')
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
                url: `dependences-state/${id}`,
                action: 'config/getDependence',
                dispatchParams: true,
                actionDispatch: 0
              }
              me.$store.dispatch('api/status', params)
              /* setTimeout(() => {
                me.$store.dispatch('config/getDependence', 0)
              }, 500); */
              //me.hideModal()
              //alert(JSON.stringify(params))
            }
          }
        })
      } catch (error) {
        console.log(error)
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
.dependence {
  .body_dependence {
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
