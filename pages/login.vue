<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <form>
        <b-row class="justify-content-center">
          <b-col md="10">
            <b-card-group>
              <b-card
                no-body
                class="p-4">
                <b-card-body>
                  <img
                    src="~/static/img/logo.png"
                    class="img-fluid">
                  <h1 class="text-center">Iniciar Sesión</h1>
                  <p class="text-muted">Inicia sesión con tu cuenta</p>
                  <b-input-group>
                    <b-input-group-prepend><b-input-group-text><i class="fas fa-user"/></b-input-group-text></b-input-group-prepend>
                    <input
                      v-model="email"
                      type="email"
                      class="form-control"
                      placeholder="E-Mail"
                      required>
                  </b-input-group>
                  <!-- <span
                    v-if="error.error"
                    class="help-block text-danger">
                    {{ error.error }}
                  </span> -->
                  <span
                    v-if="error.email"
                    class="help-block text-danger">
                    {{ error.email[0] }}
                  </span>
                  <b-input-group class="mt-3">
                    <b-input-group-prepend><b-input-group-text><i class="fas fa-key"/></b-input-group-text></b-input-group-prepend>
                    <input
                      v-model="password"
                      type="password"
                      class="form-control"
                      placeholder="Password"
                      required>
                  </b-input-group>
                  <span
                    v-if="error.password"
                    class="help-block text-danger">
                    {{ error.password[0] }}
                  </span>
                  <b-row class="mt-4">
                    <b-col
                      cols="12"
                      class="text-center">
                      <b-button
                        class="px-4 btn-lg btn_login"
                        variant="primary"
                        @click.prevent="login"><i class="fas fa-sign-in-alt"/> Iniciar Sesión</b-button>
                    </b-col>
                    <b-col
                      cols="12"
                      class="text-center">
                      <b-button
                        variant="link"
                        class="px-0 btn_request">¿Has olvidado la contraseña?</b-button>
                    </b-col>
                  </b-row>
                </b-card-body>
              </b-card>
              <b-card
                no-body
                class="text-white bg-card py-5 d-md-down-none"
                style="width:44%">
                <b-card-body class="text-center">
                  <div>
                    <h1 class="mt-4">Correspondencia <strong>(VU)</strong></h1>
                    <p class="mt-4 font-lg">Sistema que gestiona de manera centralizada y normalizada, los servicios de recepción, radicación y control de la distribución de la comunicación.</p>
                    <!-- <b-button
                      class="px-4"
                      variant="dark"> Contactanos</b-button> -->
                    <a
                      href="https://www.gridsoft.co/"
                      class="btn btn-outline-light btn-lg px-4 mt-4"
                      type="button"><i class="fas fa-address-book"/> Contactenos</a>
                    <p class="mt-2">
                      <strong>Copyright <i class="far fa-copyright"/> 2020 GridSoft</strong>
                    </p>
                  </div>
                </b-card-body>
              </b-card>
            </b-card-group>
          </b-col>
        </b-row>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  layout: 'clean',
  auth: 'guest',
  data() {
    return {
      error: {},
      email: '',
      password: ''
    }
  },
  async created() {
    // Access using $auth validamos si ya estamos logueados
    if (this.$auth.loggedIn) {
      this.$router.push('/')
    }
  },
  methods: {
    async login() {
      let me = this
      me.$nuxt.$loading.start()
      me.error = {}
      // Prepare form data
      const formData = {
        email: me.email,
        password: me.password
      }
      try {
        await me.$axios
          .get(process.env.COOKIE_BASE_URL + '/sanctum/csrf-cookie')
          .then(() =>
            me.$auth
              .loginWith('local', { data: formData })
              .then(async () => {
                //redirect success auto to index
                const { data: permissions } = await me.$axios.get(
                  '/permissions'
                )
                const { data: roles } = await me.$axios.get('/roles')
                me.$laravel.setPermissions(permissions)
                me.$laravel.setRoles(roles)
                me.$store.dispatch('user/setRoles', roles)
                me.$store.dispatch('user/setPermissions', permissions)
                //location.reload()
              })
              .catch(err => {
                if (err.response.status == 401) {
                  me.$swal({
                    position: 'top-end',
                    icon: 'error',
                    title: err.response.data.errors,
                    showConfirmButton: false,
                    timer: 1500
                  })
                }
                if (err.response.status == 422) {
                  //preguntamos si el error es 422
                  me.error = err.response.data.errors
                }
              })
          )
          .catch(err => {
            me.error = err
          })
      } catch (err) {
        me.error = err
      }
      //initials login async
      /* try {
        await me.$auth.loginWith('local', { data: formData })
        .then(async () => {
          const { data: permissions } = await me.$axios.get('/permissions')
          const { data: roles } = await me.$axios.get('/roles')

          await me.$laravel.setPermissions(permissions)
          await me.$laravel.setRoles(roles)
        })
        .catch(err => {
          if (err.response.status == 401) {
            me.$swal({
              position: 'top-end',
              icon: 'error',
              title: err.response.data.errors,
              showConfirmButton: false,
              timer: 1500
            })
          }
          if (err.response.status == 422) {
            //preguntamos si el error es 422
            me.error = err.response.data.errors
          }
        })
      } catch (err) {
        me.error = err
      } */
    }
  }
}
</script>
<style lang="scss">
.h1 {
  font-size: 2.1875rem;
}
/* .btn_login {
  background: #3815b8;
  border: 1px solid #3815b8;
}
.btn_login:hover {
  background: #3815b8c2;
  border: 1px solid #3815b8c2;
}
.btn_login::after {
  background: #3815b8c2;
  border: 1px solid #3815b8c2;
} */
.bg-card {
  background: #a83333;
}
/* .btn_request {
  color: #3815b8;
}
.btn_request:hover {
  color: #3815b8c2;
} */
</style>
