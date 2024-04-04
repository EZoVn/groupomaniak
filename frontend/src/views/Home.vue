<template>
  <h1>HomePage</h1>
  <form class="container m-auto bg-slate-800">
    <p v-if="!signupOrLogin" class="text-white">
      Tu n'as pas encore de compte ?
      <span @click="switchLogin()" class="cursor-pointer text-blue-600"
        >Créer un compte</span
      >
    </p>
    <p v-else class="text-white">
      Tu as déjà un compte ?
      <span @click="switchLogin()" class="cursor-pointer text-blue-600"
        >Clique ici</span
      >
    </p>
    <div
      v-if="!signupOrLogin"
      class="flex flex-col items-center justify-center border"
    >
      <h2>Login</h2>
      <input v-model="user.username" type="text" placeholder="Pseudo" />
      <input v-model="user.email" type="email" placeholder="Email" />
      <input v-model="user.password" type="password" placeholder="Password" />
      <button @click="login()">Connexion</button>
    </div>
    <div v-else class="flex flex-col items-center justify-center border">
      <h2>SignUp</h2>
      <input v-model="user.username" type="text" placeholder="Pseudo" />
      <input v-model="user.email" type="email" placeholder="Email" />
      <input v-model="user.emailVerif" type="email" placeholder="Email check" />
      <input v-model="user.password" type="password" placeholder="Password" />
      <input
        v-model="user.passwordVerif"
        type="password"
        placeholder="Password check"
      />
      <button @click="createAccount()">Connexion</button>
    </div>
    <div @click="routerPush">
      router test
    </div>
  </form>
</template>

<script setup>
import {accountService} from "@/_services/account.service";
import { ref } from "vue";
const user = {
  username: "",
  email: "",
  password: "",
  emailVerif: "",
  passwordVerif: "",
};

const signupOrLogin = ref(false);
function switchLogin() {
  signupOrLogin.value = !signupOrLogin.value;
}
function createAccount() {
  let verifMail = accountService.validEmail(user.email);
  let verifPassword = accountService.verifPassword(user.password, user.passwordVerif);
  if(verifPassword && verifMail){
    fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    console.log("Account created", user);
  }
  
}
function login() {
  // const { username, email, password } = user;
  fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((data) => {
      
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
</script>

<style scoped></style>
