<template>
  <tr :class="{grayRow:trRowColor,unpaidStyle:statusText==='UNPAID',doneStyle:statusText==='DONE'}">
    <td class="table_check">
      <input type="checkbox" name="check" :id="'check'+data.orderId" :class="{checked:ischecked}">
      <label :for="'check'+data.orderId" @click="labelCheck"></label>
    </td>
    <td v-if="getCheckItem.orderID" class="order_id" v-text="data.orderId"></td>
    <td class="customer" v-if="getCheckItem.customer" v-text="data.customer.name"></td>
    <td class="product_list" v-if="getCheckItem.product">
      <ul>
        <li v-for="products in data.product" :key="products.id">
          <p>
            {{products.name}}
            <span v-text="products.price"></span>
          </p>
          <span v-text="products.quantity"></span>
        </li>
      </ul>
    </td>
    <td class="total" v-if="getCheckItem.total" v-text="data.total"></td>
    <td class="add_cart" v-if="getCheckItem.addToCart">
      {{data.addToCart.date}}
      <br>
      {{data.addToCart.time}}
    </td>
    <td class="check_out" v-if="getCheckItem.checkOut">
      {{data.checkOut.date}}
      <br>
      {{data.checkOut.time}}
    </td>
    <td
      class="address"
      v-if="getCheckItem.address"
    >{{data.customer.address.city+data.customer.address.zone+data.customer.address.streetAddress}}</td>
    <td class="phone" v-if="getCheckItem.phone" v-text="data.customer.phone"></td>
    <td class="email" v-if="getCheckItem.email" v-text="data.customer.email"></td>
    <td class="status" v-if="getCheckItem.status">
      <button
        class="status_Btn"
        :value="statusText"
        :class="btnColor"
        @click="statusBtnDisplayHandle"
      >
        {{data.status.toUpperCase()}}
        <span class="triangle_bottom"></span>
        <ul class="status_selection" v-show="statusBtnDisplay">
          <a href="javascript:;" class="paid" @click="statusBtnText('paid')">
            <li>Paid</li>
          </a>
          <a href="javascript:;" class="unpaid" @click="statusBtnText('unpaid')">
            <li>Unpaid</li>
          </a>
          <a href="javascript:;" class="shipping" @click="statusBtnText('shipping')">
            <li>Shipping</li>
          </a>
          <a href="javascript:;" class="done" @click="statusBtnText('done')">
            <li>Done</li>
          </a>
        </ul>
      </button>
    </td>
  </tr>
</template>
<script>
export default {
  name: 'orderList',
  props: [
    'getAllData',
    'getOrderData',
    'getCheck',
    'hasSelect',
    'hasCheckedAll'
  ],
  data() {
    return {
      getCheckItem: this.getCheck,
      allData: this.getAllData,
      ischecked: false,
      trRowColor: false,
      statusBtnDisplay: false,
      statusText: 'PAID'
    }
  },
  computed: {
    data() {
      return this.getOrderData
    },
    btnColor() {
      switch (this.statusText) {
        case 'PAID':
          return 'paidColor'
          break
        case 'UNPAID':
          return 'unpaidColor'
          break
        case 'SHIPPING':
          return 'shippingColor'
          break
        default:
          return 'doneColor'
          break
      }
    },
    checkedAll() {
      return this.hasCheckedAll
    },
    checkedSelection() {
      return this.hasSelect
    }
  },
  watch: {
    ischecked(status) {
      this.$emit('getCheckedData', this.data, status)
    },
    checkedSelection(val) {
      switch (val) {
        case 'select all':
          this.ischecked = true
          break
        case 'unselect all':
          this.ischecked = false
          break
        case 'paid':
          this.data.status === 'paid'
            ? (this.ischecked = true)
            : (this.ischecked = false)

          break
        case 'unpaid':
          this.data.status === 'unpaid'
            ? (this.ischecked = true)
            : (this.ischecked = false)
          break
        case 'shipping':
          this.data.status === 'shipping'
            ? (this.ischecked = true)
            : (this.ischecked = false)
          break
        case 'done':
          this.data.status === 'done'
            ? (this.ischecked = true)
            : (this.ischecked = false)
          break
        default:
          this.ischecked = false
          break
      }
    },
    data: {
      handler() {
        this.statusColor()
      },
      deep: true
    }
  },
  methods: {
    labelCheck() {
      this.ischecked = !this.ischecked
    },
    statusBtnDisplayHandle() {
      this.statusBtnDisplay = !this.statusBtnDisplay
    },
    statusBtnText(val) {
      switch (val) {
        case 'paid':
          this.statusText = 'PAID'
          this.data.status = 'PAID'
          break
        case 'unpaid':
          this.statusText = 'UNPAID'
          this.data.status = 'UNPAID'
          break
        case 'shipping':
          this.statusText = 'SHIPPING'
          this.data.status = 'SHIPPING'
          break
        case 'done':
          this.statusText = 'DONE'
          this.data.status = 'DONE'
          break
        default:
          break
      }
      this.changeStatus()
    },
    changeStatus() {
      this.$emit(
        'changeDataStatus',
        this.statusText.toLowerCase(),
        this.data.id
      )
    },
    statusColor() {
      switch (this.data.status) {
        case 'paid':
          this.statusText = 'PAID'
          break
        case 'unpaid':
          this.statusText = 'UNPAID'
          break
        case 'shipping':
          this.statusText = 'SHIPPING'
          break
        case 'done':
          this.statusText = 'DONE'
          break
        default:
          break
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      if ((this.allData.indexOf(this.data) + 1) % 2 === 0) {
        this.trRowColor = true
      }
      this.statusColor()
    })
  }
}
</script>
