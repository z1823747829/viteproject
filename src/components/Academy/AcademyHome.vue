<template>
  <el-scrollbar height="100%">
    <el-row>
      <el-col v-for="item in data.academies" :span="6">
        <el-card class="card" @click="router.push(`/academy/${item.id}`)">
          <el-image :src="item.img" class="image" fit="contain"/>
          <span>{{ item.academy }}</span>
        </el-card>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {reactive} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";
import {academy} from "../my_type";

const router = useRouter()
let data_list = {
  academies: [academy],
}
let data = reactive(data_list)

const get_academies_list = () => {
  axios.get("/api/web/academy/list").then(res => {
    if (res.data.status === true) {
      data.academies = res.data.academies
    } else {
      console.log("error")
    }
  }).catch((error) => {
    console.log(error)
  })
}

data.academies = []
get_academies_list()

</script>

<style scoped>
.card {
  height: 220px;
  margin: 10px;
  padding: 0;
}

.image {
  width: 100%;
  height: 150px;
}
</style>