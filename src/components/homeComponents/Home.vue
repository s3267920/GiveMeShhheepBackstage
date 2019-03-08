<template src="./index.html"></template>
<style lang="scss" src="@/scss/layout.scss"></style>
<style lang="scss" src="@/scss/index.scss"></style>
<script>
import Echart from './Echart.vue'
import LastOrders from './LastOrders'
import LoadingPage from '../extendComponents/LoadingPage'
export default {
  name: 'home',
  components: { Echart, LastOrders, LoadingPage },
  data() {
    return {
      eChartData: {
        revenue: [7100, 8800, 5580, 3300, 3600, 7700, 3300, 2500],
        cost: [1000, 4500, 3600, 2500, 580, 3300, 2500, 1000]
      },
      selectMenuDisplay: false,
      isLoading: false
    }
  },
  computed: {
    incomeTotal() {
      const revenueTotal = this.getSum(this.eChartData.revenue)
      const costTotal = this.getSum(this.eChartData.cost)
      return revenueTotal - costTotal
    }
  },
  methods: {
    loadingStatus(status) {
      this.isLoading = status
    },
    slideDownHandle() {
      this.selectMenuDisplay = !this.selectMenuDisplay
    },
    getSum(arr) {
      let total = 0
      arr.forEach(num => {
        total += num
      })
      return total
    }
  },
  mounted() {
    const vm = this
    this.$nextTick(() => {
      document.addEventListener('click', e => {
        const changeOption = document.getElementsByClassName('change_option')
        const selectMenu = document.getElementById('select_menu')
        if (e.target && e.target.className !== 'change_option') {
          vm.selectMenuDisplay = false
        }
      })
    })
  }
}
</script>
