<template>
  <header class="app-header navbar">
    <button
      class="navbar-toggler mobile-sidebar-toggler d-lg-none"
      type="button"
      @click="mobileSidebarToggle" >
      <span class="navbar-toggler-icon" />
    </button>
    <b-link
      class="navbar-brand"
      to="/" />
    <button
      class="navbar-toggler sidebar-toggler d-md-down-none"
      type="button"
      @click="sidebarToggle" >
      <span class="navbar-toggler-icon" />
    </button>
    <!-- <b-navbar-nav class="d-md-down-none">
      <b-nav-item class="px-3">Dashboard</b-nav-item>
      <b-nav-item class="px-3">Usuarios</b-nav-item>
      <b-nav-item class="px-3">Settings</b-nav-item>
    </b-navbar-nav> -->
    <b-navbar-nav class="ml-auto mr-md-4">
      <!-- <client-only>
        <unicon
          name="car-wash"
          fill="red"/>
        <unicon
          name="layer-group"
          fill="royalblue"
          icon-style="monochrome"/>
      </client-only> -->
      <!-- <b-nav-item class="d-md-down-none">
        <i class="icon-bell"/>
        <b-badge
          pill
          variant="danger">
          5
        </b-badge>
      </b-nav-item>
      <b-nav-item class="d-md-down-none">
        <i class="icon-list"/>
      </b-nav-item>
      <b-nav-item class="d-md-down-none">
        <i class="icon-location-pin"/>
      </b-nav-item> -->
      <HeaderDropdown :user="user"/>
    </b-navbar-nav>
    <!-- <button
      class="navbar-toggler aside-menu-toggler d-md-down-none"
      type="button"
      @click="asideToggle" >
      <span class="navbar-toggler-icon" />
    </button> -->
  </header>
</template>

<script>
import HeaderDropdown from './HeaderDropdown.vue'

export default {
  name: 'CHeader',
  components: {
    HeaderDropdown
  },
  props: {
    fixed: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      required: true
    }
  },
  created() {
    this.$store.dispatch('company/getCompany')
  },
  mounted: function() {
    this.isFixed(this.fixed)
  },
  methods: {
    isFixed(fixed) {
      fixed
        ? document.body.classList.add('header-fixed')
        : document.body.classList.remove('header-fixed')
      return fixed
    },
    sidebarToggle(e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize(e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle(e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle(e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    }
  }
}
</script>
