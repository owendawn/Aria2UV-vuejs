<template>
  <div id="download-page">
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item></el-breadcrumb-item>
        <el-breadcrumb-item>
          <el-button
            type="text"
            v-on:click="toggleModal"
          >新增下载链接</el-button>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <el-button
            type="text"
            v-on:click="toggleModal2"
          >新增torrent</el-button>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <el-button
            type="text"
            v-on:click="toggleModal3"
          >新增MetaLink</el-button>
        </el-breadcrumb-item>
        <el-breadcrumb-item></el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div
      style="width:calc(100% - 202px)"
      class="pull-left"
    >
      <p-to-download-group v-bind:todos="toDos"></p-to-download-group>
    </div>

    <p-download-menu class="pull-right"></p-download-menu>

    <!-- =============================================================== -->
    <el-dialog
      title="链接下载"
      :visible.sync="outerVisible"
    >
      <el-form
        label-position="right"
        label-width="100px"
        :model="this.linkJob"
      >
        <el-form-item label="下载链接">
          <el-input
            type="textarea"
            v-model="linkJob.link"
          ></el-input>
        </el-form-item>
        <el-form-item label="下载路径">
          <el-input v-model="linkJob.dir">
            <template slot="append">
              <el-button
                type="primary"
                plain
                @click="linkJob.dir='C:/Users/Administrator/Desktop'"
              >
                <p-icon name="home" />
              </el-button>
              <el-button
                type="primary"
                plain
                @click="linkJob.dir=$store.state.globalOption.dir"
              >
                <p-icon name="cog" />
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="最大连接数">
          <el-input-number
            size="small"
            v-model="linkJob['max-connection-per-server']"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="最大线程数">
          <el-slider
            v-model="linkJob['split']"
            :max="this.linkJob['split']>16?linkJob['split']:16"
            show-input
          >
          </el-slider>
        </el-form-item>
        <el-form-item
          label="FTP类型"
          prop="ftp-type"
        >
          <el-select v-model="linkJob['ftp-type']">
            <el-option
              label="binary"
              value="binary"
            ></el-option>
            <el-option
              label="ascii"
              value="ascii"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="FTP用户">
          <el-input v-model="linkJob['ftp-user']"></el-input>
        </el-form-item>
        <el-form-item label="FTP密码">
          <el-input v-model="linkJob['ftp-passwd']"></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="addLink"
          type="primary"
        >确定</el-button>
        <el-button @click="outerVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- ======================================================== -->
    <el-dialog
      title="Torrent下载"
      :visible.sync="outerVisible2"
    >
      <el-form
        label-position="right"
        label-width="100px"
        :model="this.btJob"
      >
        <el-form-item label="种子">
          <input
            class="el-form-item__content"
            type="file"
            @change="changeBTCode($event)"
          >
        </el-form-item>
        <el-form-item label="下载路径">
          <el-input v-model="btJob.dir">
            <template slot="append">
              <el-button
                type="primary"
                plain
                @click="btJob.dir='C:/Users/Administrator/Desktop'"
              >
                <p-icon name="home" />
              </el-button>
              <el-button
                type="primary"
                plain
                @click="btJob.dir=$store.state.globalOption.dir"
              >
                <p-icon name="cog" />
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="最大连接数">
          <el-input-number
            size="small"
            v-model="btJob['max-connection-per-server']"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="最大线程数">

          <el-slider
            v-model="btJob['split']"
            :max="this.btJob['split']>16?btJob['split']:16"
            show-input
          >
          </el-slider>
        </el-form-item>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="addBt"
          type="primary"
        >确定</el-button>
        <el-button @click="outerVisible2 = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- ======================================================== -->
    <el-dialog
      title="MetaLink下载"
      :visible.sync="outerVisible3"
    >
      <el-form
        label-position="right"
        label-width="150px"
        :model="this.metaJob"
      >
        <el-form-item label="MetaLink地址">
          <el-input
            type="textarea"
            v-model="metaJob.link"
          ></el-input>
        </el-form-item>
        <el-form-item label="下载路径">
          <el-input v-model="metaJob.dir">
            <template slot="append">
              <el-button
                type="primary"
                plain
                @click="metaJob.dir='C:/Users/Administrator/Desktop'"
              >
                <p-icon name="home" />
              </el-button>
              <el-button
                type="primary"
                plain
                @click="metaJob.dir=$store.state.globalOption.dir"
              >
                <p-icon name="cog" />
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="最大连接数">
          <el-input-number
            size="small"
            v-model="metaJob['max-connection-per-server']"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="最大线程数">

          <el-slider
            v-model="metaJob['split']"
            :max="this.metaJob['split']>16?btJob['split']:16"
            show-input
          >
          </el-slider>
        </el-form-item>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="addMetaLink"
          type="primary"
        >确定</el-button>
        <el-button @click="outerVisible3 = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import 'vue-awesome/icons/home'
