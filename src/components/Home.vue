<template>
  <el-scrollbar>
    <el-carousel style="width: 50%;margin: auto">
      <el-carousel-item v-for="item in data.home" :key="item" @click="router.push(`/course/${item.id}`)">
        <el-image v-if="item.course" :src="item.img" class="carousel-img" fit="fill"/>
        <!--                <span style="font-size: 5px">{{ item.course }} 教师：{{ item.teacher }} 点击量：{{ item.clicks }}</span>-->
      </el-carousel-item>
    </el-carousel>
    <div>
      <el-divider content-position="left"><h2>热门课程</h2></el-divider>
      <el-scrollbar>
        <div class="scrollbar-flex-content">
          <el-col v-for="item in data.popular_courses" :span="6">
            <el-card class="card" @click="router.push(`/course/${item.id}`)">
              <el-image v-if="item.course" :src="item.img" class="image" fit="contain"/>
              <span>{{ item.course }}</span><br>
              <span style="font-size: 5px">教师：{{ item.teacher }} 点击量：{{ item.clicks }}</span>
            </el-card>
          </el-col>
        </div>
      </el-scrollbar>
    </div>
  </el-scrollbar>
  <el-backtop :bottom="50" :right="20" target=".el-scrollbar__wrap"/>
</template>

<script lang="ts" setup>
import {reactive} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import {course, forum, keyword} from "./my_type";

const router = useRouter()

let datalist = {
  home: [course],
  popular_courses: [course],
  popular_keywords: [keyword],
  popular_forums: [forum],
}
let data = reactive(datalist)

const get_home = () => {

  axios.get("/api/web/home").then(res => {
    if (res.data.status === true) {
      console.log(res.data)
      data.home = res.data.home
      data.popular_courses = res.data.popular_courses
      data.popular_keywords = res.data.popular_keywords
      data.popular_forums = res.data.popular_forums
    }
  }).catch((error) => {
    console.log(error)
  })
}

get_home()
</script>

<style scoped>
.scrollbar-flex-content {
  display: flex;
}

.carousel-card {
  width: 100%;
  height: 100%;
}

.carousel-img {
  width: 100%;
  height: 100%;
}

.card {
  height: 230px;
  margin: 0 10px;
  padding: 0;
}

.image {
  width: 100%;
  height: 150px;
}

</style>