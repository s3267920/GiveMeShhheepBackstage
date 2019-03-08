<template>
  <ul v-if="orderData">
    <li v-for="i in 3" :key="orderData[i-1].name">
      <!-- <span class="order_img" :style="{backgroundImage:`url(${orderData[i-1].img})`}"></span> -->
      <span class="order_img">
        <img :src="`${orderData[i-1].img}`" alt>
      </span>
      <div class="orders_content">
        <p class="order_name">{{orderData[i-1].productName}}</p>
        <div class="time">
          <img src="@/assets/img/clock.svg" alt>
          <span class="order_date" v-text="getDate()"></span>
          <span class="order_time" v-text="getTime()"></span>
        </div>
        <span class="customer_name">
          <img src="@/assets/img/icon_person.svg" alt>
          {{orderData[i-1].name}}
        </span>
      </div>
      <div class="price">
        <p>Total</p>
        <span>{{orderData[i-1].price}}</span>
      </div>
    </li>
  </ul>
</template>

<script>
const axios = require('axios')
const moment = require('moment')

export default {
  data() {
    return {
      orderData: ''
    }
  },
  methods: {
    getDate: () => {
      moment.locale('zh-tw')
      return moment().format('L')
    },
    getTime: () => {
      moment.locale('zh-tw')
      return moment().format('LT')
    }
  },
  mounted() {
    axios
      .get('https://give-me-shheep-data.herokuapp.com/customers')
      .then(res => {
        const data = res.data
        this.orderData = data
      })
      .catch(error => console.log(error))
  }
}
</script>
