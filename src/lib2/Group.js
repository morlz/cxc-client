import BaseModel from '@/lib/BaseModel'
import api from '@/api'
import { User, SheetList } from '@/lib'
import moment from 'moment'

export default class Group extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			users: [User]
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

	get sheets () {
		return this._sheets
	}

	set sheets (val) {
		let sheetList = new SheetList(val, this.id)
		this._sheets = Array.apply(null, { length: this.cource_count }).map((el, index) => {
			let date = moment(this.admission).add(Math.trunc(index / 2), 'year').date(1)
			return sheetList.getByDate(index % 2 ? date.month(11) : date.month(3))
		})
	}

	get admission () {
		 return this._admission
	}

	get admissionText () {
		return this._admission.format('DD MMMM YYYY')
	}

	set admission (val) {
		this._admission = moment(val)
	}
}
