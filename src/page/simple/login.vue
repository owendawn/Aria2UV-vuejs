<template>
    <div class="container pt-5">
        <div class="form-signin">
            <div class="text-center mb-4">
                <h1 class="h3 mb-3 font-weight-normal">我的地盘，我做主</h1>
                <p>Enjoy every day in your life!
                    <code>^v^</code>
                </p>
            </div>

            <div class="form-label-group">
                <label> 用户名</label>
                <input type="text" class="form-control" placeholder="用户名" required autofocus v-model="user">
            </div>

            <div class="form-label-group">
                <label>密码</label>
                <input type="password" class="form-control" placeholder="密码" required v-model="pwd">
            </div>

            <div class="checkbox mb-3">
                <label>
                    <input type="checkbox" value="1" v-model="remember"> Remember me for 30 days
                </label>
            </div>
            <button class="btn btn-lg btn-primary btn-block" type="submit" @click="loginClick">登陆</button>
            <p class="mt-5 mb-3 text-muted text-center">
                <router-link to="/registry">没用账户，前往注册</router-link>
            </p>
        </div>
    </div>
</template>
<script>

export default {
    data(){
        return {
            user:"",
            pwd:"",
            remember:""
        }
    },
    methods: {
        loginClick(){
           
        }
    },
    mounted() {
    }
}
</script>
<style>
</style>
