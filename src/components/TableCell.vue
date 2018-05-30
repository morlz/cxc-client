<template>
<div
	class="TableCell"
	:class="{
		'TableCell__holiday' : holiday,
		'TableCell__vs' : vs
	}"
	:title="title"
>
	<div
		class="TableCell__value"
		@click="toggle"
		:class="{ 'TableCell__selecting' : showed }"
		 :style="{ color: +value ? '#000' : '#aaa' }">
		{{ !holiday && !vs ? value : ''  }}
	</div>

	<q-slide-transition>
		<div class="Select" v-if="showed">
			<div class="Select__options">
				<div class="SelectOption" v-for="option, index in options" @click="select(option)">
					{{ option.label }}
				</div>
			</div>
		</div>
	</q-slide-transition>
</div>
</template>

<script>
import { QSlideTransition } from 'quasar'

export default {
	components: {
		QSlideTransition
	},
	props: {
		value: [String, Number],
		options: Array,
		holiday: Object,
		vs: Boolean,
	},
	data () {
		return {
			showed: false
		}
	},
	watch: {

	},
	computed: {
		title () {
			if (!this.holiday)
				return ''

			return this.holiday.localName
		}
	},
	methods: {
		select (option) {
			this.$emit('input', option.value)
			this.hide()
		},
		show () {
			this.showed = true
			this.$nextTick(a => document.addEventListener('click', this.hide))
		},
		hide () {
			this.showed = false
			document.removeEventListener('click', this.hide)
		},
		toggle () {
			if (!!this.holiday || this.vs) return
			this.showed ?
				this.hide()
			:	this.show()
		}
	},
	created () {

	},
	mounted () {

	}
}
</script>

<style lang="stylus">
.TableCell
	width 100%
	height 100%
	cursor pointer
	position relative
	&__value
		width 100%
		height 100%
		transition all .20s ease-in-out
		line-height 30px
		text-align center
		color #aaa

	&__selecting
		background rgba(0, 0, 255, 0.1)

	&__holiday
		//pointer-events none
		cursor default
		background #ddd

	&__vs
		//pointer-events none
		cursor default
		background #ded


.Select
	position absolute
	top 100%
	background #fff
	overflow-y auto
	z-index 1000
	box-shadow 0 3px 5px 1px rgba(0, 0, 0, .15)
	&__options
		display grid

.SelectOption
	transition all .15s ease-in-out
	z-index 1000
	padding 10px
	cursor pointer
	width 40px
	text-align center
	user-select none
	&:hover
		background rgba(0, 0, 255, .15)

</style>
