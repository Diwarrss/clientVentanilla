<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col
          md="6"
          sm="8">
          <b-card
            no-body
            class="mx-4">
            <b-card-body class="p-4">
              <h1>Register</h1>
              <p class="text-muted">Create your account</p>
              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-user"/></b-input-group-text>
                </b-input-group-prepend>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  placeholder="Username">
              </b-input-group>

              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text>@</b-input-group-text>
                </b-input-group-prepend>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="Email">
              </b-input-group>

              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-lock"/></b-input-group-text>
                </b-input-group-prepend>
                <input
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  placeholder="Password">
              </b-input-group>

              <b-input-group class="mb-4">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-lock"/></b-input-group-text>
                </b-input-group-prepend>
                <input
                  v-model="form.password_confirmation"
                  type="password"
                  class="form-control"
                  placeholder="Repeat password">
              </b-input-group>

              <b-button
                variant="success"
                block
                @click.prevent="register">Crear Cuenta</b-button>
            </b-card-body>
            <b-card-footer class="p-4">
              <b-row>
                <b-col cols="6">
                  <b-button
                    block
                    class="btn btn-facebook"><span>facebook</span></b-button>
                </b-col>
                <b-col cols="6">
                  <b-button
                    block
                    class="btn btn-twitter"
                    type="button"><span>twitter</span></b-button>
                </b-col>
              </b-row>
            </b-card-footer>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  layout: 'clean',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  async created() {
    await this.$axios.get('sanctum/csrf-cookie', {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      },
      withCredentials: true
    })
  },
  methods: {
    async register() {
      this.$axios
        .post('api/register', this.form)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
  /* async asyncData({ app }) {
    let { data: crsf } = await app.$axios.get('sanctum/csrf-cookie')
    return { crsf }
  } */
}
</script>
