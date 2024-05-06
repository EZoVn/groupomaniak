<template>
  <div>
    <label for="comment">Ajouter un commentaire</label>
    <input v-model="comment" type="text" placeholder="Commencer un commentaire" />
    <div class="flex justify-around p-4">
      <button class="m-auto w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white" @click="addComment(props.postId)">Publier</button>
    </div>
  </div>  
</template>
<script setup>
import { ref } from "vue";
const comment = ref("");
const props = defineProps({
  getAllPost: Function,
  postId: Number,
})
async function addComment (postId) {
  try {
    let user = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(`http://localhost:8080/api/comment/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.userId,
        content: comment.value,
      }),
    });
    const data = await response.json();
    console.log(data);
    comment.value = "";
    props.getAllPost();
  } catch (error) {
    console.error(error, error.message);
  }
}
</script>