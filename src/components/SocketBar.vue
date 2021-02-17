<template>
	<div>
	</div>
</template>
<script>
export default {
	name: 'SocketBar',
	data: () => ({
		userName: String
	}),
	mounted() {
		const socket = new WebSocket("ws://localhost:1212/chat")
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
