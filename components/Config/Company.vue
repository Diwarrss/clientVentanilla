<template>
  <b-card>
    <b-row>
      <b-col lg="6">
        <div class="text item">
          <b-form-group
            id="groupstate"
            label="Imagen inicio de sesión:"
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
        <div>
          <b-button
            :disabled="updatingImage"
            variant="success"
            @click="sendData(true)">
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
      </b-col>
      <b-col lg="6">
        <div class="text item">
          <b-form-group
            id="groupstate"
            label="Logotipo de radicación:"
            label-for="state">
            <el-upload
              :on-preview="handlePictureCardPreview"
              :on-change="updateLogoList"
              :on-remove="handleRemoveLogo"
              :before-upload="beforeLogoUpload"
              :auto-upload="false"
              :on-exceed="handleExceed"
              :file-list="logoView"
              :limit="1"
              class="mb-2"
              action="/"
              list-type="picture-card">
              <i class="el-icon-plus"/>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img
                :src="dialogLogoUrl"
                width="100%"
                alt="">
            </el-dialog>
          </b-form-group>
        </div>
        <div>
          <b-button
            :disabled="updatingLogo"
            variant="success"
            @click="sendData(false)">
            <span v-if="updatingLogo">
              <b-spinner
                small
                label="Spinning"/> Actualizando...
            </span>
            <span v-else>
              <i class="fas fa-save"/> Actualizar Logo
            </span>
          </b-button>
        </div>
      </b-col>
    </b-row>
  </b-card>
</template>
<script>
export default {
  data() {
    return {
      updatingImage: false,
      updatingLogo: false,
      form: {
        logo: [],
        image: []
      },
      errors: {},
      dialogVisible: false,
      imageView: [],
      logoView: [],
      dialogImageUrl: '',
      dialogLogoUrl: ''
    }
  },
  created() {
    this.$axios.get('company')
    .then(res => {
      this.company = res.data
      this.imageView = [
        {
          name: 'image.png',
          url: process.env.filesBaseUrl + this.company.image
        }
      ]
      this.logoView = [
        {
          name: 'logo.png',
          url: process.env.filesBaseUrl + this.company.logo
        }
      ]
    })
    .catch(err => {
      console.error(err);
    })
  },
  methods: {
    sendData(type) {
      let me = this
      me.errors = {}
      //validamos q no tenga errores el formulario
      //actualizar
      //cambiar imagen del usuario logueado (acount)
      if (type) {
        if (!me.form.image.length) {
        } else {
          me.updatingImage = true
          //estanadrizamos para enviar imagenes o archivos sin problema
          let formData = new FormData()
          formData.append(
            'image',
            me.form.image.length ? me.form.image[0] : 'img/company/image.png'
          )
          this.$axios
            .post('change-image-company', formData, {
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
                //loader.hide()
              }, 1000)
            })
            .catch(err => {
              //loader.hide()
              console.error(err)
            })
        }
      } else {
        if (!me.form.logo.length) {
        } else {
          me.updatingLogo = true
          //estanadrizamos para enviar imagenes o archivos sin problema
          let formData = new FormData()
          formData.append(
            'image',
            me.form.logo.length ? me.form.logo[0] : 'img/company/logo.png'
          )
          this.$axios
            .post('change-logo-company', formData, {
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
                me.updatingLogo = false
                this.$store.dispatch("company/getCompany");
                //loader.hide()
              }, 1000)
            })
            .catch(err => {
              //loader.hide()
              console.error(err)
            })
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
    updateLogoList(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt1M = file.size / 2048 / 2048 < 4
      this.logoView.push({
        name: file.name,
        url: URL.createObjectURL(file.raw)
      })
      this.form.logo.push(file.raw)
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
    handleRemoveLogo(file, fileList) {
      let listImages = this.form.logo
      let index = listImages.splice(
        listImages.findIndex(({ uid }) => uid == file.uid),
        1
      )
      this.$delete(this.form.logo, index)
      this.logoView = []
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
    beforeLogoUpload(file) {
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
