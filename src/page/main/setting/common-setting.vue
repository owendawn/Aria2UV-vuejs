<template>
  <div id="common-setting-page">
    <el-card class="box-card">
      <el-form
        :model="this.getOption()"
        ref="ruleForm"
        label-width="30%"
        class="demo-ruleForm"
      >
        <el-form-item
          label="保存路径(dir)"
          prop="dir"
        >
          <el-input v-model="getOption().dir"></el-input>
        </el-form-item>
        <el-form-item label="断点续传(continue)">
          <el-select v-model="getOption().continue">
            <el-option
              label="是"
              value="true"
            ></el-option>
            <el-option
              label="否"
              value="false"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最大下载任务数(max-concurrent-downloads)">
          <el-input
            type="number"
            v-model="getOption()['max-concurrent-downloads']"
          ></el-input>
        </el-form-item>
        <el-form-item label="单服务器最大连接数(max-connection-per-server)">
          <el-input
            type="number"
            v-model="getOption()['max-connection-per-server']"
          ></el-input>
        </el-form-item>
        <el-form-item label="最小文件分片大小(min-split-size)">
          <el-input
            type="number"
            v-model="getOption()['min-split-size']"
          >
            <template slot="append">{{Number(getOption()['min-split-size'])/1024/1024}}M</template>
          </el-input>
        </el-form-item>
        <el-form-item label="单任务最大线程数(split)">
          <el-input
            type="number"
            v-model="getOption()['split']"
          ></el-input>
        </el-form-item>
        <el-form-item label="最大重试次数(max-tries)">
          <el-input
            type="number"
            v-model="getOption()['max-tries']"
          ></el-input>
        </el-form-item>
        <el-form-item label="重试等待时间(retry-wait)">
          <el-input
            type="number"
            v-model="getOption()['retry-wait']"
          ></el-input>
        </el-form-item>
        <el-form-item label="文件未找到重试次数(max-file-not-found)">
          <el-input
            type="number"
            v-model="getOption()['max-file-not-found']"
          ></el-input>
        </el-form-item>

        <el-form-item label="启动下载未完成BT任务(bt-seed-unverified)">
          <el-select v-model="getOption()['bt-seed-unverified']">
            <el-option
              label="是"
              value="true"
            ></el-option>
            <el-option
              label="否"
              value="false"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保存磁链为BT任务(bt-save-metadata)">
          <el-select v-model="getOption()['bt-save-metadata']">
            <el-option
              label="是"
              value="true"
            ></el-option>
            <el-option
              label="否"
              value="false"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="BT任务下载最大文件数(bt-max-open-files)">
          <el-input
            type="number"
            v-model="getOption()['bt-max-open-files']"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="updateSetting"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import store from "../../../store/modules/base/store.js"
import common from "../../../assets/util/common.js"
export default {
  store,
  data() {
    return {
      setting: {
      }
    }
  },

  mounted() {
    this.setting = Object.assign({}, this.$store.state.globalOption);
    console.log(this.$store.state.globalOption);
    window.addEventListener("message", ( e )=> {
		    if(e.data.act==="updateGlobalOption"){
             this.setting = Object.assign({}, this.$store.state.globalOption);
        }
     }, false );
     if(Object.keys(this.setting)===0){
         this.$store.dispatch("postToAjax", { jsonrpc: "2.0", method: "aria2.getGlobalOption", id: common.getReqId(common.reqType.sendGetGlobalOptionREQ) });
     }

  },

  methods: {
    getOption() {
      return this.setting;
    },
    updateSetting() {
      this.$store.dispatch("postToAjax", {
        jsonrpc: "2.0",
        method: "aria2.changeGlobalOption",
        id: common.getReqId(common.reqType.sendChangeGlobalOptionREQ),
        params: [
          this.setting
        ]
      });
      this.$store.dispatch("postToAjax", { jsonrpc: "2.0", method: "aria2.getGlobalOption", id: common.getReqId(common.reqType.sendGetGlobalOptionREQ) });
    }

  }
}
</script>
<style>
</style>
