import BaseModel from '@/lib/BaseModel'
import api from '@/api'
import { User, PermissionSetup } from '@/lib'
import moment from 'moment'

export default class Permission extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			users: [User],
			setup: [PermissionSetup]
		}, {
			name: '',
			description: '',
			...arg
		})
	}

	static async getList () {
		let res = await api.get('permissions')
		if (Array.isArray(res))
			return res.map(el => new Permission(el))

		return res
	}

	async save () {
		let res = this.id ? api.put('permission', this) : api.post('permission', this)
		if (!res) return

		return this.update(res)
	}

	async delete () {
		let res = await api.delete('permission', { id: this.id })
		if (!res) return

		return this.update(res)
	}
}
