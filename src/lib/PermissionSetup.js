import BaseModel from '@/lib/BaseModel'
import api from '@/api'
import { Permission, User } from '@/lib'
import moment from 'moment'

export default class PermissionSetup extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			user: User,
			permission: Permission
		}, {
			...arg,
			user_id: +arg.user_id,
			permission_id: +arg.permission_id
		})
	}

	static async getList () {
		let res = await api.get('permission-setup')
		if (Array.isArray(res))
			return res.map(el => new PermissionSetup(el))

		return res
	}

	static async save (items) {
		let res = await api.put('permission-setup', { items })
		if (Array.isArray(res))
			return res.map(el => new PermissionSetup(el))

		return res
	}
}
