<style lang="scss" src="@/scss/layout.scss"></style>
<style lang="scss" src="@/scss/orders.scss"></style>
<template src="./orders.html"></template>

<script>
import axios from 'axios'
import orderList from './orderList'
import ChangeStatusSelection from '../extendComponents/ChangeStatusSelection'
import loadingPage from '../extendComponents/LoadingPage'
import pagination from '../extendComponents/Pagination'
import Footers from '../extendComponents/Footers'
export default {
  name: 'orders',
  components: {
    orderList,
    loadingPage,
    ChangeStatusSelection,
    pagination,
    Footers
  },

  data() {
    return {
      allSelectionOption: ['paid', 'unpaid', 'shipping', 'done'],
      orderData: [],
      filterData: [],
      hasCheckedData: [],
      selectIsShow: false,
      editIsShow: false,
      isLoading: false,
      hasSelect: '',
      checkedAll: false,
      getCheck: {
        orderID: false,
        customer: true,
        product: true,
        total: true,
        addToCart: true,
        checkOut: true,
        address: true,
        phone: false,
        email: false,
        status: true
      },
      ordersPageStatusList: []
    }
  },
  computed: {
    hasCheckedAll() {
      if (this.checkedAll === true) {
        this.hasSelect = 'select all'
        return 'select all'
      }
      if (this.hasSelect !== 'select all') {
        this.hasSelect = this.hasSelect
        return this.hasSelect
      }
      this.hasSelect = 'unselect all'
      return 'unselect all'
    },
    orderListData() {
      if (!this.filterData.length) {
        return this.filterDataHandle(1, 5)
      }
      this.hasCheckedData = []
      this.hasSelect = ''
      this.selectIsShow = false
      return this.filterData
    }
  },
  watch: {
    checkedAll() {
      this.selectIsShow = false
      // 不使用watch監聽會在一開始獲取錯誤值
      this.checkedSelection(this.hasCheckedAll)
    }
  },
  methods: {
    slideDownHandle() {
      this.editIsShow = !this.editIsShow
    },
    checkedSelection(value) {
      switch (value) {
        case 'select all':
          this.checkedAll = true
          this.hasSelect = value
          break
        case 'unselect all':
          this.checkedAll = false
          this.hasSelect = value
          break
        case 'paid':
        case 'unpaid':
        case 'shipping':
        case 'done':
          this.checkedAll = false
          this.hasSelect = value
          break
        default:
          break
      }
    },
    changeOrderListStatus(newRes, id) {
      axios
        .patch(`https://give-me-shheep-data.herokuapp.com/orders/${id}`, {
          status: newRes
        })
        .then(res => {
          this.orderData[id - 1].status = newRes
          this.isLoading = false
        })
    },
    getCheckedDataArray(data, status) {
      const vm = this
      if (status) {
        vm.hasCheckedData.push(data)
      } else {
        let newIndex = ''
        vm.hasCheckedData.forEach((el, index) => {
          if (el.id === data.id) {
            newIndex = index
          }
        })
        vm.hasCheckedData.splice(newIndex, 1)
      }
    },
    changeHasCheckedDataStatus(val) {
      this.hasCheckedData.forEach(el => {
        if (el.status !== val) {
          axios
            .patch(
              `https://give-me-shheep-data.herokuapp.com/orders/${el.id}`,
              {
                status: val
              }
            )
            .then(res => {
              this.orderData[el.id - 1].status = val
              this.isLoading = false
            })
        }
      })
    },
    filterDataHandle(page, limitNum) {
      const newData = []

      let totalData = 5
      page * limitNum > this.orderData.length
        ? (totalData = this.orderData.length)
        : (totalData = page * limitNum)
      for (let i = (page - 1) * limitNum; i < totalData; i++) {
        newData.push(this.orderData[i])
      }
      this.filterData = newData
      return newData
    }
  },
  mounted() {
    this.isLoading = true
    this.$nextTick(function() {
      if (!this.orderData.length) {
        axios
          .get('https://give-me-shheep-data.herokuapp.com/orders')
          .then(res => {
            this.orderData = res.data
            this.isLoading = false
          })
          .catch(error => {
            console.log(error)
          })
      }
      const vm = this
      document.addEventListener('click', e => {
        if (e.target && e.target.id !== 'check_more_option') {
          vm.selectIsShow = false
        }
      })
    })
  }
}
</script>
