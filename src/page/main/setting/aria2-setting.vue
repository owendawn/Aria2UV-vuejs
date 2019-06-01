<template>
  <div id="aria2-setting-page">
    <el-card class="box-card">
      <el-form
        ref="setting"
        :model="setting"
        label-width="120px"
      >
        <el-form-item label="Aria2服务器"></el-form-item>
        <el-form-item style="text-align:center;">
          <el-col :span="16">
            <el-input v-model="setting.ip">
              <template slot="prepend">ws://</template>
              <template slot="append">:</template>
            </el-input>
          </el-col>

          <el-col :span="8">
            <el-input v-model="setting.port">
              <template slot="append">/jsonrpc</template>
            </el-input>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="this.save"
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
        ip: 'localhost',
        port: 6800
      }
    }
  },

  mounted() {
    this.setting.ip = this.$store.state.ip;
    this.setting.port = this.$store.state.port;
  },

  methods: {
    save() {
      window.localStorage.setItem("rpc-ip", this.setting.ip);
      window.localStorage.setItem("rpc-port", this.setting.port);
      this.$store.state.websocket.close();
      this.$store.commit("setIp", this.setting.ip);
      this.$store.commit("setPort", this.setting.port);
      this.$store.commit("setWebsocket", null);
      this.$store.dispatch("initWebsocket");
      this.$message({
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: '保存成功'
      });
    }

  }
}
</script>
<style>
</style>
