<template>

  <div style="width: 900px;height: 150px;" ref="chart"></div>
</template>
<script>
  import 'echarts/lib/chart/line'
  import ECharts from 'echarts'
  export default {
    props: {
      ups: {
        type: Array,
        required: true
      },
      downs: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        myChart:null,
        up:[],
        down:[],
        chartOption: {
          title: {
            text: '速率统计',
            show:false
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            show:false,
            data: ['上传速率', '下载速率']
          },
          grid: {
            left: '3%',
            right: '25',
            bottom: '0',
            top: '10',
            containLabel: true
          },
          xAxis: {
            type: 'time',
            boundaryGap: false,
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '上传速率',
              type: 'line',
              stack: '速率',
              data: this.$props.ups,
              symbolSize: 3,
              lineStyle:{
                color:'#ff4f26'
              },
              areaStyle: {
                normal: {
                  color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#eb8f6c'
                  }, {
                    offset: 1,
                    color: '#ffe'
                  }])
                }
              },
            },
            {
              name: '下载速率',
              type: 'line',
              stack: '速率',
              data: this.$props.downs,
              symbolSize: 3,
              lineStyle:{
                color:'#03a562'
              },
              areaStyle: {
                normal: {
                  color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#8ec6ad'
                  }, {
                    offset: 1,
                    color: '#ffe'
                  }])
                }
              },
            }
          ]
        }
      }
    },
    mounted() {
      this.myChart = ECharts.init(this.$refs.chart);
      this.myChart.setOption(this.chartOption);
    },
    watch:{
      ups(news,olds){
        this.up=news;
      },
      downs(news,olds){
        this.down=news;
        this.myChart.setOption(this.chartOption);
      }
    },
    methods: {}
  }
</script>
<style>
</style>
