<template>
	<table class="SheetResultAllTable" data-column-width='{ "1": 270 }'>

		<template v-if="printing">
			<tr>
				<td data-style="Header" :colspan="(sheet.monthList.length + 1) * 2 + 1">Министерство образования Московской области</td>
			</tr>
			<tr>
				<td data-style="Header" :colspan="(sheet.monthList.length + 1) * 2 + 1">Государственный университет "Дубна" - Дмитровский институт непрерывного образования</td>
			</tr>
			<tr>
				<td data-style="Header" :colspan="(sheet.monthList.length + 1) * 2 + 1">ЛИСТ ПОСЕЩАЕМОСТИ</td>
			</tr>
			<tr>
				<td data-style="Header" :colspan="(sheet.monthList.length + 1) * 2 + 1">Специальность {{ group.spec.name }} Курс {{ sheet.getCource(group.addmissionYeare) }} Группа {{ group.name }} за {{ sheet.name }}</td>
			</tr>
		</template>

		<tr>
			<td class="SheetResultAllTable__1st">Названия месяцев</td>

			<td v-for="tab, index in sheet.monthList" :key="index" colspan="2" data-style="Center">
				<div class="">
					{{ tab.format('MMMM YYYY') }}
				</div>
			</td>

			<td colspan="2" data-style="Center">
				<div>
					Итог
				</div>
			</td>
		</tr>

		<tr>
			<td>ФИО</td>

			<template v-for="tab, index in sheet.monthList">
				<td>
					<div>
						уваж
					</div>
				</td>

				<td>
					<div>
						неуваж
					</div>
				</td>
			</template>

			<td>
				<div>
					уваж
				</div>
			</td>

			<td>
				<div>
					неуваж
				</div>
			</td>
		</tr>

		<tr v-for="user, index in users">
			<td>
				<div class="">
					{{ user.name }}
				</div>
			</td>

			<template v-for="month, index in sheet.monthList">
				<td>
					{{ sheet.getDataSumm(month, user.id, +1) }}
				</td>
				<td>
					{{ sheet.getDataSumm(month, user.id, -1) }}
				</td>
			</template>

			<td>
				<div>
					{{ sheet.getDataUserSumm(user.id, +1) }}
				</div>
			</td>

			<td>
				<div>
					{{ sheet.getDataUserSumm(user.id, -1) }}
				</div>
			</td>
		</tr>
	</table>
</template>

<script>
import { mapState } from 'vuex'
import api from '@/api'

export default {
	computed: {
		...mapState('sheet', {
			sheet: state => state.cached.current,
			group: state => state.cached.group,
			printing: state => state.printing
		}),
		users () {
			if (!this.group.users)
				return []

			return this.group.users.sort( api.sortFnFactory(el => el.name, true) )
		}
	}
}
</script>

<style lang="stylus">
.SheetResultAllTable
	border-collapse collapse
	font-size 14px

	td
		padding 5px
		border 1px solid #888
		text-align center
		&:first-child
			text-align left
</style>
