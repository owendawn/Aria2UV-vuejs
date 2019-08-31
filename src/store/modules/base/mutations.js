export default {
  setWebsocket(state, value) {
    state.websocket = value;
  },
  setIp(state, value) {
    state.ip = value;
  },
  setPort(state, value) {
    state.port = value;
  },
  setGlobalStat(state, value) {
    state.globalStat = value;
  },
  setToDownloads(state, value) {
    state.toDownloads = value;
  },
  setToWaits(state, value) {
    state.toWaits = value;
  },
  setToFinishs(state, value) {
    state.toFinishs = value;
  },
  setPeers(state, value) {
    state.peers = value;
  },
  setGlobalOption(state, value) {
    state.globalOption = value;
  },
  setLive(state, value) {
    state.live = value;
  },
  setPeersId(state, value){
    state.peersId=value;
  }

};
