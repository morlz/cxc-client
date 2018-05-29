import BaseModel from '@/lib/BaseModel'
import api from '@/api'
import { SheetDay } from '@/lib'
import moment from 'moment'

export default class SheetMonth extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			days: [SheetDay]
		}, arg)
	}

	is (date) {
		return this.date.isSame(date, 'month') && this.date.isSame(date, 'year')
	}

	forUser (uid) {
		return this.clone().update({
			days: this.daysList.map(day => this.getDayByDate(day).forUser(uid))
		})
	}

	get daysList () {
		return Array.apply(null, { length: moment(this.date).daysInMonth() })
			.map((el, index) => moment(this.date).add(index, 'days'))
	}

	getDayByDate (date) {
		let res = this.days.find(day => day.is(date))
		return res ? res : new SheetDay({
			group_id: this.group_id,
			date,
			values: []
		})
	}

	get viewDays () {
		return this.daysList.map(date => this.getDayByDate(date))
	}
}
