<template>
  <el-scrollbar max-height="100%">
    <el-form ref="forum_add_form" :model="data.form" :rules="rules" label-position="top" label-width="120px"
             style="width: 90%;margin: auto">
      <el-form-item :error="data.errors.title" label="标题" prop="title">
        <el-input v-model="data.form.title"/>
      </el-form-item>
      <el-form-item :error="data.errors.profile" prop="profile">
        <template v-slot:label>
                    <span>简介
                        <el-tooltip content="帮助读者快速了解内容" effect="dark" placement="top">
                            <el-icon>
                                <WarningFilled/>
                            </el-icon>
                        </el-tooltip>
                    </span>
        </template>
        <el-input v-model="data.form.profile" clearable maxlength="128" placeholder="请输入简介"
                  rows="2" show-word-limit type="textarea"/>
      </el-form-item>
      <el-form-item v-if="data.form.content_type==0" :error="data.errors.rtf_content" label="富文本格式内容">
        <template v-slot:label>
          富文本格式内容
          <el-button @click="data.form.content_type=1">点击切换为Markdown</el-button>
          <Editor v-model="data.form.rtf_content"
                  :init="init" api-key="8hn75fp048fynpmqrn0289umwq8dms8ei538atwy2sglz5vn"/>
        </template>
      </el-form-item>
      <el-form-item v-else :error="data.errors.md_content" label="Markdown格式内容">
        <template v-slot:label>
          Markdown格式内容
          <el-button @click="data.form.content_type=0">点击切换为富文本</el-button>
        </template>
        <md-editor v-model="data.form.md_content"
                   :toolbars-exclude="['save','github']"
                   style="height:500px;text-align: left" @onUploadImg="onUploadImg"/>
      </el-form-item>
      <el-form-item :error="data.errors.keyword" label="关键词">
        <el-transfer v-model="data.form.keyword" :data="data.keywords"
                     :props="{key: 'id',label: 'keyword'}" filterable/>
      </el-form-item>
      <el-form-item :error="data.errors.annex" label="附件">
        <el-upload ref="upload" :auto-upload="false" :limit="1" :on-change="(uploadFile:UploadFile, uploadFiles:UploadFiles)=>getFile(uploadFile)" :on-exceed="handleExceed"
                   show-file-list
                   style="width: 90%">
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip text-red">
              限制上传一个文件，切文件大小在100MB以内
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
    <el-button @click="router.back()">取消</el-button>
    <el-button type="primary" @click="forum_add(forum_add_form)">上传</el-button>
  </span>
  </el-scrollbar>

</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {WarningFilled} from "@element-plus/icons-vue";
import axios from "axios";
import {
  ElMessage, FormInstance, FormRules, genFileId, UploadFile, UploadFiles, UploadInstance, UploadProps, UploadRawFile
} from "element-plus";
import {useRouter} from "vue-router";
import {forum, keyword} from "../my_type";
import Editor from "@tinymce/tinymce-vue";
import MdEditor from "md-editor-v3";
import {bytesToSize} from "../my_function";


const router = useRouter()
const forum_add_form = ref<FormInstance>()
const upload = ref<UploadInstance>()
const init = {
  language: "zh_CN",
  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
}
const any: any = null
let datalist = {
  forums: [forum],
  keywords: [keyword],
  form: {
    title: '',
    profile: '',
    md_content: '',
    rtf_content: '',
    content_type: 0,
    keyword: [],
    annex: any,
  },
  errors: {
    title: '',
    profile: '',
    md_content: '',
    rtf_content: '',
    keyword: '',
    annex: '',
  }
}
let data = reactive(datalist)
const rules = reactive<FormRules>({
  title: [{required: true, message: '请输入标题', trigger: 'blur'},],
  content: [{required: true, message: '请输入内容', trigger: 'blur'},],
})
const getFile = (uploadFile: UploadFile) => {
  // console.log(uploadFile)
  data.form.annex = uploadFile.raw
}
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const get_forum_add = () => {
  axios.get('/api/web/forum/add').then(res => {
    if (res.data.status === true) {
      data.keywords = res.data.keywords
    } else {
      console.log("error")
    }
  }).catch((error) => {
    console.log(error)
  })
}

const forum_add = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  for (let item in data.errors) {
    // @ts-ignore
    data.errors[item] = ''
  }
  if (data.form.annex && data.form.annex.size > 1024 * 1024 * 100) {
    data.errors.annex = `请将文件大小控制在100.0 MB以下。当前文件大小${bytesToSize(data.form.annex.size)}`
    return
  }
  formEl.validate((valid) => {
    if (valid) {
      let formData = new FormData();
      formData.append("title", data.form.title);
      formData.append("profile", data.form.profile);
      formData.append("rtf_content", data.form.rtf_content);
      formData.append("md_content", data.form.md_content);
      formData.append("content_type", data.form.content_type.toString());
      for (let item of data.form.keyword) {
        formData.append('keyword', item);
      }
      formData.append("annex", data.form.annex);
      axios.post('/api/web/forum/add', formData, {
        headers: {"Content-Type": "multipart/form-data"}
      }).then(res => {
        if (res.data.status === true) {
          data.form.title = ''
          data.form.profile = ''
          data.form.rtf_content = ''
          data.form.md_content = ''
          data.form.keyword = []
          data.form.annex = ''
          ElMessage({
            message: '上传成功,等待管理员审核',
            type: 'success',
          })
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
const onUploadImg = async (files: any, callback: any) => {
  const res = await Promise.all(
      files.map((file: any) => {
        return new Promise((rev, rej) => {
          const formData = new FormData();
          formData.append('img', file);

          axios.post('/api/web/forum/img/add', formData, {
            headers: {"Content-Type": "multipart/form-data"}
          }).then((res) => rev(res))
              .catch((error) => rej(error));
        });
      })
  );
  callback(res.map((item) => item.data.url));
};


data.forums = []
get_forum_add()
</script>

<style scoped>

</style>