import 'vue-awesome/icons/cog'
import { mapGetters, mapState } from 'vuex'
import store from "../../../store/modules/base/store.js"
import common from "../../../assets/util/common.js"
export default {
  store,
  data() {
    return {
      timeout:null,
      outerVisible: false,
      outerVisible2: false,
      outerVisible3: false,
      linkJob: {
        link: '',
        dir: '',
        'max-connection-per-server': 0,
        'split': 0,
        'ftp-type': '',
        'ftp-user': '',
        'ftp-passwd': ''
      },
      btJob: {
        btContent: null,
        dir: '',
        'max-connection-per-server': 0,
        'split': 0,
      },
      metaJob: {
        link: '',
        dir: '',
        'max-connection-per-server': 0,
        'split': 0,
      }
    }
  },

  mounted() {
    this.refreshData();
  },
  updated() {
    // console.log(this.$store)
  },
  beforeDestroy(){
     if(that.timeout!==null){
          clearTimeout(that.timeout);
        }
  },
  computed: mapState({
    toDos: state => state.toDownloads,
    globalOption: state => state.globalOption
  }),
  methods: {
    refreshData(){
      
      let that = this;
      (function update() {
        if(that.timeout!==null){
          clearTimeout(that.timeout);
        }
        if (that.$route.fullPath === "/download") {
          that.$store.dispatch("sendToWebSocket", { jsonrpc: "2.0", method: "aria2.tellActive", id: common.getReqId(common.reqType.sendTellActiveREQ) });
          that.timeout=setTimeout(() => {
            that.timeout=null;
            update();
          }, 3000);
        }
      })();
    },
    refreshOptions() {
      this.linkJob['dir'] = this.globalOption['dir'];
      this.linkJob['max-connection-per-server'] = Number(this.globalOption['max-connection-per-server']);
      this.linkJob['split'] = Number(this.globalOption['split']);
      this.linkJob['ftp-type'] = this.globalOption['ftp-type'];
      this.linkJob['ftp-user'] = this.globalOption['ftp-user'];
      this.linkJob['ftp-passwd'] = this.globalOption['ftp-passwd'];

      this.btJob['dir'] = this.globalOption['dir'];
      this.btJob['max-connection-per-server'] = Number(this.globalOption['max-connection-per-server']);
      this.btJob['split'] = Number(this.globalOption['split']);

      this.metaJob['dir'] = this.globalOption['dir'];
      this.metaJob['max-connection-per-server'] = Number(this.globalOption['max-connection-per-server']);
      this.metaJob['split'] = Number(this.globalOption['split']);
    },
    toggleModal() {
      this.refreshOptions()
      this.outerVisible = true;
    },
    toggleModal2() {
      this.refreshOptions()
      this.outerVisible2 = true;
    },
    toggleModal3() {
      this.refreshOptions()
      this.outerVisible3 = true;
    },
    addLink() {
      this.$store.dispatch("sendToWebSocket",
        {
          jsonrpc: "2.0",
          method: "aria2.addUri",
          id: common.getReqId(common.reqType.sendAddUriREQ),
          params: [
            [this.linkJob.link.replace(/[\s]/g,'')],
            this.linkJob
          ]
        }
      );
       this.outerVisible = false;
    },
    changeBTCode(e) {
      let that = this;
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = function (e) {
        that.btJob.btContent = this.result.replace("data:application/octet-stream;base64,", "");
      }
    },
    addBt(e) {
      this.$store.dispatch("sendToWebSocket",
        {
          jsonrpc: "2.0",
          method: "aria2.addTorrent",
          id: common.getReqId(common.reqType.sendAddBtREQ),
          params: [
            this.btJob.btContent,
            [],
            this.btJob
          ]
        }
      );
      this.outerVisible2 = false;
    },
    addMetaLink() {
      this.$store.dispatch("sendToWebSocket",
        {
          jsonrpc: "2.0",
          method: "aria2.addTorrent",
          id: common.getReqId(common.reqType.sendAddMetalinkREQ),
          params: [
            [this.metaJob.link],
            this.metaJob
          ]
        }
      );
      this.outerVisible3 = false;
    }
  }
}
</script>
<style>
#download-page .el-input-number span {
  height: 29px;
}
#download-page .el-input-number span i {
  line-height: 30px;
}
#download-page .el-breadcrumb {
  line-height: 3rem;
  background-color: #e9ecef;
}
</style>
