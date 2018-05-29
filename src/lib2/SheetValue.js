import BaseModel from '@/lib/BaseModel'
import api from '@/api'


export default class SheetValue extends BaseModel {
	constructor (arg) {
		super()

		this.define({}, arg)
	}
}
