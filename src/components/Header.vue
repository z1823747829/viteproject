<template>
  <div>
    <el-menu :default-active="data.active" :ellipsis="false" mode="horizontal">
      <el-image :src="data.logo" fit="contain" style="height: 56px"/>
      <div class="flex-grow"/>
      <el-menu-item index="/" @click="router.push('/')">
        <el-icon>
          <HomeFilled/>
        </el-icon>
        首页
      </el-menu-item>
      <el-menu-item index="/academy" @click="router.push('/academy')">
        <el-icon>
          <Menu/>
        </el-icon>
        学院
      </el-menu-item>
      <el-menu-item index="/course" @click="router.push('/course')">
        <el-icon>
          <Promotion/>
        </el-icon>
        课程
      </el-menu-item>
      <el-menu-item index="/forum" @click="router.push('/forum')">
        <el-icon>
          <ChatLineSquare/>
        </el-icon>
        论坛
      </el-menu-item>
      <el-menu-item index="/about" @click="router.push('/about')">
        <el-icon>
          <InfoFilled/>
        </el-icon>
        关于
      </el-menu-item>
      <div class="flex-grow"/>
      <div style="margin: auto;text-align: right">
        <div v-show="!data.isLogin">
          <el-button type="primary" @click="router.push('/sign_in')">登录</el-button>
          <el-button @click="router.push('/sign_up')">注册</el-button>
        </div>
        <el-sub-menu v-show="data.isLogin" index="6">
          <template #title>
            <el-avatar :src="data.user.head"/>
            <span>{{ data.user.nickname }}</span>
          </template>
          <el-menu-item index="2-1" @click="router.push('/user')">
            <el-icon>
              <User/>
            </el-icon>
            个人资料
          </el-menu-item>
          <el-menu-item index="2-2" @click="router.push('/user/forum')">
            <el-icon>
              <ZoomIn/>
            </el-icon>
            我的发帖
          </el-menu-item>
          <el-menu-item index="2-3" @click="sign_out">
            <el-icon>
              <Close/>
            </el-icon>
            退出登录：<span style="color: blue">{{ data.user.uname }}</span>
          </el-menu-item>
        </el-sub-menu>
      </div>
    </el-menu>
  </div>

</template>

<script lang="ts" setup>
import {reactive, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {ChatLineSquare, Close, HomeFilled, InfoFilled, Menu, Promotion, User, ZoomIn} from "@element-plus/icons-vue";
import axios from "axios";
import VueCookies from "vue-cookies";
import {user} from "./my_type";

const cookies: any = VueCookies
const router = useRouter()
const route: any = useRoute()
let datalist = {
  active: '',
  logo: '',
  isLogin: false,
  user: user,
}
let data = reactive(datalist)

let sign_out = () => {
  axios.get("/api/web/sign_out").then(res => {
    if (res.data.status === true) {
      data.isLogin = false
      router.push('/')
    }
  }).catch((error) => {
    console.log(error)
  })
}

const set_data = () => {
  if (cookies.isKey("user_info")) {
    let cookie = (new Function("return " + cookies.get("user_info")))();
    cookie = JSON.parse(cookie)
    data.user = cookie
    data.isLogin = true
  } else {
    data.isLogin = false
  }
}

const get_header = () => {
  axios.get("/api/web/header").then(res => {
    if (res.data.status === true) {
      data.logo = res.data.logo
    }
  }).catch((error) => {
    console.log(error)
  })
}

watch(() => route.path, async () => {
  data.active = route.matched.at(0).path
  set_data()
})
set_data()
get_header()
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>