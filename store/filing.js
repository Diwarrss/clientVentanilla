//store para radicacion
export const state = () => ({
  entryFiling: [],
  outGoingFiling: [],
  resultFiling: [],
  allRow: 0
})

export const getters = {}

export const actions = {
  getEntryFiling: async function({ commit }, params) {
    if (params) {
      let fromDate = params[0]
      let toDate = params[1]
      const data = await this.$axios.get('entry-filing', {
        params: {
          fromDate: fromDate,
          toDate: toDate
        }
      })
      commit('setEntryFiling', data.data)
    } else {
      const data = await this.$axios.get('entry-filing')
      commit('setEntryFiling', data.data)
    }
  },
  getOutGoingFiling: async function({ commit }, params) {
    if (params) {
      let fromDate = params[0]
      let toDate = params[1]
      const data = await this.$axios.get('outgoing-filing', {
        params: {
          fromDate: fromDate,
          toDate: toDate
        }
      })
      commit('setOutGoingFiling', data.data)
    } else {
      const data = await this.$axios.get('outgoing-filing')
      commit('setOutGoingFiling', data.data)
    }
  },
  getResultFiling: async function({ commit }, params) {
    console.log(params)
    if (params) {
      /* let fromDate = params.fromDate
      let toDate = params.toDate
      let type = params.type
      let title = params.title
      let typeDocument = params.typeDocument
      let sender = params.sender
      let addressee = params.addressee
      let setledSearch = params.setledSearch */
      const data = await this.$axios.get('result-filings', {
        params: {
          fromDate: params.fromDate,
          toDate: params.toDate,
          type: params.type,
          title: params.title,
          typeDocument: params.typeDocument,
          sender: params.sender,
          addressee: params.addressee,
          setledSearch: params.setledSearch,
          typeSearch: params.typeSearch
        }
      })
      commit('setResultFiling', data.data)
    }
  },
  clearResultFiling: function({ commit }) {
    commit('setResultFiling', {})
  }
}

export const mutations = {
  setEntryFiling(state, data) {
    state.entryFiling = data
    state.allRow = data.length
  },
  setOutGoingFiling(state, data) {
    state.outGoingFiling = data
    state.allRow = data.length
  },
  setResultFiling(state, data) {
    state.resultFiling = data
    state.allRow = data.length
  }
}
