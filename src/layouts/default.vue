<template>
<q-layout view="lHh Lpr lFf">
	<q-layout-header>
		<q-toolbar color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
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
</template>

<script>
import {
	openURL
} from 'quasar'
import { mapState } from 'vuex'

import AppMenuProfile from '@/components/AppMenuProfile'
import GroupList from '@/components/GroupList'

export default {
	name: 'LayoutDefault',
	components: {
		AppMenuProfile,
		GroupList
	},
	data() {
		return {
			leftDrawerOpen: this.$q.platform.is.desktop
		}
	},
	methods: {
		openURL
	}
}
</script>

<style>
</style>
