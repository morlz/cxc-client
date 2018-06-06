<template>
<q-page padding class="Permissions">
	<q-btn color="primary" class="Permissions__button" @click="save">Сохранить состояние</q-btn>

	<div class="Permissions__lists">
		<q-card class="AddUserForm">
			<q-card-main class="AddFormInner">
				<q-field>
					<q-input v-model="add.user.name" float-label="ФИО"/>
				</q-field>

				<q-field>
					<q-input v-model="add.user.login" float-label="Логин"/>
				</q-field>

				<q-field>
					<q-input v-model="add.user.pass" float-label="Пароль"/>
				</q-field>
			</q-card-main>

			<q-card-actions>
				<q-btn color="primary" flat @click="addUser">Добавить</q-btn>
			</q-card-actions>
		</q-card>

		<q-card class="AddPermissionForm">
			<q-card-main class="AddFormInner">
				<q-field>
					<q-input v-model="add.permission.name" float-label="Название"/>
				</q-field>

				<q-field>
					<q-input v-model="add.permission.description" float-label="Описание"/>
				</q-field>
			</q-card-main>

			<q-card-actions>
				<q-btn color="primary" flat @click="addPermission">Добавить</q-btn>
			</q-card-actions>
		</q-card>

		<q-list class="UserList">
			<q-list-header>Пользователи</q-list-header>

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

				<q-item-side>
					<q-btn flat color="negative" icon="delete" @click.stop="deleteUser(user)"/>
				</q-item-side>
			</q-item>
		</q-list>

		<q-list class="PermissionList">
			<q-list-header>Права</q-list-header>

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

				<q-item-side>
					<q-btn flat color="negative" icon="delete" @click.stop="deletePermission(permission)"/>
				</q-item-side>
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

import { User, Permission } from '@/lib'

export default {
	data () {
		return {
			add: {
				user: new User(),
				permission: new Permission()
			}
		}
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
			'init',
			'deleteUser',
			'deletePermission'
		]),
		...mapMutations('permissions', [
			'select',
			'toggleUser',
			'togglePermission'
		]),
		isSelected (type, id) {
			return this.selected.type == type && this.selected.id == id
		},
		async addUser () {
			await this.$store.dispatch('permissions/addUser', this.add.user)
			this.add.user = new User()
		},
		async addPermission () {
			await this.$store.dispatch('permissions/addPermission', this.add.permission)
			this.add.permission = new Permission()
		}
	},
	async created () {
		await this.init()
	},
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
		grid-template-rows max-content 1fr

		.q-item
			cursor pointer

	&__button
		justify-self end

	.selected
		background rgba(189,189,189,0.4)

.AddFormInner
	display grid
	grid-gap 10px
</style>
