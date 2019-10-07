<template>
  <el-menu
    id="p-nav"
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#17a2b8"
    text-color="#fff"
    active-text-color="#ffd04b"
    :router="true"
  >
    <el-menu-item
      index="blank_1"
      disabled
      class="cursor-none"
    ></el-menu-item>
    <el-menu-item
      id="logo"
      index="/download"
      style="color:white;"
    >
      <strong>Aria2UV</strong><small> - v2.0.0</small>
    </el-menu-item>
    <el-menu-item
      index="blank_2"
      disabled
      class="cursor-none"
    ></el-menu-item>
    <el-menu-item index="/download">下载管理</el-menu-item>
    <el-submenu index="">
      <template slot="title">Aria2配置</template>
      <el-menu-item index="/aria2-setting">Aira2服务器配置</el-menu-item>
      <el-menu-item index="/common-setting">通用配置</el-menu-item>
    </el-submenu>

    <el-menu-item
      index="ui-source"
      class="pull-right nav-icon-right-sm"
    >
      <a
        href="https://github.com/owendawn/Aria2UV-vuejs"
        target="_blank"
      >
        <p-icon
          name="bug"
          class="text-white"
          title="UI源码"
        />
      </a>
    </el-menu-item>
    <el-menu-item
      index="aira2-service"
      class="pull-right nav-icon-right-sm"
    >
      <a
        href="https://pan.baidu.com/s/1z5K2wFulPkm03bRnrjA4AQ"
        target="_blank"
      >
        <p-icon
          name="magic"
          class="text-white"
          title="Aria2定制服务包"
        />
      </a>
    </el-menu-item>
    <el-menu-item
      index="baiduyun-plugin"
      class="pull-right nav-icon-right-sm"
    >
      <a
        href="https://github.com/acgotaku/BaiduExporter"
        target="_blank"
      >
        <p-icon
          name="paper-plane"
          class="text-white"
          title="Baidu云插件"
        />
      </a>
    </el-menu-item>



    <el-menu-item class="pull-right nav-icon-right-sm">
      <p-icon
        name="heartbeat"
        class="text-white"
        :class="!this.live?'outline':'online'"
      />
    </el-menu-item>
    <el-menu-item class="pull-right nav-icon-right-sm">
      <p-icon
        name="cloud-download-alt"
        class="text-white"
      />
      <span>{{this.common.getSize(this.$store.state.globalStat.downloadSpeed)+"/s"}}</span>
    </el-menu-item>
    <el-menu-item class="pull-right nav-icon-right-sm">
      <p-icon
        name="cloud-upload-alt"
        class="text-white"
      />
      <span>{{this.common.getSize(this.$store.state.globalStat.uploadSpeed)+"/s"}}</span>
    </el-menu-item>

    <el-menu-item
      index="aria2-url"
      class="pull-right nav-icon-right-sm"
    >
      <el-button
        id="rpc-link"
        class="text-white"
        plain
        @click="closeAria2Server"
      > ws://{{this.$store.state.ip}}:{{this.$store.state.port}}/jsonrpc</el-button>
    </el-menu-item>
  </el-menu>
</template>
<script>
import 'vue-awesome/icons/paper-plane'
import 'vue-awesome/icons/magic'
import 'vue-awesome/icons/bug'
import 'vue-awesome/icons/heartbeat'
import 'vue-awesome/icons/cloud-upload-alt'
import 'vue-awesome/icons/cloud-download-alt'

import { mapGetters, mapState } from 'vuex'
import store from "../store/modules/base/store.js"
import common from "../assets/util/common.js"
import { setInterval } from 'timers';
export default {
  store,
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      common
    };
  },
  computed: mapState({
    websocket: state => state.websocket,
    live: state => state.live,
  }),
  mounted() {
    if (this.$store.state.websocket !== null) {
      this.$store.state.websocket.close();
    }
    this.$store.dispatch("initWebsocket")
    this.$store.dispatch("postToAjax", { jsonrpc: "2.0", method: "aria2.getGlobalOption", id: common.getReqId(common.reqType.sendGetGlobalOptionREQ) });
    setInterval(it => {
      if (!this.live) { return }
      this.$store.dispatch("sendToWebSocket", { jsonrpc: "2.0", method: "aria2.getGlobalStat", id: common.getReqId(common.reqType.sendGetGlobalStatREQ) });
      document.title = ""
        + "↓" + common.getSize(Number(this.$store.state.globalStat.downloadSpeed), " - . - ")
        + " ↑" + common.getSize(Number(this.$store.state.globalStat.uploadSpeed), " - . - ")
        + " ~ Aria2UV";
    }, 2000);
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    closeAria2Server() {
      this.$confirm('是否确认关闭Aria2后台服务支持?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch("postToAjax", {
          jsonrpc: "2.0",
          method: "aria2.shutdown",
          id: common.getReqId(common.reqType.sendShutdownREQ)
        });
      }).catch(() => {

      });


    }

  }
}
</script>
<style>
#p-nav .nav-icon-right-sm {
  padding: 0 9px;
  border-bottom: 0;
}
#p-nav svg.outline path {
  color: red;
}
#p-nav #logo {
  font-size: 20pt;
  border-bottom: 0;
  color: white;
}
#p-nav #rpc-link {
  background: inherit;
}
.el-menu--horizontal > .el-submenu .el-submenu__icon-arrow {
  color: #faf8f8;
}
</style>
