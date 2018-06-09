<template>
	<div class="Menu">
		<q-list no-border link inset-delimiter v-if="auth_can('edit-permissions') || auth_can('edit-groups')">
			<q-list-header>Администрирование</q-list-header>

			<q-item link to="/permissions" v-if="auth_can('edit-permissions')">
				<q-item-main label="Настройка прав"/>
			</q-item>

			<q-item link to="/groups" v-if="auth_can('edit-groups')">
				<q-item-main label="Настройка групп"/>
			</q-item>

			<q-item link to="/specs" v-if="auth_can('spec')">
				<q-item-main label="Добавление специальностей"/>
			</q-item>
		</q-list>

		<q-list no-border link inset-delimiter v-if="auth_can('sheets')">
			<q-list-header>Ведомости по группам</q-list-header>
			<q-collapsible v-for="group, index in list" :key="index" :label="group.name">
				<q-item v-for="sheet, sIndex in group.sheets" link :to="sheet.path" :key="index + '-' + sIndex">
					<q-item-main :label="sheet.name" />
					<q-item-side v-if="auth_can('sheet-remove')">
						<q-btn color="negative" flat icon="delete"/>
					</q-item-side>
				</q-item>

				<q-item link :to="`/add/sheet/${group.id}`" v-if="auth_can('sheet-add')">
					<q-item-main>
						Добавить
					</q-item-main>
				</q-item>
			</q-collapsible>
		</q-list>
	</div>
</template>

<script>
import {
	mapGetters,
	mapActions,
	MapMutations,
	mapState
} from 'vuex'

import { AuthMixin } from '@/mixins'

export default {
	mixins: [AuthMixin],
	computed: {
		...mapState('group', {
			list: state => state.cached.list
		})
	},
	created () {
		this.$store.dispatch('group/init')
	},
}
</script>

<style lang="stylus">
</style>
