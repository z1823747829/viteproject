import {createApp} from 'vue'
import './style.css'
import 'element-plus/dist/index.css'
import 'tinymce/skins/ui/oxide/skin.css'
import "md-editor-v3/lib/style.css";

import App from './App.vue'
import ElementPlus from 'element-plus'
import locale from "element-plus/lib/locale/lang/zh-cn";
import VueCookie from 'vue-cookies'
import router from "./router";

createApp(App).use(router).use(ElementPlus, {locale}).use(VueCookie).mount('#app')
