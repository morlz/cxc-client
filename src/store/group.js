import { Group } from '@/lib'

const state = {
	cached: {
		list: [],
	},
	loading: {
		list: false,
	}
}

const actions = {
	async init ({ commit, dispatch }) {
		dispatch('getList')
	},
	async getList ({ commit, dispatch }) {
		let list = await Group.getList()
		if (!list) return

		commit('cachedSet', { list })
	},
	async save ({ commit, dispatch }) {},
}

const mutations = {
	cachedSet: (state, payload) => state.cached = { ...state.cached, ...payload },
	loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload }
}

const getters = {

}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
