//import Vue from 'vue'
//import VueRouter from 'vue-router'

import OnlyApp from '../app-only.vue'

import Download from './download/download.vue'
import Wait from './download/wait.vue'
import Finish from './download/finish.vue'
import CommonSetting from './setting/common-setting.vue'
import Aria2Setting from './setting/aria2-setting.vue'


//Vue.use(VueRouter)

const routes=[
    //{path: '/', component:OnlyApp, components: {default: Download}},


    {path: '/download', component:Download},
    {path: '/wait', component:Wait},
    {path: '/finish', component:Finish},
    {path: '/common-setting', component:CommonSetting},
    {path: '/aria2-setting', component:Aria2Setting},

     // 重定向
     {
         path: '/',
         redirect: '/download'
     }
]

const router=new VueRouter({routes})

export default router
