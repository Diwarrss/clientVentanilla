<template>
  <el-card class="box-card">
    <div
      slot="header"
      class="clearfix">
      <i class="fas fa-wrench"/>
      <span class="cardhead"> Configuración</span>
    </div>
    <div>
      <el-tabs
        v-model="activeName"
        type="card"
        @tab-click="handleClick">
        <el-tab-pane name="tabCompany">
          <span slot="label"><i class="fas fa-building" /> Empresa</span>
          <Company/>
        </el-tab-pane>
        <el-tab-pane name="tabDependence">
          <span
            slot="label"><i class="fas fa-user-tie"/> Remitente/Destinatario</span>
          <!-- Dependencias o Personas-->
          <Dependence :cantidad="dato"/>
        </el-tab-pane>
        <el-tab-pane name="tabTypeDocument">
          <span slot="label"><i class="far fa-file"/> Tipo Documento</span>
          <!-- Tipo de documento -->
          <TypeDocument :cantidad="dato"/>
        </el-tab-pane>
        <el-tab-pane name="tabPriority">
          <span slot="label"><i class="fas fa-exclamation"/> Prioridades</span>
          <Priority :cantidad="dato"/>
        </el-tab-pane>
        <el-tab-pane name="tabPeople">
          <span slot="label"><i class="fas fa-people-carry"/> Remitentes</span>
          <People :cantidad="dato"/>
        </el-tab-pane>
        <el-tab-pane name="tabContextType">
          <span slot="label"><i class="fas fa-file-contract"/> Tipo Contexto</span>
          <ContextType :cantidad="dato"/>
        </el-tab-pane>
        <el-tab-pane name="tabTypeIdentification">
          <span slot="label"><i class="far fa-id-card"/> Tipo Identificación</span>
          <TypeIdentification :cantidad="dato"/>
        </el-tab-pane>
        <el-tab-pane name="tabGender">
          <span slot="label"><i class="fas fa-venus-mars"/> Géneros</span>
          <Gender :cantidad="dato"/>
        </el-tab-pane>
        <el-tab-pane name="tabCancellationReason">
          <span slot="label"><i class="fas fa-ban"/> Motivos Anulación</span>
          <CancellationReason :cantidad="dato"/>
        </el-tab-pane>
        <el-tab-pane
          v-if="viewRoles"
          name="tabRol">
          <span slot="label"><i class="fas fa-user-cog"/> Roles de usuario</span>
          <RolAndPermission/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>
<script>
/* import Dependences from '~/components/Configuration/Dependences' */
import Dependence from '~/components/Config/Dependence'
import TypeDocument from '~/components/Config/TypeDocument'
import Priority from '~/components/Config/Priority'
import People from '~/components/Config/People'
import ContextType from '~/components/Config/ContextType'
import TypeIdentification from '~/components/Config/TypeIdentification'
import Gender from '~/components/Config/Gender'
import RolAndPermission from '~/components/Config/RolAndPermission'
import CancellationReason from '~/components/Config/CancellationReason'
import Company from '~/components/Config/Company'
export default {
  components: {
    Dependence,
    TypeDocument,
    Priority,
    People,
    ContextType,
    TypeIdentification,
    Gender,
    RolAndPermission,
    CancellationReason,
    Company
  },
  data() {
    return {
      activeName: '',
      viewRoles: false
      /* ,
      dato: 16 */
    }
  },
  /* async asyncData({ app, store }) { */
  /* if (app.activeName == 'tabDependence') {
      store.dispatch('config/getDependence')
    } else if (app.activeName == 'tabTypeDocument') {
      let { data: typeDocument } = await app.$axios.get('type-documents')
      store.dispatch('config/getTypeDocument', typeDocument)
    } else if (app.activeName == 'tabTypeIdentification') {
      store.dispatch('config/getTypeIdentification')
    } */
  /* console.log(app.activeName)
    let { data: dependence } = await app.$axios.get('dependences')
    store.dispatch('config/getPriority', dependence)

    let { data: typeDocument } = await app.$axios.get('type-documents')
    store.dispatch('config/getTypeDocument', typeDocument)

    let { data: priority } = await app.$axios.get('priorities')
    store.dispatch('config/getPriority', priority)

    let { data: people } = await app.$axios.get('people')
    store.dispatch('config/getPeople', people)

    let { data: contextType } = await app.$axios.get('context-types')
    store.dispatch('config/getContextType', contextType)

    let { data: typeIdentification } = await app.$axios.get(
      'type-identifications'
    )
    store.dispatch('config/getTypeIdentification', typeIdentification)

    let { data: gender } = await app.$axios.get('genders')
    store.dispatch('config/getGender', gender) */
  /* }, */
  computed: {
    dato() {
      return this.$store.state.config.allRow
    }
  },
  created() {
    //Middleware for see view for permission
    let storePermissions = this.$store.state.user.permissions
    let showPage =
      storePermissions.find(item => item === 'see_configuration') === undefined
    if (showPage) {
      this.$router.push('/')
    }
    let storeViewRoles = this.$store.state.user.permissions
    this.viewRoles = !(
      storeViewRoles.find(item => item === 'manage_roles') === undefined
    )
  },
  methods: {
    handleClick(tab, event) {
      if (this.activeName == 'tabDependence') {
        /* this.$store.dispatch('config/getGender')
        this.$store.dispatch('config/getTypeIdentification') */
        this.$store.dispatch('config/getDependence', 0)
      } else if (this.activeName == 'tabTypeDocument') {
        this.$store.dispatch('config/getTypeDocument')
      } else if (this.activeName == 'tabPriority') {
        this.$store.dispatch('config/getPriority')
      } else if (this.activeName == 'tabPeople') {
        /* this.$store.dispatch('config/getGender')
        this.$store.dispatch('config/getTypeIdentification') */
        this.$store.dispatch('config/getPeople', false)
      } else if (this.activeName == 'tabContextType') {
        this.$store.dispatch('config/getContextType')
      } else if (this.activeName == 'tabTypeIdentification') {
        this.$store.dispatch('config/getTypeIdentification')
      } else if (this.activeName == 'tabGender') {
        this.$store.dispatch('config/getGender')
      } else if (this.activeName == 'tabRol') {
        this.$store.dispatch('config/getRolHasPermission')
        this.$store.dispatch('config/getPermission')
      } else if (this.activeName == 'tabCancellationReason') {
        this.$store.dispatch('config/getCancellationReason')
      }
    },
    activePermission(value) {
      let storePermissions = this.$store.state.user.permissions
      return !(storePermissions.find(item => item === value) === undefined)
    }
  }
}
</script>
<style lang="scss">
.cardhead {
  font-size: 16px;
}
</style>
