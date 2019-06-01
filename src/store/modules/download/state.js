const state = {
    cardData: [],
    isloadingComplete: false,
    busy: false,
    isShow: false,
  };

const mutations = {
    updateLoadingState(state, data) {
      state.isloadingComplete = data;
    },
    updateBusyState(state, data) {
      state.busy = data;
    },
    addData(state, data) {
      state.cardData = state.cardData.concat(data);
    },
    refreshData(state, data) {
      state.cardData = data;
    },
    isShowAlert(state, data) {
      state.isShow = data;
    },
  };

  export default mutations;