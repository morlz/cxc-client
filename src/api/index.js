import axios from 'axios'
import EventEmitter from 'browser-event-emitter'
import path from 'path'

const protocol = 'http'
//const domain = '95.72.9.114/cxc-server/public/'
const domain = 'api.cxc.pew-pc.com/'

class ApiCore extends EventEmitter {
	async invoke (to, options = {}, method = 'get', i = 0) {
		let args = [...Array.from(arguments)]
		//await this._wait(1000)

		let url = path.join(domain, to)
		let auth = {
			api_token: localStorage.getItem('api_token'),
			uid: localStorage.getItem('uid')
		}

		if (options.id !== undefined) {
			url = path.join(url, '/' + options.id)
			delete options.id
		}

		const req = { [method === 'get' ? 'params' : 'data']: options }

		req.params = { ...req.params, ...auth }

		url = protocol + '://' + url

		let res = {}
		try {
			res = await axios({ ...req, method, url })
		} catch (err) {
			console.log('err', { ...err })

			if (err.response && err.response.status === 500 && i < 5) {
				console.log('err 500', i);
				await this._wait(5e2)

				console.log('err args', args)
				args[3] = ++i
				return await this.invoke(...args)
			}

			return {}
		}

		if (!res.data || res.data.error)
			return this.handleError(res)

		return res.data
	}

	async get (...args) {
		return await this.invoke(...args)
	}

	async post (...args) {
		return await this.invoke(...args, 'post')
	}

	async delete (...args) {
		return await this.invoke(...args, 'delete')
	}

	async put (...args) {
		return await this.invoke(...args, 'put')
	}

	handleError ({ data, status }) {
		this.emit('error', data.error || data)

		if (data.error)
			return this.emit('handledError', data.error)

		return this.emit('unhadledError', data)
	}

	_wait (time = 300) {
		return new Promise(resolve => setTimeout(resolve, time))
	}

	sortFnFactory (field, revert = false) {
		return (a, b) => {
			if (typeof field == 'function') {
				if (field(a) > field(b)) return revert ? 1 : -1
				if (field(a) < field(b)) return revert ? -1 : 1
			}
			if (a[field] > b[field]) return revert ? 1 : -1
			if (a[field] < b[field]) return revert ? -1 : 1
			return 0
		}
	}
}

export default new ApiCore()
