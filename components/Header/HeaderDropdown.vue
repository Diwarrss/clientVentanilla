<template>
  <b-nav-item-dropdown
    right
    no-caret >
    <template slot="button-content">
      <span>{{ user.username }}</span>
      <img
        src="~static/img/avatars/6.jpg"
        class="img-avatar"
        alt="admin@bootstrapmaster.com" >
    </template>
    <b-dropdown-header
      tag="div"
      class="text-center" >
      <strong>Cuenta</strong>
    </b-dropdown-header>
    <b-dropdown-item
      to="/acount"
    >
      <client-only>
        <unicon
          name="user-circle"
          fill="royalblue"/>
      </client-only>
      Perfil
    </b-dropdown-item>
    <b-dropdown-divider />
    <b-dropdown-item @click="logout">
      <client-only>
        <unicon
          name="signout"
          fill="red"
          icon-style="monochrome"/>
      </client-only>
      Cerrar Sesión
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
export default {
  name: 'HeaderDropdown',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data: () => {
    return { itemsCount: 42 }
  },
  methods: {
    async logout() {
      try {
        await this.$auth.logout('logout')
        localStorage.removeItem('roles')
        localStorage.removeItem('permissions')
        //reset Permissions and Roles
        /* this.$laravel.setPermissions(['null'])
        this.$laravel.setRoles(['null']) */
        //this.$router.push('/login')
      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>
<style lang="scss">
.dropdown-menu {
  left: unset !important;
  transform: translate3d(-17px, 35px, 0px) !important;
}
</style>
