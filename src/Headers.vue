<template>
  <header>
    <div class="logo">
      <h1>
        <router-link to="/backstage">Give Me Shhheep</router-link>
      </h1>
    </div>
    <nav>
      <ul v-if="login">
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
        <li class="signOut" v-if="login" @click="signOut">
          <a>Sign Out</a>
        </li>
        <li class="login">
          <router-link v-if="!login&&getPath!=='login'" to="login" key="login">Log in</router-link>
          <router-link v-if="!login&&getPath!=='signUp'" to="signUp" key="signUp">Sign Up</router-link>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import db from './firebaseInit.js'
import router from './router.js'

export default {
  name: 'headers',
  data() {
    return {
      getPath: '',
      customerName: '',
      login: false,
      personalDisplay: false
    }
  },
  computed: {
    getThisPath() {
      return (this.getPath = this.$route.name)
    }
  },
  watch: {
    $route() {
      if (db.auth().currentUser !== null) {
        this.login = true
      } else {
        this.login = false
      }
    }
  },
  methods: {
    personalDisplayStatus() {
      this.personalDisplay = !this.personalDisplay
    },
    signOut() {
      const vm = this
      db.auth()
        .signOut()
        .then(() => {
          vm.login = false
          alert('登出成功')
          router.push({
            path: '/login',
            name: 'login'
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted() {
    db.auth().onAuthStateChanged(user => {
      if (user) {
        const id = user.uid
        this.login = true
        db.firestore()
          .collection('user')
          .doc(id)
          .get()
          .then(doc => {
            this.customerName = doc.data().userName
          })
          .catch(error => {
            console.warn(error)
          })
      } else {
        this.login = false
      }
    })
  }
}
</script>
