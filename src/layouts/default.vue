<template>
<q-layout view="lHh Lpr lFf" v-if="logined" class="App" :class="{ 'HeaderShadowDisable': !headerShadow }">
	<q-layout-header>
		<q-toolbar color="primary" :inverted="$q.theme === 'ios'">
			<q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
				<q-icon name="menu" />
			</q-btn>

			<q-toolbar-title>
				Ведомости
				<div slot="subtitle">{{ $moment().format('DD-MM-YYYY') }} - {{ $moment().add(1, 'day').format('DD-MM-YYYY') }}</div>
			</q-toolbar-title>
		</q-toolbar>
	</q-layout-header>

	<q-layout-drawer :value="leftDrawerOpen" :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null">
		<app-menu-profile/>

		<group-list/>
	</q-layout-drawer>

	<q-page-container>
		<router-view :key="$route.fullPath"/>
	</q-page-container>
</q-layout>

<auth v-else/>
</template>

<script>
import {
	openURL
} from 'quasar'
import { mapState, mapGetters } from 'vuex'

import AppMenuProfile from '@/components/AppMenuProfile'
import Auth from '@/pages/Auth'
import GroupList from '@/components/GroupList'

export default {
	name: 'LayoutDefault',
	components: {
		AppMenuProfile,
		GroupList,
		Auth
	},
	data() {
		return {
			leftDrawerOpen: this.$q.platform.is.desktop
		}
	},
	computed: {
		...mapGetters({
			logined: 'auth/logined'
		}),
		...mapState('app', [
			'headerShadow'
		])
	},
	methods: {
		openURL
	}
}
</script>

<style lang="stylus">
.HeaderShadowDisable
	.q-layout-header
		box-shadow none
</style>
