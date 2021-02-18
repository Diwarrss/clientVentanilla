<template>
  <!-- <h3>Radicación de entrada</h3> -->
  <el-card class="box-card entry_filing">
    <div slot="header" class="clearfix">
      <i class="fas fa-file-import" />
      <span class="cardhead">Radicación de Entrada</span>
    </div>
    <div>
      <div>
        <b-button v-permission="'create_based_entrance'" variant="primary" @click="newEntryFiling(false)">
          <i class="fas fa-plus-circle" /> Nuevo
        </b-button>
        <b-button variant="success" @click="exportToExcel">
          <i class="fas fa-file-csv" /> Exportar
        </b-button>
        <!-- <download-excel
          :data="entryFiling"
          :fields="json_fields"
          type="csv"
          class="btn btn-success"
          name="EntryFiling.csv">
          <i class="fas fa-file-csv" /> Exportar
        </download-excel> -->
        <!-- <a
          :href="`${exportUrl}/entryfiling/export/${dateRange.length ? dateRange : $moment().format('yyyy-MM-DD')}`"
          class="btn btn-success"
          target="_blank">
        <i class="fas fa-file-csv"/> Exportar </a> -->
        <b-button target="_blank" variant="warning" @click.prevent="showPDFTemplate">
          <i class="fas fa-clipboard-list" /> Generar planilla
        </b-button>
      </div>
      <div class="mt-2 pt-3 body_entry">
        <template>
          <div class="container-fluid overflow-auto">
            <b-row>
              <!-- sector de filtrar -->
              <b-col lg="4" class="my-1">
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
                      <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <!-- rango de fechas -->
              <b-col lg="5" class="my-1">
                <span>Rango de Fechas:</span>
                <el-date-picker
                  id="datePicker"
                  v-model="dateRange"
                  :start-placeholder="$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')"
                  :end-placeholder="$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')"
                  :default-value="$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')"
                  class="custom_datePicker"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  range-separator="a"
                  @change="getDataForDate"
                />
              </b-col>
              <!-- Perpage -->
              <b-col lg="3" class="my-1">
                <b-form-group
                  label="Por página"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="mb"
                  label-for="perPageSelect"
                  class="mb-0">
                  <b-form-select
                    id="perPageSelect"
                    v-model="perPage"
                    :options="pageOptions"
                    class="select_custom"
                    size="mb"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <!-- Pintar Tabla -->
            <b-table
              v-if="entryFiling.length"
              id="table-entryFiling"
              :fields="fields"
              :items="entryFiling"
              :per-page="perPage"
              :filter="filter"
              :current-page="currentPage"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              class="mt-2"
              show-empty
              striped
              small
              responsive
              @filtered="onFiltered">
              <!-- se pinta el componente para el slot acciones -->
              <template v-slot:cell(acciones)="row">
                <b-button
                  variant="primary"
                  @click="modalEdit(row.item, row.index, $event.target, true)"
                >
                  <i class="fas fa-eye mr-md-1" />
                  <span class="d-none d-md-inline-block">Ver</span>
                </b-button>
                <b-button
                  v-permission="'edit_based_entrance'"
                  variant="warning"
                  @click="modalEdit(row.item, row.index, $event.target, false)"
                >
                  <i class="fas fa-edit mr-md-1" />
                  <span class="d-none d-md-inline-block">Editar</span>
                </b-button>
                <b-button v-permission="'change_based_entrance_status'" variant="danger" @click="modalCancel(row.item, row.index, $event.target)">
                  <i class="fas fa-ban mr-md-1" />
                  <span class="d-none d-md-inline-block">Anular</span>
                </b-button>
              </template>
            </b-table>
            <b-col v-else>
              <b-alert
                show
                variant="warning"
                class="text-center my-4 alert_not_data"
              >Sin resultados!</b-alert>
            </b-col>
            <!-- Info Paginacion -->
            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="table-entryFiling"
            />
          </div>
        </template>
      </div>
      <!-- Info modal new-->
      <b-modal
        ref="modal-entryFiling"
        :id="form.modal"
        no-close-on-esc
        no-close-on-backdrop
        size="lg"
        hide-footer
      >
        <template v-slot:modal-title>
          <i v-if="!viewOnlly && event" class="fas fa-plus-circle" />
          <i v-else-if="!viewOnlly && !event" class="fas fa-edit" />
          <i v-else class="fas fa-eye" />
          {{ tittleModal }}
        </template>
        <b-form v-if="show && modalValidate === 0" enctype="multipart/form-data" @submit="sendData">
          <div class="form-row">
            <b-form-group
              v-if="!event"
              id="groupinitial"
              class="col-md-6"
              label="Radicado:"
              label-for="settled"
            >
              <b-form-input id="settled" v-model="form.settled" name="settled" disabled />
            </b-form-group>
            <b-form-group
              v-if="!event"
              id="groupinitial"
              class="col-md-6"
              label="Fecha de creación:"
              label-for="date"
            >
              <b-form-input id="date" v-model="form.date" name="date" disabled />
            </b-form-group>
          </div>
          <div class="form-row">
            <b-form-group id="groupname" class="col-12" label="Titulo:" label-for="title">
              <b-form-input
                id="title"
                :disabled="viewOnlly ? true : false"
                v-model="form.title"
                :class="{'is-invalid': $v.form.title.$error}"
                autofocus
                placeholder="Ingrese titulo"
              />
              <template v-if="$v.form.title.$error">
                <div v-if="!$v.form.title.required" class="invalid-feedback">Digite el Titulo</div>
                <div
                  v-if="!$v.form.title.maxLength"
                  class="invalid-feedback"
                >El Titulo Exede los 150 Caracteres</div>
              </template>
            </b-form-group>
          </div>
          <div class="form-row">
            <b-form-group
              id="groupstate"
              class="col-md-4"
              label="Nivel de acceso:"
              label-for="access_level"
            >
              <b-form-select
                id="access_level"
                :disabled="viewOnlly ? true : false"
                v-model="form.access_level"
                :class="{'is-invalid': $v.form.access_level.$error}"
                :options="acces_level"
              />
              <template v-if="$v.form.access_level.$error">
                <div
                  v-if="!$v.form.access_level.required"
                  class="invalid-feedback"
                >Seleccione el Nivel de Acceso</div>
              </template>
            </b-form-group>
            <b-form-group
              id="groupstate"
              class="col-md-4"
              label="Prioridad:"
              label-for="priority_id"
            >
              <b-form-select
                id="priority_id"
                :disabled="viewOnlly ? true : false"
                v-model="form.priority_id"
                :class="{'is-invalid': $v.form.priority_id.$error}"
              >
                <b-form-select-option :value="null">Seleccionar...</b-form-select-option>
                <b-form-select-option
                  v-for="(item, index) in priority"
                  :disabled="viewOnlly ? true : false"
                  :key="index"
                  :value="item.id"
                >{{ item.name }}</b-form-select-option>
              </b-form-select>
              <template v-if="$v.form.priority_id.$error">
                <div
                  v-if="!$v.form.priority_id.required"
                  class="invalid-feedback"
                >Seleccione la Prioridad</div>
              </template>
            </b-form-group>
            <b-form-group
              id="groupstate"
              class="col-md-4"
              label="Medio del documento:"
              label-for="means_document"
            >
              <b-form-select
                id="means_document"
                :disabled="viewOnlly ? true : false"
                v-model="form.means_document"
                :class="{'is-invalid': $v.form.means_document.$error}"
                :options="means_document"
              />
              <template v-if="$v.form.means_document.$error">
                <div
                  v-if="!$v.form.means_document.required"
                  class="invalid-feedback"
                >Seleccione el Medio Documental</div>
              </template>
            </b-form-group>
          </div>
          <div class="form-row">
            <b-form-group
              id="groupstate"
              class="col-md-4"
              label="Tipo de Contexto:"
              label-for="context_tipe"
            >
              <b-form-select
                id="context_tipe"
                :disabled="viewOnlly ? true : false"
                v-model="form.context_type_id"
                :class="{'is-invalid': $v.form.context_type_id.$error}"
              >
                <b-form-select-option :value="null">Seleccionar...</b-form-select-option>
                <b-form-select-option
                  v-for="(item, index) in contextType"
                  :disabled="viewOnlly ? true : false"
                  :key="index"
                  :value="item.id"
                >{{ item.name }}</b-form-select-option>
              </b-form-select>
              <template v-if="$v.form.context_type_id.$error">
                <div
                  v-if="!$v.form.context_type_id.required"
                  class="invalid-feedback"
                >Seleccione el Tipo de Contexto</div>
              </template>
            </b-form-group>
            <b-form-group
              id="groupstate"
              class="col-md-5"
              label="Tipo de documento:"
              label-for="type_document_id"
            >
              <b-form-select
                id="type_document_id"
                :disabled="viewOnlly ? true : false"
                v-model="form.type_document_id"
                :class="{'is-invalid': $v.form.type_document_id.$error}"
              >
                <b-form-select-option :value="null">Seleccionar...</b-form-select-option>
                <b-form-select-option
                  v-for="(item, index) in typeDocument"
                  :disabled="viewOnlly ? true : false"
                  :key="index"
                  :value="item.id"
                >{{ item.name }}</b-form-select-option>
              </b-form-select>
              <template v-if="$v.form.type_document_id.$error">
                <div
                  v-if="!$v.form.type_document_id.required"
                  class="invalid-feedback"
                >Seleccione el Tipo de Documento</div>
              </template>
            </b-form-group>
            <b-form-group id="groupname" class="col-md-3" label="Folios:" label-for="folios">
              <b-form-input
                id="folios"
                min="0"
                oninput="validity.valid||(value='');"
                :disabled="viewOnlly ? true : false"
                v-model="form.folios"
                :class="{'is-invalid': $v.form.folios.$error}"
                type="number"
                placeholder="Ingrese folios"
              />
              <template v-if="$v.form.folios.$error">
                <div
                  v-if="!$v.form.folios.required"
                  class="invalid-feedback"
                >Digite el Número de Folios</div>
                <div
                  v-if="!$v.form.folios.maxLength"
                  class="invalid-feedback"
                >El Número de Folios Exede los 11 Caracteres</div>
              </template>
            </b-form-group>
          </div>
          <div class="form-row row_content">
            <b-form-group id="groupstate" class="col-9" label="Remitente:" label-for="infoPeople">
              <v-select
                id="infoPeople"
                v-model="infoPeople"
                :disabled="viewOnlly || edit ? true : false"
                :options="people"
                :class="{'is-invalid': $v.form.people_id.$error}"
                placeholder="Seleccionar..."
                label="names"
                class="vue_select_input"
              >
                <div slot="no-options">No hay Resultados!</div>
              </v-select>
              <template v-if="$v.form.people_id.$error">
                <div
                  v-if="!$v.form.people_id.required"
                  class="invalid-feedback"
                >Seleccione el Remitente</div>
              </template>
            </b-form-group>
            <b-button variant="secondary" class="col-3 add_button_custom" @click="showModalDependence()"><i class="fas fa-plus-circle" /> Crear Nuevo</b-button>
            <b-form-group id="groupstate" class="col-12" label="Anexos y Observaciones:" label-for="subject">
              <b-form-textarea
                id="subject"
                :disabled="viewOnlly ? true : false"
                v-model="form.subject"
                :class="{'is-invalid': $v.form.subject.$error}"
                placeholder="Ingrese asunto"
                name="subject"
                rows="3"
                max-rows="6"
              />
              <template v-if="$v.form.subject.$error">
                <div v-if="!$v.form.subject.required" class="invalid-feedback">Digite el Asunto</div>
                <div
                  v-if="!$v.form.subject.maxLength"
                  class="invalid-feedback"
                >El Asunto Exede los 2000 Caracteres</div>
              </template>
            </b-form-group>
            <b-form-group
              id="groupstate"
              class="col-12"
              label="Palabras clave:"
              label-for="key_words"
            >
              <b-form-tags
                id="key_words"
                :disabled="viewOnlly ? true : false"
                v-model="array_key_words"
                :class="{'is-invalid': $v.form.key_words.$error}"
                separator=" ,;"
                remove-on-delete
                no-add-on-enter
                tag-variant="info"
                tag-pills
                name="array_key_words"
                class="vue_select_input"
                placeholder="Ingrese palabras clave"
                duplicate-tag-text="Palabra duplicada"
              />
              <template v-if="$v.form.key_words.$error">
                <div
                  v-if="!$v.form.key_words.required"
                  class="invalid-feedback"
                >Digite las Palabras Claves</div>
                <div
                  v-if="!$v.form.key_words.maxLength"
                  class="invalid-feedback"
                >Las Palabras Claves Exeden los 255 Caracteres</div>
              </template>
            </b-form-group>
            <b-form-group
              id="groupstate"
              class="col-12"
              label="Destinatario:"
              label-for="dependences"
            >
              <v-select
                id="dependences"
                v-model="form.dependences"
                :disabled="viewOnlly || edit ? true : false"
                :options="dependence"
                :class="{'is-invalid': $v.form.dependences.$error}"
                placeholder="Seleccionar..."
                label="names"
                class="vue_select_input"
                name="dependences"
                multiple
              >
                <div slot="no-options">No hay Resultados!</div>
              </v-select>
              <template v-if="$v.form.dependences.$error">
                <div
                  v-if="!$v.form.dependences.required"
                  class="invalid-feedback"
                >Seleccione Destinatario</div>
              </template>
            </b-form-group>
            <b-col md="12">
              <span v-show="viewOnlly && fileList.length" class="font-weight-bold">
                <i class="fas fa-cloud-download-alt" /> Click para descargar
              </span>
              <el-upload
                :class="{ 'upload_view' : viewOnlly || event == 1 }"
                :http-request="uploadFileTemp"
                :on-change="updateList"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :file-list="fileList"
                class="upload-demo mb-4"
                action
              >
                <el-button size="small" type="primary">
                  <i class="fas fa-upload" /> Clic para subir archivo
                </el-button>
              </el-upload>
              <b-progress v-if="sendingFile" :max="max" class="mb-2">
                <b-progress-bar
                  :value="uploadPercentage"
                  :label="`${((uploadPercentage / max) * 100).toFixed(2)}%`"
                />
              </b-progress>
            </b-col>
          </div>
          <div class="text-center">
            <b-button v-if="!viewOnlly && event && !saved" variant="info" @click="clearModal">
              <i class="fas fa-eraser" /> Limpiar
            </b-button>
            <b-button
              v-if="!viewOnlly && event"
              :disabled="sending"
              type="submit"
              variant="success"
            >
              <span v-if="sending">
                <b-spinner small label="Spinning" />Guardando...
              </span>
              <span v-else>
                <i class="fas fa-save" /> Guardar
              </span>
            </b-button>
            <b-button
              v-if="!viewOnlly && !event"
              :disabled="updating"
              type="submit"
              variant="success"
            >
              <span v-if="updating">
                <b-spinner small label="Spinning" />Actualizando...
              </span>
              <span v-else>
                <i class="fas fa-save" /> Actualizar
              </span>
            </b-button>
            <b-button
              v-if="saved"
              :disabled="sendingFile"
              variant="dark"
              @click="showModalStampPrint"
            >
              <i class="fas fa-stamp" /> Imprimir sello
            </b-button>
            <b-button :disabled="sendingFile" variant="danger" @click="hideModal">
              <i class="fas fa-times-circle" /> Cancelar
            </b-button>
          </div>
        </b-form>
      </b-modal>
      <!-- info modal anular -->
      <b-modal
        ref="modal-entryFiling-cancel"
        :id="cancelFiling.modal"
        no-close-on-esc
        no-close-on-backdrop
        hide-footer
      >
        <template v-slot:modal-title>
          <i class="fas fa-ban" />
          {{ tittleModalCancel }}
        </template>
        <b-form v-if="show && modalValidate === 1" @submitCancel="sendDataCancel">
          <b-form-group id="groupstate" label="Motivo:" label-for="reason">
            <b-form-select
              id="reason"
              v-model="cancelFiling.cancellationReason_id"
              :class="{'is-invalid': $v.cancelFiling.cancellationReason_id.$error}"
              name="reason"
            >
              <b-form-select-option :value="null">Seleccionar...</b-form-select-option>
              <b-form-select-option
                v-for="(item, index) in reasons"
                :key="index"
                :value="item.id"
              >{{ item.name }}</b-form-select-option>
            </b-form-select>
            <template v-if="$v.cancelFiling.cancellationReason_id.$error">
              <div
                v-if="!$v.cancelFiling.cancellationReason_id.required"
                class="invalid-feedback"
              >Seleccione el Motivo de Cancelación</div>
            </template>
          </b-form-group>
          <b-form-group id="groupname" label="Observación:" label-for="observation">
            <b-form-textarea
              id="observation"
              v-model="cancelFiling.description"
              :class="{'is-invalid': $v.cancelFiling.description.$error}"
              name="observation"
              rows="3"
              max-rows="6"
              placeholder="Ingrese observación"
            />
            <template v-if="$v.cancelFiling.description.$error">
              <div
                v-if="!$v.cancelFiling.description.required"
                class="invalid-feedback"
              >Digite la Descripción</div>
              <div
                v-if="!$v.cancelFiling.description.maxLength"
                class="invalid-feedback"
              >La Descripción Exede los 255 Caracteres</div>
            </template>
          </b-form-group>
          <div class="text-center">
            <b-button :disabled="sending" variant="success" @click="sendDataCancel">
              <span v-if="sending">
                <b-spinner small label="Spinning" />Anulando...
              </span>
              <span v-else>
                <i class="fas fa-ban" /> Anular
              </span>
            </b-button>
            <b-button variant="danger" @click="hideModalCancel">
              <i class="fas fa-times-circle" /> Cancelar
            </b-button>
          </div>
        </b-form>
      </b-modal>
      <!-- Componente para imprimir sello -->
      <ModalStampPrint :form="form" :info-people="infoPeople" :info-addressee="form.dependences" />
      <ModalNewDependence :toEntryFiling="true" />
    </div>
  </el-card>
