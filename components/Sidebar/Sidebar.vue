<template>
  <div class="sidebar">
    <SidebarHeader />
    <nav class="sidebar-nav">
      <div slot="header" />
      <ul class="nav">
        <li class="nav-item">
          <router-link
            to="/"
            class="nav-link" >
            <i class="fas fa-mail-bulk"/> Dashboard
          </router-link>
        </li>
        <li class="nav-title text-center">
          COMUNICACIONES
        </li>
        <li class="nav-item">
          <router-link
            v-if="activePermission('see_based_entrance')"
            to="/entryfiling"
            class="nav-link" >
            <i class="fas fa-file-import"/> Recibidas
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-if="activePermission('see_based_out')"
            to="/outgoingfiling"
            class="nav-link" >
            <i class="fas fa-file-export"/> Enviadas
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-if="activePermission('see_based_internal')"
            to="/internalfiling"
            class="nav-link" >
            <i class="fas fa-inbox" /> Internas
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-if="activePermission('search_based')"
            to="/searchfiling"
            class="nav-link" >
            <i class="fas fa-search-plus"/> Buscar Radicado
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-if="activePermission('see_settled')"
            to="/myfilings"
            class="nav-link" >
            <i class="fas fa-crown"/> Mis Radicados
          </router-link>
        </li>
        <li class="nav-title text-center">
          SISTEMA
        </li>
        <li class="nav-item">
          <router-link
            v-if="activePermission('see_configuration')"
            to="/config"
            class="nav-link" >
            <i class="fas fa-wrench"/> Configuración
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-if="activePermission('view_user')"
            to="/users"
            class="nav-link" >
            <i class="fas fa-users"/> Usuarios
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/acount"
            class="nav-link" >
            <i class="fas fa-id-badge"/> Cuenta
          </router-link>
        </li>
      </ul>
      <slot />
    </nav>
    <SidebarFooter/>
    <SidebarMinimizer/>
  </div>
</template>
<script>
import SidebarFooter from './SidebarFooter'
import SidebarHeader from './SidebarHeader'
import SidebarMinimizer from './SidebarMinimizer'
/*import SidebarNavDivider from './SidebarNavDivider'
import SidebarNavDropdown from './SidebarNavDropdown'
import SidebarNavLink from './SidebarNavLink'
import SidebarNavTitle from './SidebarNavTitle'
import SidebarNavItem from './SidebarNavItem'
import SidebarNavLabel from './SidebarNavLabel' */
export default {
  name: 'Sidebar',
  components: {
    SidebarFooter,
    SidebarHeader,
    SidebarMinimizer
  },
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    role() {
      return this.$auth.user.role
    }
  },
  mounted: function() {
    this.isFixed(this.fixed)
  },
  methods: {
    isFixed() {
      this.fixed
        ? document.body.classList.add('sidebar-fixed')
        : document.body.classList.remove('sidebar-fixed')
      return this.fixed
    },
    handleClick(e) {
      e.preventDefault()
      e.target.parentElement.classList.toggle('open')
    },
    activePermission(value) {
      let storePermissions = this.$store.state.user.permissions
      return !(storePermissions.find(item => item === value) === undefined)
    },
  }
}
</script>

<style lang="scss">
.sidebar {
  .nav-link {
    cursor: pointer;
  }
  .nuxt-link-exact-active {
    background: #1d97c2 !important;
  }
  .nav-title {
    font-weight: 700;
    font-size: 14px;
  }
}
</style>
