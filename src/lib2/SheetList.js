import BaseModel from '@/lib/BaseModel'
import moment from 'moment'
import { Sheet } from '@/lib'

export default class MonthList extends BaseModel {
	constructor (sheets, group_id) {
		super({ sheets, group_id })
	}

	getByDate (date) {
		let res = this.sheets.find(el => moment(el.from).isBefore(moment(date)) && moment(el.to).isAfter(moment(date)))
		return res ? res : new Sheet({
			from: moment(date).subtract(1, 'month'),
			to: moment(date).add(1, 'month'),
			group_id: this.group_id
		})
	}
}
