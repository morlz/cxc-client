import BaseModel from '@/lib/BaseModel'
import api from '@/api'
import { Group, SheetMonth } from '@/lib'
import moment from 'moment'
import Vue from 'vue'

export default class Sheet extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			//group: Group
			months: [SheetMonth],
		}, arg)
	}

	get name () {
		return moment(this.from).format('DD MMMM YYYY') + ' - ' + moment(this.to).format('DD MMMM YYYY')
	}

	get path () {
		return `/group/${this.group_id}/sheet` + (this.id ? '/' + this.id : `/${this.from}/${this.to}`)
	}


	getMonthByDate (date) {
		let res = this.months.find(month => month.is(date))
		return res ? res : new SheetMonth({
			group_id: this.group_id,
			date,
			days: []
		})
	}

	get monthList () {
		return Array.apply(null, { length: Math.ceil(moment.duration(this.to.diff(this.from)).asMonths()) })
			.map((el, index) => moment(this.from).add(index, 'months'))
	}

	static async getOne (id) {
		let res = await api.get('sheet', { id })
		if (!res) return

		return new Sheet(res)
	}

	get group () {
		return this._group
	}

	set group (val) {
		val.users.map(user => user.update({ months: this.getMonthsForUser(user.id) }))
		Vue.set(this, '_group', val)
	}

	getMonthsForUser (uid) {
		return this.monthList.map(monthName => this.getMonthByDate(monthName).forUser(uid))
	}

	get initialMonth () {
		let from = moment(this.from),
			to = moment(this.to),
			now = moment()

		if (now.isAfter(to))
			return to.format('MMMM YYYY')

		if (now.isBefore(from))
			return from.format('MMMM YYYY')

		return now.format('MMMM YYYY')
	}
}
