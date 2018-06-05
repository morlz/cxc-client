<template>
	<q-list no-border link inset-delimiter>
		<q-list-header>Ведомости по группам</q-list-header>
		<q-collapsible v-for="group, index in list" :key="index" :label="group.name">
			<q-item v-for="sheet, sIndex in group.sheets" link :to="sheet.path" :key="index + '-' + sIndex">
				<q-item-main :label="sheet.name" />
				<q-item-side>
					<q-btn color="negative" flat icon="delete"/>
				</q-item-side>
			</q-item>

			<q-item link :to="`/add/sheet/${group.id}`">
				<q-item-main>
					Добавить
				</q-item-main>
			</q-item>
		</q-collapsible>
	</q-list>
</template>

<script>
import {
	mapGetters,
	mapActions,
	MapMutations,
	mapState
} from 'vuex'

import {} from 'quasar'

export default {
	components: {

	},
	props: {

	},
	data () {
		return {

		}
	},
	watch: {

	},
	computed: {
		...mapState('group', {
			list: state => state.cached.list
		})
	},
	methods: {
		addSheet () {

		}
	},
	async mounted () {

	},
	created () {
		this.$store.dispatch('group/init')
	},
	destroyed () {

	}
}
</script>

<style lang="stylus">
</style>
