<template>

  <el-collapse accordion>
    <p-to-download v-for="todo in todos" :todo="todo" :key="todo.gid"></p-to-download>
  </el-collapse>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: true
    };
  },
  props: {
    todos: {
      type: Array,
      required: true
    }
  },
  mounted(){
    // console.log(this)
  },
  updated(){
    // console.log(this)
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
   
  }
}
</script>
<style>
</style>