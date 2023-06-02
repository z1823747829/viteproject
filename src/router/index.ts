import {createRouter, createWebHistory} from 'vue-router'
import VueCookies from "vue-cookies";
import {ElMessage} from "element-plus";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: '首页',
            component: () => import('../components/Home.vue'),
        },
        {
            path: '/sign_in',
            name: '登录',
            component: () => import('../components/User/Signin.vue'),
        },
        {
            path: '/sign_up',
            name: '注册',
            component: () => import('../components/User/Signup.vue'),
        },
        {
            path: '/academy',
            name: '学院',
            component: () => import('../components/Academy/Academy.vue'),
            children: [
                {
                    path: '',
                    name: '学院首页',
                    component: () => import('../components/Academy/AcademyHome.vue'),
                },
                {
                    path: ':aid',
                    name: '学院详情',
                    component: () => import('../components/Academy/AcademyDetail.vue'),
                }
            ]
        },
        {
            path: '/course',
            component: () => import('../components/Course/Course.vue'),
            children: [
                {
                    path: '',
                    name: '课程首页',
                    component: () => import('../components/Course/CourseHome.vue'),
                },
                {
                    path: ':cid',
                    name: '课程详情',
                    component: () => import('../components/Course/CourseDetail.vue'),
                },
                {
                    path: 'resource/:crid',
                    name: '课程资源',
                    component: () => import('../components/Course/CourseResource.vue'),
                },
            ]
        },
        {
            path: '/forum',
            component: () => import('../components/Forum/Forum.vue'),
            children: [
                {
                    path: '',
                    name: '论坛首页',
                    component: () => import('../components/Forum/ForumHome.vue'),
                },
                {
                    path: ':fid',
                    name: '帖子',
                    component: () => import('../components/Forum/ForumDetail.vue'),
                },
                {
                    path: 'add',
                    name: '新建帖子',
                    component: () => import('../components/Forum/ForumAdd.vue'),
                },
            ]
        },
        {
            path: '/about',
            name: '关于',
            component: () => import('../components/About.vue'),
        },
        {
            path: '/user',
            name: '个人资料',
            component: () => import('../components/User/User.vue'),
        },
        {
            path: '/user/forum',
            name: '个人发帖',
            component: () => import('../components/User/UserForum.vue'),
        },
    ]
})

const cookies: any = VueCookies
router.beforeEach((to, from, next) => {
    let accessible_path = ['首页', '登录', '注册', '关于',]
    if (cookies.isKey('user_info') || accessible_path.indexOf(<string>to.name) > -1) {
        if (to.name) {// @ts-ignore
            document.title = to.name + " | CAUC线上学习平台"
        } else {
            document.title = "CAUC线上学习平台"
        }
        next()
    } else {
        next({name: '首页'})
        ElMessage({message: '请登录后再试', type: 'error', grouping: true, showClose: true,})
    }
})
export default router
