import { User } from '@/lib'

const state = {
	user: null,
	loading: {
		user: false
	}
}

const actions = {
	async init ({ dispatch }) {
		await dispatch('getUserData')
	},
	async signin ({ commit, dispatch, state }, payload) {
		let res = await User.signin(payload)
		if (!res) return

		if (!res.id)
			return dispatch('alert', 'Неверное имя пользователя или пароль', { root: true })

		commit('userSet', res)
		router.push('/')
	},
	async getUserData ({ commit, dispatch }) {
		let res = await User.getUserData()
		if (!res.id) return

		commit('userSet', res)
	},
	async logout ({ commit }) {
		commit('signout')
	}
}

const mutations = {
	loginSet: (state, payload) => state.login = payload,
	passSet: (state, payload) => state.pass = payload,
	userSet: (state, payload) => {
		state.user = payload
		if (payload.api_token) localStorage.setItem('api_token', payload.api_token)
		if (payload.id) localStorage.setItem('uid', payload.id)
	},
	signout: state => {
		state.user = null
		localStorage.removeItem('api_token')
		localStorage.removeItem('uid')
	}
}

const getters = {
	logined: state => !!state.user,
	permissions: state => state.user ? state.user.permissions : []
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
