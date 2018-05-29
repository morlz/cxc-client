import BaseModel from '@/lib/BaseModel'
import api from '@/api'
import moment from 'moment'
import axios from 'axios'

export default class Holiday extends BaseModel {
	constructor (arg) {
		super(arg)
		//this.define({}, arg)
	}

	//http://kayaposoft.com/enrico/json/v1.0/?action=getPublicHolidaysForMonth&month=2&year=2018&country=rus

	static async getList (date) {
		date = moment(date)
		let { data } = await axios({
			//url: `http://htmlweb.ru/service/api.php?holiday`,
			url: `http://kayaposoft.com/enrico/json/v1.0/`,
			method: 'get',
			params: {
				action: 'getPublicHolidaysForMonth',
				month: date.format('M'),
				year: date.format('YYYY'),
				country: 'rus'
			}
			/*
			params: {
				type: 1,
				perpage: 100,
				country: 'ru'
			}
			*/
		})

		if (!Array.isArray(data))
			return data

		return data.map(el => new Holiday(el))
	}

	is (date) {
		return this.date.isSame(date)
	}

	get date () {
		return this._date
	}

	set date ({ day, month, year }) {
		this._date = moment(`${day}-${month}-${year}`, 'D-M-YYYY')
	}
}
