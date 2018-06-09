<template>
<q-page padding class="Specs">
	<q-card>
		<q-card-main class="Specs__add">
			<q-field helper="Например 09.02.03">
				<q-input v-model="form.id" float-label="Код специальности"/>
			</q-field>

			<q-field helper="Это первые 2 цифры в названии группы">
				<q-input v-model="form.code" float-label="Префикс"/>
			</q-field>

			<q-field>
				<q-input v-model="form.name" float-label="Название специальности"/>
			</q-field>
		</q-card-main>

		<q-card-actions>
			<q-btn color="primary" @click="add" flat>Добавить</q-btn>
		</q-card-actions>
	</q-card>

	<q-list>
		<q-item v-for="spec, index in specs" :key="index">
			<q-item-side>
				{{ spec.code }}
			</q-item-side>

			<q-item-main>
				<q-item-tile>
					{{ spec.name }}
				</q-item-tile>

				<q-item-tile>
					{{ spec.id }}
				</q-item-tile>
			</q-item-main>

			<q-item-side right>
				<q-btn color="negative" @click="remove(spec)" falt>Добавить</q-btn>
			</q-item-side>
		</q-item>
	</q-list>
</q-page>
</template>

<script>
import { Spec } from '@/lib'
import { mapState } from 'vuex'
export default {
	data () {
		return {
			form: new Spec()
		}
	},
	computed: {
		...mapState('spec', {
			specs: state => state.cached.list
		})
	},
	methods: {
		add () {
			this.$store.dispatch('spec/save', this.form)
			this.form = new Spec()
		},
		remove () {

		}
	},
	created () {
		this.$store.dispatch('spec/init')
	}
}
</script>

<style lang="stylus">
.Specs
	display grid
	grid-gap 10px
	grid-template-rows max-content 1fr
	&__add
		display grid
		grid-gap 10px
</style>
