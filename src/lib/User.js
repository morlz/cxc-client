import BaseModel from '@/lib/BaseModel'
import api from '@/api'
import { Permission, PermissionSetup } from '@/lib'
import moment from 'moment'

export default class User extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			permissions: [Permission],
			permissionSetup: [PermissionSetup],
		}, {
			name: '',
			pass: '',
			login: '',
			role_id: 3,
			...arg
		})
	}

	static async signin (data) {
		let res = await api.get('signin', data)
		if (res)
			return new User(res)

		return res
	}

	static async getUserData () {
		let res = await api.get('userdata')
		if (res && res != 'Unauthorized.')
			return new User(res)

		return res
	}

	static async getList () {
		let res = await api.get('users')
		if (Array.isArray(res))
			return res.map(el => new User(el))

		return res
	}

	get avatar () {
		//if (process.env.NODE_ENV == 'development')
			//return 'https://forums.roku.com/styles/canvas/theme/images/no_avatar.jpg'

		if (!this.photo)
			return 'https://forums.roku.com/styles/canvas/theme/images/no_avatar.jpg'

		if (this.photo.substr(0, 5) === 'src="')
			return this.photo.substr(5, this.photo.length - 6)

		return this.photo
	}

	async save () {
		let res = this.id ? await api.put('user', this) : await api.post('user', this)
		if (!res) return

		return this.update(res)
	}

	async delete () {
		let res = await api.delete('user', { id: this.id })
		if (!res) return

		return this.update(res)
	}
}
