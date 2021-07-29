<!--
 * @Descripttion: 
 * @Author: liuYaoYu
 * @Date: 2021-03-04 15:23:44
 * @LastEditors: liuYaoYu
 * @LastEditTime: 2021-04-23 17:44:44
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.is-never-shadow {
  height: 100%;
}
.el-card__body {
  height: 100%;
}
.inlineBlock {
  display: inline-block;
}
</style>
