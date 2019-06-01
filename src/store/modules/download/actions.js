import Vue from 'vue'; 

const actions = {
    getData(context, object) {
      const {progress, isRefresh} = object;
      progress.$Progress.start();
      context.commit('updateLoadingState', false);
      context.commit('updateBusyState', true);
  
      /**
       * use vue-resource
       */
      Vue.http.get('/mock/api.json').then((response) => {
        const json = response.data;
        context.commit('updateLoadingState', true);
        context.commit('updateBusyState', false);
        if (isRefresh === true) {
          context.commit('refreshData', json);
        } else {
          context.commit('addData', json);
        }
        progress.$Progress.finish();
      }, () => {
        context.commit('updateBusyState', false);
        progress.$Progress.fail();
      });
    }
  
};

export default actions;