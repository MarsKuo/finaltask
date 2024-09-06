<template>

  <!-- login_page -->
  <div id="loginPage" class="bg-yellow">
    <div class="conatiner loginPage vhContainer ">
      <div class="side">
        <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
        <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
      </div>
      <div>
        <form class="formControls" action="index.html" id="myForm">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <label class="formControls_label" for="email">Email</label>
          <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required v-model="emailLogin">
          <span>此欄位不可留空</span>
          <label class="formControls_label" for="pwd">密碼</label>
          <input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required v-model="pwdLogin">
          <input class="formControls_btnSubmit" type="button" @click="login" value="登入">
          <!-- <a class="formControls_btnLink" href="#signUpPage">註冊帳號</a> -->
          <RouterLink class="formControls_btnLink" to="/signup">註冊帳號</RouterLink>
        </form>
      </div>
    </div>
  </div>

</template>
<script setup>
const apiUrl = "https://todolist-api.hexschool.io";
import { ref } from 'vue';
import axios from 'axios';
import { RouterLink } from 'vue-router'; // 确保导入 RouterLink
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
// ref
const emailLogin = ref('')
const pwdLogin = ref('')
const token = ref('')
const messageLogin = ref('')
const router = useRouter()


const login = async () => {

  const form = document.getElementById('myForm');
  if (form.checkValidity()) {
    try {
      const response = await axios.post(`${apiUrl}/users/sign_in`, {
        email: emailLogin.value,
        password: pwdLogin.value,
      })
      token.value = response.data.token
      messageLogin.value = "登入成功，即將為您跳轉"

      Swal.fire({
        position: "center center",
        icon: "success",
        title: messageLogin.value,
        showConfirmButton: false,
        timer: 1500
      });

      //存cookie
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.cookie = `hexschoolTodo=${token.value}; expires=${tomorrow.toUTCString()}`;

      setTimeout(() => {
        router.push('/todolist');
      }, 1500);
    } catch (error) {
      messageLogin.value = error.response.data.message
      Swal.fire({
        icon: "error",
        title: messageLogin.value,
        text: "Something went wrong!",
        showConfirmButton: false,
        timer: 1500
      });
    }
  } else {
    form.reportValidity();
  }
}
</script>