import { Sheet, Group } from '@/lib'
import Vue from 'vue'

const state = {
	cached: {
		current: {},
		group: {}
	},
	loading: {
		current: false,
		group: false
	},
	printing: false
}

const actions = {
	async init ({ commit, dispatch, state }, payload) {
		await dispatch('getOne', payload)
		if (state.cached.group.id != state.cached.current.group_id)
			await dispatch('getGroup', state.cached.current.group_id)
	},
	async getOne ({ commit, dispatch }, id) {
		commit('loadingSet', { current: true })
		let current = await Sheet.getOne(id)
		commit('loadingSet', { current: false })
		if (!current) return

		commit('cachedSet', { current })
	},
	async getGroup ({ commit, dispatch }, id) {
		commit('loadingSet', { group: true })
		let group = await Group.getOne(id)
		commit('loadingSet', { group: false })
		if (!group) return

		commit('cachedSet', { group })
	},
	async create ({ commit, dispatch }, payload) {
		let res = await Sheet.create(payload)
		if (!res) return

		await dispatch('group/getList', null, { root: true })
	},
	async delete ({ commit, dispatch }, sheet) {
		let res = await sheet.delete()
		if (!res) return

		commit('group/removeSheetFromCache', res, { root: true })
		dispatch('notify', 'Успешно удално!', { root: true })
	},
}

const mutations = {
	cachedSet: (state, payload) => state.cached = { ...state.cached, ...payload },
	loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload },
	printingSet: (state, payload) => state.printing = payload,
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
