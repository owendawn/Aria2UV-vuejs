<template>

  <el-collapse accordion @change="this.change" v-model="gids">
    <p-to-download v-for="todo in todos" :todo="todo" :key="todo.gid" :openGid="openGid"></p-to-download>
  </el-collapse>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: true,
      openGid:null,
    };
  },
  props: {
    todos: {
      type: Array,
      required: true
    }
  },
  mounted(){
    // console.log(this.$props.todos)
  },
  updated(){
    // console.log(this)
  },
  methods: {
    change(v){
      this.openGid=v;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
   
  }
}
</script>
<style>
</style>
