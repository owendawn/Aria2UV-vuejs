import common from "../../../assets/util/common.js"
import PanUtil from "../../../assets/util/PanUtil"
import {
  Message
} from 'element-ui';
// import axios from 'axios'

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

const fn= {
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
        }  else if (new RegExp("^sendTellFinishREQ_").test(data.id)) {
          commit("setToFinishs", data.result);
        } else if (new RegExp("^sendTellWaitREQ_").test(data.id)) {
          commit("setToWaits", data.result);
        }
      } else {
        switch (data.method) {
          case "aria2.onDownloadStart": {
            PanUtil.notify("通知", "任务开始下载"
              // , "https://img1002.pocoimg.cn/image/poco/works/15/2019/0906/20/15677724857976783_201117043_H1200.png"
            );
            break;
          }
          case "aria2.onBtDownloadComplete": {
            PanUtil.notify("通知", "种子下载完毕"
              // , "https://img1002.pocoimg.cn/image/poco/works/15/2019/0906/20/15677724855436782_201117043_H1200.png"
            );
            break;
          }
          case "aria2.onDownloadComplete": {
            PanUtil.notify("通知", "任务下载完毕"
              // , "https://img1002.pocoimg.cn/image/poco/works/15/2019/0906/20/15677724855436782_201117043_H1200.png"
            );
            break;
          }
          case "aria2.onDownloadPause": {
            PanUtil.notify("通知", "任务下载暂停"
              // , "https://img1002.pocoimg.cn/image/poco/works/15/2019/0906/20/15677724857180313_201117043_H1200.png"
            );
            break;
          }
          case "aria2.onDownloadError": {
            PanUtil.notify("通知", "任务下载异常终止"
              // , "https://img1002.pocoimg.cn/image/poco/works/15/2019/0906/20/15677724856682249_201117043_H1200.png"
            );
            break;
          }
          case "aria2.onDownloadStop": {
            PanUtil.notify("通知", "任务下载终止"
              // , "https://img1002.pocoimg.cn/image/poco/works/15/2019/0906/20/15677724857180313_201117043_H1200.png"
            );
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
  },
  postToAjax:({
               commit,
               state
             },params)=>{
    axios.post(
      "http://"+state.ip+":"+state.port+"/jsonrpc",
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      })
      .then((re) =>{
        let data=re.data;
        switch (data.id.substring(0,data.id.indexOf("_"))) {
          case common.reqType.sendGetPeersREQ:{
            commit("setPeers",data.result)
            break;
          }
          case common.reqType.sendGetGlobalOptionREQ:{
            commit("setGlobalOption", data.result);
            window.postMessage({act:'updateGlobalOption'},"*");
            break;
          }
          case common.reqType.sendGetOptionREQ:{
            commit("setOption", {data:data.result,id:params.params[0]});
            break;
          }
          case common.reqType.sendChangeOptionREQ:{
            handleAndNotify("修改参数",data);
            const ps={
              jsonrpc: "2.0",
              method: "aria2.getOption",
              id: common.getReqId(common.reqType.sendGetOptionREQ),
              params: [params.params[0]]
            }
            fn.postToAjax({commit,state},ps)
            break;
          }
          case common.reqType.sendAddUriREQ:{
            handleAndNotify("任务下载开始",data);
            break;
          }
          case common.reqType.sendAddBtREQ:{
            handleAndNotify("任务下载开始",data);
            break;
          }
          case common.reqType.sendAddMetalinkREQ:{
            handleAndNotify("任务下载开始",data);
            break;
          }
          case common.reqType.sendPauseREQ:{
            handleAndNotify("任务下载已暂停",data);
            break;
          }
          case common.reqType.sendUnpauseREQ:{
            handleAndNotify("任务继续下载",data);
            break;
          }
          case common.reqType.sendRemoveREQ:{
            handleAndNotify("任务停止下载",data);
            break;
          }
          case common.reqType.sendForceRemoveREQ:{
            handleAndNotify("任务强制停止下载",data);
            break;
          }
          case common.reqType.sendRemoveDownloadResultREQ:{
            handleAndNotify("任务已移除",data);
            break;
          }
          case common.reqType.sendRestartREQ:{
            handleAndNotify("任务重新下载开始",data);
            break;
          }
          case common.reqType.sendChangeOptionResultREQ:{
            handleAndNotify("更新任务参数",data);
            break;
          }
          case common.reqType.sendChangeGlobalOptionREQ:{
            handleAndNotify("更新系统参数",data);
            break;
          }
          case common.reqType.sendShutdownREQ:{
            handleAndNotify("关闭Aria2后台服务",data);
            break;
          }
          default:{
            alert("异常数据："+JSON.stringify(data))
          }
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

};

export default fn;
