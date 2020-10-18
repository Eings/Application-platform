<template>
  <div class="common-pc-login-layout login">
    <form class="common-pc-login-container" autocomplete="off">
      <div class="user">
        <img :src="userimg" @error="onError($event)" />
      </div>
      <div class="title">{{ title }}</div>
      <div class=" form__group " :class="{ isfocus: isUserNameoffset }">
        <span class="text">输入账号...</span>
        <auto-complete
          v-model.trim="form.username"
          :data="data1"
          :filter-method="filterMethod"
          element-id="user"
          @input="cheackName"
          @on-focus="onUserNameFocus"
          @on-blur="onUserNameBlur"
          @keyup.tab.native="onTab($event)"
          @keyup.enter.native="login()"
        ></auto-complete>
        <!-- <span class="username-bg icon-bg"></span> -->
        <Icon type="md-person" class="icon-bg" />
      </div>

      <div class=" form__group" :class="{ isfocus: isPwdoffset }">
        <span class="text">输入密码...</span>
        <Tooltip
          :always="true"
          :disabled="!dxxTip"
          theme="light"
          :content="'大写已开启'"
          placement="bottom-start"
          class="dxxTip"
        >
          <input
            id="psd"
            type="password"
            class="form-control"
            v-model.trim="form.password"
            @focus="onPwdFocus()"
            @blur="onPwdBlur()"
            @keydown="onPasswordKeydown($event)"
            @keypress="detectCapsLock"
            ref="pass"
          />
        </Tooltip>
        <!-- <input v-else id="psd" type="password" class="form-control" v-model.trim="form.password" @focus="onPwdFocus()" @blur="onPwdBlur()" @keydown="onPasswordKeydown($event)" @keypress="detectCapsLock" ref="pass"> -->
        <!-- <span class="psd-bg icon-bg"></span> -->
        <Icon type="md-lock" class="icon-bg" />
      </div>
      <div class=" form-check">
        <input type="checkbox" v-model="form.remember" id="remember" />
        <label class="form-check-label" for="remember">记住密码</label>
      </div>
      <div class="login-btn">
        <button
          v-if="islogining"
          ref="enter_btn"
          type="button"
          disabled
          class="btn btn-success btn-block"
        >
          登录中...
        </button>

        <button
          v-else
          ref="enter_btn"
          type="button"
          class="btn btn-success btn-block"
          @click="login"
        >
          登录
        </button>
      </div>
      <div class="" v-if="error">
        <div
          class="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          {{ error }}
        </div>
      </div>
    </form>
    <div class="company">@xx市xx有限公司技术支持</div>
  </div>
</template>

<script>
import userface from '../../assets/img/userface.jpg'
import bgLogin from '../../assets/img/bg-login-2x.png'

// import axios from 'axios'
// import { curl } from '@skyland/fxlogin'

