import { Spec } from '@/lib'

const state = {
	cached: {
		list: []
	},
	loading: {
		list: false
	}
}

const actions = {
	async init ({ commit, dispatch }) {
		dispatch('getList')
	},
	async getList ({ commit, dispatch }) {
		commit('loadingSet', { list: true })
		let list = await Spec.getList()
		commit('loadingSet', { list: false })
		if (!list) return

		commit('cachedSet', { list })
	},
	async save ({ commit, dispatch }, spec) {
		let res = await spec.save()
		if (!res) return

		commit('cachedListAppend', res)
		dispatch('notify', 'Успешно сохранено!', { root: true })
	},
	async delete ({ commit, dispatch }, spec) {
		let res = await spec.delete()
		if (!res) return

		commit('removeFromCache', res)
		dispatch('notify', 'Успешно удално!', { root: true })
	},
}

const mutations = {
	cachedSet: (state, payload) => state.cached = { ...state.cached, ...payload },
	loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload },
	cachedListAppend: (state, payload) => state.cached.list.push(payload),
	removeFromCache: (state, payload) => state.cached.list = state.cached.list.filter(el => el.id != payload.id)
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
