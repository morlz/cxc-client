import BaseModel from '@/lib/BaseModel'
import api from '@/api'

export default class Spec extends BaseModel {
	constructor (arg) {
		super()
		this.define({}, {
			code: '',
			name: '',
			...arg
		})
	}

	static async getList () {
		let res = await api.get('specs')
		if (Array.isArray(res))
			return res.map(el => new Spec(el))

		return res
	}

	async save () {
		let res = this.id ? await api.put('spec', this) : await api.post('spec', this)
		if (!res) return

		return this.update(res)
	}

	async delete () {
		let res = await api.delete('spec', { id: this.id })
		if (!res) return

		return this.update(res)
	}
}
