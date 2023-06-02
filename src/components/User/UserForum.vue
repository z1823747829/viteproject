<template>
  <el-row>
    <el-col :span="6">
      <el-link>热门</el-link>
    </el-col>
    <el-col :span="12" style="height: 100%;">
      <el-scrollbar height="100%">
        <el-card v-for="item in data.forums" style="margin: 5px" @click="router.push(`/forum/${item.id}`)">
          <div style="width:100%;text-align: left">
            <span style="font-size: 30px">{{ item.title }}</span>
            <div>
              <el-avatar :src="item.user.head"/>
              <div style="display: inline-block">
                <span>{{ item.user.nickname }}</span><br>
                <span style="font-size: 12px;color: gray">{{ get_date(item.time) }}</span><br>
              </div>
            </div>

            <span class="span">
                            {{ item.profile }}
                        </span>
            <span style="color: #da0d54">状态：{{ status(item.status) }}</span>
          </div>
          <el-row style="margin-top: 5px">
            <el-col :span="8">
              <el-icon>
                <Share/>
              </el-icon>
              20
            </el-col>
            <el-col :span="8">
              <el-icon>
                <ChatLineSquare/>
              </el-icon>
              20
            </el-col>
            <el-col :span="8">
              <el-icon>
                <Pointer/>
              </el-icon>
              {{ item.clicks }}
            </el-col>
          </el-row>
        </el-card>
      </el-scrollbar>
      <el-backtop :bottom="50" :right="20" target=".el-scrollbar__wrap"/>
    </el-col>
    <el-col :span="6" style="text-align: left">
      <el-tooltip content="新建文章" effect="light" placement="right">
        <el-button :icon="Edit" circle size="large" type="primary" @click="router.push('/forum/add')"/>
      </el-tooltip>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {reactive} from "vue";
import {ChatLineSquare, Edit, Pointer, Share} from "@element-plus/icons-vue";
import axios from "axios";
import {get_date, status} from "../my_function";
import {useRouter} from "vue-router";
import {forum} from "../my_type";

const router = useRouter()
let datalist = {
  forums: [forum],
}
let data = reactive(datalist)

const get_forum_list = () => {
  axios.get('/api/web/user/forum').then(res => {
    if (res.data.status === true) {
      data.forums = res.data.forums
    } else {
      console.log("error")
    }
  }).catch((error) => {
    console.log(error)
  })
}

data.forums = []
get_forum_list()
</script>

<style scoped>
.el-row {
  height: 100%;
}

.span {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tag {
  margin: 5px;
}

</style>