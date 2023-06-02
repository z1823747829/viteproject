<template>
  <el-descriptions :column='1' border style="width: 500px;margin: auto" title="个人资料">
    <el-descriptions-item label="头像">
      <el-avatar :src="data.user.head"/>
    </el-descriptions-item>
    <el-descriptions-item label="用户昵称">{{ data.user.nickname }}</el-descriptions-item>
    <el-descriptions-item label="用户名">{{ data.user.uname }}</el-descriptions-item>
    <el-descriptions-item label="性别">{{ gender(data.user.gender) }}</el-descriptions-item>
    <el-descriptions-item label="出生日期">{{ data.user.birthday }}</el-descriptions-item>
    <el-descriptions-item label="手机号码">{{ data.user.phone }}</el-descriptions-item>
    <el-descriptions-item label="邮箱">{{ data.user.email }}</el-descriptions-item>
  </el-descriptions>
  <el-button @click="data.dialog=true">修改资料</el-button>
  <el-dialog v-model="data.dialog" title="修改资料" top="5vh">
    <el-scrollbar max-height="60vh">
      <el-form ref="sign_up_form" :model="data.from" :rules="rules" label-width="120px">
        <el-form-item label="头像">
          <el-upload :auto-upload='false' :on-change="( uploadFile:UploadFile, uploadFiles:UploadFiles)=>{getFile(uploadFile)}" :show-file-list="false"
                     accept="image/*">
            <el-image v-if="data.from.headurl" :src="data.from.headurl" class="avatar" fit="cover"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item :error="data.errors.nickname" label="昵称" prop="nickname">
          <el-input v-model="data.from.nickname" clearable/>
        </el-form-item>
        <el-form-item :error="data.errors.uname" label="用户名" prop="uname">
          <el-input v-model="data.from.uname" clearable/>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="data.from.gender">
            <el-option :value="0" label="未知"/>
            <el-option :value="1" label="男"/>
            <el-option :value="2" label="女"/>
          </el-select>
        </el-form-item>
        <el-form-item :error="data.errors.birthday" label="出生日期" prop="uname">
          <el-date-picker v-model="data.from.birthday" :disabled-date="disabledDate"
                          value-format="YYYY-MM-DD"></el-date-picker>
        </el-form-item>
        <el-form-item :error="data.errors.phone" label="手机号码" prop="uname">
          <el-input v-model="data.from.phone" clearable/>
        </el-form-item>
        <el-form-item :error="data.errors.email" label="邮箱" prop="uname">
          <el-input v-model="data.from.email" clearable/>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
            <span class="dialog-footer">
            <el-button @click="get_user">取消</el-button>
            <el-button type="primary" @click="update(sign_up_form)">上传</el-button>
            </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import axios from "axios";
import {inject, reactive, ref} from "vue";
import {FormInstance, FormRules, UploadFile, UploadFiles} from "element-plus";
import {Plus} from "@element-plus/icons-vue";
import {user} from "../my_type";
import {gender} from "../my_function";

const sign_up_form = ref<FormInstance>()
const reload = inject("reload") as Function
let data_list = {
  dialog: false,
  user: user,
  from: {
    id: 0,
    nickname: '',
    uname: '',
    gender: 0,
    head: '',
    birthday: "2000-01-01",
    email: '',
    phone: '',
    headurl: '',
  },
  errors: {
    gender: '',
    head: '',
    nickname: '',
    uname: '',
    birthday: '',
    email: '',
    phone: '',
  }
}
let data = reactive(data_list)

const rules = reactive<FormRules>({
  nickname: [{required: true, message: '请输入昵称', trigger: 'blur'},],
  uname: [{required: true, message: '请输入用户名', trigger: 'blur'},
    {pattern: /^(\w){1,32}$/, message: '用户名应由字母，数字，下划线组成，1-32位', trigger: 'blur'},],

})
const disabledDate = (time: Date) => {
  let startTime = Date.now() - 60 * 60 * 24 * 365 * 200 * 1000
  return time.getTime() > Date.now() || time.getTime() < startTime
}
const getFile = (uploadFile: UploadFile) => {
  // @ts-ignore
  data.from.head = uploadFile.raw
  // @ts-ignore
  data.from.headurl = URL.createObjectURL(data.from.head)
}
const get_user = () => {
  data.dialog = false
  axios.get("/api/web/user").then(res => {
    if (res.data.status === true) {
      data.user = res.data.user
      for (let item in data.from) {
        data.from[item] = data.user[item]
      }
      data.from.headurl = data.user.head
    } else {
      console.log("error")
    }
  }).catch((error) => {
    console.log(error)
  })
}
const update = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  for (let item in data.errors) {
    // @ts-ignore
    data.errors[item] = ''
  }
  formEl.validate((valid) => {
    if (valid) {
      let formData = new FormData();
      formData.append("gender", data.from.gender.toString());
      formData.append("id", data.from.id.toString());
      formData.append("nickname", data.from.nickname);
      formData.append("uname", data.from.uname);
      formData.append("birthday", data.from.birthday);
      formData.append("phone", data.from.phone);
      formData.append("email", data.from.email);
      URL.revokeObjectURL(data.from.head)
      formData.append("head", data.from.head);
      axios.post("/api/web/user", formData, {
        headers: {'content-type': 'application/x-www-form-urlencoded'}
      }).then(res => {
        if (res.data.status === true) {
          data.dialog = false;
          get_user()
          reload()
        } else {
          for (let key in res.data.errors) {
            // @ts-ignore
            data.errors[key] = res.data.errors[key][0]
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    } else {
      return false
    }
  })
}

get_user()
</script>

<style scoped>
.avatar {
  width: 178px;
  height: 178px;
  display: block;

}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>