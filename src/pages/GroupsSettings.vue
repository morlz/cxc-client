<template>
<q-page padding class="GroupsSetup">
	<q-btn color="primary" class="GroupsSetup__button" @click="save">Сохранить состояние</q-btn>

	<div class="GroupsSetup__lists">
		<q-list class="UserList">
			<q-list-header>Пользователи</q-list-header>

			<q-item
				v-for="user, index in users"
				:key="index"
				:class="{ selected: isSelected('user', user.id) }">
				<q-item-side v-if="showToggleUsers">
					<q-toggle
						:value="groupUsers.includes(user.id)"
						@input="toggleUser({ value: $event, id: user.id })"/>
				</q-item-side>

				<q-item-main
					:label="user.name"
					@click.native="select({ type: 'user', id: user.id })"/>
			</q-item>
		</q-list>

		<q-list class="GroupList">
			<q-list-header>Группы</q-list-header>

			<q-item
				v-for="group, index in groups"
				:key="index"
				:class="{ selected: isSelected('group', group.id) }">
				<q-item-side v-if="showToggleGroups">
					<q-toggle
						:value="userGroups.includes(group.id)"
						@input="toggleGroup({ value: $event, id: group.id })"/>
				</q-item-side>

				<q-item-main
					:label="group.name"
					@click.native="select({ type: 'group', id: group.id })"/>
			</q-item>
		</q-list>
	</div>
</q-page>
</template>

<script>
import {
	mapGetters,
	mapActions,
	mapMutations,
	mapState
} from 'vuex'

export default {
	computed: {
		...mapGetters('permissions', [
			'users'
		]),
		...mapState('group', {
			groups: state => state.cached.list,
			selected: state => state.selected
		}),
		...mapGetters('group', [
			'showToggleUsers',
			'showToggleGroups',
			'groupUsers',
			'userGroups'
		])
	},
	methods: {
		...mapActions('group', [
			'save',
			'setupInit',
		]),
		...mapMutations('group', [
			'select',
			'toggleUser',
			'toggleGroup'
		]),
		isSelected (type, id) {
			return this.selected.type == type && this.selected.id == id
		},
	},
	async created () {
		await this.setupInit()
	},
}
</script>

<style lang="stylus">
.GroupsSetup
	display grid
	grid-gap 10px
	grid-template-rows max-content 1fr

	&__lists
		display grid
		grid-gap 10px
		grid-template-columns 1fr 1fr
		grid-template-rows max-content 1fr

		.q-item
			cursor pointer

	&__button
		justify-self end

	.selected
		background rgba(189,189,189,0.4)
</style>
