//store para usuario
export const state = () => ({
  company: []
})

export const getters = {}

export const mutations = {
  setcompany(state, data) {
    state.company = data
  }
}

export const actions = {
  getCompany: async function ({ commit }) {
    const data = await this.$axios.get('company')
    commit('setcompany', data.data)
  }
}
