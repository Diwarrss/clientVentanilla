<template>
  <div class="rol_permission">
    <b-card>
      <div class="border-bottom">
        <b-button
          variant="primary"
          class="mb-3"
          @click="newRol()"><i class="fas fa-plus-circle"/> Nuevo</b-button>
      </div>
      <el-tabs
        v-model="activeName"
        tab-position="top"
        class="mr-3 ml-3 mt-2"
        @tab-click="handleClick">
        <el-tab-pane
          v-if="roleHasPermissions.length"
          v-for="(item, index) in roleHasPermissions"
          :key="index"
          :label="item.name"
          :name="item.name">
            <b-form-group class="mt-2">
              <b-form-checkbox
                v-for="(option, index) in allPermissions"
                v-model="selected"
                :key="index"
                :value="option.id"
                name="flavour-4a"
                switch
                inline
                @change="updatePermissionRole(option.id, 'customSwitch'+index)">
                {{ option.title }}
              </b-form-checkbox>
            </b-form-group>
          </el-tab-pane>
      </el-tabs>
      <!-- Info modal -->
      <b-modal
        no-close-on-esc
        no-close-on-backdrop
        ref="modal-rol"
        id="modal_rol"
        title="Nuevo Rol"
        hide-footer>
        <template v-slot:modal-title>
          <i class="fas fa-plus-circle"/> Nuevo Rol
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
              v-model="formRol.name"
              placeholder="Ingrese Nombre"
              :class="{'is-invalid': $v.formRol.name.$error || errors.name}"/>
            <template v-if="$v.formRol.name.$error">
              <div class="invalid-feedback" v-if="!$v.formRol.name.required">
                Digite el Nombre
              </div>
              <div class="invalid-feedback" v-if="!$v.formRol.name.maxLength">
                El nombre Exede los 200 Caracteres
              </div>
            </template>
            <template v-if="errors.name">
              <div class="invalid-feedback">
                {{ errors.name[0] }}
              </div>
            </template>
          </b-form-group>
          <div
            class="text-center">
            <b-button
              type="submit"
              :disabled="sending"
              variant="success">
              <span v-if="sending">
                <b-spinner small label="Spinning"/> Guardando...
              </span>
              <span v-else>
                <i class="fas fa-save"/> Guardar
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
import { required, minLength, maxLength, between, integer } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      formRol: {
        name: ''
      },
      activeName: '',
      rolInfo: 0,
      selected: [],
      state: '',
      allSelect: this.selected,
      check_id: '',
      show: true,
      sending: false
    }
  },
  validations() {
    let formRol = {
      formRol: {
        name: {
          required,
          maxLength: maxLength(200)
        }
      }
    }
    return formRol
  },
  watch: {
    selected() {
      //console.log(this.selected.length)
      this.allSelect<this.selected.length ? this.state = true : this.state = false
      this.allSelect = this.selected.length
      if (this.check_id != '') {
        if (!this.state) {
          let params = {
            url: 'delete-role-has-permissions',
            data: {
              role_id: this.rolInfo,
              permission_id: this.check_id
            }
          }
          this.$store.dispatch('api/delete', params)
          console.log('eliminado', params)
          /* this.$notify({
            title: 'Eliminado',
            message: 'Permiso Eliminado con éxito',
            type: 'error',
            duration: 4000
          }) */
        }else{
          let params = {
            notify: true,
            url: 'role-has-permissions',
            data: {
              role_id: this.rolInfo,
              permission_id: this.check_id
            },
            files: false
          }
          this.$store.dispatch('api/create', params)
          console.log('agregado', params)
        }
      }
    }
  },
  computed: {
    roleHasPermissions() {
      return this.$store.state.config.rolHasPermission
    },
    allPermissions() {
      return this.$store.state.config.allPermissions
    },
    errors() {
      return this.$store.state.api.errors
    }
  },
  methods: {
    //enlistamos los permisos por rol seleccionado
    sendData(evt) {
      evt.preventDefault()
      let me = this
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      } else {
        //Crear
        this.sending = true
        let params = {
          url: 'all-rol',
          data: me.formRol,
          files: false
        }
        me.$store.dispatch('api/create', params)
        setTimeout(() => {
          if (Object.keys(me.errors).length >= 1) { //validation back
            me.sending = false
            return
          }else {
            me.sending = false
            this.$store.dispatch('config/getRolHasPermission')
            this.$store.dispatch('config/getPermission')
            me.hideModal()
          }
        }, 2000);
      }
    },
    handleClick(tab, event) {
      //console.log(this.roleHasPermissions)
      this.$store.dispatch('config/getRolHasPermission')
      this.$store.dispatch('config/getPermission')
      this.rolInfo = this.roleHasPermissions.find(rhp => rhp.name === this.activeName).id
      this.selected = this.roleHasPermissions.find(rhp => rhp.name === this.activeName).permissions.map(rp => {return rp.id})
      this.check_id = ''
    },
    updatePermissionRole(permissionId, checkId){
      this.check_id = permissionId
    },
    newRol() {
      this.$refs['modal-rol'].show()
    },
    hideModal() {
      this.$refs['modal-rol'].hide()
      this.$v.$reset()
      this.formRol = {
        name: null
      }
    }
  }
}
</script>
<style lang="scss">
  .rol_permission{
    /* .el-tabs__content{
      overflow-y: scroll;
    } */
    .custom-control-label{
      min-width: 220px;
      &:hover{
        cursor: pointer;
      }
    }
  }
</style>
