<template>
<div class="AddSheet">
	<q-field helper="С">
		<q-datetime v-model="form.from" float-label="С"/>
	</q-field>

	<q-field helper="По">
		<q-datetime v-model="form.to" float-label="По"/>
	</q-field>

	<q-btn color="primary" @click="add">Добавить</q-btn>
</div>
</template>

<script>
export default {
	data () {
		return {
			form: {
				from: '',
				to: ''
			}
		}
	},
	methods: {
		add () {
			this.$store.dispatch('sheet/create', {
				from: this.$moment(this.form.from).format('YYYY-MM-DD'),
				to: this.$moment(this.form.to).format('YYYY-MM-DD'),
				group_id: this.$route.params.id
			})
		}
	},
}
</script>

<style lang="stylus">
.AddSheet
	display grid
	grid-gap 10px
	justify-items start

	.q-datetime-input
		width 200px
</style>
