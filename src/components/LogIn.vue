<template>
  <div class="content_login">
    <div class="login">
      <div class="login_header">
        <h2>
          登入
          <span>Login</span>
        </h2>
      </div>
      <div class="input_group" :class="{isFocus:emailFocus}">
        <input
          type="email"
          name="user_email"
          id="user_email"
          :class="{error:email.error.length}"
          placeholder="example@gmail.com"
          v-model="email.email"
          @focus="emailFocus=true"
          @blur="emailBlurHandle"
          @keyup.enter.prevent.stop="submitToLogin()"
        >
        <font-awesome-icon class="login_icon" :icon="['far', 'envelope']" size="lg"/>
        <label for="user_email">
          email
          <span></span>
        </label>
        <div class="error_msg" v-if="email.error.length" v-text="email.error"></div>
      </div>
      <div class="input_group" :class="{isFocus:passwordFocus}">
        <input
          type="password"
          name="user_password"
          id="user_password"
          :class="{error:password.error.length}"
          placeholder="password"
          v-model="password.password"
          @focus="passwordFocus=true"
          @blur=" passwordBlurHandle"
          @keyup.enter.prevent.stop="submitToLogin()"
        >
        <font-awesome-icon class="login_icon" :icon="['fas', 'key']" size="lg"/>
        <label for="user_password">
          password
          <span></span>
        </label>
        <div class="error_msg" v-if="password.error.length" v-text="password.error"></div>
      </div>

      <div class="login_other">還沒有帳號？
        <router-link class="change_to_sign_up" to="signUp">註冊</router-link>
      </div>
      <button
        class="submit_btn"
        type="submit"
        value="submit"
        @focus="btnText='Login'"
        @blur="btnText='登入'"
        @submit.prevent.stop
        @click.prevent.stop="submitToLogin()"
      >
        {{btnText}}
        <span v-if="btnText==='Login'" :class="{checking:checking}">...</span>
      </button>
    </div>
  </div>
</template>
<style lang="scss" src="@/scss/layout.scss"></style>
<style lang="scss" src="@/scss/loginAndSignUp.scss"></style>
<script>
import db from '../firebaseInit.js';
import router from '../router.js';

export default {
  name: 'logIn',
  data() {
    return {
      email: {
        email: '',
        error: '',
      },
      password: {
        password: '',
        error: '',
      },
      emailFocus: false,
      passwordFocus: false,
      btnText: '登入',
      checking: false,
    };
  },
  computed: {},
  methods: {
    submitToLogin() {
      this.checking = true;
      if (this.checkForm()) {
        db.auth()
          .signInWithEmailAndPassword(this.email.email, this.password.password)
          .then(() => {
            router.go(-1);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
              alert('Wrong password.');
            } else {
              this.password.error = errorMessage;
            }
            console.log(error);
          });
      } else {
        this.checking = false;
        return false;
      }
    },

    checkForm() {
      !this.password.password.length
        ? (this.password.error = '請輸入密碼')
        : (this.password.error = '');

      if (!this.email.email.length) {
        this.email.error = '請輸入電子郵件';
      } else {
        !this.validEmail(this.email.email)
          ? (this.email.error = '請輸入正確的電子郵件格式')
          : (this.email.error = '');
      }
      if (!this.email.error.length && !this.password.error.length) {
        return true;
      }
      return false;
    },
    validEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    passwordBlurHandle() {
      this.password.password.length
        ? (this.passwordFocus = true)
        : (this.passwordFocus = false);
    },
    emailBlurHandle() {
      this.email.email.length
        ? (this.emailFocus = true)
        : (this.emailFocus = false);
    },
    passwordFocusHandle() {
      this.password.password.length
        ? (this.passwordFocus = true)
        : (this.passwordFocus = false);
    },
    emailFocusHandle() {
      this.email.email.length
        ? (this.emailFocus = true)
        : (this.emailFocus = false);
    },
  },
};
</script>
