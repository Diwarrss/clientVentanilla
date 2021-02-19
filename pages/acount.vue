<template>
  <el-card class="box-card">
    <div
      slot="header">
      <i class="far fa-id-card"/>
      <span> Cuenta</span>
    </div>
    <div
      id="content_acount"
      class="row">
      <!-- datos -->
      <div class="col-md-4">
        <el-card class="box-card">
          <div
            slot="header"
            class="clearfix">
            <h5 class="mb-0"><i class="fas fa-user-circle"/>  Mi Perfil</h5>
          </div>
          <div class="text item">
            <b-form>
              <b-form-group
                id="groupinitial"
                label="Nombre de Usuario:"
                label-for="username">
                <b-form-input
                  id="username"
                  v-model="form.username"
                  :class="{ 'is-invalid': $v.form.username.$error || errors.username }"
                  name="username"
                  placeholder="Ingrese Nombre de Usuario"/>
                <template v-if="$v.form.username.$error">
                  <div
                    v-if="!$v.form.username.required"
                    class="invalid-feedback">
                    Digite el Nombre de Usuario
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
                label="E-mail:"
                label-for="email">
                <b-form-input
                  id="email"
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
              <b-form-group
                id="groupstate"
                label="Rol:"
                label-for="rol">
                <b-form-input
                  id="rol"
                  :value="rol_name"
                  disabled/>
              </b-form-group>
              <b-form-group
                id="groupstate"
                label="Dependencia:"
                label-for="dependence_id">
                <v-select
                  id="dependence_id"
                  :reduce="dependence => dependence.id"
                  v-model="form.dependence_id"
                  :options="dependence"
                  disabled
                  placeholder="Seleccionar..."
                  label="names"
                  class="vue_select_input"
                  name="dependence_id">
                  <div slot="no-options">No hay Resultados!</div>
                </v-select>
              </b-form-group>
              <b-form-group
                id="groupstate"
                label="Persona:"
                label-for="dependencePerson_id">
                <v-select
                  id="dependencePerson_id"
                  :reduce="dependencePerson => dependencePerson.id"
                  v-model="form.dependencePerson_id"
                  :options="dependencePerson"
                  disabled
                  placeholder="Seleccionar..."
                  label="names"
                  class="vue_select_input"
                  name="dependencePerson_id">
                  <div slot="no-options">No hay Resultados!</div>
                </v-select>
              </b-form-group>
              <div
                class="text-center">
                <b-button
                  :disabled="updating"
                  variant="success"
                  @click="sendData('dataUser')">
                  <span v-if="updating">
                    <b-spinner
                      small
                      label="Spinning"/> Actualizando...
                  </span>
                  <span v-else>
                    <i class="fas fa-save"/> Actualizar Datos
                  </span>
                </b-button>
              </div>
            </b-form>
          </div>
        </el-card>
      </div>
      <!-- imagen -->
      <div class="col-md-4">
        <el-card class="box-card">
          <div
            slot="header"
            class="clearfix">
            <h5 class="mb-0"><i class="fas fa-image"/> Mi Foto</h5>
          </div>
          <div class="text item">
            <b-form-group
              id="groupstate"
              label="Imagen Perfil:"
              label-for="state">
              <el-upload
                :on-preview="handlePictureCardPreview"
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
          </div>
          <div
            class="text-center">
            <b-button
              :disabled="updatingImage"
              variant="success"
              @click="sendData('changeImage')">
              <span v-if="updatingImage">
                <b-spinner
                  small
                  label="Spinning"/> Actualizando...
              </span>
              <span v-else>
                <i class="fas fa-save"/> Actualizar Imagen
              </span>
            </b-button>
          </div>
        </el-card>
      </div>
      <!-- password -->
      <div class="col-md-4">
        <el-card class="box-card">
          <div
            slot="header"
            class="clearfix">
            <h5 class="mb-0"><i class="fas fa-key"/> Mi Contraseña</h5>
          </div>
          <div class="text item">
            <b-form>
              <b-form-group
                id="groupinitial"
                label="Contraseña Anterior:"
                label-for="oldPassword">
                <b-form-input
                  id="oldPassword"
                  ref="oldPassword"
                  :class="{'is-invalid': $v.form.oldPassword.$error}"
                  v-model="form.oldPassword"
                  type="password"
                  name="oldPassword"
                  placeholder="Ingrese Contraseña Anterior"/>
                <template v-if="$v.form.oldPassword.$error">
                  <div
                    v-if="!$v.form.oldPassword.required"
                    class="invalid-feedback">
                    Digite la Contraseña
                  </div>
                  <div
                    v-if="!$v.form.oldPassword.maxLength"
                    class="invalid-feedback">
                    La Contraseña Exede los 130 Caracteres
                  </div>
                  <div
                    v-if="!$v.form.oldPassword.minLength"
                    class="invalid-feedback">
                    El Contraseña Debe Tener Mínimo 8 Caracteres
                  </div>
                </template>
              </b-form-group>
              <b-form-group
                id="groupinitial"
                label="Contraseña:"
                label-for="password">
                <b-form-input
                  id="password"
                  ref="password"
                  :class="{'is-invalid': $v.form.password.$error}"
                  v-model="form.password"
                  type="password"
                  name="password"
                  placeholder="Ingrese Nueva Contraseña"/>
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
                label="Confirmar Contraseña:"
                label-for="confirm_password">
                <b-form-input
                  id="confirm_password"
                  v-model="form.confirm_password"
                  :class="{'is-invalid': $v.form.confirm_password.$error}"
                  type="password"
                  name="confirm_password"
                  placeholder="Ingrese Confirmación de Contraseña"/>
                <template v-if="$v.form.confirm_password.$error">
                  <div
                    v-if="!$v.form.confirm_password.sameAsPassword"
                    class="invalid-feedback">
                    Las Contraseñas no Coindicen
                  </div>
                </template>
              </b-form-group>
              <div
                class="text-center">
                <b-button
                  :disabled="updatingPassword"
                  variant="success"
                  @click="sendData('changePassword')">
                  <span v-if="updatingPassword">
                    <b-spinner
                      small
                      label="Spinning"/> Actualizando...
                  </span>
                  <span v-else>
                    <i class="fas fa-save"/> Actualizar Contraseña
                  </span>
                </b-button>
              </div>
            </b-form>
          </div>
        </el-card>
      </div>
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
      rolUser: null,
      typeData: '',
      updating: false,
      updatingPassword: false,
      updatingImage: false,
      form: {
        modal: 'modal-user',
        id: null,
        username: null,
        names: null,
        email: null,
        oldPassword: null,
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
      errors: {},
      dialogVisible: false,
      imageView: [],
      dialogImageUrl: ''
    }
  },
  validations() {
    if (this.typeData === 'dataUser') {
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
          oldPassword: {},
          password: {},
          confirm_password: {}
        }
      }
      return form
    } else if (this.typeData === 'changePassword') {
      let form = {
        form: {
          username: {},
          email: {},
          oldPassword: {
            required,
            minLength: minLength(8),
            maxLength: maxLength(255)
          },
          password: {
            required,
            minLength: minLength(8),
            maxLength: maxLength(255)
          },
          confirm_password: {
            sameAsPassword: sameAs('password')
          }
        }
      }
      return form
    }
    let form = {
      form: {
        username: {},
        email: {},
        oldPassword: {},
        password: {},
        confirm_password: {}
      }
    }
    return form
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    rol_name() {
      return this.$store.state.user.roles[0]
    },
    dependence() {
      return this.$store.state.config.dependence
    },
    dependencePerson() {
      return this.$store.state.config.dependencePerson
    }
  },
  created() {
    this.$store.dispatch('api/clearErrors')
    this.$store.dispatch('user/getAllRoles', false) //send param with out permissions
    this.$store.dispatch('config/getDependence', 2)
    this.$store.dispatch('config/getDependencePerson', 3)
    this.form.id = this.user.id
    this.form.username = this.user.username
    this.form.email = this.user.email
    this.form.rol = this.user.rol
    this.form.dependence_id = this.user.dependence_id
    this.form.dependencePerson_id = this.user.dependencePerson_id
    this.imageView = [
      {
        name: 'image.png',
        url: process.env.filesBaseUrl + this.user.image
      }
    ]
  },
  methods: {
    sendData(type) {
      let me = this
      me.errors = {}
      me.typeData = type //para realizar validación de formulario dinamicamente

      //validamos q no tenga errores el formulario
      me.$v.$touch()
      if (me.$v.$invalid) {
        return //retornamos errores
      } else {
        //actualizar
        //let loader = me.$loading.show()
        if (type === 'dataUser') {
          //al actualizar los datos basicos
          me.updating = true
          let params = {
            username: me.form.username,
            email: me.form.email
          }
          me.$axios
            .post('/change-data', params)
            .then(res => {
              setTimeout(() => {
                me.$swal({
                  title: res.data.message,
                  icon: 'success',
                  confirmButtonColor: '#4dbd74',
                  confirmButtonText:
                    '<i class="far fa-check-circle"></i> Aceptar',
                  timer: 2000
                })
                me.updating = false
                this.$auth.fetchUser()
                this.$v.$reset()
                //loader.hide()
              }, 1000)
            })
            .catch(err => {
              //loader.hide()
              if (err.response.status == 422) {
                me.errors = err.response.data.errors
              }
              me.updating = false
            })
        } else if (type === 'changePassword') {
          //al cambiar la contraseña
          me.updatingPassword = true
          let params = {
            old_password: me.form.oldPassword,
            new_password: me.form.password,
            confirm_password: me.form.confirm_password
          }
          me.$axios
            .post('/change-password', params)
            .then(res => {
              setTimeout(() => {
                this.$swal({
                  title: res.data.message,
                  icon: res.data.type,
                  confirmButtonColor: '#4dbd74',
                  confirmButtonText:
                    '<i class="far fa-check-circle"></i> Aceptar',
                  timer: 2000
                })
                me.updatingPassword = false
                me.form.oldPassword = ''
                me.form.password = ''
                me.form.confirm_password = ''
                this.$v.$reset()
                //loader.hide()
              }, 1000)
            })
            .catch(err => {
              //loader.hide()
              console.error(err)
            })
        } else if (type === 'changeImage') {
          //cambiar imagen del usuario logueado (acount)
          if (!me.form.image.length) {
          } else {
            me.updatingImage = true
            //estanadrizamos para enviar imagenes o archivos sin problema
            let formData = new FormData()
            formData.append(
              'image',
              me.form.image.length ? me.form.image[0] : 'img/users/profile.png'
            )
            this.$axios
              .post('change-image', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
              .then(res => {
                setTimeout(() => {
                  this.$swal({
                    title: res.data.message,
                    icon: 'success',
                    confirmButtonColor: '#4dbd74',
                    confirmButtonText:
                      '<i class="far fa-check-circle"></i> Aceptar',
                    timer: 2000
                  })
                  me.updatingImage = false
                  this.$auth.fetchUser()
                  this.$v.$reset()
                  //loader.hide()
                }, 1000)
              })
              .catch(err => {
                //loader.hide()
                console.error(err)
              })
          }
        }
      }
    },
    handlePictureCardPreview(file) {
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
    beforeImageUpload(file) {
      //console.log('Antes de subir')
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
#content_acount {
  .el-card__header {
    background-color: #63c2de !important;
  }
}
</style>
