<template>
  <div id="app">
    <div id="nav"></div>
    <router-view />
  </div>
</template>

<script>
export default {
  //数据区
  data() {
    return {}
  },
  //方法区
  methods: {
    async send() {
      let { data } = await this.$curl.get('/api/getList')
      console.log('res', data)
    },
  },
  //计算属性区
  computed: {},
  //父传子接收区
  props: [],
  //生命周期区
  created() {},
  mounted() {
    this.send()
  },
  //组件区
  components: {},
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
