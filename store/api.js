export const state = () => ({
  result: [],
  errors: {}
})

export const getters = {}

export const actions = {
  create: function({ commit, state }, params) {
    commit('setErrors', {})
    let me = this
    let url = params.url
    let getData = params.data
    let files = params.files
    if (files) {
      me.$axios
        .post(url, getData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          if (res.data.type === 'success') {
            if (res.data.notify) {
              me.$swal({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: res.data.message,
                showConfirmButton: false,
                timer: 3000
              })
            } else {
              setTimeout(() => {
                me.$swal({
                  title: res.data.message,
                  icon: 'success',
                  confirmButtonColor: '#4dbd74',
                  confirmButtonText:
                    '<i class="far fa-check-circle"></i> Aceptar',
                  timer: 2000
                })
              }, 1000)
            }
            commit('setResult', res.data.data)
            /* me.$store.dispatch('config/getDependence') */
          } else {
            me.$swal({
              title: res.data.message,
              icon: 'error',
              confirmButtonColor: '#4dbd74',
              confirmButtonText: '<i class="far fa-check-circle"></i> Aceptar',
              timer: 2000
            })
          }
          console.log(res)
        })
        .catch(err => {
          //preguntamos si el error es 422
          if (err.response.status == 422) {
            commit('setErrors', err.response.data.errors)
          }
          console.error(err)
        })
    } else {
      me.$axios
        .post(url, getData)
        .then(res => {
          if (res.data.type === 'success') {
            if (res.data.notify) {
              //mensanje flotante superior derecho
              me.$swal({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: res.data.message,
                showConfirmButton: false,
                timer: 3000
              })
            } else {
              setTimeout(() => {
                //mensanje Central en la pagina como Modal
                me.$swal({
                  title: res.data.message,
                  icon: 'success',
                  confirmButtonColor: '#4dbd74',
                  confirmButtonText:
                    '<i class="far fa-check-circle"></i> Aceptar',
                  timer: 2000
                })
              }, 1000)
            }
            commit('setResult', res.data.data)
            /* me.$store.dispatch('config/getDependence') */
          } else {
            me.$swal({
              title: res.data.message,
              icon: 'error',
              confirmButtonColor: '#4dbd74',
              confirmButtonText: '<i class="far fa-check-circle"></i> Aceptar',
              timer: 2000
            })
          }
          console.log(res)
        })
        .catch(err => {
          //preguntamos si el error es 422
          if (err.response.status == 422) {
            commit('setErrors', err.response.data.errors)
          }
          console.error(err)
        })
    }
  },
  update: function({ commit }, params) {
    commit('setErrors', {})
    console.log(params.data)
    let url = params.url
    let getData = params.data
    let files = params.files
    if (files) {
      this.$axios
        .post(url, getData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          if (res.data.type === 'success') {
            setTimeout(() => {
              this.$swal({
                title: res.data.message,
                icon: 'success',
                confirmButtonColor: '#4dbd74',
                confirmButtonText:
                  '<i class="far fa-check-circle"></i> Aceptar',
                timer: 2000
              })
            }, 1000)
            commit('setResult', res.data.data)
          } else {
            this.$swal({
              title: res.data.message,
              icon: 'error',
              confirmButtonColor: '#4dbd74',
              confirmButtonText: '<i class="far fa-check-circle"></i> Aceptar',
              timer: 2000
            })
          }
          console.log(res)
        })
        .catch(err => {
          if (err.response.status == 422) {
            commit('setErrors', err.response.data.errors)
          }
          console.error(err)
        })
    } else {
      this.$axios
        .put(url, getData)
        .then(res => {
          if (res.data.type === 'success') {
            setTimeout(() => {
              this.$swal({
                title: res.data.message,
                icon: 'success',
                confirmButtonColor: '#4dbd74',
                confirmButtonText:
                  '<i class="far fa-check-circle"></i> Aceptar',
                timer: 2000
              })
            }, 1000)
            commit('setResult', res.data.data)
          } else {
            this.$swal({
              title: res.data.message,
              icon: 'error',
              confirmButtonColor: '#4dbd74',
              confirmButtonText: '<i class="far fa-check-circle"></i> Aceptar',
              timer: 2000
            })
          }
          console.log(res)
        })
        .catch(err => {
          if (err.response.status == 422) {
            commit('setErrors', err.response.data.errors)
          }
          console.error(err)
        })
    }
  },
  state: function({ commit }, url) {
    this.$axios
      .put(url)
      .then(res => {
        if (res.data.type === 'success') {
          this.$swal({
            title: res.data.message,
            icon: 'success',
            confirmButtonColor: '#4dbd74',
            confirmButtonText: '<i class="far fa-check-circle"></i> Aceptar',
            timer: 2000
          })
          commit('setResult', res.data.data)
        } else {
          this.$swal({
            title: res.data.message,
            icon: 'error',
            confirmButtonColor: '#4dbd74',
            confirmButtonText: '<i class="far fa-check-circle"></i> Aceptar',
            timer: 2000
          })
        }
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
  },
  delete: function({ commit }, params) {
    console.log(params)
    let url = params.url
    let getData = params.data
    this.$axios
      .post(url, getData)
      .then(res => {
        if (res.data.type === 'success') {
          this.$swal({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: res.data.message,
            showConfirmButton: false,
            timer: 4000
          })
          commit('setResult', res.data.data)
        } else {
          this.$swal({
            title: res.data.message,
            icon: 'error',
            confirmButtonColor: '#4dbd74',
            confirmButtonText: 'Aceptar',
            timer: 3000
          })
        }
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
  },
  clearErrors: function({ commit }) {
    commit('setErrors', {})
  },
  cancelFiling: function({ commit }, params) {
    commit('setErrors', {})
    let me = this
    let url = params.url
    let getData = params.data
    me.$axios
      .post(url, getData)
      .then(res => {
        if (res.data.type === 'success') {
          this.$swal({
            title: res.data.message,
            icon: 'success',
            confirmButtonColor: '#4dbd74',
            confirmButtonText: '<i class="far fa-check-circle"></i> Aceptar',
            timer: 4000
          })
          commit('setResult', res.data.data)
        } else {
          this.$swal({
            title: res.data.message,
            icon: 'error',
            confirmButtonColor: '#4dbd74',
            confirmButtonText: '<i class="far fa-check-circle"></i> Aceptar',
            timer: 3000
          })
        }
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
  }
}

export const mutations = {
  setResult(state, data) {
    state.result = data
  },
  setErrors(state, data) {
    state.errors = data
  }
}
