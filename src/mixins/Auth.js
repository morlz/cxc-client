import { mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters('auth', {
			auth_permissions: 'permissions'
		})
	},
	methods: {
		auth_can(name) {
			return true
			return !!this.auth_permissions.find(el => el.name == name)
		}
	}
}
