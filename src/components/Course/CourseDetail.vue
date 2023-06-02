<template>
  <el-scrollbar max-height="100%">
    <el-card style="margin-left: 10px;margin-right: 10px">
      <el-image :src="data.course.img" fit="contain" style="width: 800px; height: 200px"/>
      <h2>{{ data.course.course }}</h2>
      <span style="font-size: 5px">教师：{{ data.course.teacher }} 点击量：{{ data.course.clicks }}</span>
      <el-divider content-position="left">课程详情</el-divider>
      <p class="profile">{{ data.course.profile }}</p>
      <el-tag v-for="item in data.course.keyword" class="tag">{{ item }}</el-tag>
    </el-card>
    <el-divider content-position="left">课程资源</el-divider>
    <el-empty v-if="!data.course_resources.length" description="没有内容，请刷新重试！若仍未解决，请联系管理员。"/>
    <el-button v-for="item in data.course_resources" v-else plain style="width: 60%;margin: 5px;height: 50px"
               type="primary"
               @click="router.push(`/course/resource/${item.id}`)">
      {{ item.order + ' : ' + item.resource }}
    </el-button>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import {course, course_resource} from "../my_type";

const router = useRouter()
const route = useRoute()
let data_list = {
  course: course,
  course_resources: [course_resource]
}
let data = reactive(data_list)
const get_course = () => {
  axios.get(`/api/web/course/${route.params.cid}`).then(res => {
    if (res.data.status === true) {
      data.course = res.data.course
      data.course_resources = res.data.course_resources
    } else {
      console.log("error")
    }
  }).catch((error) => {
    console.log(error)
  })
}

data.course_resources = []
get_course()
</script>

<style scoped>
.profile {
  width: 100%;
  text-align: left;
  text-indent: 2em;
}

.tag {
  margin: 5px;
}
</style>