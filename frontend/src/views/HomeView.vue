<template>
  <h1>HomePage</h1>
  <div class="mx-auto max-w-md rounded-md bg-slate-800 p-4">
    <form @submit.prevent="login()" v-if="!signupOrLogin" class="flex flex-col gap-3 text-white">
      <h2 class="text-2xl font-bold text-red-700">Login</h2>
      <label for="email">Email</label>
      <input v-model="user.email" type="email" placeholder="Email" />
      <label for="password">Password</label>
      <input v-model="user.password" type="password" placeholder="Password" />
      <button
        class="m-auto w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white"
        type="submit"
      >
        Connexion
      </button>
    </form>
    <form v-else class="flex flex-col gap-3 text-white">
      <h2 class="text-2xl font-bold text-green-700">SignUp</h2>
      <label for="username">Username</label>
      <input v-model="user.username" type="text" placeholder="Pseudo" />
      <label for="email">Email</label>
      <input v-model="user.email" type="email" placeholder="Email" />
      <label for="emailVerif">Vérification Email</label>
      <input v-model="user.emailVerif" type="email" placeholder="Email check" />
      <label for="password">Mot de passe</label>
      <input v-model="user.password" type="password" placeholder="Password" />
      <label for="passwordVerif">Vérfication mot de passe</label>
      <input
        v-model="user.passwordVerif"
        type="password"
        placeholder="Password check"
      />
      <button
        class="m-auto w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white"
        @click="createAccount()"
      >
        Creer un compte
      </button>
    </form>
    <div class="pt-4">
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
    </div>
  </div>
</template>

<script setup>
import { accountService } from "@/_services/account.service";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

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
  let verifPassword = accountService.verifPassword(
    user.password,
    user.passwordVerif,
  );
  if (verifPassword && verifMail) {
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
async function login() {
  const { email, password } = user;
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const error = (await response.json()).message;
      console.log(error);
    }
    const data = await response.json();
    console.log(data.access_token, data.user_id);
    localStorage.setItem("user", JSON.stringify({token : data.access_token, userId: data.user_id}));
    router.push("/Post");
  } catch (error) {
    console.error("Error:", error);
  }
}
</script>

<style scoped>
input {
  @apply w-full rounded border p-2 text-sm text-black outline-0 ring-offset-2 focus:ring-2;
}
</style>
