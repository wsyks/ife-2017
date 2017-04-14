<template>
  <div id="app">
    <header>SYEAN <span class="green">FM</span></header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Microsoft YaHei','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #FAFAFA;
  width: 100%;
  height: 100%;

}
header{
  background-color: #FAFAFA;
  color:#A3A9AD;
  line-height: 60px;
  font-size: 40px;
  text-align: center;

}
header .green{
  color:#A2D8C8;
}
</style>
