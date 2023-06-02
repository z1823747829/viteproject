<template>
  <el-scrollbar max-height="100%">
    <el-row>
      <el-col :offset="6" :span="12" style="text-align: left">
        <h1>{{ data.forum.title }}</h1>
        <div v-if="data.forum.content_type==0" v-html="data.forum.rtf_content">

        </div>
        <md-editor v-else v-model="data.forum.md_content" preview-only preview-theme="github"/>

        <el-tag v-for="item in data.forum.keyword" class="tag">{{ item }}</el-tag>
        <br>
        <span v-if="data.forum.annex">
                    附件：{{ annex }}
                    <el-button><a :download="annex"
                                  :href="data.forum.annex">点击下载</a></el-button>
                </span>
        <el-divider id="comment" content-position="left">评论</el-divider>
        <div>
          <el-input v-model="data.form.content" clearable maxlength="128" placeholder="请输入评论"
                    rows="3" show-word-limit type="textarea"/>
          <el-button type="primary" @click="comment_add()">上传</el-button>
        </div>
        <div v-for="item in data.comments" style="width: 100%;text-align: left">
          <el-avatar :src="item.user.head"/>
          <div style="display: inline-block">
            <span>{{ item.user.nickname }}</span><br>
            <span style="font-size: 12px;color: gray">{{ get_date(item.time) }}</span><br>
          </div>
          <br>
          <span>{{ item.content }}</span>
        </div>

      </el-col>
      <el-col :span=6 style="text-align: left">
        <el-affix :offset="60">
          <el-tooltip content="分享" effect="light" placement="right">
            <el-button :icon="Share" circle size="large" type="warning" @click="copy"/>
          </el-tooltip>
          <br>
          <el-tooltip content="评论" effect="light" placement="right">
            <a href="#comment">
              <el-button :icon="ChatDotRound" circle size="large" type="warning"/>
            </a>
          </el-tooltip>
        </el-affix>
      </el-col>
    </el-row>
  </el-scrollbar>
  <el-backtop :bottom="50" :right="20" target=".el-scrollbar__wrap"/>


</template>

<script lang="ts" setup>
import {computed, reactive} from "vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import {ElMessage} from "element-plus";
import {ChatDotRound, Share} from "@element-plus/icons-vue";
import {get_date} from "../my_function";
import {comment, forum} from "../my_type";
import MdEditor from "md-editor-v3";

const router = useRouter()
const route = useRoute()
let data_list = {
  forum: forum,
  comments: [comment],
  form: {
    f_id: 0,
    content: '',
  }
}
let data = reactive(data_list)
const annex = computed(() => {
  let arr = data.forum.annex.split('/')
  return decodeURI(arr[arr.length - 1])
})
const copy = () => {
  navigator.clipboard.writeText(window.location.href);
  ElMessage({
    message: '复制链接成功，快去分享吧',
    type: 'success',
  })
}
const get_forum = () => {
  axios.get(`/api/web/forum/${route.params.fid}`).then(res => {
    if (res.data.status === true) {
      data.forum = res.data.forum
      data.form.f_id = data.forum.id
      data.comments = res.data.comments
    } else {
      console.log("error")
    }
  }).catch((error) => {
    console.log(error)
  })
}
const comment_add = () => {
  if (data.form.content === '') {
    ElMessage({message: '请输入评论', type: 'warning',})
    return
  }
  axios.post('/api/web/comment/add', data.form, {
    headers: {"Content-Type": "multipart/form-data"}
  }).then(res => {
    if (res.data.status === true) {
      ElMessage({message: '评论成功', type: 'success',})
      data.form.content = ''
      get_forum()
    } else {
      console.log("error")
    }
  }).catch((error) => {
    console.log(error)
  })
}

data.comments = []
get_forum()
</script>

<style scoped>
.tag {
  margin: 5px;
}
</style>