<template>
<q-page padding class="Permissions">
	<q-btn color="primary" class="Permissions__button" @click="save">Сохранить состояние</q-btn>

	<div class="Permissions__lists">
		<q-card class="AddUserForm" v-if="auth_can('user-add')">
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

				<q-select v-model="add.user.role_id" :options="roles"/>
			</q-card-main>

			<q-card-actions>
				<q-btn color="primary" flat @click="addUser">Добавить</q-btn>
			</q-card-actions>
		</q-card>

		<q-card class="AddPermissionForm" v-if="auth_can('permission-add')">
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
				:class="{ selected: isSelected('user', user.id) }"
				@click.native="select({ type: 'user', id: user.id })">
				<q-item-side v-if="showToggleUsers">
					<q-toggle
						:value="permissionUsers.includes(user.id)"
						@input="toggleUser({ value: $event, id: user.id })"/>
				</q-item-side>

				<q-item-main>
					<q-item-tile>
						{{ user.login }}
					</q-item-tile>

					<q-item-tile>
						{{ user.name }}
					</q-item-tile>

					<q-item-tile>
						{{ roles.find(el => el.value == user.role_id).label }}
					</q-item-tile>
				</q-item-main>

				<q-item-side v-if="auth_can('user-remove')">
					<q-btn flat color="negative" icon="delete" @click.stop="deleteUser(user)"/>
				</q-item-side>
			</q-item>
		</q-list>

		<q-list class="PermissionList">
			<q-list-header>Права</q-list-header>

			<q-item
				v-for="permission, index in permissions"
				:key="index"
				:class="{ selected: isSelected('permission', permission.id) }"
				@click.native="select({ type: 'permission', id: permission.id })">
				<q-item-side v-if="showTogglePermissions">
					<q-toggle
						:value="userPermissions.includes(permission.id)"
						@input="togglePermission({ value: $event, id: permission.id })"/>
				</q-item-side>

				<q-item-main>
					<q-item-tile>
						{{ permission.name }}
					</q-item-tile>

					<q-item-tile>
						{{ permission.description }}
					</q-item-tile>
				</q-item-main>

				<q-item-side v-if="auth_can('permission-remove')">
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
import { AuthMixin } from '@/mixins'

export default {
	mixins: [AuthMixin],
	data () {
		return {
			add: {
				user: new User(),
				permission: new Permission()
			},
			roles: [
				{ value: 1, label: 'Админ' },
				{ value: 2, label: 'Преподаватель' },
				{ value: 3, label: 'Пользователь' },
			]
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
