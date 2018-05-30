<template>
<q-page class="Sheet">
	<q-tabs v-model="currentMonth">
		<q-tab slot="title" v-for="tab, index in sheet.monthList" :key="index" :name="tab.format('MMMM YYYY')" :label="tab.format('MMMM YYYY')" />
		<q-tab slot="title" name="result" label="ИТОГ" />
	</q-tabs>

	<div class="Sheet__content" :key="currentMonth">
		<template v-if="sheet && currentMonth != 'result'">
			<q-tabs inverted>
				<q-tab slot="title" name="table" label="Таблица" default/>
				<q-tab slot="title" name="res" label="Итог"/>

				<q-tab-pane name="table">
					<table class="Table">
						<tr>
							<td>
							</td>

							<td v-for="day in currentMonthLength">
								<div class="Table__head">
									<div class="Table__head-value">
										{{ day }}
									</div>
								</div>
							</td>

							<td>
								<div class="">
									Неуваж / уваж
								</div>
							</td>
						</tr>

						<template v-if="group">
							<tr v-for="user, index in users">
								<td>
									<div class="Table__name">
										{{ user.name }}
									</div>
								</td>

								<td v-for="value, vIndex in sheet.getData(currentMonth, user.id)" :key="index + '-' + vIndex">
									<div class="Table__value">
										<table-cell
											:value="value"
											:options="hours"
											:holiday="isHoliday(currentMonth, vIndex)"
											:vs="isVs(currentMonth, vIndex)"
											@input="(sheet.setData(currentMonth, user.id, vIndex, $event), $nextTick(() => $forceUpdate()))"/>
									</div>
								</td>

								<td>
									<div class="Table__summ">
										{{ sheet.getDataSumm(currentMonth, user.id) }}
									</div>
								</td>
							</tr>
						</template>
					</table>
				</q-tab-pane>

				<q-tab-pane name="res">
					<result :month="currentMonth"/>
				</q-tab-pane>
			</q-tabs>
		</template>

		<template v-if="currentMonth == 'result'">
			<result-all/>
		</template>

		<q-inner-loading :visible="local_loading">
			<q-spinner size="50px" color="primary"/>
		</q-inner-loading>
	</div>
</q-page>
</template>

<script>
import { mapState } from 'vuex'
import TableCell from '@/components/TableCell'
import moment from 'moment'
import { Holiday } from '@/lib'
import api from '@/api'
import ResultAll from '@/components/ResultAll'
import Result from '@/components/Result'

const hours = Array.apply(null, { length: 9 }).map((el, index) => ({
	label: ((index - 4) * 2).toFixed(),
	value: ((index - 4) * 2)
}))

export default {
	components: {
		TableCell,
		ResultAll,
		Result
	},
	data () {
		return {
			currentMonth: this.$moment().format('MMMM YYYY'),
			hours,
			holidays: [],
			holidaysLoading: false
		}
	},
	watch: {
		sheet (n) {
			this.currentMonth = this.sheet.initialMonth
		},
		async currentMonth () {
			if (this.currentMonth === 'result') return
			this.getHolidays()
		}
	},
	computed: {
		...mapState('sheet', {
			sheet: state => state.cached.current,
			group: state => state.cached.group,
			loading: state => state.loading.current || state.loading.group
		}),
		currentMonthLength () {
			if (this.currentMonth === 'result') return
			return this.$moment(this.currentMonth).daysInMonth()
		},
		users () {
			if (!this.group.users)
				return []

			return this.group.users.sort( api.sortFnFactory(el => el.name, true) )
		},
		local_loading () {
			return !this.sheet.id || this.loading || this.holidaysLoading
		}
	},
	methods: {
		isHoliday (month, day) {
			let date = this.$moment(month, 'MMMM YYYY').date(day + 1)

			return this.holidays.find(el => el.is(date))
		},
		isVs (month, day) {
			let date = this.$moment(month, 'MMMM YYYY').date(day + 1)
			if (!date.day())
				return true

			return false
		},
		async getHolidays () {
			this.holidaysLoading = true
			this.holidays = await Holiday.getList(this.$moment(this.currentMonth, 'MMMM YYYY'))
			this.holidaysLoading = false
		}
	},
	async created () {
		this.$store.dispatch('sheet/init', this.$route.params.id)
		this.getHolidays()
	}
}
</script>

<style lang="stylus">
.Sheet
	width 100%

	&__content
		width 100%
		overflow-x auto
		padding 10px

.Table
	border-collapse collapse

	&__name
		width 300px
		padding 0px 5px

	&__head
		height 20px

	&__head-value
		//transform rotate(90deg)
		text-align center

	tr:hover > td
		background rgba(0, 0, 0, .10)

	td
		margin 0
		padding 0

	&__value
		height 30px
		width 30px
		border 1px solid #eee
		&:hover
			border 1px solid #e9e

	&__summ
		width 120px
		padding 0 5px
		text-align center
</style>
