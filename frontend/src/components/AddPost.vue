<template>
  <div class="container flex flex-col p-4">
    <label for="post">Ajouter un post</label>
    <input v-model="post" type="text" placeholder="Commencer un post" />
    <div class="flex justify-around p-4">
      <input
        class="hidden"
        ref="imgInput"
        type="file"
        @change="handleFileSelect"
      />
      <button class="m-auto w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white" @click="$refs.imgInput.click()" name="ajoutPhoto">
        Add Img
      </button>
      <button class="m-auto w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white" @click="addPost">Publier</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {apiFetch} from "../_services/caller.service";

const props = defineProps({
  getAllPost: Function,
});

const post = ref("");
const img = ref(null);

function handleFileSelect(event) {
  img.value = event.target.files[0];
}

async function addPost() {
  try {
    let user = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();
    formData.append("content", post.value);
    formData.append("userId", user.userId);
    formData.append("file", img.value);
    const response = await apiFetch("http://localhost:8080/api/post", {
      method: "POST",
      body: formData,
    });
    const data = await response;
    img.value = null;
    post.value = "";
    props.getAllPost();
  } catch (error) {
    console.error(error);
  }
}
// async function addPost() {
//   try {
//     let user = JSON.parse(localStorage.getItem("user"));
//     const formData = new FormData();
//     formData.append("content", post.value);
//     formData.append("userId", user.userId);
//     formData.append("file", img.value);
//     const response = await fetch("http://localhost:8080/api/post", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${user.token}`,
//       },
//       body: formData,
//     });
//     const data = await response.json();
//     console.log(data);
//     img.value = null;
//     post.value = "";
//     props.getAllPost();
//   } catch (error) {
//     console.error(error);
//   }
// }
</script>
