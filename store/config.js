//store para configuracion
export const state = () => ({
  dependence: [],
  dependencePerson: [],
  typeDocument: [],
  priority: [],
  people: [],
  contextType: [],
  typeIdentification: [],
  gender: [],
  rolHasPermission: [],
  allPermissions: [],
  cancellationReason: [],
  allRow: 0
})

export const getters = {}

export const actions = {
  getDependencePerson: async function({ commit }, param) {
    const data = await this.$axios.get('dependences', { params: { active: param} })
    commit('setDependencePerson', data.data)
  },
  getDependence: async function({ commit }, param) {
    const data = await this.$axios.get('dependences', { params: { active: param} })
    commit('setDependence', data.data)
  },
  getTypeDocument: async function({ commit }) {
    const data = await this.$axios.get('type-documents')
    commit('setTypeDocument', data.data)
  },
  getPriority: async function({ commit }) {
    const data = await this.$axios.get('priorities')
    commit('setPriority', data.data)
  },
  getPeople: async function({ commit }, param) {
    const data = await this.$axios.get('people', { params: { active: param } })
    commit('setPeople', data.data)
  },
  getContextType: async function({ commit }) {
    const data = await this.$axios.get('context-types')
    commit('setContextType', data.data)
  },
  getTypeIdentification: async function({ commit }) {
    const data = await this.$axios.get('type-identifications')
    commit('setTypeIdentification', data.data)
  },
  getGender: async function({ commit }) {
    const data = await this.$axios.get('genders')
    commit('setGender', data.data)
  },
  getRolHasPermission: async function({ commit }) {
    const data = await this.$axios.get('all-rol')
    commit('setRolHasPermission', data.data)
  },
  getPermission: async function({ commit }) {
    const data = await this.$axios.get('all-permissions')
    commit('setPermission', data.data)
  },
  getCancellationReason: async function({ commit }) {
    const data = await this.$axios.get('cancellation-reasons')
    commit('setCancellationReason', data.data)
  },
  clearAllData: function({ commit }) {
    commit('setDataClear', [])
  },
}

export const mutations = {

  setDependencePerson(state, data) {
    state.dependencePerson = data
    state.allRow = data.length
  },
  setDependence(state, data) {
    state.dependence = data
    state.allRow = data.length
  },
  setTypeDocument(state, data) {
    state.typeDocument = data
    state.allRow = data.length
  },
  setPriority(state, data) {
    state.priority = data
    state.allRow = data.length
  },
  setPeople(state, data) {
    state.people = data
    state.allRow = data.length
  },
  setContextType(state, data) {
    state.contextType = data
  },
  setTypeIdentification(state, data) {
    state.typeIdentification = data
    state.allRow = data.length
  },
  setGender(state, data) {
    state.gender = data
    state.allRow = data.length
  },
  setRolHasPermission(state, data) {
    state.rolHasPermission = data
  },
  setPermission(state, data) {
    state.allPermissions = data
  },
  setCancellationReason(state, data) {
    state.cancellationReason = data
    state.allRow = data.length
  },
  setDataClear(state, data) {
    state.dependence = data
    state.typeDocument = data
    state.priority = data
    state.people = data
    state.contextType = data
    state.typeIdentification = data
    state.gender = data
    state.cancellationReason = data
  }
}
