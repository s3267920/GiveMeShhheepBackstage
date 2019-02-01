<template>
  <div id="myChart" ref="myChart" style=" width: 100%; height:400px"></div>
</template>

<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/component/dataset');
require('echarts/lib/chart/line');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/markPoint');
require('echarts/lib/component/markLine');
require('echarts/lib/component/legend');

export default {
  name: 'mychart',
  props: ['getData'],
  data() {
    return {
      chart: '',
      echartData: this.getData,
    };
  },
  computed: {
    income() {
      const income = [];
      const revenue = this.echartData.revenue;
      const cost = this.echartData.cost;
      for (let i = 0; i < revenue.length; i++) {
        income.push(revenue[i] - cost[i]);
      }
      return income;
    },
  },
  mounted() {
    const revenue = this.echartData.revenue;
    const cost = this.echartData.cost;
    const income = this.income;
    // console.log()
    const mychart = echarts.init(this.$refs.myChart);
    const options = {
      baseOption: {
        tooltip: {
          show: true,
          trigger: 'item',
        },
        legend: {
          data: [
            {
              name: 'TOTAL REVENUE',
              icon: 'circle',
            },
            {
              name: 'TOTAL COST',
              icon: 'circle',
            },
            {
              name: 'NET INCOME',
              icon: 'circle',
            },
          ],
          itemWidth: 10,
        },
        textStyle: {
          color: '#8da291',
          fontWeight: 'bold',
          fontSize: 16,
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '6 JUN',
              '7 JUN',
              '8 JUN',
              '9 JUN',
              '10 JUN',
              '11 JUN',
              '12 JUN',
              '13 JUN',
            ],
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#8da291',
              fontWeight: 'bold',
              fontSize: 16,
              interval: 0,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            boundaryGap: false,
            min: 0,

            axisLabel: {
              color: '#8da291',
              fontWeight: 'bold',
              fontSize: 16,
              interval: 0,
            },
          },
        ],
        series: [
          {
            name: 'TOTAL REVENUE',
            type: 'line',
            color: '#7ed321',
            data: revenue,
            tooltip: {
              backgroundColor: '#7ed321',
              formatter: '{a}<br />{b} : {c}',
            },
            itemStyle: {
              opacity: 0,
            },
            emphasis: {
              itemStyle: {
                borderColor: '#7ed321',
                borderWidth: 4,
                opacity: 1,
              },
              label: {
                show: true,
                formatter: '{c}',
                color: '#7ed321',
              },
            },
          },
          {
            name: 'TOTAL COST',
            type: 'line',
            color: '#d0021b',
            data: cost,
            tooltip: {
              backgroundColor: '#d0021b',
              formatter: '{a}<br />{b} : {c}',
            },
            itemStyle: {
              opacity: 0,
            },
            emphasis: {
              itemStyle: {
                borderColor: '#d0021b',
                borderWidth: 4,
                opacity: 1,
              },
              label: {
                show: true,
                formatter: '{c}',
                color: '#d0021b',
              },
            },
          },
          {
            name: 'NET INCOME',
            type: 'line',
            color: '#4a90e2',
            data: income,
            tooltip: {
              backgroundColor: '#4a90e2',
              formatter: '{a}<br />{b} : {c}',
            },
            itemStyle: {
              opacity: 0,
            },
            markLine: {
              emphasis: {
                lineStyle: {
                  width: 50,
                  color: '#fff',
                },
              },
            },
            lineStyle: {
              emphasis: {
                width: 50,
                color: '#fff',
              },
            },
            emphasis: {
              itemStyle: {
                borderColor: '#4a90e2',
                borderWidth: 4,
                opacity: 1,
              },
              label: {
                show: true,
                formatter: '{c}',
                color: '#4a90e2',
              },
              lineStyle: {
                width: 10,
              },
            },
          },
        ],
      },
      media: [
        {
          query: {
            maxWidth: 1000,
          },
          option: {
            length: {
              orient: 'horizontal',
            },
          },
        },
      ],
    };
    mychart.setOption(options);
  },
  methods: {},
};
</script>
