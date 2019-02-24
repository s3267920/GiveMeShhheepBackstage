<style lang="scss" src="@/scss/layout.scss"></style>
<style lang="scss" src="@/scss/orders.scss"></style>
<template src="./orders.html"></template>

<script>
import orderList from './orderList'
import orderData from '../../assets/orders.json'
import changeStatusSelection from './changeStatusSelection'
import loadingPage from '../LoadingPage'
import pagination from './Pagination'
import axios from 'axios'
export default {
  name: 'orders',
  components: {
    orderList,
    loadingPage,
    pagination,
    changeStatusSelection
  },

  data() {
    return {
      orderListData: orderData.orders || [],
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
      this.selectIsShow = false
    },
    changeStatusHandle(newRes, id) {
      this.orderListData[id - 1].status = newRes
      axios
        .patch(`http://localhost:3000/orders/${id}`, { status: newRes })
        .then(res => {
          console.log('updated!!!')
        })
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
    changeOrdersStatus(val) {
      let vm = this
      vm.hasCheckedData.forEach(el => {
        if (el.status !== val) {
          axios
            .patch(`http://localhost:3000/orders/${el.id}`, { status: val })
            .then(res => {
              console.log('change!!!')
            })
        }
      })
    }
  },
  watch: {
    checkedAll: function() {
      //不使用watch監聽會在一開始獲取錯誤值
      this.checkedSelection(this.hascheckedAll)
    }
  },
  mounted() {
    this.$nextTick(function() {
      let vm = this
      if (!vm.orderListData.length) {
        vm.isLoading = true
        axios
          .get('http://localhost:3000/orders')
          .then(res => {
            vm.orderListData = res.data
            vm.isLoading = false
          })
          .catch(error => {
            console.log(error)
          })
      }
    })
  }
}
</script>


