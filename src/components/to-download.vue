<template>

  <el-collapse-item
    class="p-to-download"
    @change="handleChange"
    ref="chartPane"
  >
    <template slot="title">
      <div class="download-header">
        <strong>
          {{this.name}}
        </strong>

        <div class="info">
          <span>
            <p-icon
              name="signal"
              width="12"
              height="12"
            /> {{this.$props.todo.connections}}
            <p-icon
              name="magnet"
              width="12"
              height="12"
            /> {{this.$props.todo.numSeeders}}
            <p-icon
              name="file-alt"
              width="12"
              height="12"
            /> {{this.$props.todo.files.filter(it=>Number(it.completedLength)>=Number(it.length)).length}}/{{this.$props.todo.files.length}}
            <i
              class="el-icon-loading"
              v-if="this.$props.todo.status==='active'"
            ></i>
          </span>
          <span>
            <p-icon
              name="download"
              width="12"
              height="12"
            /> {{this.common.getSize(this.$props.todo.downloadSpeed)+"/s"}}
            &emsp;剩余时间: {{this.getCastTime()}}
          </span>
          <span>
            {{this.common.getSize(this.$props.todo.completedLength)}}
            /
            {{this.common.getSize(this.$props.todo.totalLength)}}
          </span>
        </div>

      </div>
      <el-progress
        class="progress"
        type="circle"
        style="font-size:10pt;"
        :percentage="this.getPercent(this.$props.todo.completedLength,this.$props.todo.totalLength)"
        :width="55"
      ></el-progress>
      <el-dropdown @command="chooseCommand">
        <span class="el-dropdown-link">
          &emsp;<i class="el-icon-arrow-down el-icon--right"></i>&nbsp; &emsp;
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command="pause"
            v-if="['active'].indexOf(this.$props.todo.status)!==-1"
          >暂停</el-dropdown-item>
          <el-dropdown-item
            command="stop"
            v-if="['active','paused'].indexOf(this.$props.todo.status)!==-1"
          >终止</el-dropdown-item>
          <el-dropdown-item
            command="unpause"
            v-if="['paused'].indexOf(this.$props.todo.status)!==-1"
          >继续下载</el-dropdown-item>
          <el-dropdown-item
            command="restart"
            v-if="['complete','error','removed'].indexOf(this.$props.todo.status)!==-1"
          >重新下载</el-dropdown-item>
          <el-dropdown-item
            command="remove"
            v-if="['complete','error','removed'].indexOf(this.$props.todo.status)!==-1"
          >删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <el-tabs
      type="border-card"
      @tab-click="this.tabClick"
    >
      <el-tab-pane label=" 概况" >

        <p-updown-chart ref="chart" style="height: 150px" :ups="this.ups" :downs="this.downs"></p-updown-chart>

        <el-table
          :data="this.getInfoTable()"
          style="width: 100%;font-size:1px;"
          stripe
        >
          <el-table-column
            prop="name"
            label="#"
            width="200"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label=""
          >
            <template slot-scope="scope">
              <div v-html="scope.row.value">

              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        label="区块信息"
        v-if="this.type!=='FTP'"
      >
        <div class="piece-info">
          <span :title="this.pieces.complete+'/'+this.$props.todo.numPieces+'块'">
            <!-- <span
              class="piece filled"
              style="vertical-align:middle"
            ></span>  -->
            <el-badge :value="this.pieces.complete" class="item" >
              <el-button size="small" type="success">已完成</el-button>
            </el-badge>
            </span>
            &emsp;&emsp;&emsp;&emsp;
          <span :title="(Number(this.$props.todo.numPieces)-this.pieces.complete) +'/'+this.pieces.total+'块'">
            <!-- <span
              class="piece"
              style="vertical-align:middle"
            ></span>  -->
            <el-badge :value="Number(this.$props.todo.numPieces)-this.pieces.complete" class="item">
              <el-button size="small">未完成</el-button>
            </el-badge>
            </span>
        </div>
        <div style="text-align: center">
          <span>
            <el-tag>分块大小：{{common.getSize(this.$props.todo.pieceLength)}}</el-tag>
          </span>
          <br>
          <br>
          <el-progress
           :text-inside="true" 
           :stroke-width="66" 
           :percentage="(this.pieces.complete/Number(this.$props.todo.numPieces)*100).toFixed(4)"
           status="success">
           </el-progress>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="文件列表"
        v-if="!!this.$props.todo.bittorrent"
      >
       <p-to-download-files :todo="this.$props.todo"></p-to-download-files>
      </el-tab-pane>
      <el-tab-pane
        label="链接详情"
        v-if="this.$props.todo.status==='active'"
      >
      <el-button
      type="primary"
      :loading="this.hasLaodPeers&&this.getPeersTable().length===0"
      @click="this.getPeerInfos"
      >
        加载{{this.hasLaodPeers?(this.getPeersTable().length>0?"":"......"):""}}
        </el-button>
        <el-table
          :data="this.getPeersTable()"
          style="width: 100%;"
        >
          <el-table-column
            prop="name"
            label="位置"
            width="280"
          >
          </el-table-column>
          <el-table-column
            prop="type"
            label="客户端"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="percent"
            label="完成率"
          >
          </el-table-column>
          <el-table-column
            prop="downloadSpeedStr"
            label="下载速度"
          >
          </el-table-column>
          <el-table-column
            prop="uploadSpeedStr"
            label="上传速度"
          >
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
          >
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-collapse-item>

