<template>
  <div class="modal_responder_radicado_salida">
    <b-modal
      ref="modal-outgoingFiling"
      :id="form.modal"
      no-close-on-esc
      no-close-on-backdrop
      size="lg"
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
        v-if="show && modalValidate === 0"
        enctype="multipart/form-data"
        @submit="sendData">
        <div class="form-row">
          <b-form-group
            v-if="!event && form.settled != ''"
            id="groupinitial"
            class="col-md-6"
            label="Radicado:"
            label-for="settled">
            <b-form-input
              id="settled"
              v-model="form.settled"
              name="settled"
              disabled/>
          </b-form-group>
          <b-form-group
            v-if="!event && form.date != ''"
            id="groupinitial"
            class="col-md-6"
            label="Fecha de creación:"
            label-for="date">
            <b-form-input
              id="date"
              v-model="form.date"
              name="date"
              disabled/>
          </b-form-group>
        </div>
        <div class="form-row">
          <b-form-group
            id="groupname"
            class="col-12"
            label="Titulo:"
            label-for="title">
            <b-form-input
              id="title"
              :disabled="viewOnlly ? true : false"
              v-model="form.title"
              :class="{'is-invalid': $v.form.title.$error}"
              autofocus
              placeholder="Ingrese titulo"/>
            <template v-if="$v.form.title.$error">
              <div
                v-if="!$v.form.title.required"
                class="invalid-feedback">
                Digite el Titulo
              </div>
              <div
                v-if="!$v.form.title.maxLength"
                class="invalid-feedback">
                El Titulo Exede los 150 Caracteres
              </div>
            </template>
          </b-form-group>
        </div>
        <div class="form-row">
          <b-form-group
            id="groupstate"
            class="col-md-4"
            label="Nivel de acceso:"
            label-for="access_level">
            <b-form-select
              id="access_level"
              :disabled="viewOnlly ? true : false"
              v-model="form.access_level"
              :class="{'is-invalid': $v.form.access_level.$error}"
              :options="acces_level"/>
            <template v-if="$v.form.access_level.$error">
              <div
                v-if="!$v.form.access_level.required"
                class="invalid-feedback">
                Seleccione el Nivel de Acceso
              </div>
            </template>
          </b-form-group>
          <b-form-group
            id="groupstate"
            class="col-md-4"
            label="Prioridad:"
            label-for="priority_id">
            <b-form-select
              id="priority_id"
              :disabled="viewOnlly ? true : false"
              v-model="form.priority_id"
              :class="{'is-invalid': $v.form.priority_id.$error}">
              <b-form-select-option :value="null">Seleccionar...</b-form-select-option>
              <b-form-select-option
                v-for="(item, index) in priority"
                :disabled="viewOnlly ? true : false"
                :key="index"
                :value="item.id">{{ item.name }}
              </b-form-select-option>
            </b-form-select>
            <template v-if="$v.form.priority_id.$error">
              <div
                v-if="!$v.form.priority_id.required"
                class="invalid-feedback">
                Seleccione la Prioridad
              </div>
            </template>
          </b-form-group>
          <b-form-group
            id="groupstate"
            class="col-md-4"
            label="Medio del documento:"
            label-for="means_document">
            <b-form-select
              id="means_document"
              :disabled="viewOnlly ? true : false"
              v-model="form.means_document"
              :class="{'is-invalid': $v.form.means_document.$error}"
              :options="means_document"/>
            <template v-if="$v.form.means_document.$error">
              <div
                v-if="!$v.form.means_document.required"
                class="invalid-feedback">
                Seleccione el Medio Documental
              </div>
            </template>
          </b-form-group>
        </div>
        <div class="form-row">
          <b-form-group
            id="groupstate"
            class="col-md-4"
            label="Tipo de Contexto:"
            label-for="context_tipe">
            <b-form-select
              id="context_tipe"
              :disabled="viewOnlly ? true : false"
              v-model="form.context_type_id"
              :class="{'is-invalid': $v.form.context_type_id.$error}">
              <b-form-select-option :value="null">Seleccionar...</b-form-select-option>
              <b-form-select-option
                v-for="(item, index) in contextType"
                :disabled="viewOnlly ? true : false"
                :key="index"
                :value="item.id">{{ item.name }}
              </b-form-select-option>
            </b-form-select>
            <template v-if="$v.form.context_type_id.$error">
              <div
                v-if="!$v.form.context_type_id.required"
                class="invalid-feedback">
                Seleccione el Tipo de Contexto
              </div>
            </template>
          </b-form-group>
          <b-form-group
            id="groupstate"
            class="col-md-5"
            label="Tipo de documento:"
            label-for="type_document_id">
            <b-form-select
              id="type_document_id"
              :disabled="viewOnlly ? true : false"
              v-model="form.type_document_id"
              :class="{'is-invalid': $v.form.type_document_id.$error}">
              <b-form-select-option :value="null">Seleccionar...</b-form-select-option>
              <b-form-select-option
                v-for="(item, index) in typeDocument"
                :disabled="viewOnlly ? true : false"
                :key="index"
                :value="item.id">{{ item.name }}
              </b-form-select-option>
            </b-form-select>
            <template v-if="$v.form.type_document_id.$error">
              <div
                v-if="!$v.form.type_document_id.required"
                class="invalid-feedback">
                Seleccione el Tipo de Documento
              </div>
            </template>
          </b-form-group>
          <b-form-group
            id="groupname"
            class="col-md-3"
            label="Folios:"
            label-for="folios">
            <b-form-input
              id="folios"
              oninput="validity.valid||(value='');"
              min="0"
              :disabled="viewOnlly ? true : false"
              v-model="form.folios"
              :class="{'is-invalid': $v.form.folios.$error}"
              type="number"
              placeholder="Ingrese folios"/>
            <template v-if="$v.form.folios.$error">
              <div
                v-if="!$v.form.folios.required"
                class="invalid-feedback">
                Digite el Número de Folios
              </div>
              <div
                v-if="!$v.form.folios.maxLength"
                class="invalid-feedback">
                El Número de Folios Exede los 11 Caracteres
              </div>
            </template>
          </b-form-group>
        </div>
        <div class="form-row row_content">
          <b-form-group
            id="groupstate"
            class="col-9"
            label="Remitente:"
            label-for="dependence_id">
            <v-select
              id="dependence_id"
              v-model="infoDependence"
              :disabled="viewOnlly || edit ? true : false"
              :options="dependence"
              :class="{'is-invalid': $v.form.dependence_id.$error}"
              placeholder="Seleccionar..."
              label="names"
              class="vue_select_input">
              <div slot="no-options">No hay Resultados!</div>
            </v-select>
            <template v-if="$v.form.dependence_id.$error">
              <div
                v-if="!$v.form.dependence_id.required"
                class="invalid-feedback">
                Seleccione el Remitente
              </div>
            </template>
          </b-form-group>
          <b-button v-permission="'new_person_from_settled'" :disabled="viewOnlly ? true : false" variant="secondary" class="col-3 add_button_custom" @click="showModalDependence()"><i class="fas fa-plus-circle" /> Crear Nuevo</b-button>
          <b-button v-permission:unless="'new_person_from_settled'" variant="secondary" class="col-3 add_button_custom" disabled><i class="fas fa-plus-circle" /> Crear Nuevo</b-button>
          <b-form-group
            id="groupstate"
            class="col-12"
            label="Anexos y Observaciones:"
            label-for="subject">
            <b-form-textarea
              id="subject"
              :disabled="viewOnlly ? true : false"
              v-model="form.subject"
              :class="{'is-invalid': $v.form.subject.$error}"
              placeholder="Ingrese Observaciones"
              name="subject"
              rows="3"
              max-rows="6"/>
            <template v-if="$v.form.subject.$error">
              <div
                v-if="!$v.form.subject.required"
                class="invalid-feedback">
                Digite las Observaciones
              </div>
              <div
                v-if="!$v.form.subject.maxLength"
                class="invalid-feedback">
                Exede los 2000 Caracteres
              </div>
            </template>
          </b-form-group>
          <b-form-group
            id="groupstate"
            class="col-12"
            label="Palabras clave:"
            label-for="key_words">
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
              duplicate-tag-text="Palabra duplicada"/>
            <template v-if="$v.form.key_words.$error">
              <div
                v-if="!$v.form.key_words.required"
                class="invalid-feedback">
                Digite las Palabras Claves
              </div>
              <div
                v-if="!$v.form.key_words.maxLength"
                class="invalid-feedback">
                Las Palabras Claves Exeden los 255 Caracteres
              </div>
            </template>
          </b-form-group>
          <b-form-group
            id="groupstate"
            class="col-12"
            label="Destinatario:"
            label-for="people">
            <v-select
              id="people"
              v-model="form.dependence"
              :disabled="viewOnlly || edit ? true : false"
              :options="dependence"
              :class="{'is-invalid': $v.form.dependence.$error}"
              placeholder="Seleccionar..."
              label="names"
              class="vue_select_input"
              multiple>
              <div slot="no-options">No hay Resultados!</div>
            </v-select>
            <template v-if="$v.form.dependence.$error">
              <div
                v-if="!$v.form.dependence.required"
                class="invalid-feedback">
                Seleccione Destinatario
              </div>
            </template>
          </b-form-group>
          <b-col
            md="12">
            <span
              v-show="viewOnlly && fileList.length"
              class="font-weight-bold">
              <i class="fas fa-cloud-download-alt"/> Click para descargar anexo
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
              action="">
              <el-button
                size="small"
                type="primary"><i class="fas fa-upload"/> Clic para subir Anexo</el-button>
            </el-upload>
            <!-- <span class="">Click para descargar</span> -->
            <b-progress
              v-if="sendingFile"
              :max="max"
              class="mb-2">
              <b-progress-bar
                :value="uploadPercentage"
                :label="`${((uploadPercentage / max) * 100).toFixed(2)}%`"/>
            </b-progress>
          </b-col>
          <b-col
            md="12">
            <span
              v-show="viewOnlly && fileListGuide.length"
              class="font-weight-bold">
              <i class="fas fa-cloud-download-alt"/> Click para descargar guia
            </span>
            <el-upload
              :class="{ 'upload_view' : viewOnlly || event == 1 }"
              :http-request="uploadFileTempGuide"
              :on-change="updateListGuide"
              :on-preview="handlePreviewGuide"
              :on-remove="handleRemoveGuide"
              :before-remove="beforeRemoveGuide"
              :file-list="fileListGuide"
              :limit="1"
              class="upload-demo mb-4"
              action="">
              <el-button
                size="small"
                type="primary"><i class="fas fa-upload"/> Clic para subir Guia</el-button>
            </el-upload>
            <!-- <span class="">Click para descargar</span> -->
            <b-progress
              v-if="sendingFileGuide"
              :max="max"
              class="mb-2">
              <b-progress-bar
                :value="uploadPercentageGuide"
                :label="`${((uploadPercentageGuide / max) * 100).toFixed(2)}%`"/>
            </b-progress>
          </b-col>
        </div>
        <div
          class="text-center">
          <b-button
            v-if="!viewOnlly && event && !saved"
            variant="info"
            @click="clearModal"><i class="fas fa-eraser"/> Limpiar</b-button>
          <b-button
            v-if="!viewOnlly && event"
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
            v-if="!viewOnlly && !event"
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
            v-permission="'print_stamp'"
            v-if="saved"
            :disabled="sendingFile"
            variant="dark"
            @click="showModalStampPrint"><i class="fas fa-stamp"/> Imprimir sello</b-button> -->
          <b-button
            :disabled="sendingFile"
            variant="danger"
            @click="hideModal"><i class="fas fa-times-circle"/> Cancelar</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>
