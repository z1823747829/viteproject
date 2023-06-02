<template>
  <el-row style="height: 100%">
    <el-col :span="4" class="scrollbar">
      <el-scrollbar>
        <h5 class="mb-2">学院</h5>
        <el-menu default-active='' @select="academyChange">
          <el-menu-item index="">全部</el-menu-item>
          <el-menu-item v-for="academy in data.academies" :index="academy.code">
            {{ academy.academy }}
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-col>
    <el-col :span="20" class="scrollbar backtop">
      <el-scrollbar>
        <el-row>
          <el-col :span="24">
            <el-input v-model="data.page.search" clearable placeholder="搜索课程"
                      style="width: 400px;margin: 10px">
              <template #prepend>
                <el-select v-model="data.page.select" placeholder="Select" style="width: 130px;">
                  <el-option label="课程名称搜索" value="1"/>
                  <el-option label="关键词搜索" value="2"/>
                  <el-option label="混合搜索" value="3"/>
                </el-select>
              </template>
              <template #append>
                <el-button @click="get_course_list">
                  <el-icon>
                    <Search/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col v-for="item in data.courses" :span="6">
            <el-card class="card" @click="router.push(`/course/${item.id}`)">
              <el-image :src="item.img" class="image" fit="contain"/>
              <span class="span">{{ item.course }}</span>
              <span style="font-size: 5px">教师：{{ item.teacher }} 点击量：{{ item.clicks }}</span>
            </el-card>
          </el-col>
          <el-col :offset="8" :span="12">
            <el-pagination :current-page="data.page.page" :page-size="data.page.size"
                           :page-sizes="[12, 24, 36]" :total="data.count"
                           background layout="sizes, prev, pager, next, jumper, total"
                           style="margin: 10px"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"/>
          </el-col>
        </el-row>
      </el-scrollbar>
      <el-backtop :bottom="50" :right="20" target=".backtop .el-scrollbar__wrap"/>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {reactive} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";
import {Search} from "@element-plus/icons-vue";
import {academy, course} from "../my_type";

const router = useRouter()
let data_list = {
  count: 0,
  academies: [academy],
  courses: [course],
  page: {
    code: '',
    page: 1,
    search: '',
    select: "1",
    size: 12,
  }
}
let data = reactive(data_list)
const academyChange = (index: string) => {
  data.page.code = index
  data.page.search = ''
  data.page.page = 1
  get_course_list()
}
const handleSizeChange = (val: number) => {
  data.page.size = val
  data.page.page = 1
  get_course_list()
}
const handleCurrentChange = (val: number) => {
  data.page.page = val
  get_course_list()
}

const get_course_list = () => {
  axios.get("/api/web/course/list", {params: data.page}).then(res => {
    if (res.data.status === true) {
      data.academies = res.data.academies
      data.courses = res.data.courses
      data.count = res.data.count
    } else {
      console.log("error")
    }
  }).catch((error) => {
    console.log(error)
  })
}
data.academies = []
data.courses = []
get_course_list()
</script>

<style scoped>
.scrollbar, .scrollbar > el-scrollbar {
  height: 100%;
}

.card {
  height: 230px;
  margin: 10px;
  padding: 0;
}

.image {
  width: 100%;
  height: 150px;
}

.span {
  white-space: nowrap; /*强制单行显示*/
  text-overflow: ellipsis; /*超出部分省略号表示*/
  overflow: hidden; /*超出部分隐藏*/
  width: 100%; /*设置显示的最大宽度*/
  display: inline-block;
}
</style>