import moment from 'moment'

moment.locale('ru')

export default ({ Vue }) => {
  Vue.prototype.$moment = moment
}
