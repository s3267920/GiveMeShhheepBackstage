<template>
  <div class="content_login">
    <div class="login">
      <div class="login_header">
        <h2>
          登入
          <span>Login</span>
        </h2>
      </div>
      <div class="user_email" :class="{isFocus:emailFocus}">
        <input
          type="email"
          name="user_email"
          id="user_email"
          :class="{error:email.error.length}"
          placeholder="example@gmail.com"
          v-model="email.email"
          @focus="emailFocus=true"
          @blur="emailBlurHandle"
        >
        <font-awesome-icon class="login_icon" :icon="['far', 'envelope']" size="lg"/>
        <label for="user_email">email</label>
        <div class="login_error" v-if="email.error.length" v-text="email.error"></div>
      </div>
      <div class="user_password" :class="{isFocus:passwordFocus}">
        <input
          type="password"
          name="user_password"
          id="user_password"
          :class="{error:password.error.length}"
          placeholder="password"
          v-model="password.password"
          @focus="passwordFocus=true"
          @blur=" passwordBlurHandle"
        >
        <font-awesome-icon class="login_icon password_icon" :icon="['fas', 'key']" size="lg"/>
        <label for="user_password">password</label>
        <div class="login_error" v-if="password.error.length" v-text="password.error"></div>
      </div>

      <div class="login_other">
        <a class="forget_password">忘記密碼？</a>
        <router-link class="change_to_sign_up" to="signUp">註冊</router-link>
      </div>
      <button
        class="submit_btn"
        type="submit"
        value="submit"
        @focus="btnText='Login'"
        @blur="btnText='登入'"
        @submit.prevent.stop
        @click="checkForm()"
      >
        {{btnText}}
        <span v-if="btnText==='Login'">...</span>
      </button>
    </div>
  </div>
</template>
<style lang="scss" src="@/scss/layout.scss"></style>
<style lang="scss" src="@/scss/login.scss"></style>
<script>
export default {
  name: 'logIn',
  data() {
    return {
      email: {
        email: '',
        error: ''
      },
      password: {
        password: '',
        error: ''
      },
      emailFocus: false,
      passwordFocus: false,
      btnText: '登入'
    }
  },
  computed: {},
  methods: {
    checkForm() {
      !this.password.password.length
        ? (this.password.error = '請輸入密碼')
        : (this.password.error = '')

      if (!this.email.email.length) {
        this.email.error = '請輸入電子郵件'
      } else {
        !this.validEmail(this.email.email)
          ? (this.email.error = '請輸入正確的電子郵件格式')
          : (this.email.error = '')
      }
    },
    validEmail(email) {
      let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    passwordBlurHandle() {
      this.password.password.length
        ? (this.passwordFocus = true)
        : (this.passwordFocus = false)
    },
    emailBlurHandle() {
      this.email.email.length
        ? (this.emailFocus = true)
        : (this.emailFocus = false)
    },
    passwordFocusHandle() {
      this.password.password.length
        ? (this.passwordFocus = true)
        : (this.passwordFocus = false)
    },
    emailFocusHandle() {
      this.email.email.length
        ? (this.emailFocus = true)
        : (this.emailFocus = false)
    }
  }
}
</script>