import BaseModel from '@/lib/BaseModel'
import api from '@/api'
import { Sheet } from '@/lib'
import moment from 'moment'

export default class SheetData extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			sheet: Sheet
		}, arg)
	}

	is (date) {
		date = moment(date, 'MMMM YYYY')
		return moment(this.date).isSame(date, 'month') && moment(this.date).isSame(date, 'year')
	}

	setValue (value) {
		this.value = value
		this.save()
	}

	async save () {
		let res = this.id ? await api.put('data', this.serialize) : await api.post('data', this.serialize)
		if (!res) return

		return this.update(res)
	}

	get value () {
		return this._value
	}

	set value (val) {
		this._value = +val
	}

	get serialize () {
		return {
			...this,
			value: this.value,
		}
	}
}
