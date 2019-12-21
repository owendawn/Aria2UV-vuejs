<template>
  <div>
    <el-form :model="tmp"  label-width="100px">
      <el-form-item label="下载地址">
        <el-input v-model="tmp.dir"></el-input>
      </el-form-item>
      <el-form-item label="最大线程数">
        <el-input v-model="tmp['max-connection-per-server']"></el-input>
      </el-form-item>
      <el-form-item label="最大重试数">
        <el-input v-model="tmp['max-tries']"></el-input>
      </el-form-item>
      <el-form-item label="User-Agent">
        <el-select v-model="ua" placeholder="请选择" style="width:100%">
          <el-option v-for="str in uaList"  :label="str" :value="str" :key="str"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Header">
        <el-input type="textarea" rows=6 v-model="tmp['header']" style="resize: none;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  // import PanUtil from "../assets/util/PanUtil.js"
  import common from "../assets/util/common.js"
  import store from "../store/modules/base/store.js"
export default {
    store,
  data() {
    return {
      ua:'',
      tmp:{
      },
      checks: [],
      optionflag:this.$store.state.optionflag,
      uaList:new Set([
        'Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0.1) Gecko/20100101 Firefox/4.0.1',
        'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11',
        'Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11',
        'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
        'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50\n',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',
      ])

    };
  },
  props: {
    guid: {
      type: Object,
      required: true
    },
    openGid: {
      type: Object,
      required: true
    }
  },
  watch:{
    '$store.state.optionflag'(a,b){
      const opt=this.$store.state.theOption[this.guid]||{}
      this.tmp={
        dir:opt.dir,
        'max-connection-per-server':opt['max-connection-per-server'],
        'max-tries':opt['max-tries'],
      }
      let tmps=[]
      if(opt.header){
        let arr=opt.header.split('\n')
        arr.forEach(it=>{
          if(it.toUpperCase().indexOf('USER-AGENT:')>=0){
            let uastr=it.replace('User-Agent:','').replace(/\r/g,'').trim()
            this.ua=uastr
            this.uaList.add(uastr);
          }else{
            tmps.push(it);
          }
        })
        this.tmp.header=tmps.join("\n");
      }
    }
  },
  mounted(){
    this.init()
  },
  methods: {
      init(){
        const option=this.$store.state.theOption[this.guid]||{}
        if(!option||Object.getOwnPropertyNames(option).length<=0){
          this.$store.dispatch(
            "postToAjax",
            {
              jsonrpc: "2.0",
              method: "aria2.getOption",
              id: common.getReqId(common.reqType.sendGetOptionREQ),
              params: [this.$props.guid]
            }
          )
        }
      },
      getValue(k){
        console.log(k,this.tmp[k]||this.data[k])
        return this.tmp[k]||this.data[k]
      },
    save(){
       let ps= Object.assign({},this.tmp,);
       if(this.ua){
         ps.header='User-Agent: '+this.ua+"\n"+ps.header
       }
      this.$store.dispatch(
        "postToAjax",
        {
          jsonrpc: "2.0",
          method: "aria2.changeOption",
          id: common.getReqId(common.reqType.sendChangeOptionREQ),
          params: [this.$props.guid,ps]
        }
      )
    }
  }
}
</script>
<style>
</style>
