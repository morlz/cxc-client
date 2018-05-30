<template>
<div class="AuthPage">
	<app-menu-profile class="AuthPage__form"/>
</div>
</template>

<script>
import AppMenuProfile from '@/components/AppMenuProfile'
export default {
	components: {
		AppMenuProfile
	}
}
</script>

<style lang="stylus">
.AuthPage
	width 100vw
	height 100vh
	background #ddd
	display grid
	align-items center
	justify-content center

	&__form
		min-width 300px
		padding 10px
</style>
