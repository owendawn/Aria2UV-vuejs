<template>
  <div id="finish-page">
    <div
      style="width:calc(100% - 202px)"
      class="pull-left"
    >
      <p-to-download-group v-bind:todos="toDos"></p-to-download-group>
    </div>

    <p-download-menu class="pull-right"></p-download-menu>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import store from "../../../store/modules/base/store.js"
import common from "../../../assets/util/common.js"
export default {
    store,
  data() {
    return {

    }
  },
  mounted() {
    let that = this;
    (function update() {
      if (that.$route.fullPath === "/finish") {
        that.$store.dispatch("sendToWebSocket", { jsonrpc: "2.0", method: "aria2.tellStopped", id: common.getReqId(common.reqType.sendTellFinishREQ) ,params:[-1,1000]});
        setTimeout(() => {
          update();
        }, 3000);
      }
    })();

  },
 computed: mapState({
    toDos: state => state.toFinishs
  }),
  methods: {


  }
}
</script>
<style>
</style>