<script>
import { EventBus } from '~/plugins/event-bus'
import {
  required,
  maxLength
} from 'vuelidate/lib/validators'
export default {
  props: {
    dataEntryFiling: {
      type: Object,
      default: () => {}
    },
    modalEditView: {
      type: Boolean,
      default: () => true
    },
    newOutGoingFilingView: {
      type: Boolean,
      default: () => false
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      sendingFile: false,
      sendingFileGuide: false,
      uploadPercentage: 0,
      uploadPercentageGuide: 0,
      means_document: [
        { value: null, text: 'Seleccionar...' },
        { value: 'fisic', text: 'FÍSICO' },
        { value: 'digital', text: 'DIGITAL' },
        { value: 'fisic/digital', text: 'FÍSICO/DIGITAL' }
      ],
      acces_level: [
        { value: null, text: 'Seleccionar...' },
        { value: 'public', text: 'PÚBLICO' },
        { value: 'restricted', text: 'RESTRINGIDO' }
      ],
      show: true,
      infoDependence: null,
      form: {
        modal: 'modal-outgoingFiling',
        id: null,
        cons_year: null,
        date: null,
        title: null,
        settled: null,
        access_level: 'fisic',
        means_document: 'public',
        folios: null,
        annexes: 0,
        subject: null,
        key_words: null,
        attachments: null,
        dependence: null,
        context_type_id: 2,
        type_document_id: null,
        dependence_id: null,
        priority_id: 1,
        entry_filing_id: null
      },
      array_key_words: [],
      sending: null,
      updating: null,
      saved: null,
      tittleModal: '',
      event: null,
      viewOnlly: false,
      edit: false,
      fileList: [],
      fileListGuide: [],
      fileUpload: '',
      modalValidate: null
    }
  },
  validations() {
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
        dependence: {
          required
        },
        priority_id: {
          required
        },
        dependence_id: {
          required
        }
      }
    }
    return form
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    apiUrl() {
      return process.env.API_BASE_URL
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
    dependence() {
      return this.$store.state.config.dependence
    },
    priority() {
      return this.$store.state.config.priority
    },
    outgoingFiling() {
      return this.$store.state.filing.outGoingFiling
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
    }
  },
  watch: {
    array_key_words() {
      this.form.key_words = this.array_key_words.join(',')
    }
  },
  created() {
    EventBus.$on('showModalOurgoingFiling', () => {
      this.newOutGoingFiling(this.newOutGoingFilingView)
      this.form.entry_filing_id = this.dataEntryFiling.id
      setTimeout(() => {
        this.$refs['modal-outgoingFiling'].show()
      }, 500)
    })
  },
  methods: {
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
          .post(`/outgoing-filing/delete-files/${file.id}`)
          .then(res => {
            //agrega el file en el array con el nombre y ur que quedo en bd
            this.$store.dispatch('filing/getOutGoingFiling')
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
        .get(`get-file/outgoingFiling/${file.name}/${this.form.settled}`, {
          responseType: 'arraybuffer'
        })
        .then(res => {
          let blob = new Blob([res.data], { type: 'application/*' })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = file.name
          link.click()
          //agrega el file en el array con el nombre y ur que quedo en bd
          //this.$store.dispatch('filing/getOutGoingFiling')
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
          this.sendingFileGuide = false
          console.error(err)
        })
      //console.log(res);
    },
    updateList(file) {
      this.fileUpload = file.raw
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
        .post('/outgoing-filing/upload-temp-files', formData, {
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
            this.$store.dispatch('filing/getOutGoingFiling', this.dateRange)
          } else {
            this.$store.dispatch('filing/getOutGoingFiling')
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
    beforeRemoveGuide(file, fileList) {
      //solicitamos la ocnfirmacion para eliminar el archivo
      if (this.viewOnlly) {
      } else {
        return this.$confirm(
          `Esta seguro de eliminar el archivo, ${file.name} ?`
        )
      }
    },
    handleRemoveGuide(file, fileList) {
      let me = this
      if (this.viewOnlly) {
      } else {
        let listFiles = this.fileListGuide
        let index = listFiles.splice(
          listFiles.findIndex(({ uid }) => uid == file.uid),
          1
        )
        //eliminamos el archivo del array
        this.$delete(this.fileListGuide, index)
        //eliminamos el archivpo del storage y la base de datos
        this.$axios
          .post(`/outgoing-filing/delete-files/${file.id}`)
          .then(res => {
            //agrega el file en el array con el nombre y ur que quedo en bd
            this.$store.dispatch('filing/getOutGoingFiling')
            this.$swal({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: res.data.message,
              showConfirmButton: false,
              timer: 3000
            })
          })
          .catch(err => {
            console.error(err)
          })
      }
    },
    handlePreviewGuide(file) {
      this.$axios
        .get(`get-file/outgoingFiling/${file.name}/${this.form.settled}`, {
          responseType: 'arraybuffer'
        })
        .then(res => {
          let blob = new Blob([res.data], { type: 'application/*' })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = file.name
          link.click()
        })
        .catch(err => {
          this.sendingFile = false
          console.error(err)
        })
      //console.log(res);
    },
    updateListGuide(file) {
      this.fileUploadGuide = file.raw
    },
    uploadFileTempGuide(file) {
      this.uploadPercentageGuide = 0
      this.sendingFileGuide = true
      let formData = new FormData()
      formData.append('id', this.form.id)
      formData.append('settled', this.form.settled)
      formData.append('file', this.fileUploadGuide) //get last element for array
      this.$axios
        .post('/outgoing-filing/upload-guide', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: function(progressEvent) {
            this.uploadPercentageGuide = Math.floor(
              (100 * progressEvent.loaded) / progressEvent.total
            )
          }.bind(this)
        })
        .then(res => {
          //agrega el file en el array con el nombre y ur que quedo en bd
          this.fileListGuide.push({
            name: res.data.data.name,
            url: process.env.filesBaseUrl + res.data.data.url,
            id: res.data.data.id
          })
          //console.log(res.data)
          this.sendingFileGuide = false
          if (this.dateRange.length) {
            this.$store.dispatch('filing/getOutGoingFiling', this.dateRange)
          } else {
            this.$store.dispatch('filing/getOutGoingFiling')
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
          this.sendingFileGuide = false
          console.error(err)
        })
    },
    newOutGoingFiling(view) {
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
      this.$store.dispatch('config/getContextType')
      this.array_key_words = []
      this.infoDependence = null
      this.form.id = null
      this.form.cons_year = null
      this.form.title = null
      this.form.date = null
      this.form.settled = null
      this.form.access_level = 'public'
      this.form.means_document = 'fisic'
      this.form.folios = null
      this.form.annexes = 0
      this.form.subject = null
      this.form.key_words = null
      this.form.attachments = null
      this.form.context_type_id = 2
      this.form.type_document_id = null
      this.form.priority_id = 1
      if (this.dataEntryFiling) {
        this.tittleModal = 'Respuesta Radicado de Entrada # ' + this.dataEntryFiling.settled
        this.form.dependence_id = this.user.dependencePerson_id
        this.form.dependence = []
        this.form.dependence.push(this.dependence.find(rhp => rhp.id === this.dataEntryFiling.dependence_id.id))
        this.infoDependence = this.dependence.find(rhp => rhp.id === this.user.dependencePerson_id)
        this.form.title = 'Respuesta Radicado de Entrada # ' + this.dataEntryFiling.settled
        this.edit = true
      } else {
        this.tittleModal = 'Nuevo Registro'
        this.form.dependence_id = null
        this.form.dependence = null
        this.edit = false
        this.infoDependence = {}
      }
      this.event = 1
      this.saved = false
      this.fileList = []
      this.fileListGuide = []
      this.$refs['modal-outgoingFiling'].show()
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
      this.$store.dispatch('config/getContextType')
      item.up_files.forEach(element => {
        if (element.type === 0) {
          this.fileList.push({
            name: element.name,
            url: element.url,
            id: element.id
          })
        } else if (element.type === 1) {
          this.fileListGuide.push({
            name: element.name,
            url: element.url,
            id: element.id
          })
        }
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
      this.form.dependence = item.dependences
      this.form.context_type_id = item.context_type_id
      this.form.type_document_id = item.type_document_id
      this.form.dependence_id = item.dependence
      this.infoDependence = item.dependence
      this.form.priority_id = item.priority_id
      this.event = 0
    },
    clearModal() {
      this.array_key_words = []
      this.infoDependence = null
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
        dependence: null,
        context_type_id: null,
        type_document_id: null,
        dependence_id: null,
        priority_id: null
      }
      this.$v.$reset()
    },
    hideModal() {
      this.$refs['modal-outgoingFiling'].hide()
      setTimeout(() => {
        this.modalValidate = null
        this.viewOnlly = false
        this.edit = false
        this.saved = false
        this.array_key_words = []
        this.fileList = []
        this.fileListGuide = []
        this.infoDependence = null
        this.form = {
          id: null,
          cons_year: null,
          title: null,
          date: null,
          settled: null,
          access_level: 'public',
          means_document: 'fisic',
          folios: null,
          annexes: 0,
          subject: null,
          key_words: null,
          attachments: null,
          dependence: null,
          context_type_id: 2,
          type_document_id: null,
          dependence_id: null,
          priority_id: 1,
          entry_filing_id: null
        }
        this.$v.$reset()
      }, 500)
    },
    sendData(evt) {
      evt.preventDefault()
      let me = this
      me.form.title = me.form.title.toUpperCase()
      me.form.dependence_id = me.infoDependence ? me.infoDependence.id : ''
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      } else {
        //Crear
        if (me.event) {
          me.form.state = 1
          me.sending = true
          let params = {
            url: 'outgoing-filing',
            data: me.form,
            files: false
          }
          me.$store.dispatch('api/create', params)
          setTimeout(() => {
            me.sending = false
            me.$store.dispatch('filing/getEntryFiling')
            if (this.params) {
              me.$store.dispatch('filing/getResultFiling', this.params)
            }
            me.hideModal()
            me.edit = true
            me.saved = true
            me.viewOnlly = false
            me.event = 0
            if (me.resultResponse) {
              me.form.settled = me.resultResponse.settled
              me.form.date = me.resultResponse.created_at
              me.form.id = me.resultResponse.id
              //me.form.dependence_id = me.resultResponse.id
              me.tittleModal = `Radicado # ${me.resultResponse.settled}`
            }
          }, 2000)
          //alert(JSON.stringify(params))
        } else {
          //actualizar
          me.updating = true
          let params = {
            url: `outgoing-filing/${me.form.id}`,
            data: me.form,
            action: 'filing/getOutGoingFiling',
            dispatchParams: me.dateRange.length ? true : false,
            actionDispatch: me.dateRange
          }
          me.$store.dispatch('api/update', params)
          setTimeout(() => {
            me.updating = false
            /* if (me.dateRange.length) {
              me.$store.dispatch('filing/getOutGoingFiling', me.dateRange)
            } else {
              me.$store.dispatch('filing/getOutGoingFiling')
            } */
            //me.hideModal()
          }, 2000)
        }
      }
    },
    showModalDependence() {
      this.$store.dispatch("config/getTypePeople")
      EventBus.$emit('showModalNewDependence')
    }
  }
}
</script>
<style lang="scss">
.row_content {
  .add_button_custom {
    height: 35px;
    margin-top: 29px;
  }
}
</style>
