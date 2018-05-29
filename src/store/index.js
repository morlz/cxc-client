import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import auth from './auth'
import group from './group'
import sheet from './sheet'

export default new Vuex.Store({
	modules: {
		auth,
		group,
		sheet
	},
	namespaced: true
})
