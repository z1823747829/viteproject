<template>
  <el-row style="height: 100%">
    <el-col :span="18" style="height: 100%;overflow: hidden">
      <iframe v-if="filetype" :src="data.course_resource.resource_file" height="100%" width="100%"/>
      <video v-else ref="video" :src="data.course_resource.resource_file" autoplay
             controls style="height: 100%;width: 100%" @timeupdate="onTimeUpdate">
        您的浏览器不支持 video 标签。
      </video>

    </el-col>
    <el-col :span="6" style="padding: 0 10px;height: 100%">
      <el-tabs v-model="data.tab" class="tab">
        <el-tab-pane label="详情" name="first">
          <el-scrollbar class="el-scrollbar first">
            <el-card>
              <el-image :src="data.course.img" style="width: 100%"></el-image>
              <h2>{{ data.course.course }}</h2>
              <span style="font-size: 5px">教师：{{ data.course.teacher }} 点击量：{{
                  data.course.clicks
                }}</span>
              <el-divider content-position="left">课程详情</el-divider>
              <p class="profile">{{ data.course.profile }}</p>
              <el-tag v-for="item in data.course.keyword" class="tag">{{ item }}</el-tag>
            </el-card>
            <el-divider content-position="left">课程资源</el-divider>
            <el-button v-for="item in data.course_resources" plain style="width: 80%;margin: 5px;height: 50px"
                       type="primary"
                       @click="router.push(`/course/resource/${item.id}`)">
              {{ item.order + ' : ' + item.resource }}
            </el-button>
          </el-scrollbar>
          <el-backtop :bottom="50" :right="20" target=".first .el-scrollbar__wrap"/>
        </el-tab-pane>
        <el-tab-pane label="评论" name="second">
          <el-scrollbar class="el-scrollbar second">
            <div v-for="item in data.comments" style="width: 100%;text-align: left">
              <el-avatar :src="item.user.head"/>
              <div style="display: inline-block">
                <span>{{ item.user.nickname }}</span><br>
                <span style="font-size: 12px;color: gray">{{ get_date(item.time) }}</span><br>
              </div>
              <br>
              <span>{{ item.content }}</span>
            </div>
          </el-scrollbar>
          <el-affix :offset="20" position="bottom">
            <el-button type="primary" @click="data.dialog=true">评论</el-button>
          </el-affix>
          <el-dialog v-model="data.dialog" align-center draggable title="评论" width="40%">
            <el-input v-model="data.form.content" clearable maxlength="128" placeholder="请输入评论"
                      rows="4" show-word-limit type="textarea"/>
            <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="data.dialog = false">取消</el-button>
                        <el-button type="primary" @click="data.dialog = false;comment_add()">上传</el-button>
                      </span>
            </template>
          </el-dialog>
          <el-backtop :bottom="50" :right="20" target=".second .el-scrollbar__wrap "/>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from "vue";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import axios from "axios";
import {ElMessage} from "element-plus";
import {get_date} from "../my_function";
import {comment, course, course_resource} from "../my_type";


const router = useRouter()
const route = useRoute()
const video = ref()
let data_list = {
  tab: 'first',
  dialog: false,
  course: course,
  time: 0,
  course_resource: course_resource,
  course_resources: [course_resource],
  comments: [comment],
  form: {
    c_id: 0,
    content: '',
  },
}
let data = reactive(data_list)

const filetype = computed(() => {
  let arr = data.course_resource.resource_file.split('.')
  return arr[arr.length - 1] === 'pdf';
})
const get_course_resource = () => {
  axios.get(`/api/web/course/resource/${route.params.crid}`).then(res => {
    if (res.data.status === true) {
      data.course = res.data.course
      data.course_resource = res.data.course_resource
      data.course_resources = res.data.course_resources
      data.comments = res.data.comments
      data.form.c_id = data.course.id
      data.time = res.data.time
    } else {
      console.log("error")
    }
  }).catch((error) => {
    console.log(error)
  })
}

const comment_add = () => {
  if (data.form.content === '') {
    ElMessage({
      message: '请输入评论',
      type: 'warning',
    })
    return
  }
  axios.post('/api/web/comment/add', data.form, {
    headers: {"Content-Type": "multipart/form-data"}
  }).then(res => {
    if (res.data.status === true) {
      ElMessage({message: '评论成功', type: 'success',})
      data.form.content = ''
      get_course_resource()
    } else {
      console.log("error")
    }
  }).catch((error) => {
    console.log(error)
  })
}

const onTimeUpdate = () => {
  // console.log(video.value?.currentTime)
  if (video.value?.currentTime == 0) {
    video.value.currentTime = data.time
  }
  if (video.value?.currentTime - data.time > 10 || data.time - video.value?.currentTime > 10) {
    data.time = video.value.currentTime
    axios.post(`/api/web/course/resource/${route.params.crid}/set_time`, {time: data.time}, {
      headers: {"Content-Type": "multipart/form-data"}
    })
  }
}

onBeforeRouteUpdate((to, from) => {
  if (to.params.crid !== from.params.crid) {
    setTimeout(get_course_resource, 100)
  }
})
onMounted(() => {
  // setTimeout(()=>{
  video.value.currentTime = data.time
  // },500)
})
data.comments = []
data.course_resources = []
get_course_resource()
</script>

<style scoped>
.el-tab-pane {
  height: calc(100vh - 60px - 54px);
}

.profile {
  width: 100%;
  text-align: left;
  text-indent: 2em;
}

.tag {
  margin: 5px;
}
</style>