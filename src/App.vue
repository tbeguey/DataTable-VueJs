<template>
  <div id="app">
    <img src="./assets/logo.png">
    <br>
    <DataTable/>
  </div>
</template>

<script>
import DataTable from './components/DataTable'

export default {
  name: 'App',
  components: {
    DataTable
  }
}
</script>

<style>

img {
  max-width: 50px;
  max-height: 50px;
}

</style>
