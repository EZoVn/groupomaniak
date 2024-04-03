<template>
  <h1>HomePage</h1>
  <form class="container m-auto bg-slate-800">
    <div @click="switchLogin()" class="cursor-pointer text-white">Creer un compte</div>
    <div v-if="login" class="flex flex-col border justify-center items-center">
      <h2>Login</h2>
      <input type="text" placeholder="Pseudo">
      <input type="email" placeholder="Email">
      <input type="password" placeholder="Password">
      <button>Connexion</button>
    </div>
    <div v-else class="flex flex-col border justify-center items-center">
      <h2>SignUp</h2>
      <input type="text" placeholder="Pseudo">
      <input type="email" placeholder="Email">
      <input type="email" placeholder="Email check">
      <input type="password" placeholder="Password">
      <input type="password" placeholder="Password check">
      <button>Connexion</button>
    </div>

  </form>
</template>

<script setup>
  import { ref } from 'vue';

  const login = ref(false);
  function switchLogin() {
    login.value = !login.value;
  }
</script>

<style scoped>

</style>