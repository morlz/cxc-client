<template>
	<table class="SheetResultTable" id="result" data-column-width='{ "1": 300, "2": 150, "3": 150, "4": 150 }'>
		<template v-if="printing">
			<tr>
				<td data-style="Header" colspan="4">Министерство образования Московской области</td>
			</tr>
			<tr>
				<td data-style="Header" colspan="4">Государственный университет "Дубна" - Дмитровский институт непрерывного образования</td>
			</tr>
			<tr>
				<td data-style="Header" colspan="4">СВЕДЕНИЯ</td>
			</tr>
			<tr>
				<td data-style="Header" colspan="4">О РАБОТЕ ГРУППЫ {{ group.name }} ЗА {{ month }}</td>
			</tr>
		</template>

		<tr data-height="60" v-if="group.users">
			<td data-style="Center" class="SheetResultTable__1st">Количиство студентов</td>
			<td data-style="Center" colspan="3">{{ group.users.length }}</td>
		</tr>
		<tr data-height="30">
			<td data-style="Center" rowspan="2">Количество часов, пропущеных группой</td>
			<td data-style="Center">Всего</td>
			<td data-style="Center">По уважительной причине</td>
			<td data-style="Center">Без уважительной причины</td>
		</tr>
		<tr data-height="30" v-if="sheet.id">
			<td data-style="Center">{{ sheet.getMonthHours(month) }}</td>
			<td data-style="Center">{{ sheet.getMonthHoursRespect(month) }}</td>
			<td data-style="Center">{{ sheet.getMonthHoursNoRespect(month) }}</td>
		</tr>
		<tr data-height="50">
			<td data-style="Center">Список студентов, пропустивших от 14 до 18 часов без уважительной причины (указать фамилии)</td>
			<td data-style="Center" colspan="3">
				{{ sheet.getUsersNoRespect(users, month, 14, 18).join(', ') }}
			</td>
		</tr>
		<tr data-height="50">
			<td data-style="Center">Список студентов, пропустивших от 20 до 48 часов без уважительной причины (указать фамилии)</td>
			<td data-style="Center" colspan="3">
				{{ sheet.getUsersNoRespect(users, month, 20, 48).join(', ') }}
			</td>
		</tr>
		<tr data-height="50">
			<td data-style="Center">Список студентов, пропустивших 50 и более часов без уважительной причины (указать фамилии)</td>
			<td data-style="Center" colspan="3">
				{{ sheet.getUsersNoRespect(users, month, 50).join(', ') }}
			</td>
		</tr>
		<tr data-height="30">
			<td data-style="Center">Принятые меры</td>
			<td data-style="Center" colspan="3"></td>
		</tr>
		<tr data-height="30">
			<td data-style="Center">Поощрения</td>
			<td data-style="Center" colspan="3"></td>
		</tr>
		<tr data-height="30">
			<td data-style="Center">Наиболее интересное мероприятие</td>
			<td data-style="Center" colspan="3"></td>
		</tr>
	</table>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/api'

export default {
	components: {

	},
	props: {
		month: String
	},
	data () {
		return {

		}
	},
	watch: {

	},
	computed: {
		...mapState('sheet', {
			sheet: state => state.cached.current,
			group: state => state.cached.group,
			printing: state => state.printing
		}),
		users () {
			if (!this.group.users)
				return []

			return this.group.users
		}
	},
	methods: {

	},
	created () {

	},
	mounted () {

	}
}
</script>

<style lang="stylus">
.SheetResultTable
	border-collapse collapse
	font-size 14px

	&__1st
		width 300px

	td
		padding 10px
		border 1px solid #888
		text-align center
</style>
