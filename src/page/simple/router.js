//import Vue from 'vue'
//import VueRouter from 'vue-router'

import OnlyApp from '../app-only.vue'


import Login from './login.vue'

Vue.use(VueRouter)

const routes=[
    {path: '/', component:OnlyApp, components: {default: Login}},


    {path:'/login',component:Login},



    // // 重定向
    // {
    //     path: '/',
    //     redirect: '/home'
    // }
]

const router=new VueRouter({routes})

export default router
