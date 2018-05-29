<template>
<q-card class="q-ma-md AppMenuProfile" color="white" text-color="blue-grey-14">
	<template v-if="logined">
		<q-card-media v-if="user.avatar">
			<img :src="user.avatar">
		</q-card-media>

		<q-card-title class="AppMenuProfile__title">
			{{ user.name }}
			<q-btn icon="account_box" color="primary" round class="AppMenuProfile__button" @click="$router.push(`/user/${user.id}`)"/>

			<div slot="subtitle" class="AppMenuProfile__email">
				<div>
					{{ user.email }}
				</div>

				<div v-if="user.role">
					{{ user.role.name }}
				</div>
			</div>
		</q-card-title>

		<q-card-actions class="row reverse">
			<q-btn flat color="secondary" @click="logout">
				Выйти
			</q-btn>
		</q-card-actions>
	</template>

	<template v-else>
		<q-card-main class="AppMenuProfile__main">
			<q-field :error="!!errorInLogin" :error-label="errorInLogin">
				<q-input v-model.trim="signin.login" float-label="Логин"/>
			</q-field>

			<q-field :error="!!errorInPassword" :error-label="errorInPassword">
				<q-input v-model.trim="signin.pass" float-label="Пароль" type="password"/>
			</q-field>
		</q-card-main>

		<q-card-actions class="AppMenuProfile__actions">
			<q-btn color="primary" @click="go">Войти</q-btn>
		</q-card-actions>
	</template>

	<q-inner-loading :visible="loading.user">
		<q-spinner size="50px" color="primary"/>
	</q-inner-loading>
</q-card>
</template>

<script>
import {
	mapGetters,
	mapActions,
	MapMutations,
	mapState
} from 'vuex'


export default {
	components: {

	},
	props: {

	},
	data () {
		return {
			signin: {
				login: "",
				pass: ""
			},
			tryToIn: 0
		}
	},
	watch: {

	},
	computed: {
		...mapState('auth', [
			'loading',
			'user'
		]),
		...mapGetters('auth', [
			'logined'
		]),
		errorInLogin () {
			if (!this.tryToIn) return
			if (!this.signin.login)
				return 'Введите логин'
		},
		errorInPassword () {
			if (!this.tryToIn) return
			if (!this.signin.pass)
				return 'Введите пароль'
			if (this.signin.pass.length < 4)
				return 'Минимальная длинна пароля 4 символа'
		},
		signInFormValid () {
			let validate = [
				!this.errorInLogin,
				!this.errorInPassword
			]

			if ( validate.includes(false) ) return
			return true
		}
	},
	methods: {
		...mapActions({
			signIn: 'auth/signin',
			authInit: 'auth/init',
			logout: 'auth/logout'
		}),
		go () {
			this.tryToIn++
			if (!this.signInFormValid) return
			this.signIn(this.signin)
		}
	},
	async mounted () {
		await this.authInit()
	}
}
</script>

<style lang="stylus">
.AppMenuProfile
	position relative

	&__title
		position relative

	&__button
		position absolute
		top 0
		right 16px
		transform translateY(-50%)

	&__balance
		color gray
		i::before
			font-size 14px

	&__email
		color gray

	&__main
		display grid
		grid-gap 10px

</style>
