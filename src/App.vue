<template>
  <div id="app">
    <GoViewer msg="wei qi"/>
  </div>
</template>

<script>
import GoViewer from './components/GoViewer.vue'

export default {
  name: 'App',
  components: {
    GoViewer,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
