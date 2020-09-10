//store para usuario
export const state = () => ({
  permissions: [],
  roles: [],
  users: [],
  allRoles: [],
  allRow: 0
})

export const getters = {}

export const mutations = {
  setRoles(state, data) {
    state.roles = data
  },
  setPermissions(state, data) {
    state.permissions = data
  },
  setUsers(state, data) {
    state.users = data
    state.allRow = data.length
  },
  setAllRoles(state, data) {
    state.allRoles = data
  }
}

export const actions = {
  setRoles({ commit }, roles) {
    //sabe info in localStorage
    //localStorage.setItem("roles", JSON.stringify(roles))
    commit('setRoles', roles)
  },
  setPermissions({ commit }, permissions) {
    //sabe info in localStorage
    //localStorage.setItem("permissions", JSON.stringify(permissions))
    commit('setPermissions', permissions)
  },
  getUsers: async function({ commit }) {
    const data = await this.$axios.get('all-user')
    commit('setUsers', data.data)
  },
  getAllRoles: async function({ commit }, param) {
    //if is true return with permissions because isn't roles
    const data = await this.$axios.get('all-rol', { params: { hasPermissions: param } })
    commit('setAllRoles', data.data)
  }
  /* getRoles: async function({ commit }) {
    const { data: roles } = await axios.get('/roles')
    this.$laravel.setRoles(roles)
    commit('setRoles', roles)
  },
  getPermissions: async function({ commit }) {
    const { data: permissions } = await axios.get('/permissions')
    this.$laravel.setPermissions(permissions)
    commit('setPermissions', permissions)
  } */
}
