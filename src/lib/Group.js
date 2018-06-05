import BaseModel from '@/lib/BaseModel'
import api from '@/api'
import { User, Sheet } from '@/lib'
import moment from 'moment'

export default class Group extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			users: [User],
			sheets: [Sheet]
		}, arg)
	}

	static async getList () {
		let res = await api.get('groups')
		if (Array.isArray(res))
			return res.map(el => new Group(el))

		return res
	}

	static async getOne (id) {
		let res = await api.get('group', { id })
		if (!res) return

		return new Group(res)
	}
}
