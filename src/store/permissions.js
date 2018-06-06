import { User, Permission, PermissionSetup } from '@/lib'

const state = {
	cached: {
		users: [],
		permissions: [],
		setup: []
	},
	loading: {
		users: false,
		permissions: false,
		setup: false
	},
	selected: {
		type: '',
		id: 0
	}
}

const actions = {
	async init ({ dispatch }) {
		await Promise.all([
			dispatch('getUsers'),
			dispatch('getPermissions'),
			dispatch('getPermissionsSetup'),
		])
	},
	async getUsers ({ commit, dispatch, state }) {
		commit('loadingSet', { users: true })
		let users = await User.getList()
		commit('loadingSet', { users: false })
		if (!users) return

		commit('cachedSet', { users })
	},
	async getPermissions ({ commit, dispatch, state }) {
		commit('loadingSet', { permissions: true })
		let permissions = await Permission.getList()
		commit('loadingSet', { permissions: false })
		if (!permissions) return

		commit('cachedSet', { permissions })
	},
	async getPermissionsSetup ({ commit, dispatch, state }) {
		commit('loadingSet', { setup: true })
		let setup = await PermissionSetup.getList()
		commit('loadingSet', { setup: false })
		if (!setup) return

		commit('cachedSet', { setup })
	},
	async save ({ commit, dispatch, state }) {
		let res = await PermissionSetup.save(state.cached.setup)
		if (!res) return

		dispatch('notify', 'Успешно сохранено!', { root: true })
	},
	async addUser ({ commit, dispatch, state }, user) {
		let res = await user.save()
		if (!res) return

		commit('cachedUsersAppend', res)
	},
	async addPermission ({ commit, dispatch, state }, permission) {
		let res = await permission.save()
		if (!res) return

		commit('cachedPermissionsAppend', res)
	},
	async deleteUser ({ commit, dispatch }, user) {
		let res = await user.delete()
		if (!res) return

		commit('deleteUserFromCache', res)
	},
	async deletePermission ({ commit, dispatch }, permission) {
		let res = await permission.delete()
		if (!res) return

		commit('deletePermissionFromCache', res)
	}

}

const mutations = {
	cachedSet: (state, payload) => state.cached = { ...state.cached, ...payload },
	loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload },
	select: (state, payload) => state.selected = { ...state.selected, ...payload },
	toggleUser: (state, { value, id }) => value ?
		state.cached.setup.push(
			new PermissionSetup({
				user_id: id,
				permission_id: state.selected.id
			})
		)
	:	state.cached.setup = state.cached.setup.filter(
		el => !(el.user_id == id && el.permission_id == state.selected.id)
	),
	togglePermission: (state, { value, id }) => value ?
		state.cached.setup.push(
			new PermissionSetup({
				user_id: state.selected.id,
				permission_id: id
			})
		)
	:	state.cached.setup = state.cached.setup.filter(
		el => !(el.user_id == state.selected.id && el.permission_id == id)
	),
	cachedUsersAppend: (state, payload) => state.cached.users.push(payload),
	cachedPermissionsAppend: (state, payload) => state.cached.permissions.push(payload),
	deleteUserFromCache: (state, payload) => state.cached.users = state.cached.users.filter(el => el.id != payload.id),
	deletePermissionFromCache: (state, payload) => state.cached.permissions = state.cached.permissions.filter(el => el.id != payload.id),
}

const getters = {
	userPermissions: state => state.cached.setup.filter(el => el.user_id == state.selected.id).map(el => el.permission_id),
	permissionUsers: state => state.cached.setup.filter(el => el.permission_id == state.selected.id).map(el => el.user_id),
	showToggleUsers: state => state.selected.type == 'permission',
	showTogglePermissions: state => state.selected.type == 'user',
	users: state => state.cached.users
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