</template>
<script>
import 'vue-awesome/icons/link'
import 'vue-awesome/icons/signal'
import 'vue-awesome/icons/magnet'
import 'vue-awesome/icons/file-alt'
import 'vue-awesome/icons/download'


import store from "../store/modules/base/store.js"
import common from "../assets/util/common.js"
import ECharts from 'echarts'
import 'echarts/lib/chart/radar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'

import { setInterval, clearInterval, setTimeout } from 'timers';

export default {
  components:{
    'v-chart': ECharts
  },
  store,
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      common,
      isCollapse: true,
      type: null,
      hasLaodPeers:false,
      dir: this.$props.todo.dir,
      connectInterval: null,
      name: null,
      pieces:this.getPieces(),
      files: this.$props.todo.files,
      checks: [],
      ups:[],
      downs:[],
      times:[],
      myChart:null,

    };
  },
  mounted() {
    this.$refs.chart.$el.style.width=this.$refs.chartPane.$el.offsetWidth-50;
    if (this.$props.todo.bittorrent) {
      if (this.$props.todo.bittorrent.info) {
        this.type = "Torrent"
        this.name = "✪ " + this.$props.todo.bittorrent.info.name;
        this.checks = this.$props.todo.files.filter(it => it.selected === 'true').map(it => it.index).concat();
      } else {
        this.type = "Magnet";
        this.name = "◑ " + this.$props.todo.files[0].path;
      }
    } else if (new RegExp("^ftp://").test(this.$props.todo.files[0].uris[0].uri)) {
      this.type = "FTP";
      this.name = "☢ " + decodeURIComponent(this.$props.todo.files[0].uris[0].uri.substring(this.$props.todo.files[0].uris[0].uri.lastIndexOf("/") + 1));
    } else if (new RegExp("^https?://").test(this.$props.todo.files[0].uris[0].uri)) {
      this.type = "HTTP/HTTPS";
      this.name = "☪ " + decodeURIComponent(
        this.$props.todo.files[0].path.substring(this.$props.todo.files[0].path.lastIndexOf("/") + 1)
        ||this.$props.todo.files[0].uris[0].uri.substring(this.$props.todo.files[0].uris[0].uri.lastIndexOf("/") + 1)
      );
    }
    setInterval(this.updateChartData,3000);
  },
  updated(){

  },
  methods: {
    tabClick(){

    },
    updateChartData(){
      let time=new Date().getTime();
      this.times.push(time);
      this.ups.push([time,Number(this.$props.todo.uploadSpeed)]);
      this.downs.push([time,Number(this.$props.todo.downloadSpeed)]);
      while (this.ups.length>30){
        this.times.shift();
        this.ups.shift();
        this.downs.shift();
      }
    },
    getPeerInfos(){
      this.hasLaodPeers=true;
      this.$store.dispatch("postToAjax",{
            jsonrpc: "2.0",
            method: "aria2.getPeers",
            id: common.getReqId(common.reqType.sendGetPeersREQ),
            params: [
              this.$props.todo.gid
            ]
      });
      this.$store.commit("setPeersId",this.$props.todo.gid);
      this.hasLaodPeers=false;
      // this.$store.dispatch(
      //   "sendToWebSocket",
      //   {
      //     jsonrpc: "2.0",
      //     method: "aria2.getPeers",
      //     id: common.getReqId(common.reqType.sendGetPeersREQ),
      //     params: [this.$props.todo.gid]
      //   }
      // );
    },
    handleChange(val) {
      console.log(val);
    },
    getPercent(fz, fm) {
      if (Number(fm) === 0) { return 0; }
      return Math.round(Number(fz) * 10000 / Number(fm)) / 100;
    },
    getCastTime() {
      let time = "∞";
      if (this.$props.todo.downloadSpeed !== "0") {
        let leave = Number(this.$props.todo.totalLength) - Number(this.$props.todo.completedLength);
        let long = Math.round(leave / Number(this.$props.todo.downloadSpeed));
        time = Math.floor(long / 60 / 60) + ":" + Math.floor(long % (60 * 60) / 60) + ":" + Math.floor(long % 60);
      }
      return time;
    },
    parseState(state, it) {

      switch (state) {
        case "active": return "正在下载";
        case "complete": return "已完成";
        case "error": return "异常终止 - " + common.Aria2ErrorCode[it.errorCode] + "";
        case "paused": return "暂停";
        case "waiting": return "正在连接";
        case "removed": return "已删除";
        default:
          return "未知"
      }
    },
    getInfoTable() {
      let re = [
        { name: "任务类型", value: this.type },
        { name: "任务状态", value: "<span title='" + this.$props.todo.errorMessage + "'>" + this.parseState(this.$props.todo.status, this.$props.todo) + "</span>" },
        { name: "连接数", value: this.$props.todo.connections },
        { name: "下载路径", value: this.$props.todo.dir },
      ];
      if (this.$props.todo.bittorrent) {
        let magnet = "magnet:?xt=urn:btih:" + this.$props.todo.infoHash;
        re.push({ name: "磁力链接", value: "<a href='" + magnet + "' target='_blank' style='text-decoration: none;'>" + magnet + "</a>" });
        re.push({ name: "下载宣言", value: "<textarea style='width:100%;resize:none;' rows=5>" + this.$props.todo.bittorrent.announceList.map(it => it[0]).join("\n") + "</textarea>" });
      } else {
        re.push({ name: "链接地址", value: "<a href='" + this.$props.todo.files[0].uris[0].uri + "' target='_blank' style='text-decoration: none;'>" + this.$props.todo.files[0].uris[0].uri + "</a>" });
      }
      return re;
    },


    getPieces() {
      return common.countBitfield(this.$props.todo.bitfield)
      // return {
      //   total:Number(this.$props.todo.numPieces),
      //   complete:Math.round(Number(this.$props.todo.completedLength)/(Number(this.$props.todo.totalLength)/Number(this.$props.todo.numPieces)))
      // };
    },
    parsePeerInfo(peerid) {
      try {
        var ret = window.format_peerid(peerid);
        if (ret.client == 'unknown') throw 'unknown';
        return ret.client + (ret.version ? '-' + ret.version : '');
      } catch (e) {
        if (peerid == '%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00')
          return 'unknown';
        var ret = unescape(peerid).split('-');
        for (var i = 0; i < ret.length; i++) {
          if (ret[i].trim().length) return ret[i];
        }
        return 'unknown';
      }
    },
    getPeersTable() {
      if(this.$store.state.peersId!==this.$props.todo.gid){
        return [];
      }
      return this.$store.state.peers.map(it => {
        it.name = it.ip + ":" + it.port
        it.type = this.parsePeerInfo(it.peerId);
        it.downloadSpeedStr = common.getSize(it.downloadSpeed) + "/s";
        it.uploadSpeedStr = common.getSize(it.uploadSpeed) + "/s";
        it.percent = common.countBitfield(it.bitfield).percent;
        it.state = it.peerChoking === "false" ? "通畅" : "堵塞";
        return it;
      });
    },
    chooseCommand(command) {
      switch (command) {
        case 'pause': {
          this.$store.dispatch("sendToWebSocket", { jsonrpc: "2.0", method: "aria2.pause", id: common.getReqId(common.reqType.sendPauseREQ), params: [this.$props.todo.gid] })
          break;
        }
        case 'unpause': {
          this.$store.dispatch("sendToWebSocket", { jsonrpc: "2.0", method: "aria2.unpause", id: common.getReqId(common.reqType.sendUnpauseREQ), params: [this.$props.todo.gid] })
          break;
        }
        case 'restart': {
          console.log(this.$props.todo)
          this.$store.dispatch(
            "sendToWebSocket",
            {
              jsonrpc: "2.0",
              method: "aria2.removeDownloadResult",
              id: common.getReqId(common.reqType.sendRemoveDownloadResultREQ),
              params: [this.$props.todo.gid]
            }
          )
          if (this.type === "Torrent" || this.type === "Magnet") {
            this.$store.dispatch("sendToWebSocket", {
              jsonrpc: "2.0",
              method: "aria2.addUri",
              id: common.getReqId(common.reqType.sendRestartREQ),
              params: [
                ["magnet:?xt=urn:btih:" + this.$props.todo.infoHash],
                this.$props.todo
              ]
            })
          } else if (this.type === "FTP"||this.type==="HTTP/HTTPS") {
            this.$store.dispatch("sendToWebSocket", {
              jsonrpc: "2.0",
              method: "aria2.addUri",
              id: common.getReqId(common.reqType.sendRestartREQ),
              params: [
                [this.$props.todo.files[0].uris[0].uri],
                this.$props.todo
              ]
            })
          }
          break;
        }
        case 'stop': {
          //仅针对正在下载的任务
          this.$store.dispatch("sendToWebSocket", { jsonrpc: "2.0", method: "aria2.remove", id: common.getReqId(common.reqType.sendRemoveREQ), params: [this.$props.todo.gid] })
          // this.$store.dispatch("sendToWebSocket", { jsonrpc: "2.0", method: "aria2.forceRemove", id: common.getReqId(common.reqType.sendForceRemoveREQ), params: [this.$props.todo.gid] })
          break;
        }
        case 'remove': {
          this.$store.dispatch("sendToWebSocket", { jsonrpc: "2.0", method: "aria2.removeDownloadResult", id: common.getReqId(common.reqType.sendRemoveDownloadResultREQ), params: [this.$props.todo.gid] })
          break;
        }
      }
    },

  }
}
</script>
<style>
.p-to-download .el-tab-pane {
  height: 280px;
  overflow: auto;
}
.p-to-download .el-badge__content {
  color: #212529;
  background-color: #f8f9fa;
}
.p-to-download .el-collapse-item__arrow.el-icon-arrow-right {
  display: none;
}
.p-to-download .piece-info {
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px dashed silver;
  margin-bottom: 32px;
  padding-bottom: 16px;
  padding-top: 8px;
}
.p-to-download .piece {
  width: 10px;
  height: 10px;
  display: inline-block;
  background-color: #eef2f4;
  border: 1px solid #dee2e5;
  margin: 0 2px 4px 0;
}
.p-to-download .piece.filled {
  background-color: #b8dd69;
  border-color: #b8dd69;
}
.p-to-download .el-table td {
  padding: 6px 0;
}
.p-to-download .el-table .cell {
  line-height: 22px;
}
.p-to-download .progress {
  margin-right: 12px;
}
.p-to-download .el-collapse-item__content {
  padding-bottom: 2px;
}
.p-to-download .el-collapse-item__header {
  height: 60px;
  line-height: 30px;
}
.p-to-download .download-header {
  padding-left: 24px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 12px;
}
.p-to-download .download-header .info {
  display: flex;
  justify-content: space-between;
  padding-right: 18px;
  font-size: 11pt;
}
.p-to-download .el-badge__content {
    color: #fff;
    background-color: #b7bbbf;
}

</style>
