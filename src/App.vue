<template>
  <div id="app">
    <head-node></head-node>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<script>
import HeadNode from "./components/headNode"
export default {
    components: {
    HeadNode
  }
}
</script>
<style>

</style>
