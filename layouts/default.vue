<template>
  <div
    v-if="isStorage"
    class="app">
    <AppHeader
      :user="user"
      fixed />
    <div class="app-body">
      <Sidebar
        :nav-items="nav"
        fixed />
      <main class="main">
        <!-- <breadcrumb :list="list"/> -->
        <div class="container-fluid mt-4">
          <nuxt/> <!-- Muestran las paginas que creamos -->
        </div>
      </main>
      <!-- <AppAside fixed/> -->
    </div>
    <!-- <AppFooter/> -->
  </div>
</template>

<script>
import nav from './menu'
import {
  Header as AppHeader,
  Sidebar,
  /* Aside as AppAside, */
  Footer as AppFooter
  /* Breadcrumb */
} from '~/components/'

export default {
  name: 'Full',
  components: {
    AppHeader,
    Sidebar,
    /* AppAside, */
    AppFooter
    /* Breadcrumb */
  },
  data() {
    return {
      nav: nav.items
    }
  },
  computed: {
    name() {
      return this.$route.name
    },
    list() {
      return this.$route.matched
    },
    user() {
      return this.$store.state.auth.user
    },
    isStorage() {
      let dataStorage = this.$store.state.user.permissions
      return !(
        dataStorage.find(item => item === 'show_panel_admin') === undefined
      )
    }
  },
  created() {
    //get data for API of permissions and roles
    this.$axios
      .get('/permissions')
      .then(res => {
        this.$store.dispatch('user/setPermissions', res.data)
        this.$laravel.setPermissions(res.data)
        //console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
    this.$axios
      .get('/roles')
      .then(res => {
        this.$store.dispatch('user/setRoles', res.data)
        this.$laravel.setRoles(res.data)
        //console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
      this.$store.dispatch('config/getDependence', 1)
      this.$store.dispatch('config/getTypeDocument')
      this.$store.dispatch('config/getPriority')
      this.$store.dispatch('config/getContextType')
  }
}
</script>
