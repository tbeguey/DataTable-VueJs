<template>
  <div id="app">
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
