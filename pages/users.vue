<template>
  <el-card class="box-card user">
    <div
      slot="header"
      class="clearfix">
      <i class="fas fa-users"/>
      <span class="cardhead"> Usuarios</span>
    </div>
    <div>
      <div>
        <b-button
          v-permission="'create_user'"
          variant="primary"
          @click="newUser(false)"><i class="fas fa-plus-circle"/> Nuevo</b-button>
          <!-- <b-button
          variant="success"><i class="fas fa-file-csv"/> Exportar</b-button> -->
      </div>
      <div
        v-if="user.length"
        class="mt-2 pt-3 body_user">
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
              id="table-user"
              :fields="fields"
              :items="user"
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
              @filtered="onFiltered"
            >
              <!-- se pinta el componente para el slot acciones -->
              <template v-slot:cell(acciones)="row">
                <b-button
                  variant="primary"
                  @click="modalEdit(row.item, row.index, $event.target, true)"><i class="fas fa-eye mr-md-1"/><span class="d-none d-md-inline-block">Ver</span></b-button>
                <b-button
                  v-permission="'edit_user'"
                  variant="warning"
                  @click="modalEdit(row.item, row.index, $event.target, false)"><i class="fas fa-edit mr-md-1"/><span class="d-none d-md-inline-block">Editar</span></b-button>
                <b-button
                  v-if="row.item.state == 1"
                  v-permission="'change_user_status'"
                  variant="danger"
                  @click="status(row.item.id, 'disable')"><i class="fas fa-times-circle mr-md-1"/><span class="d-none d-md-inline-block">Inactivar</span></b-button>
                <b-button
                  v-if="row.item.state == 0"
                  v-permission="'change_user_status'"
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
              aria-controls="table-user"
            />
          </div>
        </template>
      </div>
      <!-- Info modal -->
      <b-modal
        ref="modal-user"
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
          v-if="show"
          @submit="sendData">
          <div class="form-row">
            <b-form-group
              id="groupinitial"
              class="col-md-6"
              label="Username:"
              label-for="username">
              <b-form-input
                id="username"
                :disabled="viewOnlly ? true : false"
                v-model="form.username"
                :class="{ 'is-invalid': $v.form.username.$error || errors.username }"
                name="username"
                placeholder="Ingrese Username"/>
              <template v-if="$v.form.username.$error">
                <div
                  v-if="!$v.form.username.required"
                  class="invalid-feedback">
                  Digite el Username
                </div>
                <div
                  v-if="!$v.form.username.maxLength"
                  class="invalid-feedback">
                  El Username Exede los 30 Caracteres
                </div>
              </template>
              <template v-if="errors.username">
                <div class="invalid-feedback">
                  {{ errors.username[0] }}
                </div>
              </template>
            </b-form-group>
            <b-form-group
              id="groupinitial"
              class="col-md-6"
              label="E-mail:"
              label-for="email">
              <b-form-input
                id="email"
                :disabled="viewOnlly ? true : false"
                v-model="form.email"
                :class="{'is-invalid': $v.form.email.$error || errors.email}"
                name="email"
                placeholder="Ingrese e-mail"/>
              <template v-if="$v.form.email.$error">
                <div
                  v-if="!$v.form.email.required"
                  class="invalid-feedback">
                  Digite el E-mail
                </div>
                <div
                  v-if="!$v.form.email.maxLength"
                  class="invalid-feedback">
                  El E-mail Exede los 130 Caracteres
                </div>
                <div
                  v-if="!$v.form.email.email"
                  class="invalid-feedback">
                  El E-mail es Invalido
                </div>
              </template>
              <template v-if="errors.email">
                <div class="invalid-feedback">
                  {{ errors.email[0] }}
                </div>
              </template>
            </b-form-group>
          </div>
          <div class="form-row">
            <b-form-group
              id="groupinitial"
              class="col-md-6"
              label="Password:"
              label-for="password">
              <b-form-input
                id="password"
                ref="password"
                :disabled="viewOnlly ? true : false"
                :class="{'is-invalid': $v.form.password.$error}"
                v-model="form.password"
                type="password"
                name="password"
                placeholder="Ingrese Password"/>
              <template v-if="$v.form.password.$error">
                <div
                  v-if="!$v.form.password.required"
                  class="invalid-feedback">
                  Digite la Contraseña
                </div>
                <div
                  v-if="!$v.form.password.maxLength"
                  class="invalid-feedback">
                  La Contraseña Exede los 130 Caracteres
                </div>
                <div
                  v-if="!$v.form.password.minLength"
                  class="invalid-feedback">
                  El Contraseña Debe Tener Mínimo 8 Caracteres
                </div>
              </template>
            </b-form-group>
            <b-form-group
              id="groupinitial"
              class="col-md-6"
              label="Confirmar Password:"
              label-for="confirm_password">
              <b-form-input
                id="confirm_password"
                :disabled="viewOnlly ? true : false"
                v-model="form.confirm_password"
                :class="{'is-invalid': $v.form.confirm_password.$error}"
                type="password"
                name="confirm_password"
                placeholder="Ingrese Confirmación de Password"/>
              <template v-if="$v.form.confirm_password.$error">
                <div
                  v-if="!$v.form.confirm_password.sameAsPassword"
                  class="invalid-feedback">
                  Las Contraseñas no Coindicen
                </div>
              </template>
            </b-form-group>
          </div>
          <div class="form-row">
            <b-form-group
              id="groupstate"
              class="col-md-6"
              label="Rol:"
              label-for="rol">
              <b-form-select
                id="rol"
                :disabled="viewOnlly ? true : false"
                v-model="form.rol"
                :class="{'is-invalid': $v.form.rol.$error}"
                name="rol">
                <b-form-select-option :value="null">Seleccionar...</b-form-select-option>
                <b-form-select-option
                  v-for="(item, index) in allRoles"
                  :disabled="viewOnlly ? true : false"
                  :key="index"
                  :value="item.name">{{ item.name }}
                </b-form-select-option>
              </b-form-select>
              <template v-if="$v.form.rol.$error">
                <div
                  v-if="!$v.form.rol.required"
                  class="invalid-feedback">
                  Seleccione el Rol
                </div>
              </template>
            </b-form-group>
            <b-form-group
              id="groupstate"
              class="col-md-6"
              label="Estado:"
              label-for="state">
              <b-form-select
                id="state"
                :disabled="viewOnlly ? true : false"
                v-model="form.state"
                :class="{'is-invalid': $v.form.state.$error}"
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
          </div>
          <div class="form-row">
            <b-form-group
              id="groupstate"
              class="col-md-6"
              label="Dependencia:"
              label-for="dependence_id">
              <v-select
                id="dependence_id"
                :reduce="dependence => dependence.id"
                v-model="form.dependence_id"
                :disabled="viewOnlly ? true : false"
                :options="dependence"
                placeholder="Seleccionar..."
                label="names"
                class="vue_select_input"
                name="dependence_id">
                <div slot="no-options">No hay Resultados!</div>
              </v-select>
            </b-form-group>
            <b-form-group
              id="groupstate"
              class="col-md-6"
              label="Persona:"
              label-for="dependencePerson_id">
              <v-select
                id="dependencePerson_id"
                :reduce="dependencePerson => dependencePerson.id"
                v-model="form.dependencePerson_id"
                :disabled="viewOnlly ? true : false"
                :options="dependencePerson"
                placeholder="Seleccionar..."
                label="names"
                class="vue_select_input"
                name="dependencePerson_id">
                <div slot="no-options">No hay Resultados!</div>
              </v-select>
            </b-form-group>
          </div>
          <div class="form-row">
            <b-form-group
              id="groupstate"
              class="col-md-6"
              label="Imagen Perfil:"
              label-for="image">
              <el-upload
                id="image"
                :on-preview="handlePictureCardPreviewImage"
                :on-change="updateImageList"
                :on-remove="handleRemoveImage"
                :before-upload="beforeImageUpload"
                :auto-upload="false"
                :on-exceed="handleExceed"
                :file-list="imageView"
                :limit="1"
                class="mb-2"
                action="/"
                list-type="picture-card">
                <i class="el-icon-plus"/>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img
                  :src="dialogImageUrl"
                  width="100%"
                  alt="">
              </el-dialog>
            </b-form-group>
            <b-form-group
              id="groupstate"
              class="col-md-6"
              label="Firma:"
              label-for="firm">
              <el-upload
                id="firm"
                :on-preview="handlePictureCardPreviewFirm"
                :on-change="updateFirmList"
                :on-remove="handleRemoveFirm"
                :before-upload="beforeImageUpload"
                :auto-upload="false"
                :on-exceed="handleExceed"
                :file-list="firmView"
                :limit="1"
                class="mb-2"
                action="/"
                list-type="picture-card">
                <i class="el-icon-plus"/>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img
                  :src="dialogImageUrl"
                  width="100%"
                  alt="">
              </el-dialog>
            </b-form-group>
          </div>
          <div
            v-if="!viewOnlly"
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
              v-else
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
    </div>
  </el-card>