// axios.defaults.headers['Content-Type'] = 'application/json'
// axios.defaults.xsrfCookieName = "csrfToken"
// axios.defaults.xsrfHeaderName = "x-csrf-token"
// axios.defaults.withCredentials = true
export default {
  name: 'app',
  data() {
    return {
      dxxTip: false,
      error: '',
      form: {
        username: '',
        password: '',
        remember: false,
      },
      userisfocus: false,
      psdisfocus: false,
      userid: '',
      userimg: '',
      // documents/default/userface.jpg
      cookie: '',
      data1: [], //下拉框的值
      islogining: false,
      title: '', // 标题
    }
  },
  computed: {
    isPwdoffset() {
      let flag = this.psdisfocus || this.form.password != ''
      return flag
    },
    isUserNameoffset() {
      let flag = this.userisfocus || this.form.username != ''
      return flag
    },
  },
  mounted() {
    this.getTitle()
    this.$nextTick(() => {
      this.loginUsers = this.getLoginedUsers()
      if (this.loginUsers.length == 0) {
        document.getElementById('user').focus()
      } else {
        let copyUserData = this.loginUsers.reverse()
        this.form.username = copyUserData[0].name
        this.userid = copyUserData[0].id
        this.data1 = this.loginUsers.map((p) => p.name)
      }
      if (this.form.username != '') {
        setTimeout(() => {
          this.$refs.pass.focus()
        }, 100)
      } else {
        setTimeout(() => {
          document.getElementById('user').focus()
        }, 100)
      }
      this.getImage(this.userid)
    })
  },
  methods: {
    // 获取主题
    getTitle() {
      this.$curl.get('api/public/title').then((res) => {
        const { data } = res
        if (data) {
          this.title = data
        }
      })
    },
    login() {
      if (!this.form.username || !this.form.password) {
        this.error = '用户名、密码不能为空'
        setTimeout(() => {
          this.$refs.pass.focus()
        }, 100)
        return
      }
      this.islogining = true
      this.error = null
      let _form = Object.assign({}, this.form)
      this.$curl
        .post('/api/public/login', _form)
        .then((res) => {
          const { data } = res
          if (!data.res.length) {
            this.error = res.msg
            this.islogining = false
          } else {
            let name = this.form.username
            let id = res.userid
            let currentIP = window.location.host
            let userArr =
              JSON.parse(localStorage.getItem(`'loginedUsers:${currentIP}'`)) ||
              []
            if (userArr.length) {
              let index = userArr.findIndex((p) => p.id === id)
              if (index !== -1) {
                userArr.splice(index, 1)
              }
            }
            userArr.push({ name: name, id: id })
            localStorage.setItem(
              `'loginedUsers:${currentIP}'`,
              JSON.stringify(userArr)
            )
            let params = {
              action: '/api/public/login',
              ipAddress: currentIP,
            }
            this.$curl
              .post('api/public/writeloginLog', { params })
              .then((res) => {})
            location.href = 'index.html'
          }
        })
        .catch((err) => {
          this.islogining = false
          this.error = err.response.data.msg || err.message
        })
    },
    getLoginedUsers() {
      let currentIP = window.location.host
      let co =
        JSON.parse(localStorage.getItem(`'loginedUsers:${currentIP}'`)) || []
      return co
    },
    onUserNameFocus() {
      this.userisfocus = true
    },
    onUserNameBlur() {
      this.userisfocus = false
    },
    onPwdFocus() {
      this.psdisfocus = true
    },
    onPwdBlur() {
      this.psdisfocus = false
    },
    // enter回车登录
    onPasswordKeydown(event) {
      let enter_btn = this.$refs.enter_btn
      if (event.keyCode == 13) {
        enter_btn.click() //调用登录按钮的登录事件
      }
    },
    onTab(event) {
      //pb修改
      if (this.userisfocus) {
        document.getElementById('user').click()
        let passinput = this.$refs.pass
        if (event.keyCode == 9) {
          setTimeout(() => {
            passinput.focus()
          }, 100)
        }
      }
    },
    onError(event) {
      event.target.src = userface
    },
    getImage(userid) {
      // this.userimg = userid ? `documents/user/${userid}/face.jpg` : 'documents/default/userface.jpg';
      if (userid) {
        this.userimg = `/api/public/core/personal/getuserface?userid=${userid}`
      } else {
        this.userimg = userface
      }
    },
    cheackName() {
      if (this.loginUsers) {
        let user = this.loginUsers.find((p) => p.name === this.form.username)
        this.getImage(user ? user.id : '')
      }
    },
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
    },
    detectCapsLock(event) {
      var e = event || window.event
      var o = e.target || e.srcElement
      var oTip = o.nextSibling
      var keyCode = e.keyCode || e.which // 按键的keyCode
      var isShift = e.shiftKey || keyCode == 16 || false // shift键是否按住
      if (
        (keyCode >= 65 && keyCode <= 90 && !isShift) || // Caps Lock 打开，且没有按住shift键
        (keyCode >= 97 && keyCode <= 122 && isShift) // Caps Lock 打开，且按住shift键
      ) {
        this.dxxTip = true
      } else {
        this.dxxTip = false
      }
    },
  },
}
</script>

<style>
* {
  touch-action: pan-y;
}

html {
  height: 100%;
}

body {
  background: url('../../assets/img/bg-login@2x.png') 0 / cover fixed;
  background-position: center;
  overflow-x: hidden;
}
.dxxTip {
  color: red !important;
}
.common-pc-login-layout {
  padding-top: 18vh;
  color: #fefefe;
  box-sizing: border-box;
}

.common-pc-login-container {
  width: 50%;
  max-width: 400px;
  margin: 0 auto;
  padding: 00px 26px 50px;
  border-radius: 6px;
  position: relative;
  /* background: hsla(0, 0%, 80%, .25) border-box; */
  background: rgba(255, 255, 255, 0.8) border-box;
  box-shadow: 0 0 38px rgba(56, 84, 127);
  transition: all 0.3s ease;
}

/* .common-pc-login-container.focus {
            background: hsla(0, 0%, 100%, .25) border-box;
        } */
.title {
  font-size: 22px;
  color: #213567;
  text-align: center;
  padding: 80px 0 40px;
}
.user {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -40%);
}

.user img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid #fff;
  margin-bottom: 20px;
}

.form__group input {
  background: transparent;
  border: none;
  color: #213567;
  height: 32px;
}

/* input样式被autocomplete冲掉解决 */
.form__group input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px #c7c6c6 inset !important;
  -webkit-text-fill-color: #213567 !important;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
  color: #213567;
}

