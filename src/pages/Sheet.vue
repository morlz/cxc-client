<template>
<q-page class="Sheet">
	<q-tabs v-model="currentMonth" class="Sheet__tabs">
		<q-tab slot="title" v-for="tab, index in sheet.monthList" :key="index" :name="tab.format('MMMM YYYY')" :label="tab.format('MMMM YYYY')" />
		<q-tab slot="title" name="result" label="ИТОГ" v-if="auth_can('sheet-result')"/>
	</q-tabs>

	<div class="Sheet__content" :key="currentMonth">
		<template v-if="sheet && currentMonth != 'result'">
			<q-tabs inverted v-model="currentTab">
				<q-tab slot="title" name="table" label="Таблица" default v-if="auth_can('month')"/>
				<q-tab slot="title" name="res" label="Итог" v-if="auth_can('month-result')"/>
				<q-btn slot="title" color="primary" @click="toExcel" flat>Экспорт в excel</q-btn>

				<q-tab-pane name="table" v-if="auth_can('month')">
					<table class="Table" id="table" ref="monthValues" data-column-width='{"1": 300}'>
						<template v-if="printing">
							<tr>
								<td data-style="Header" :colspan="currentMonthLength + 2">Министерство образования Московской области</td>
							</tr>

							<tr>
								<td data-style="Header" :colspan="currentMonthLength + 2">Государственный университет "Дубна" - Дмитровский институт непрерывного образования</td>
							</tr>

							<tr>
								<td data-style="Header" :colspan="currentMonthLength + 2">Ведомость учета часов, пропущенных  студентами</td>
							</tr>

							<tr>
								<td data-style="Header" :colspan="currentMonthLength + 2">Специальность Программирование в компьютерных системах Курс 4 Группа {{ group.name }} за {{ currentMonth }} года</td>
							</tr>
						</template>

						<tr>
							<td>
							</td>

							<td v-for="day in currentMonthLength" data-style="Center">
								<div class="Table__head">
									<div class="Table__head-value">
										{{ currentMonthOffset.start + day }}
									</div>
								</div>
							</td>

							<td data-style="Center">
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

								<td
									v-for="value, vIndex in sheet.getData(currentMonth, user.id)"
									:key="index + '-' + vIndex"
									data-type="Number"
									:data-value="value">
									<div class="Table__value">
										<table-cell
											:value="value"
											:options="hours"
											:holiday="isHoliday(currentMonth, vIndex + currentMonthOffset.start)"
											:vs="isVs(currentMonth, vIndex + currentMonthOffset.start)"
											@input="(sheet.setData(currentMonth, user.id, vIndex + currentMonthOffset.start, $event), $nextTick(() => $forceUpdate()))"/>
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
					<result :month="currentMonth" ref="monthResult"/>
				</q-tab-pane>
			</q-tabs>
		</template>

		<template v-if="currentMonth == 'result' && auth_can('month-result')">
			<result-all ref="resultAll"/>
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
import { AuthMixin } from '@/mixins'
import tableToExcel from '@/lib/tableToExcel'

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
	mixins: [AuthMixin],
	data () {
		return {
			currentMonth: this.$moment().format('MMMM YYYY'),
			currentTab: '',
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
			loading: state => state.loading.current || state.loading.group,
			printing: state => state.printing
		}),
		currentMonthLength () {
			if (this.currentMonth === 'result')
				return 0

			return this.$moment(this.currentMonth, 'MMMM YYYY').daysInMonth() - this.currentMonthOffset.start - this.currentMonthOffset.end
		},
		currentMonthOffset () {
			if (!this.sheet.getMonthDaysOffset)
				return {
					start: 0,
					end: 0
				}

			return this.sheet.getMonthDaysOffset(this.currentMonth)
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
		},


		async toExcel () {
			try {
				await this.$q.dialog({
					title: 'Экспорт в excel',
					message: 'Вы уверены?',
					ok: 'Да',
					cancel: 'Нет'
				})
				this.toExcel_run()
			} catch (err) {}
		},
		async toExcel_run () {
			this.$store.commit('sheet/printingSet', true)

			let excel = {
				sheets: [],
				sheetNames: []
			}

			for (let month of this.sheet.monthList) {
				month = month.format('MMMM YYYY')

				await this.toExcel_goToMonth(month)
				excel.sheets.push(await this.toExcel_takeCurrentMonth())
				excel.sheetNames.push(month)

				await this.toExcel_goToCurrentMonthResult()
				excel.sheets.push(await this.toExcel_takeCurrentMonthResult())
				excel.sheetNames.push('Итоги месяца ' + month)
			}

			await this.toExcel_goToResultAll()
			excel.sheets.push(await this.toExcel_takeResultAll())
			excel.sheetNames.push('Итоги симестра ' + this.sheet.name)

			console.log(excel)
			tableToExcel(excel.sheets, excel.sheetNames, 'TestBook.xls', 'Excel')
			this.$store.commit('sheet/printingSet', false)
		},
		async toExcel_goToMonth (month) {
			this.currentMonth = month
			await this.waitForRefLoaded('monthValues')
		},
		async toExcel_goToCurrentMonthResult () {
			this.currentTab = 'res'
			await this.waitForRefLoaded('monthResult')
		},
		async toExcel_goToResultAll () {
			this.currentMonth = 'result'
			await this.waitForRefLoaded('resultAll')
		},
		toExcel_takeCurrentMonth () {
			return this.$refs.monthValues
		},
		toExcel_takeCurrentMonthResult () {
			return this.$refs.monthResult.$el
		},
		toExcel_takeResultAll () {
			return this.$refs.resultAll.$el
		},

		async waitForRefLoaded(ref) {
			let res = await this.waitForRefLoaded_check(ref)
			if (!res)
				await this.waitForRefLoaded(ref)
		},
		waitForRefLoaded_check (ref) {
			return new Promise(resolve => setTimeout(() => resolve(this.$refs[ref] !== undefined), 30))
		}
	},
	async created () {
		this.$store.dispatch('sheet/init', this.$route.params.id)
		this.getHolidays()
	},
	mounted () {
		this.$store.commit('app/headerShadowSet', false)
	},
	beforeDestroy () {
		this.$store.commit('app/headerShadowSet', true)
	}
}
</script>

<style lang="stylus">
.Sheet
	width 100%

	&__tabs
		box-shadow 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px rgba(0,0,0,0.14), 0 1px 10px rgba(0,0,0,0.12)

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
