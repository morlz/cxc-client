import BaseModel from '@/lib/BaseModel'
import api from '@/api'
import { SheetValue } from '@/lib'
import Vue from 'vue'
import moment from 'moment'

export default class SheetDay extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			values: [SheetValue]
		}, {
			values: [],
			...arg
		})
	}

	forUser (uid) {
		return this.clone().update({ user_id: uid })
	}

	is (date) {
		return moment(date).format('DD MMMM YYYY') == moment(this.date).format('DD MMMM YYYY')
	}

	get value () {
		if (this._value !== undefined)
			return this._value

		let res = this.values.find(el => el.user_id == this.user_id)
		return res || 0
	}

	set value (val) {
		console.log(this);
		Vue.set(this, '_value', val)
	}
}