</template>
<script>
import {
  required,
  minLength,
  maxLength,
  between,
  integer,
  sameAs,
  email
} from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      sortBy: 'date',
      sortDesc: false,
      filter: null,
      perPage: 10,
      currentPage: 1,
      show: true,
      states: [
        { value: null, text: 'Seleccionar...' },
        { value: 1, text: 'Activo' },
        { value: 0, text: 'Inactivo' }
      ],
      fields: [
        {
          key: 'id',
          label: '#',
          sortable: true
        },
        {
          key: 'username',
          label: 'Username',
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
          key: 'roles',
          label: 'Rol',
          sortable: true,
          formatter: value => {
            return value[0].name
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
        modal: 'modal-user',
        id: null,
        username: null,
        email: null,
        password: null,
        confirm_password: null,
        state: null,
        rol: null,
        oldRol: null,
        dependence_id: '',
        dependencePerson_id: '',
        firm: [],
        image: []
      },
      firmView: [],
      imageView: [],
      sending: false,
      updating: false,
      rows: this.cantidad,
      tittleModal: '',
      event: null,
      person: true,
      viewOnlly: false,
      pageOptions: [10, 20, 30],
      dateRange: '',
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  validations() {
    if (this.event === 0) {
      let form = {
        form: {
          username: {
            required,
            maxLength: maxLength(30)
          },
          email: {
            required,
            maxLength: maxLength(130),
            email
          },
          password: {},
          confirm_password: {
            sameAsPassword: sameAs('password')
          },
          rol: {
            required
          },
          state: {
            required
          }
        }
      }
      return form
    }
    let form = {
      form: {
        username: {
          required,
          maxLength: maxLength(30)
        },
        email: {
          required,
          maxLength: maxLength(130),
          email
        },
        password: {
          required,
          minLength: minLength(8),
          maxLength: maxLength(255)
        },
        confirm_password: {
          sameAsPassword: sameAs('password')
        },
        rol: {
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
    user() {
      return this.$store.state.user.users
    },
    allRoles() {
      return this.$store.state.user.allRoles
    },
    dato() {
      return this.$store.state.user.allRow
    },
    errors() {
      return this.$store.state.api.errors
    },
    dependence() {
      return this.$store.state.config.dependence
    },
    dependencePerson() {
      return this.$store.state.config.dependencePerson
    }
  },
  watch: {
    /* cuando la variable sea afectada o tenga algun cambio ejecuta el proceso */
    dato() {
      this.rows = this.dato
    }
  },
  created() {
    //Middleware for see view for permission
    let storePermissions = this.$store.state.user.permissions
    let showPage =
      storePermissions.find(item => item === 'see_configuration') === undefined
    if (showPage) {
      this.$router.push('/')
    } else {
      this.$store.dispatch('user/getUsers')
      //console.log(process.env.filesBaseUrl)
    }
  },
  methods: {
    newUser(view) {
      if (view) {
        this.viewOnlly = true
      } else {
        this.viewOnlly = false
      }
      this.sending = false
      this.updating = false
      this.$store.dispatch('api/clearErrors')
      this.$store.dispatch('user/getAllRoles', false) //send param with out permissions
      this.$store.dispatch('config/getDependence', 2)
      this.$store.dispatch('config/getDependencePerson', 3)
      this.form.id = null
      this.form.username = null
      this.form.email = null
      this.form.password = null
      this.form.confirm_password = null
      this.form.state = null
      this.form.dependence_id = ''
      this.form.dependencePerson_id = ''
      this.form.rol = null
      this.form.oldRol = null
      this.form.firm = []
      this.form.image = []
      this.firmView = []
      this.imageView = []
      this.tittleModal = 'Nuevo Registro'
      this.event = 1
      this.$refs['modal-user'].show()
    },
    modalEdit(item, index, button, view) {
      console.log(item)
      if (view) {
        this.tittleModal = 'Ver ' + item.username
        this.viewOnlly = true
      } else {
        this.viewOnlly = false
        this.tittleModal = 'Editar ' + item.username
      }
      this.$store.dispatch('api/clearErrors')
      this.$store.dispatch('user/getAllRoles', false)
      this.$store.dispatch('config/getDependence', 2)
      this.$store.dispatch('config/getDependencePerson', 3)
      this.form.id = item.id
      this.form.username = item.username
      this.form.email = item.email
      this.form.password = null
      this.form.confirm_password = null
      this.form.state = item.state
      this.form.dependence_id = item.dependence_id
      this.form.dependencePerson_id = item.dependencePerson_id
      this.form.rol = item.roles[0].name
      this.form.oldRol = item.roles[0].name
      console.log(process.env.filesBaseUrl + item.firm)
      this.firmView = [
        { name: 'firm.png', url: process.env.filesBaseUrl + item.firm }
      ]
      this.imageView = [
        { name: 'image.png', url: process.env.filesBaseUrl + item.image }
      ]
      this.event = 0
      this.$refs['modal-user'].show()
    },
    hideModal() {
      this.$refs['modal-user'].hide()
      this.viewOnlly = false
      this.form = {
        id: null,
        username: null,
        email: null,
        password: null,
        confirm_password: null,
        state: null,
        dependence_id: '',
        dependencePerson_id: '',
        rol: null,
        oldRol: null,
        firm: [],
        image: []
      }
      this.firmView = []
      this.imageView = []
      this.$v.$reset()
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
                url: `all-user-state/${id}`,
                action: 'user/getUsers'
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
      //estanadrizamos para enviar imagenes o archivos sin problema
      let formData = new FormData()
      formData.append('id', me.form.id)
      formData.append('username', me.form.username)
      formData.append('email', me.form.email)
      formData.append('password', me.form.password)
      formData.append('confirm_password', me.form.confirm_password)
      formData.append('state', me.form.state)
      formData.append('dependence_id', me.form.dependence_id != null ? me.form.dependence_id : '')
      formData.append('dependencePerson_id', me.form.dependencePerson_id != null ? me.form.dependencePerson_id : '')
      formData.append('rol', me.form.rol)
      formData.append('oldRol', me.form.oldRol)
      formData.append(
        'firm',
        me.form.firm.length ? me.form.firm[0] : 'users/firm.png'
      )
      formData.append(
        'image',
        me.form.image.length ? me.form.image[0] : 'users/profile.png'
      )
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      } else {
        //Crear
        this.sending = true
        //console.log(me.form.attachments)
        if (me.event) {
          let params = {
            url: 'all-user',
            data: formData,
            files: true
          }
          me.$store.dispatch('api/create', params)
          setTimeout(() => {
            if (Object.keys(me.errors).length >= 1) {
              //validation back
              me.sending = false
              return
            } else {
              me.sending = false
              me.$store.dispatch('user/getUsers')
              me.hideModal()
            }
          }, 2000)
          //alert(JSON.stringify(params))
        } else {
          //actualizar
          me.updating = true
          let params = {
            url: `all-user/${me.form.id}`,
            data: formData,
            files: true,
            action: 'user/getUsers'
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
              //me.$store.dispatch('user/getUsers')
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
    },
    handlePictureCardPreviewImage(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlePictureCardPreviewFirm(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    updateImageList(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt1M = file.size / 2048 / 2048 < 4
      this.imageView.push({
        name: file.name,
        url: URL.createObjectURL(file.raw)
      })
      this.form.image.push(file.raw)
    },
    updateFirmList(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt1M = file.size / 2048 / 2048 < 4
      this.firmView.push({
        name: file.name,
        url: URL.createObjectURL(file.raw)
      })
      this.form.firm.push(file.raw)
    },
    handleRemoveImage(file, fileList) {
      let listImages = this.form.image
      let index = listImages.splice(
        listImages.findIndex(({ uid }) => uid == file.uid),
        1
      )
      this.$delete(this.form.image, index)
      this.imageView = []
      //console.log(file, fileList)
    },
    handleRemoveFirm(file, fileList) {
      let listImages = this.form.firm
      let index = listImages.splice(
        listImages.findIndex(({ uid }) => uid == file.uid),
        1
      )
      this.$delete(this.form.firm, index)
      this.firmView = []
      //console.log(file, fileList)
    },
    beforeImageUpload(file) {
      console.log('Antes de subir')
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt1M = file.size / 2000 / 2000 < 4

      if (!isJPG || !isPNG) {
        this.$swal({
          position: 'top',
          icon: 'error',
          title: 'La imagen debe estar en formato JPG o PNG!',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          timer: 1500
        })
      }
      if (!isLt1M) {
        this.$swal({
          position: 'top',
          icon: 'error',
          title: 'La imagen excede los 4MB!',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          timer: 1500
        })
      }
      return isJPG && isLt1M
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `El límite es 1, haz seleccionado ${files.length} archivos esta vez,
        añade hasta ${files.length}`
      )
    }
  }
}
</script>
<style lang="scss">
.user {
  .body_user {
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
