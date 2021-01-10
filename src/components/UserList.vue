<template>
	<div>
		<span>你的名字: </span><span>{{userName}}</span>
		<div>选择你的对手: </div>
		<ul>
			<li v-for="item of users" v-bind:key="item.uid">
				<span>{{ item.name }}</span>
			</li>
		</ul>
	</div>
</template>

<style scoped>
ul {
	width: 100px;
	margin: 0 auto;
	list-style-type: none;
}

ul>li>span:hover {
	font-weight: bold;
	cursor: pointer;
	border: 1px solid red;
}

</style>

<script>
import dataProcess from '../services/dataProcess'
import randomName from 'chinese-random-name'

export default {
	name: 'UserList',
	data: () => ({
		users: Array,
		pullDone: false
	}),
	mounted() {
		const currentUser = randomName.generate();
		this.$root.$emit("active", JSON.stringify({
			x: this.chessPieces.x,
			y: this.chessPieces.y,
			role: this.currentRole,
		}))
		dataProcess.fetch("player/all", (users) => {
			dataProcess.fetch("chess/data", { user: currentUser }, (initData) => {
				this.$root.$emit("initChessBoard", initData)
				this.$nextTick().then(() => {
					this.userName = currentUser;
					this.users = users;
				});
			})
		})
	}
}

</script>
