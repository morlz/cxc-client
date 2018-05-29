import BaseModel from '@/lib/BaseModel'
import api from '@/api'
import { SheetMonth } from '@/lib'
import moment from 'moment'

export default class User extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			months: [SheetMonth],
		}, arg)
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

	getMonthByDate (date) {
		let res = this.months.find(month => month.is(date))
		return res ? res : new SheetMonth({
			date: moment(date),
			days: []
		})
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
}
