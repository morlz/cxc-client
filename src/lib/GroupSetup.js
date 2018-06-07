import BaseModel from '@/lib/BaseModel'
import api from '@/api'
import { Group, User } from '@/lib'
import moment from 'moment'

export default class GroupSetup extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			user: User,
			group: Group
		}, {
			...arg,
			user_id: +arg.user_id,
			group_id: +arg.group_id
		})
	}

	static async getList () {
		let res = await api.get('group-setup')
		if (Array.isArray(res))
			return res.map(el => new GroupSetup(el))

		return res
	}

	static async save (items) {
		let res = await api.put('group-setup', { items })
		if (Array.isArray(res))
			return res.map(el => new GroupSetup(el))

		return res
	}
}
