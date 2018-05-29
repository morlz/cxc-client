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
	}
}

const actions = {
	async init ({ commit, dispatch, state }, payload) {
		await dispatch('getOne', payload)
		if (state.cached.group.id != state.cached.current.group_id)
			await dispatch('getGroup', state.cached.current.group_id)
	},
	async getOne ({ commit, dispatch }, id) {
		let current = await Sheet.getOne(id)
		if (!current) return

		commit('cachedSet', { current })
	},
	async getGroup ({ commit, dispatch }, id) {
		let group = await Group.getOne(id)
		if (!group) return

		commit('cachedSet', { group })
	},
	async create ({ commit, dispatch }, payload) {
		let res = await Sheet.create(payload)
		if (!res) return

		await dispatch('group/getList', null, { root: true })
	}
}

const mutations = {
	cachedSet: (state, payload) => state.cached = { ...state.cached, ...payload },
	loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload },
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