.form__group input:not([type='checkbox']):focus {
  background: transparent;
  outline: none;
  box-shadow: none;
  /* color: #FEFEFE; */
}

.form__group {
  position: relative;
  margin-bottom: 40px;
}

.form__group .text {
  position: absolute;
  left: 0;
  top: 0;
  transition: all 0.3s ease;
  color: #213567;
  font-size: 14px;
  line-height: 32px;
}

.form__group.isfocus .text {
  top: -24px;
  font-size: 12px;
}

.form__group input {
  padding: 4px 28px 4px 0;
  width: 100%;
  position: relative;
}

.form__group::before {
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  background: rgba(2, 14, 53, 0.15);
  position: absolute;
  top: 100%;
  left: 0%;
}

.form__group::after {
  content: '';
  width: 0%;
  height: 1px;
  background: rgba(2, 14, 53, 0.15);
  position: absolute;
  top: 100%;
  left: 50%;
  transition: all 0.3s;
}

.form__group.isfocus:after {
  left: 0%;
  width: 100%;
  height: 2px;
  background: rgba(33, 53, 103, 1);
}

/* .icon-bg {
            display: block;
            width: 20px;
            height: 20px;
            position: absolute;
            right: 0;
            top: 4px;
        } */
.icon-bg {
  display: block;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0;
  top: 4px;
  color: #213567;
  font-size: 24px;
}
.username-bg {
  background: url('../../assets/img/username-2x.png') no-repeat center;
}

.psd-bg {
  background: url('../../assets/img/psd-2x.png') no-repeat center;
}

.form-check {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.form-check .form-check-label {
  color: #454444;
  font-size: 14px;
  margin-left: 12px;
}

.company {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 6%;
  left: 50%;
  transform: translateX(-50%);
  color: #eeeeee;
  padding: 0 30px;
}

.alert {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  color: #856404;
  background-color: #fff3cd;
  font-size: 1rem;
  text-align: center;
}

.btn {
  padding: 12px 0;
  width: 100%;
  background-color: #3686ff;
  font-size: 1rem;
  border: none;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #5395f9;
}

input[type='checkbox'] {
  -webkit-appearance: none;
  /*清除复选框默认样式*/
  background: #fff;
  /*复选框的背景图，就是上图*/
  height: 20px;
  vertical-align: middle;
  width: 20px;
  border-radius: 4px;
  margin-top: 0;
  outline: none;
  border: 1px solid #dddddd;
}

input[type='checkbox']:checked {
  background: url('../../assets/img/checked-2x.png') no-repeat center;
  background-color: #3686ff;
}

.login .ivu-auto-complete.ivu-select-dropdown {
  max-height: 150px;
  overflow-y: hidden;
  overflow-x: hidden;
}

.login .ivu-auto-complete.ivu-select-dropdown:hover {
  overflow-y: overlay;
}

.login .ivu-auto-complete.ivu-select-dropdown::-webkit-scrollbar {
  width: 4px;
}

.login .ivu-auto-complete.ivu-select-dropdown::-webkit-scrollbar-thumb {
  background-color: #d9d9d9;
  border-radius: 3px;
}

@media screen and (max-width: 768px) {
  .common-pc-login-layout {
    padding-top: 90px;
  }

  .common-pc-login-container {
    background: none;
    box-shadow: none;
    width: auto;
    max-width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 24vh 30px 0;
  }
  /* 毛玻璃 */
  .common-pc-login-container {
    z-index: 1;
    overflow: hidden;
    border-radius: 0;
    background-size: cover;
    background-position: center top;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .common-pc-login-container:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: -1;
    background-image: url(../../assets/img/bg-login@2x.png);
    background-position: center top;
    background-size: cover;
    background-attachment: fixed;
    filter: blur(2px);
    margin: -30px;
  }
  .form__group .text,
  .icon-bg,
  .form__group input,
  .form-check .form-check-label {
    color: #eeeeee;
  }
  .title {
    font-size: 20px;
    padding-top: 0;
    color: #ffffff;
    padding-bottom: 60px;
  }
  .form__group::before {
    background: #bbbbbb;
  }
  .form__group.isfocus:after {
    background: #dddddd;
  }

  .common-pc-login-container.focus {
    background: none;
  }

  .common-pc-login-container::before {
    margin: 0;
    filter: blur(6px);
  }

  .user {
    top: 6vh;
    left: 50%;
    text-align: center;
    transform: translateX(-50%);
  }

  .company {
    color: #eeeeee;
    font-size: 14px;
    bottom: 4vh;
    z-index: 1;
  }
}
@media screen and (max-height: 584px) {
  .company {
    display: none;
  }
}
@media screen and (max-height: 380px) {
  .common-pc-login-layout {
    padding-top: 0;
  }
  .user {
    display: none;
    height: none;
  }
}
</style>
