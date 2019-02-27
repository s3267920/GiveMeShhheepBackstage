<style lang="scss" src="@/scss/layout.scss"></style>
<style lang="scss" src="@/scss/orders.scss"></style>
<template src="./orders.html"></template>

<script>
import orderList from './orderList'
import changeStatusSelection from './changeStatusSelection'
import loadingPage from '../LoadingPage'
import pagination from '../Pagination'
import axios from 'axios'
export default {
  name: 'orders',
  components: {
    orderList,
    loadingPage,
    changeStatusSelection,
    pagination
  },

  data() {
    return {
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
      }
    }
  },
  computed: {
    hascheckedAll() {
      if (this.checkedAll === false) {
        this.hasSelect = 'Unselect All'
        return 'Unselect All'
      } else {
        this.hasSelect = 'Select All'
        return 'Select All'
      }
    },
    orderListData() {
      if (!this.filterData.length) {
        return this.filterDataHandle(1, 5)
      } else {
        this.hasCheckedData = []
        this.hasSelect = ''
        this.selectIsShow = false
        return this.filterData
      }
    }
  },
  methods: {
    selectDisplay() {
      this.selectIsShow = !this.selectIsShow
    },
    slideDownHandle() {
      this.editIsShow = !this.editIsShow
    },
    checkedSelection(value) {
      switch (value) {
        case 'Select All':
          this.checkedAll = true
          this.hasSelect = value
          break
        case 'Unselect All':
          this.checkedAll = false
          this.hasSelect = value
          break
        case 'Paid':
        case 'Unpaid':
        case 'Shipping':
        case 'done':
          this.checkedAll = false
          this.hasSelect = value
          break
        default:
          // this.hasSelect = value
          break
      }
    },
    changeOrderListStatus(newRes, id) {
      axios
        .patch(`http://localhost:3000/orders/${id}`, { status: newRes })
        .then(res => {
          this.orderData[id - 1].status = newRes
          this.isLoading = false
        })
      console.log('changeOrderListStatus')
    },
    getCheckedDataArray(data, status) {
      let vm = this
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
            .patch(`http://localhost:3000/orders/${el.id}`, { status: val })
            .then(res => {
              this.orderData[el.id - 1].status = val
              this.isLoading = false
            })
        }
      })
      console.log('changeHasCheckedDataStatus')
    },
    filterDataHandle(page, limitNum) {
      let newData = [],
        totalData = 5
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
  watch: {
    checkedAll: function() {
      this.selectIsShow = false
      //不使用watch監聽會在一開始獲取錯誤值
      this.checkedSelection(this.hascheckedAll)
    }
  },
  mounted() {
    this.isLoading = true
    this.$nextTick(function() {
      if (!this.orderData.length) {
        axios
          .get('http://localhost:3000/orders')
          .then(res => {
            this.orderData = res.data
            this.isLoading = false
          })
          .catch(error => {
            console.log(error)
          })
      }
    })
  }
}
</script>


