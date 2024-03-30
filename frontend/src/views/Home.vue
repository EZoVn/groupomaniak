<template>
  <h1>HomePage</h1>
  <form>
    <div v-if="login">
      <h2>Login</h2>
      <input type="text" placeholder="Pseudo">
      <input type="email" placeholder="Email">
      <input type="password" placeholder="Password">
      <button>Connexion</button>
    </div>
    <div v-else>
      <h2>SignUp</h2>
      <input type="text" placeholder="Pseudo">
      <input type="email" placeholder="Email">
      <input type="email" placeholder="Email check">
      <input type="password" placeholder="Password">
      <input type="password" placeholder="Password check">
    </div>

  </form>
</template>pencla

<script setup>
  const login = true;
</script>