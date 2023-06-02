<template>
  <el-scrollbar>
    <div class="body">
      <el-card class="card">
        <el-row>
          <el-col :span="11">
            <el-image src="/media/CAUC.jpg"></el-image>
          </el-col>
          <el-col :offset="2" :span="11">
            <h1 style="font-family: 幼圆,serif">欢迎登陆</h1>
            <el-form ref="sign_in_form" :model="data.form" :rules="rules" class="form" label-width="80px"
                     @keydown.enter="sign_in(sign_in_form)">
              <el-form-item :error="data.errors.uname" label="用户名" prop="uname">
                <el-input v-model="data.form.uname" clearable/>
              </el-form-item>
              <el-form-item :error="data.errors.password" label="密码" prop="password">
                <el-input v-model="data.form.password" show-password/>
              </el-form-item>
              <el-form-item :error="data.errors.code" label="验证码" prop="code">
                <el-col :span="12">
                  <el-input v-model="data.form.code"/>
                </el-col>
                <el-col :span="12">
                  <captcha-code ref="captcha" @on-change="(code: string)=>{data.r_code=code}"/>
                </el-col>
              </el-form-item>
              <el-button id="sin" style="width: 50%" @click="sign_in(sign_in_form)">登录</el-button>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {FormInstance, FormRules} from "element-plus";
import {inject, onMounted, onUnmounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";
import CaptchaCode from "vue-captcha-code/src/captcha.vue";


const router = useRouter()
const sign_in_form = ref<FormInstance>()
const captcha = ref()
const reload = inject("reload") as Function
let data_list = {
  r_code: '',
  form: {
    uname: '',
    password: '',
    code: '',
  },
  errors: {
    uname: '',
    password: '',
    code: '',
  }
}
let data = reactive(data_list)

const rules = reactive<FormRules>({
  uname: [{required: true, message: '请输入用户名', trigger: 'blur'},
    {pattern: /^(\w){1,32}$/, message: '用户名应由字母，数字，下划线组成，1-32位', trigger: 'change'},],
  password: [{required: true, message: '请输入密码', trigger: 'blur'},],
  code: [{required: true, message: '请输入验证码', trigger: 'blur'},],
})

const sign_in = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  for (let item in data.errors) {
    // @ts-ignore
    data.errors[item] = ''
  }
  formEl.validate((valid) => {
    if (data.form.code && data.form.code.toUpperCase() != data.r_code.toUpperCase()) {
      data.errors.code = '验证码错误'
      // @ts-ignore
      captcha.value.refreshCaptcha()
      return
    }
    if (valid) {
      axios.post("/api/web/sign_in", data.form, {
        headers: {'content-type': 'application/x-www-form-urlencoded'}
      }).then(res => {
        if (res.data.status === true) {
          router.push('/')
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
</script>

<style scoped>
.form {
  margin: auto;
  width: 100%;
}

.body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: radial-gradient(at top left, RGBA(15, 117, 254, 1), RGBA(44, 217, 213, 0.5));
}

.card {
  width: 50%;
  height: 70%;
  margin: 10vh auto 19vh;
}
</style>