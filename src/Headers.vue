<template>
  <header>
    <div class="logo">
      <h1>
        <router-link to="/backstage">Give Me Shhheep</router-link>
      </h1>
    </div>
    <nav>
      <ul>
        <li>
          <router-link :class="{'checked':getThisPath=='home'}" to="/backstage">Home</router-link>
        </li>
        <li>
          <router-link :class="{'checked':getThisPath =='orders'}" to="/backstage/orders">Orders</router-link>
        </li>
        <li>
          <router-link :class="{'checked':getThisPath =='product'}" to="/backstage/product">Product</router-link>
        </li>
      </ul>
    </nav>
    <div class="personal">
      <ul>
        <li>
          <router-link
            class="customer_name"
            to="/backstage"
            v-text="customerName"
            v-if="login"
          >ADMIN</router-link>
        </li>
        <li class="LogOut" v-if="!login">
          <router-link to="/backstage" key="signUp">Sign Up</router-link>
        </li>
        <li>
          <router-link v-if="!login" to="/backstage" key="login">Log in</router-link>
          <router-link v-else to="/backstage" key="register">Register</router-link>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
export default {
  name: 'headers',
  data() {
    return {
      getPath: '',
      customerName: 'ADMIN',
      login: true,
      personalDisplay: false
    }
  },
  computed: {
    getThisPath() {
      return (this.getPath = this.$route.name)
    }
  },
  methods: {
    personalDisplayStatus() {
      this.personalDisplay = !this.personalDisplay
    }
  },
  mounted() {}
}
</script>