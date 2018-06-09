import { Group, GroupSetup } from '@/lib'
import Vue from 'vue'

const state = {
	cached: {
		list: [],
		setup: []
	},
	loading: {
		list: false,
		setup: false
	},
	selected: {
		type: '',
		id: 0
	}
}

const actions = {
	async init ({ commit, dispatch }) {
		dispatch('getList')
	},
	async getList ({ commit, dispatch }) {
		commit('loadingSet', { list: true })
		let list = await Group.getList()
		commit('loadingSet', { list: false })
		if (!list) return

		commit('cachedSet', { list })
	},
	async setupInit ({ commit, dispatch }) {
		await Promise.all([
			dispatch('permissions/getUsers', null, { root: true }),
			dispatch('getSetup'),
		])
	},
	async getSetup ({ commit, dispatch }) {
		commit('loadingSet', { setup: true })
		let setup = await GroupSetup.getList()
		commit('loadingSet', { setup: false })
		if (!setup) return

		commit('cachedSet', { setup })
	},
	async save ({ commit, dispatch }) {
		let res = await GroupSetup.save(state.cached.setup)
		if (!res) return

		dispatch('notify', 'Успешно сохранено!', { root: true })
	},
}

const mutations = {
	cachedSet: (state, payload) => state.cached = { ...state.cached, ...payload },
	loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload },
	select: (state, payload) => state.selected = { ...state.selected, ...payload },
	toggleUser: (state, { value, id }) => value ?
		state.cached.setup.push(
			new GroupSetup({
				user_id: id,
				group_id: state.selected.id
			})
		)
	:	state.cached.setup = state.cached.setup.filter(
		el => !(el.user_id == id && el.group_id == state.selected.id)
	),
	toggleGroup: (state, { value, id }) => value ?
		state.cached.setup.push(
			new GroupSetup({
				user_id: state.selected.id,
				group_id: id
			})
		)
	:	state.cached.setup = state.cached.setup.filter(
		el => !(el.user_id == state.selected.id && el.group_id == id)
	),
	removeSheetFromCache: (state, payload) => {
		let group = state.cached.list.find(el => el.id == payload.group_id)
		if (!group) return
		if (router.history.current.fullPath == `/sheet/${payload.id}`)
			router.push('/')

		Vue.set(group, 'sheets', group.sheets.filter(el => el.id != payload.id))
	}
}

const getters = {
	userGroups: state => state.cached.setup.filter(el => el.user_id == state.selected.id).map(el => el.group_id),
	groupUsers: state => state.cached.setup.filter(el => el.group_id == state.selected.id).map(el => el.user_id),
	showToggleUsers: state => state.selected.type == 'group',
	showToggleGroups: state => state.selected.type == 'user',
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
