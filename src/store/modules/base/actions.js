import common from "../../../assets/util/common.js"
import PanUtil from "../../../assets/util/PanUtil"
import {
  Message
} from 'element-ui';

export default {
  initWebsocket({
    commit,
    state
  }) {
    let that = this;
    // console.log(this)
    if (state.websocket && state.websocket.readyState < 2) {
      return;
    }
    let websocket = new WebSocket("ws://"+state.ip+":"+state.port+"/jsonrpc");
    commit("setWebsocket", websocket);
    websocket.onopen = function (evt) {
      console.log("open")
      commit("setLive", true);
    };
    websocket.onerror = (evt) => {
      console.log("error")
      commit("setLive", false);
    };
    websocket.onclose = (evt) => {
      console.log("close")
      commit("setLive", false);
      setTimeout(it => {
        websocket.close();
        that.dispatch("initWebsocket");
      }, 10000)
    };

    function handleAndNotify(content,data) {
      if (data.error) {
        Message.error({
          dangerouslyUseHTMLString: true,
          message: content + '<br><small>code:' + data.error.message + '</small>'
        });
      } else {
        Message.info({
          dangerouslyUseHTMLString: true,
          message: content + '<br><small>code:' + data.result + '</small>'
        });
      }
    }

    websocket.onmessage = function ({
      data
    }) {
      var tmp = data;
      data = JSON.parse(data);
      data.raw = tmp;
      // console.log(data)
      if (data.id) {
        if (new RegExp("^sendGetGlobalStatREQ_").test(data.id)) {
          commit("setGlobalStat", data.result);
        } else if (new RegExp("^sendTellActiveREQ_").test(data.id)) {
          commit("setToDownloads", data.result);
        } else if (new RegExp("^sendGetPeersREQ_").test(data.id)) {
          commit("setPeers", data.result);
        } else if (new RegExp("^sendTellFinishREQ_").test(data.id)) {
          commit("setToFinishs", data.result);
        } else if (new RegExp("^sendTellWaitREQ_").test(data.id)) {
          commit("setToWaits", data.result);
        } else if (new RegExp("^sendGetGlobalOptionREQ_").test(data.id)) {
          commit("setGlobalOption", data.result);
          window.postMessage({act:'updateGlobalOption'},"*");
        } else if (
          new RegExp("^sendAddUriREQ_").test(data.id) ||
          new RegExp("^sendAddBtREQ_").test(data.id) ||
          new RegExp("^sendAddMetalinkREQ_").test(data.id)
        ) {
          handleAndNotify("任务下载开始",data);
        } else if (new RegExp("^sendPauseREQ_").test(data.id)) {
          handleAndNotify("任务下载已暂停",data);
        } else if (new RegExp("^sendUnpauseREQ_").test(data.id)) {
          handleAndNotify("任务继续下载",data);
        } else if (new RegExp("^sendRemoveREQ_").test(data.id)) {
          handleAndNotify("任务停止下载",data);
        } else if (new RegExp("^sendForceRemoveREQ_").test(data.id)) {
          handleAndNotify("任务强制停止下载",data);
        } else if (new RegExp("^sendRemoveDownloadResultREQ_").test(data.id)) {
          handleAndNotify("任务已移除",data);
        } else if (new RegExp("^sendRestartREQ_").test(data.id)) {
          handleAndNotify("任务重新下载开始",data);
        } else if (new RegExp("^sendChangeOptionResultREQ_").test(data.id)) {
          handleAndNotify("更新任务参数",data);
        } else if (new RegExp("^sendChangeGlobalOptionREQ_").test(data.id)) {
          handleAndNotify("更新系统参数",data);
        } else if (new RegExp("^sendShutdownREQ_").test(data.id)) {
          handleAndNotify("关闭Aria2后台服务",data);
        }
      } else {
        switch (data.method) {
          case "aria2.onDownloadStart": {
            PanUtil.notify("通知", "任务开始下载", "http://i67.tinypic.com/2d83xhg.jpg");
            break;
          }
          case "aria2.onBtDownloadComplete": {
            PanUtil.notify("通知", "种子下载完毕", "http://i67.tinypic.com/2d83xhg.jpg");
            break;
          }
          case "aria2.onDownloadComplete": {
            PanUtil.notify("通知", "任务下载完毕", "http://i67.tinypic.com/2d83xhg.jpg");
            break;
          }
          case "aria2.onDownloadPause": {
            PanUtil.notify("通知", "任务下载暂停", "http://i67.tinypic.com/2d83xhg.jpg");
            break;
          }
          case "aria2.onDownloadError": {
            PanUtil.notify("通知", "任务下载异常终止", "http://i65.tinypic.com/5uk1l3.jpg");
            break;
          }
          case "aria2.onDownloadStop": {
            PanUtil.notify("通知", "任务下载终止", "http://i65.tinypic.com/5uk1l3.jpg");
            break;
          }
        }
      }
    };
  },
  sendToWebSocket({
    state
  }, data) {
    setTimeout(function () {
      if (state.websocket.readyState !== common.readyState.OPEN) return;
      state.websocket.send(JSON.stringify(data));
    }, state.websocket.readyState === common.readyState.CONNECTING ? 3000 : 0);
  }

};
