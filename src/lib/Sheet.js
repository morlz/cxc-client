import BaseModel from '@/lib/BaseModel'
import api from '@/api'
import { SheetData, Group } from '@/lib'
import moment from 'moment'
import Vue from 'vue'

export default class Sheet extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			data: [SheetData],
			group: Group
		}, {
			cachedData: {},
			...arg
		})
	}

	get name () {
		return moment(this.from).format('DD MMMM YYYY') + ' - ' + moment(this.to).format('DD MMMM YYYY')
	}

	get path () {
		return `/sheet/${this.id}`
	}

	static async getOne (id) {
		let res = await api.get('sheet', { id })
		if (!res) return

		return new Sheet(res)
	}

	static async create (payload) {
		let res = await api.post('sheet', payload)
		if (!res) return

		return new Sheet(res)
	}

	async delete () {
		let res = await api.delete('sheet', { id: this.id })
		if (!res) return

		return this.update(res)
	}

	getData (month, user_id) {
		let mMonth = moment(month, 'MMMM YYYY'),
			offset = this.getMonthDaysOffset(month)

		mMonth.date(1)

		let datas = this.getDataByMonth(month).filter(el => el.user_id == user_id)
		return Array.apply(null, { length: mMonth.daysInMonth() - offset.start - offset.end }).map((el, index) => {
			let data = this.findDataByDay(datas, index + 1 + offset.start)
			return data ? data.value : 0
		})
	}

	getDataSumm (month, user_id, all = true) {
		let data = this.getData(month, user_id)
		if (all === true)
			return `${data.filter(el => el < 0).reduce((prev, el) => prev + el, 0)} / ${data.filter(el => el > 0).reduce((prev, el) => prev + el, 0)}`

		if (Math.sign(all) === +1)
			return data.filter(el => el > 0).reduce((prev, el) => prev + el, 0)

		if (Math.sign(all) === -1)
			return data.filter(el => el < 0).reduce((prev, el) => prev +  Math.abs(el), 0)
	}

	getDataUserSumm (user_id, all) {
		let data = this.data.filter(el => el.user_id == user_id)

		if (Math.sign(all) === +1)
			return data.filter(el => el.value > 0).reduce((prev, el) => prev + el.value, 0)

		if (Math.sign(all) === -1)
			return data.filter(el => el.value < 0).reduce((prev, el) => prev + Math.abs(el.value), 0)
	}

	setData (month, user_id, day, value) {
		let date = moment(month, 'MMMM YYYY')
		date.date(+day + 1)

		let data = this.data.find(el => el.user_id == user_id && moment(el.date).isSame(date))
		if (data)
			data.setValue(value)
		else
			this.addData (new SheetData({ user_id, value, sheet_id: this.id, date: date.format('YYYY-MM-DD') }))
	}

	getDataByMonth (month) {
		if (this.cachedData[month])
			return this.cachedData[month]

		return this.cachedData[month] = this.data.filter(el => el.is(month))
	}

	findDataByDay (data, day) {
		return data.find(el => +moment(el.date).format('D') == day)
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

	addData (data) {
		data.save()
		let tmpData = this.data
		tmpData.push(data)


		let month = moment(data.date).format('MMMM YYYY')
		Vue.set(this.cachedData, month, tmpData.filter(el => el.is(month)))
		Vue.set(this, 'data', tmpData)
	}

	get monthList () {
		return Array.apply(null, { length: Math.floor( moment.duration(moment(this.to).diff(this.from)).asMonths() ) + 1 })
			.map((el, index) => moment(this.from).add(index, 'months'))
	}

	getMonthHours (month) {
		return this.getDataByMonth(month).reduce((prev, el) => Math.abs(el.value) + prev, 0)
	}

	getMonthHoursRespect (month) {
		return this.getDataByMonth(month).filter(el => el.value > 0).reduce((prev, el) => Math.abs(el.value) + prev, 0)
	}

	getMonthHoursNoRespect (month) {
		return this.getDataByMonth(month).filter(el => el.value < 0).reduce((prev, el) => Math.abs(el.value) + prev, 0)
	}

	getUsersNoRespect (users, month, from, to) {
		let res = users
			.filter(el => {
				let hours = this.getDataSumm(month, el.id, -1)
				let ret = to ? hours <= to : true
				if (hours >= from && ret)
					return true
			})
			.map(el => el.name.split(' ')[0])

		return res
	}

	getMonthDaysOffset (date) {
		return {
			start: moment(this.from).format('MMMM YYYY') == date ?
				moment(this.from).date() - 1
			:	0,
			end: moment(this.to).format('MMMM YYYY') == date ?
				moment(this.to).daysInMonth() - moment(this.to).date()
			:	0
		}
	}

	getCource (groupStartYeare) {
		let from = moment(this.from)
		return from.year() - groupStartYeare.year() + +(from.month() > 7)
	}
}
