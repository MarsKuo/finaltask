<template>
  <!-- sign up -->
  <div id="signUpPage" class="bg-yellow">
    <div class="conatiner signUpPage vhContainer">
      <div class="side">
        <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
        <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
      </div>
      <div>
        <form class="formControls" action="index.html" id="myForm">
          <h2 class="formControls_txt">註冊帳號</h2>
          <label class="formControls_label" for="email">Email</label>
          <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required v-model="emailSignup">
          <label class="formControls_label" for="name">您的暱稱</label>
          <input class="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱" v-model="nameSignup">

          <label class="formControls_label" for="pwd">密碼</label>
          <input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required v-model="pwdSignup">
          <label class="formControls_label" for="pwd">再次輸入密碼</label>
          <input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請再次輸入密碼" required v-model="pwdConfirmSignup">
          <input class="formControls_btnSubmit" type="button" @click="signup" value="註冊帳號">

          <RouterLink class="formControls_btnLink" to="/login">登入</RouterLink>


        </form>
      </div>
    </div>

  </div>
</template>
<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router'; // 确保导入 RouterLink
import axios from 'axios';
import Swal from 'sweetalert2'
// ref
const emailSignup = ref('')
const nameSignup = ref('')
const pwdSignup = ref('')
const pwdConfirmSignup = ref('')
const messageSignup = ref("");
const router = useRouter()

const apiUrl = "https://todolist-api.hexschool.io";
//註冊

const signup = async () => {
  const form = document.getElementById('myForm');
  if (form.checkValidity()) {
    if (pwdSignup.value === pwdConfirmSignup.value) {
      try {
        const response = await axios.post(`${apiUrl}/users/sign_up`, {
          email: emailSignup.value,
          nickname: nameSignup.value,
          password: pwdSignup.value,

        })
        messageSignup.value = `註冊成功，請重新登入`;

        Swal.fire({
          position: "center center",
          icon: "success",
          title: messageSignup.value,
          showConfirmButton: false,
          timer: 1500
        });

        setTimeout(() => {
          router.push('/login');
        }, 1500);


      } catch (error) {
        console.log(error);
        messageSignup.value = `註冊失敗:${error.response.data.message}`

        Swal.fire({
          icon: "error",
          title: messageSignup.value,
          text: "Something went wrong!",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } else {
      messageSignup.value = "密碼不一致，請再次確認密碼";
      Swal.fire({
        icon: "error",
        title: messageSignup.value,
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