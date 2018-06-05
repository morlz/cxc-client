<template>
<q-page padding class="Permissions">
	<q-btn color="primary" class="Permissions__button" @click="save">Сохранить состояние</q-btn>

	<div class="Permissions__lists">
		<q-list class="UserList">
			<q-item
				v-for="user, index in users"
				:key="index"
				:class="{ selected: isSelected('user', user.id) }">
				<q-item-side v-if="showToggleUsers">
					<q-toggle
						:value="permissionUsers.includes(user.id)"
						@input="toggleUser({ value: $event, id: user.id })"/>
				</q-item-side>

				<q-item-main
					:label="user.name"
					@click.native="select({ type: 'user', id: user.id })"/>
			</q-item>
		</q-list>

		<q-list class="PermissionList">
			<q-item
				v-for="permission, index in permissions"
				:key="index"
				:class="{ selected: isSelected('permission', permission.id) }">
				<q-item-side v-if="showTogglePermissions">
					<q-toggle
						:value="userPermissions.includes(permission.id)"
						@input="togglePermission({ value: $event, id: permission.id })"/>
				</q-item-side>

				<q-item-main
					:label="permission.name"
					@click.native="select({ type: 'permission', id: permission.id })"/>
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
		...mapState('permissions', {
			users: state => state.cached.users,
			permissions: state => state.cached.permissions,
			selected: state => state.selected
		}),
		...mapGetters('permissions', [
			'showToggleUsers',
			'showTogglePermissions',
			'permissionUsers',
			'userPermissions'
		])
	},
	methods: {
		...mapActions('permissions', [
			'save',
			'init'
		]),
		...mapMutations('permissions', [
			'select',
			'toggleUser',
			'togglePermission'
		]),
		isSelected (type, id) {
			return this.selected.type == type && this.selected.id == id
		}
	},
	async created () {
		await this.init()
	},
	mounted () {

	}
}
</script>

<style lang="stylus">
.Permissions
	display grid
	grid-gap 10px
	grid-template-rows max-content 1fr

	&__lists
		display grid
		grid-gap 10px
		grid-template-columns 1fr 1fr

	&__button
		justify-self end

	.selected
		border 1px solid red
</style>
