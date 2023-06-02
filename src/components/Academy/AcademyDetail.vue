<template>
  <el-scrollbar max-height="100%">
    <el-card style="margin-left: 10px;margin-right: 10px">
      <el-image :src="data.academy.img" fit="contain" style="width: 800px; height: 200px"/>
      <h2>{{ data.academy.academy }}</h2>
      <el-divider content-position="left">学院简介</el-divider>
      <p class="profile">{{ data.academy.profile }}</p>
    </el-card>
    <el-divider content-position="left">课程</el-divider>
    <el-empty v-if="!data.courses.length" description="没有内容，请刷新重试！若仍未解决，请联系管理员。"/>
    <el-row v-else>
      <el-col v-for="item in data.courses" :span="6">
        <el-card class="card" @click="router.push(`/course/${item.id}`)">
          <el-image v-if="item.course" :src="item.img" class="image" fit="contain"/>
          <span>{{ item.course }}</span><br>
          <span style="font-size: 5px">教师：{{ item.teacher }} 点击量：{{ item.clicks }}</span>
        </el-card>
      </el-col>
    </el-row>
  </el-scrollbar>
  <el-backtop :bottom="50" :right="20" target=".el-scrollbar__wrap"/>
</template>

<script lang="ts" setup>
import {reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import {academy, course} from "../my_type";

const router = useRouter()
const route = useRoute()
let data_list = {
  academy: academy,
  courses: [course],
}
let data = reactive(data_list)
const get_academy = () => {
  axios.get(`/api/web/academy/${route.params.aid}`).then(res => {
    if (res.data.status === true) {
      data.academy = res.data.academy
      data.courses = res.data.courses
    } else {
      console.log("error")
    }
  }).catch((error) => {
    data.courses = []
    console.log(error)
  })
}
data.courses = []
get_academy()
</script>

<style scoped>
.card {
  height: 230px;
  margin: 10px;
  padding: 0;
}

.image {
  width: 100%;
  height: 150px;
}

.profile {
  width: 100%;
  text-align: left;
  text-indent: 2em;
}
</style>