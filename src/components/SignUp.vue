<template>
  <div class="content_signUp">
    <div class="sign_up">
      <div class="sign_up_header">
        <h2>
          註冊
          <span>signUp</span>
        </h2>
      </div>
      <div class="sign_up_form">
        <div class="input_group">
          <input
            type="text"
            name="userName"
            id="user_name"
            placeholder="Name"
            v-model="newUser.userName"
          >
          <label for="user_name">
            <font-awesome-icon class="sign_up_icon" :icon="['fas','user']"></font-awesome-icon>
          </label>
          <div class="error_msg sign_up_error" v-text="error.nameMsg"></div>
        </div>
        <div class="input_group birthday_select">
          <label for="birthday_year">
            <font-awesome-icon class="sign_up_icon" :icon="['fas','birthday-cake']"></font-awesome-icon>
          </label>
          <select
            name="year"
            id="birthday_year"
            v-model="newUser.userBirthday.year"
            class="triangle_down"
          >
            <option value disabled>年</option>
            <option :value="year" v-for="year in yearFilter" :key="year">{{year}} 年</option>
          </select>
          <select
            class="triangle_down"
            name="month"
            id="birthday_month"
            v-model="newUser.userBirthday.month"
          >
            <option value disabled>月</option>
            <option :value="month" v-for="month in 12" :key="month">{{month}} 月</option>
          </select>
          <select
            class="triangle_down"
            name="day"
            id="birthday_day"
            v-model="newUser.userBirthday.day"
          >
            <option value disabled>日</option>
            <option :value="day" v-for="day in dayFilter" :key="day">{{day}} 日</option>
          </select>
          <div class="error_msg sign_up_error" v-text="error.birthdayMsg"></div>
        </div>
        <div class="input_group">
          <input
            type="text"
            name="email"
            id="user_email"
            placeholder="Email"
            v-model="newUser.userEmail"
          >
          <label for="user_email">
            <font-awesome-icon class="sign_up_icon" :icon="['fas','envelope']"></font-awesome-icon>
          </label>
          <div class="error_msg sign_up_error" v-text="error.emailMsg"></div>
        </div>
        <div class="input_group">
          <input
            type="password"
            name="password"
            id="user_password"
            placeholder="Password"
            v-model="newUser.userPassword"
          >
          <label for="user_password">
            <font-awesome-icon class="sign_up_icon" :icon="['fas','key']"></font-awesome-icon>
          </label>
          <div class="error_msg sign_up_error" v-text="error.passwordMsg"></div>
        </div>
      </div>
      <div class="sign_up_other">已有帳號？
        <router-link class="change_to_login" to="login">登入</router-link>
      </div>
      <button
        type="submit"
        class="submit_btn"
        @submit.stop.prevent
        @focus="btnText='Sign Up'"
        @blur="btnText='註冊'"
        @click="signUpHandle"
      >
        {{btnText}}
        <span v-if="btnText==='Sign Up'" :class="{checking:checking}">...</span>
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
  name: 'signUp',
  data() {
    return {
      newUser: {
        userName: '',
        userEmail: '',
        userPassword: '',
        userBirthday: {
          year: '',
          month: '',
          day: '',
        },
      },
      btnText: '註冊',
      checking: false,
      error: {
        nameMsg: '',
        birthdayMsg: '',
        emailMsg: '',
        passwordMsg: '',
      },
    };
  },
  computed: {
    yearFilter() {
      const year = [];
      const endYear = 1905;
      const firstYear = new Date().getFullYear();
      for (let i = firstYear; i >= endYear; i--) {
        year.push(i);
      }
      return year;
    },
    dayFilter() {
      const year = this.newUser.userBirthday.year;
      if (
        (year % 4 === 0 && year % 100 != 0)
        || (year % 400 === 0 && year % 3200 !== 0)
      ) {
        switch (this.newUser.userBirthday.month) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12:
            return 31;
            break;
          case 4:
          case 6:
          case 9:
          case 11:
            return 30;
            break;
          case 2:
            return 29;
            break;
          default:
            return '';
            break;
        }
      } else {
        switch (this.newUser.userBirthday.month) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12:
            return 31;
            break;
          case 4:
          case 6:
          case 9:
          case 11:
            return 30;
            break;
          case 2:
            return 28;
            break;
          default:
            return '';
            break;
        }
      }
    },
  },
  methods: {
    signUpHandle() {
      this.checking = true;
      const user = this.newUser;
      const error = this.error;
      if (
        user.userName !== ''
        && user.userEmail !== ''
        && user.userPassword !== ''
        && user.userPassword.length >= 8
        && user.userBirthday.year !== ''
        && user.userBirthday.month !== ''
        && user.userBirthday.day !== ''
      ) {
        if (!this.validEmail(user.userEmail)) {
          this.error.emailMsg = '請輸入正確的電子郵件格式';
        } else {
          db.auth()
            .createUserWithEmailAndPassword(user.userEmail, user.userPassword)
            .then((users) => {
              const id = users.user.uid;
              db.firestore()
                .collection('user')
                .doc(id)
                .set({
                  userID: id,
                  email: user.userEmail,
                  userName: user.userName,
                  userBirthday: `${user.userBirthday.year}-${
                    user.userBirthday.month
                  }-${user.userBirthday.day}`,
                })
                .then(() => {
                  alert('註冊成功');
                  router.push({
                    path: '/backstage',
                    name: 'home',
                  });
                })
                .catch((error) => {
                  console.error('Error writing document: ', error);
                });
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMsg = error.message;
              switch (errorCode) {
                case 'auth/weak-password':
                  this.error.passwordMsg = '密碼強度太弱';
                  break;
                case 'auth/email-already-in-use':
                  this.error.emailMsg = '這個電子郵件已經使用過';
                  break;
                case 'auth/invalid-email':
                  this.error.emailMsg = '電子郵件無效';
                  break;
                default:
                  break;
              }
            });
        }
      } else {
        user.userName === ''
          ? (error.nameMsg = '請填入稱呼')
          : (error.nameMsg = '');

        user.userBirthday.year === ''
        || user.userBirthday.month === ''
        || user.userBirthday.day === ''
          ? (error.birthdayMsg = '請選擇生日')
          : (error.birthdayMsg = '');

        user.userEmail === ''
          ? (error.emailMsg = '請輸入電子郵件')
          : !this.validEmail(user.userEmail)
            ? (this.error.emailMsg = '請輸入正確的電子郵件格式')
            : (error.emailMsg = '');

        user.userPassword === '' || user.userPassword.length <= 8
          ? (error.passwordMsg = '請輸入至少8碼的英數密碼')
          : (error.passwordMsg = '');
      }
    },
    validEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
  },
};
</script>
