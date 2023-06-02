<script lang="ts" setup>
import Header from "./components/Header.vue";
import {nextTick, provide, ref} from "vue";

const header = ref(true)
const reload = () => {
  header.value = false
  nextTick(() => {
    header.value = true
  })
}
provide('reload', reload)
</script>

<template>
  <div class="height">
    <el-container class="height">
      <el-header>
        <Header v-if="header"></Header>
      </el-header>
      <el-main class="height main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.height {
  height: 100%;
}

.main {
  padding: 0;
}
</style>
