import { User } from '@/lib'

const state = {
	headerShadow: true
}

const actions = {

}

const mutations = {
	headerShadowSet: (state, payload) => state.headerShadow = payload
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
