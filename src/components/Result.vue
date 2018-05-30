<template>
<div class="SheetResult">
	<table class="SheetResultTable">
		<tr v-if="group.users">
			<td class="SheetResultTable__1st">Количиство студентов</td>
			<td colspan="3">{{ group.users.length }}</td>
		</tr>
		<tr>
			<td rowspan="2">Количество часов, пропущеных группой</td>
			<td>Всего</td>
			<td>По уважительной причине</td>
			<td>Без уважительной причины</td>
		</tr>
		<tr v-if="sheet.id">
			<td>{{ sheet.getMonthHours(month) }}</td>
			<td>{{ sheet.getMonthHoursRespect(month) }}</td>
			<td>{{ sheet.getMonthHoursNoRespect(month) }}</td>
		</tr>
		<tr>
			<td>Список студентов, пропустивших от 14 до 18 часов без уважительной причины (указать фамилии)</td>
			<td colspan="3">
				{{ sheet.getUsersNoRespect(users, month, 14, 18).join(', ') }}
			</td>
		</tr>
		<tr>
			<td>Список студентов, пропустивших от 20 до 48 часов без уважительной причины (указать фамилии)</td>
			<td colspan="3">
				{{ sheet.getUsersNoRespect(users, month, 20, 48).join(', ') }}
			</td>
		</tr>
		<tr>
			<td>Список студентов, пропустивших 50 и более часов без уважительной причины (указать фамилии)</td>
			<td colspan="3">
				{{ sheet.getUsersNoRespect(users, month, 50).join(', ') }}
			</td>
		</tr>
		<tr>
			<td>Принятые меры</td>
			<td colspan="3"></td>
		</tr>
		<tr>
			<td>Поощрения</td>
			<td colspan="3"></td>
		</tr>
		<tr>
			<td>Наиболее интересное мероприятие</td>
			<td colspan="3"></td>
		</tr>
	</table>
</div>
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
