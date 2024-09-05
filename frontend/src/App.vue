<script setup>
// import {isLogged, logout} from "@/views/HomeView.vue";


</script>

<template>
  <router-link to="/">Home</router-link>
  <router-link to="/Post">Post</router-link>
  <!-- <button v-if="isLogged" @click="logout"> Deconnexion</button> -->
  <router-view></router-view>
</template>

<style>
body{
  @apply bg-slate-500;
}
</style>
