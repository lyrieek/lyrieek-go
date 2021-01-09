<template>
	<div>
		<div>
			<span>ID: </span><span>{{userName}}</span>
		</div>
	</div>
</template>
<script>
export default {
	name: 'SocketBar',
	props: {
		userName: String
	},
	mounted() {
		const socket = new WebSocket("ws://localhost:1234/")
		// const socket = new WebSocket("ws://123.207.136.134:9010/ajaxchattest")
		// socket.send('login:' + this.userName);
		socket.onopen = () => {
			this.$root.$on("active", (e) => {
				socket.send(e)
			})
		}
		socket.onmessage = (e) => {
			this.$root.$emit("pull", e.data)
		}

	}
}

</script>
