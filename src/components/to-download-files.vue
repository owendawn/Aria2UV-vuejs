<template>
  <div>
  <div style="display: flex;align-content: space-between;">
    <div style="flex:1">
      <el-tag>文件总数（{{this.$props.todo.files.length}}）</el-tag>
    </div>
    <el-button
      type="primary"
      size="mini"
      round
      @click="this.rechooseFile"
      v-if="['active','paused'].indexOf(this.data.status)!==-1"
    >上传<i class="el-icon-upload el-icon--right"></i></el-button>
  </div>
  <el-tree
    :data="this.getFileTree()"
    show-checkbox
    default-expand-all
    node-key="id"
    :render-content="this.drawTreeLine"
    ref="tree"
    highlight-current
    :props="defaultProps"
    :default-checked-keys="this.checks"
    @check-change="this.checkChange"
  >
  </el-tree>
  </div>
</template>
<script>
  import PanUtil from "../assets/util/PanUtil.js"
  import common from "../assets/util/common.js"
export default {
  data() {
    return {
      data:{},
      checks: [],
      defaultProps: {
        children: 'children',
        label(data, node) { return (data.name); }
      }
    };
  },
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  watch:{
    todo:function (value) {
      this.data=value;
    }
  },
  mounted(){
    if (this.$props.todo.bittorrent) {
      if (this.$props.todo.bitfield) {
        this.checks = this.$props.todo.files.filter(it => it.selected === 'true').map(it => it.index).concat();
      }
    }
  },
  methods: {
    checkChange(it, choose, pchoose) {
      this.checks = this.$refs.tree.getCheckedKeys();
    },
    drawTreeLine(h, { node, data, store }){
      return (<span title={data.name}>{
      (!node.isLeaf ?
        "♜ "
        : "✉ "
        + common.getSize(data.data.data.length) + " - "
        + (data.data.data.length === "0" ?
            "0" :
            (
              Math.round(
                Number(data.data.data.completedLength) * 10000
                / Number(data.data.data.length)
              ) / 100
              + "% | "
            )
        )
      ) + data.name
    }</span>);
    },
    getFiles2() {
      let diridx = 0;
      let map = {};
      let arr = [];
      const step = "&emsp;&emsp;&emsp;&emsp;";
      this.$props.todo.files.forEach(it => {
        var path = it.path.replace(this.$props.todo.dir.replace("\\", "/"), "");
        if (path[0] === "/") {
          path = path.substring(1);
        }
        let dirs = path.split("/");
        if (dirs.length === 1) {
          arr.push({ id: it.index, key: "0|" + dirs[0], name: dirs[0], pid: 0, data: it });
        } else {
          for (let i = 1; i < dirs.length; i++) {
            if (!map[(i - 1) + "|" + dirs[i - 1]]) {
              let id = "dir_" + diridx++;
              map[(i - 1) + "|" + dirs[i - 1]] = id;
              arr.push({ id: id, key: (i - 1) + "|" + dirs[i - 1], name: dirs[i - 1], pid: 0, data: it });
            }
            if (i === dirs.length - 1) {
              arr.push({ id: it.index, key: i + "|" + dirs[i], name: dirs[i], pid: map[(i - 1) + "|" + dirs[i - 1]], data: it });
            } else {
              if (!map[i + "|" + dirs[i]]) {
                let id = "dir_" + diridx++;
                map[i + "|" + dirs[i]] = id;
                arr.push({ id: id, key: i + "|" + dirs[i], name: dirs[i], pid: map[(i - 1) + "|" + dirs[i - 1]], data: it });
              }
            }
          }
        }
      });
      return arr;
    },
    getFileTree() {
      return [PanUtil.toTree(this.getFiles2(), 'id', 'pid', 'name')]
    },
    rechooseFile() {
      console.log(this.$refs.tree.getCheckedKeys());
      this.$store.dispatch("postToAjax", {
        jsonrpc: "2.0",
        method: "aria2.changeOption",
        id: common.getReqId(common.reqType.sendChangeOptionResultREQ),
        params: [
          this.$props.todo.gid,
          { "select-file": this.$refs.tree.getCheckedKeys().filter(it=>it.indexOf("dir_")<0).join(",") }
        ]
      });
      setTimeout(() => {
        if (this.checks.sort().toString() !== this.$props.todo.files.filter(it => it.selected === 'true').map(it => it.index).sort().toString()) {
          console.info("任务下载文件确认已变更")
          this.checks = this.$props.todo.files.filter(it => it.selected === 'true').map(it => it.index);
        }
      }, 3000);
    }
  }
}
</script>
<style>
</style>