</template>
<script>
import ModalStampPrint from '~/components/Filings/ModalStampPrint'
import ModalNewDependence from '~/components/Config/Modal/ModalNewDependence'
import {
  required,
  minLength,
  maxLength,
  between,
  email
} from 'vuelidate/lib/validators'
import drag from '@branu-jp/v-drag'
import { EventBus } from '~/plugins/event-bus'
import XLSX from 'xlsx'
export default {
  components: {
    ModalStampPrint,
    ModalNewDependence
  },
  //crear propiedad v-focus para autofocus inputs
  directives: {
    focus: {
      // Definición de directiva
      inserted: function(el) {
        el.focus()
      }
    },
    drag
  },
  data() {
    return {
      modalValidate: null,
      isModalStampPrintVisible: false,
      sendingFile: false,
      uploadPercentage: 0,
      max: 100,
      sortBy: 'date',
      sortDesc: false,
      filter: null,
      perPage: 10,
      currentPage: 1,
      means_document: [
        { value: null, text: 'Seleccionar...' },
        { value: 'digital', text: 'Digital' },
        { value: 'fisic', text: 'Físico' },
        { value: 'fisic/digital', text: 'Físico/Digital' }
      ],
      acces_level: [
        { value: null, text: 'Seleccionar...' },
        { value: 'public', text: 'Público' },
        { value: 'restricted', text: 'Restringido' }
      ],
      show: true,
      fields: [
        {
          key: 'id',
          label: '#',
          sortable: true
        },
        {
          key: 'settled',
          label: 'Radicado',
          sortable: true
        },
        {
          key: 'created_at',
          label: 'Fecha',
          sortable: true
        },
        {
          key: 'people.names',
          label: 'Remitente',
          sortable: true
        },
        {
          key: 'dependences',
          label: 'Destinatario(s)',
          sortable: true,
          formatter: value => {
            let names = value.map(val => {
              return val.names
            })
            return names.join(' - ')
          }
        },
        {
          key: 'means_document',
          label: 'Medio del Documento',
          sortable: true,
          formatter: value => {
            if (value == 'fisic') {
              return 'Físico'
            } else if (value == 'digital') {
              return 'Digital'
            } else {
              return 'Físico/Digital'
            }
          }
        },
        {
          key: 'acciones',
          label: 'Acciones',
          visible: false,
          sortable: false
        }
      ],
      infoPeople: null,
      form: {
        modal: 'modal-entryFiling',
        id: null,
        cons_year: null,
        date: null,
        title: null,
        settled: null,
        access_level: null,
        means_document: null,
        folios: null,
        annexes: 0,
        subject: null,
        key_words: null,
        attachments: null,
        dependences: null,
        context_type_id: null,
        type_document_id: null,
        people_id: null,
        priority_id: null
      },
      cancelFiling: {
        modal: 'modal-entryFiling-cancel',
        description: null,
        cancellationReason_id: null,
        entryFiling_id: null
      },
      saved: false,
      array_key_words: [],
      sending: null,
      updating: null,
      rows: this.cantidad,
      tittleModal: '',
      tittleModalCancel: '',
      event: null,
      person: true,
      viewOnlly: false,
      edit: false,
      pageOptions: [10, 20, 30],
      fileList: [],
      dateRange: [],
      fileUpload: '',
      json_fields: {
        'ID': 'id',
        'Radicado': 'settled',
        'Fecha': 'created_at',
        'Remitente': 'people.names',
        'Destinatario(s)': {
          field: 'dependences',
          callback: (value) => {
            let names = ''
            for (let index = 0; index < value.length; index++) {
              if (names === '') {
                names = value[index].names
              }else {
                names = names + ' - ' + value[index].names
              }
            }
            return names;
          }
        },
        /* 'Telephone 2' : {
            field: 'phone.landline',
            callback: (value) => {
                return `Landline Phone - ${value}`;
            }
        }, */
      },
      json_data: [
        {
          'id': 'Tony Peña',
          'settled': 'New York',
          'country': 'United States',
          'created_at': '1978-03-15',
          'people': {
              'names': '1-541-754-3010',
              'landline': '(541) 754-3010'
          }
        },
        {
          'id': 'Thessaloniki',
          'settled': 'Athens',
          'country': 'Greece',
          'created_at': '1987-11-23',
          'people': {
              'names': '+1 855 275 5071',
              'landline': '(2741) 2621-244'
          }
        }
      ],
      Datas: {
      // We will make a Workbook contains 2 Worksheets
        'animals': [
          {"name": "cat", "category": "animal"}
          ,{"name": "dog", "category": "animal"}
          ,{"name": "pig", "category": "animal"}
        ],
        'pokemons': [
          {"name": "pikachu", "category": "pokemon"}
          ,{"name": "Arbok", "category": "pokemon"}
          ,{"name": "Eevee", "category": "pokemon"}
        ]
      }
    }
  },
  validations() {
    if (this.modalValidate === 0) {
      let form = {
        form: {
          title: {
            required,
            maxLength: maxLength(150)
          },
          access_level: {
            required
          },
          means_document: {
            required
          },
          folios: {
            required,
            maxLength: maxLength(11)
          },
          subject: {
            required,
            maxLength: maxLength(2000)
          },
          key_words: {
            required,
            maxLength: maxLength(200)
          },
          context_type_id: {
            required
          },
          type_document_id: {
            required
          },
          people_id: {
            required
          },
          priority_id: {
            required
          },
          dependences: {
            required
          }
        }
      }
      return form
    } else if (this.modalValidate === 1) {
      let form = {
        cancelFiling: {
          description: {
            required,
            maxLength: maxLength(255)
          },
          cancellationReason_id: {
            required
          }
        }
      }
      return form
    } else {
      let form = {
        form: {
          title: {
            required,
            maxLength: maxLength(150)
          },
          access_level: {
            required
          },
          means_document: {
            required
          },
          folios: {
            required,
            maxLength: maxLength(11)
          },
          subject: {
            required,
            maxLength: maxLength(2000)
          },
          key_words: {
            required,
            maxLength: maxLength(200)
          },
          context_type_id: {
            required
          },
          type_document_id: {
            required
          },
          people_id: {
            required
          },
          priority_id: {
            required
          },
          dependences: {
            required
          }
        },
        cancelFiling: {
          description: {
            required,
            maxLength: maxLength(255)
          },
          cancellationReason_id: {
            required
          }
        }
      }
      return form
    }
  },
  computed: {
    apiUrl() {
      return process.env.API_BASE_URL
    },
    exportUrl() {
      return process.env.FILES_BASE_URL
    },
    dependence() {
      return this.$store.state.config.dependence
    },
    typeDocument() {
      return this.$store.state.config.typeDocument
    },
    contextType() {
      return this.$store.state.config.contextType
    },
    people() {
      return this.$store.state.config.people
    },
    priority() {
      return this.$store.state.config.priority
    },
    entryFiling() {
      return this.$store.state.filing.entryFiling
    },
    reasons() {
      return this.$store.state.config.cancellationReason
    },
    dato() {
      return this.$store.state.filing.allRow
    },
    resultResponse() {
      return this.$store.state.api.result
    },
    company() {
      return this.$store.state.company.company
    } /* ,
    totalAnnexes(){
      return this.fileList.length
    } */
  },
  watch: {
    /* cuando la variable sea afectada o tenga algun cambio ejecuta el proceso */
    dato() {
      this.rows = this.dato
      //this.dateRange = [ this.date, this.date]
    },
    array_key_words() {
      this.form.key_words = this.array_key_words.join(',')
    }
  },
  created() {
    //Middleware for see view for permission
    let storePermissions = this.$store.state.user.permissions
    let showPage =
      storePermissions.find(item => item === 'see_based_entrance') === undefined
    if (showPage) {
      this.$router.push('/')
    }else {
      this.$store.dispatch('filing/getEntryFiling')
    }
  },
  methods: {
    exportToExcel() { // On Click Excel download button
      let me = this
      let fromDate, toDate
      if (me.dateRange.length) {
        fromDate = me.dateRange[0]
        toDate = me.dateRange[1]
      } else {
        fromDate = ''
        toDate = ''
      }
      me.$axios({
        method: 'get',
        url: `entryfiling/export?fromDate=${fromDate}&toDate=${toDate}`, /* enviamos la url de la api y la ruta con sus parametros para descargar el csv */
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
          XLSX.utils.book_append_sheet(wb, exportData, 'RadicacionEntrada') // sheetAName is name of Worksheet
          // export Excel file
          XLSX.writeFile(wb, 'RadicacionEntrada.xlsx') // name of the file is 'book.xlsx'
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
    showModalStampPrint() {
      this.$refs['modal-entryFiling'].hide()
      //Mostrar Modal Imprimir Sello
      EventBus.$emit('showModalPrint')
    },
    beforeRemove(file, fileList) {
      //solicitamos la ocnfirmacion para eliminar el archivo
      if (this.viewOnlly) {
      } else {
        return this.$confirm(
          `Esta seguro de eliminar el archivo, ${file.name} ?`
        )
      }
    },
    handleRemove(file, fileList) {
      let me = this
      if (this.viewOnlly) {
      } else {
        let listFiles = this.fileList
        let index = listFiles.splice(
          listFiles.findIndex(({ uid }) => uid == file.uid),
          1
        )
        //eliminamos el archivo del array
        this.$delete(this.fileList, index)
        //eliminamos el archivpo del storage y la base de datos
        this.$axios
          .post(`/entry-filing/delete-files/${file.id}`)
          .then(res => {
            //agrega el file en el array con el nombre y ur que quedo en bd
            this.$store.dispatch('filing/getEntryFiling')
            this.$swal({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: res.data.message,
              showConfirmButton: false,
              timer: 3000
            })
            //console.log(res)
          })
          .catch(err => {
            console.error(err)
          })
      }
    },
    handlePreview(file) {
      //console.log(file)
      this.$axios
        .get(`get-file/entryFiling/${file.name}/${this.form.settled}`, {
          responseType: 'arraybuffer'
        })
        .then(res => {
          let blob = new Blob([res.data], { type: 'application/*' })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = file.name
          link.click()
          //agrega el file en el array con el nombre y ur que quedo en bd
          //this.$store.dispatch('filing/getEntryFiling')
          /* this.$swal({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: res.data.message,
          showConfirmButton: false,
          timer: 3000
        }) */
          //console.log(res)
        })
        .catch(err => {
          this.sendingFile = false
          console.error(err)
        })
      //console.log(res);
    },
    updateList(file) {
      this.fileUpload = file.raw
    },
    getFocus() {
      document.getElementById('key_words').focus()
      //console.log('tecla presionada')
    },
    modalCancel(item, index, button) {
      this.$store.dispatch('config/getCancellationReason')
      this.sending = false
      this.cancelFiling.description = null
      this.cancelFiling.state = null
      this.cancelFiling.entryFiling_id = item.id
      this.tittleModalCancel = 'Anular ' + item.settled
      this.$refs['modal-entryFiling-cancel'].show()
      this.modalValidate = 1
    },
    newEntryFiling(view) {
      if (view) {
        this.viewOnlly = true
      } else {
        this.viewOnlly = false
        this.edit = false
      }
      this.sending = false
      this.modalValidate = 0
      this.$store.dispatch('config/getDependence', 1)
      this.$store.dispatch('config/getTypeDocument')
      this.$store.dispatch('config/getPriority')
      this.$store.dispatch('config/getPeople', true)
      this.$store.dispatch('config/getContextType')
      this.array_key_words = []
      this.infoPeople = null
      this.form.id = null
      this.form.cons_year = null
      this.form.title = null
      this.form.date = null
      this.form.settled = null
      this.form.access_level = null
      this.form.means_document = null
      this.form.folios = null
      this.form.annexes = 0
      this.form.subject = null
      this.form.key_words = null
      this.form.attachments = null
      this.form.dependences = null
      this.form.context_type_id = null
      this.form.type_document_id = null
      this.form.people_id = null
      this.form.priority_id = null
      this.tittleModal = 'Nuevo Registro'
      this.event = 1
      this.saved = false
      this.fileList = []
      this.$refs['modal-entryFiling'].show()
    },
    modalEdit(item, index, button, view) {
      if (view) {
        this.tittleModal = 'Ver ' + item.settled
        this.viewOnlly = true
        this.saved = true
      } else {
        this.saved = false
        this.viewOnlly = false
        this.tittleModal = 'Editar ' + item.settled
      }
      this.modalValidate = 0
      this.edit = true
      this.$store.dispatch('config/getDependence', 1)
      this.$store.dispatch('config/getTypeDocument')
      this.$store.dispatch('config/getPriority')
      this.$store.dispatch('config/getPeople', true)
      this.$store.dispatch('config/getContextType')
      item.up_files.forEach(element => {
        this.fileList.push({
          name: element.name,
          url: element.url,
          id: element.id
        })
      })
      this.array_key_words = item.key_words.split([','])
      this.form.id = item.id
      this.form.cons_year = item.cons_year
      this.form.title = item.title
      this.form.date = item.created_at
      this.form.settled = item.settled
      this.form.access_level = item.access_level
      this.form.means_document = item.means_document
      this.form.folios = item.folios
      this.form.annexes = item.annexes
      this.form.subject = item.subject
      this.form.state = item.state
      this.form.key_words = item.key_words
      this.form.attachments = item.attachments
      this.form.dependences = item.dependences
      this.form.context_type_id = item.context_type_id
      this.form.type_document_id = item.type_document_id
      this.form.people_id = item.people
      this.infoPeople = item.people
      this.form.priority_id = item.priority_id
      this.event = 0
      this.$refs['modal-entryFiling'].show()
    },
    clearModal() {
      this.array_key_words = []
      this.infoPeople = null
      this.$v.$reset()
      this.form = {
        id: null,
        cons_year: null,
        title: null,
        date: null,
        settled: null,
        access_level: null,
        means_document: null,
        folios: null,
        annexes: 0,
        subject: null,
        key_words: null,
        attachments: null,
        dependences: null,
        context_type_id: null,
        type_document_id: null,
        people_id: null,
        priority_id: null
      }
    },
    hideModal() {
      this.$refs['modal-entryFiling'].hide()
      setTimeout(() => {
        this.$v.$reset()
        this.viewOnlly = false
        this.edit = false
        this.saved = false
        this.array_key_words = []
        this.fileList = []
        this.infoPeople = null
        this.modalValidate = null
        this.form = {
          id: null,
          cons_year: null,
          title: null,
          date: null,
          settled: null,
          access_level: null,
          means_document: null,
          folios: null,
          annexes: 0,
          subject: null,
          key_words: null,
          attachments: null,
          dependences: null,
          context_type_id: null,
          type_document_id: null,
          people_id: null,
          priority_id: null
        }
      }, 500)
    },
    hideModalCancel() {
      this.$refs['modal-entryFiling-cancel'].hide()
      setTimeout(() => {
        this.modalValidate = null
        this.$v.$reset()
        this.cancelFiling = {
          description: null,
          cancellationReason_id: null,
          entryFiling_id: null
        }
      }, 500)
    },
    sendDataCancel(evt) {
      evt.preventDefault()
      let me = this
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      } else {
        me.sending = true
        this.$swal({
          title: '¿Estás seguro?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#4dbd74',
          cancelButtonColor: '#d33',
          confirmButtonText: '<i class="far fa-check-circle"></i> Si, Anular!',
          cancelButtonText: '<i class="far fa-times-circle"></i> Cancelar'
        }).then(result => {
          if (result.value) {
            //Inactivar
            if (me.cancelFiling.entryFiling_id) {
              let params = {
                url: `entry-filing-cancel/${me.cancelFiling.entryFiling_id}`,
                data: me.cancelFiling,
                action: 'filing/getEntryFiling',
                dateRange: me.dateRange
              }
              //let url = `entry-filing-state/${id}`
              me.$store.dispatch('api/cancelFiling', params)
              setTimeout(() => {
                me.sending = false
                /* if (me.dateRange.length > 0) {
                  me.$store.dispatch('filing/getEntryFiling', me.dateRange)
                } else {
                  me.$store.dispatch('filing/getEntryFiling')
                } */
                me.hideModalCancel()
              }, 2000)
            }
          } else {
            me.sending = false
            me.hideModalCancel()
          }
        })
      }
    },
    sendData(evt) {
      evt.preventDefault()
      let me = this
      me.form.title = me.form.title ? me.form.title.toUpperCase() : ''
      me.form.people_id = me.infoPeople ? me.infoPeople.id : ''
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      } else {
        //Crear
        me.form.state = 1
        me.sending = true
        //console.log(me.form.attachments)
        if (me.event) {
          let params = {
            url: 'entry-filing',
            data: me.form,
            files: false
          }
          me.$store.dispatch('api/create', params)
          setTimeout(() => {
            me.sending = false
            if (me.dateRange.length > 0) {
              me.$store.dispatch('filing/getEntryFiling', me.dateRange)
            } else {
              me.$store.dispatch('filing/getEntryFiling')
            }
            //me.hideModal()
            me.edit = true
            me.saved = true
            me.viewOnlly = false
            me.event = 0
            if (me.resultResponse) {
              me.form.settled = me.resultResponse.settled
              me.form.date = me.resultResponse.created_at
              me.form.id = me.resultResponse.id
              //me.form.people_id = me.resultResponse.id
              me.tittleModal = `Radicado # ${me.resultResponse.settled}`
            }
            me.$v.$reset()
          }, 2000)
          //alert(JSON.stringify(params))
        } else {
          //actualizar
          me.updating = true
          let params = {
            url: `entry-filing/${me.form.id}`,
            data: me.form,
            action: 'filing/getEntryFiling',
            dispatchParams: me.dateRange.length ? true : false,
            actionDispatch: me.dateRange
          }
          me.$store.dispatch('api/update', params)
          setTimeout(() => {
            me.updating = false
            /* if (me.dateRange.length) {
              me.$store.dispatch('filing/getEntryFiling', me.dateRange)
            } else {
              me.$store.dispatch('filing/getEntryFiling')
            } */
          }, 2000)
        }
      }
    },
    onFiltered(filteredItems) {
      // actualiza la paginacion cuando se usa el filtro
      this.rows = filteredItems.length
      this.currentPage = 1
    },
    uploadFileTemp(file) {
      this.uploadPercentage = 0
      this.sendingFile = true
      this.form.annexes = this.fileList.length
      //console.log(this.form.annexes)
      let formData = new FormData()
      formData.append('id', this.form.id)
      formData.append('settled', this.form.settled)
      formData.append('annexes', this.form.annexes)
      formData.append('file', this.fileUpload) //get last element for array
      this.$axios
        .post('/entry-filing/upload-temp-files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: function(progressEvent) {
            this.uploadPercentage = Math.floor(
              (100 * progressEvent.loaded) / progressEvent.total
            )
          }.bind(this)
        })
        .then(res => {
          //agrega el file en el array con el nombre y ur que quedo en bd
          this.fileList.push({
            name: res.data.data.name,
            url: process.env.filesBaseUrl + res.data.data.url,
            id: res.data.data.id
          })
          //console.log(res.data)
          this.sendingFile = false
          if (this.dateRange.length) {
            this.$store.dispatch('filing/getEntryFiling', this.dateRange)
          } else {
            this.$store.dispatch('filing/getEntryFiling')
          }
          this.$swal({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: res.data.message,
            showConfirmButton: false,
            timer: 3000
          })
          //console.log(res)
        })
        .catch(err => {
          this.sendingFile = false
          console.error(err)
        })
    },
    getDataForDate() {
      this.$store.dispatch('filing/getEntryFiling', this.dateRange)
    },
    downloadReport(){
      let me = this
      let fromDate, toDate
      if (me.dateRange.length) {
        fromDate = me.dateRange[0]
        toDate = me.dateRange[0]
      } else {
        fromDate = me.$moment().format('yyyy-MM-DD')
        toDate = me.$moment().format('yyyy-MM-DD')
      }
      me.$axios({
        method: 'get',
        url: `entryfiling/export?fromDate=${fromDate}&toDate=${toDate}`, /* enviamos la url de la api y la ruta con sus parametros para descargar el csv */
        responseType: 'blob'
      })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download",me.returnDateAct()+'_'+fromDate+'A'+toDate+"_EntryFilling.xlsx")
        document.body.appendChild(link)
        link.click()
        me.$swal({
          title: "Descarga éxitosa!",
          icon: 'error',
          confirmButtonColor: '#4dbd74',
          confirmButtonText:
            '<i class="far fa-check-circle"></i> Aceptar',
          timer: 2000
        })
      })
      .catch(error => {
        /* Swal.fire({
            position: "top",
            type: "error",
            title: "Error al descargar, Reintentar!",
            showConfirmButton: false,
            timer: 1500
        }); */
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
    showPDFTemplate() {
      if (!this.dateRange.length) {
        window.open(process.env.apiBaseUrl + `/template-entry-filing`)
      } else {
        window.open(
          process.env.apiBaseUrl +
            `/template-entry-filing?fromDate=${this.dateRange[0]}&toDate=${
              this.dateRange[1]
            }`
        )
      }
    },
    showModalDependence() {
      EventBus.$emit('showModalNewDependence')
    }
  }
}
</script>
<style lang="scss">
.entry_filing {
  .body_entry {
    border-top: 1px solid gray;
  }
  .overflow-auto {
    padding: 0 20px;
  }
  .select_custom {
    width: 50%;
  }
  .alert_not_data {
    font-size: 18px;
  }
}
.row_content {
  .add_button_custom {
    height: 35px;
    margin-top: 29px;
  }
}
.upload_view {
  .el-upload--text {
    display: none;
  }
  .el-icon-close::before {
    display: none;
  }
}
.custom_datePicker {
  height: 35px !important;
}
.demo-outer {
  margin: 5px;
  height: 200px;
  border: 1px dashed #000;
}
</style>
