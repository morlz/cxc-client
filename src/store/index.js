import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import auth from './auth'
import group from './group'
import sheet from './sheet'
import notify from './notify'
import app from './app'
import permissions from './permissions'

export default new Vuex.Store({
	modules: {
		auth,
		group,
		sheet,
		notify,
		app,
		permissions
	},
	namespaced: true
})
