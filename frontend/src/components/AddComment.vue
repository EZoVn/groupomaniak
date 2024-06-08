<template>
  <div class="flex my-2">
    <label for="comment"></label>
    <input
      class="w-full rounded-l p-2"
      v-model="comment"
      type="text"
      placeholder="Commencer un commentaire"
    />
    <button
      class=" w-max rounded-r bg-slate-400 px-6 py-2 text-sm font-normal text-white"type="submit"
      @click="addComment(props.postId)"
    >
      Publier
    </button>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { apiFetch } from "@/_services/caller.service";
const comment = ref("");
const props = defineProps({
  getAllPost: Function,
  postId: Number,
  switchAddComment: Boolean,
});
async function addComment(postId) {
  try {
    let user = JSON.parse(localStorage.getItem("user"));
    const response = await apiFetch(
      `http://localhost:8080/api/comment/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          content: comment.value,
        }),
      },
    );
    const data = await response;
    comment.value = "";
    props.switchAddComment = false;
    console.log(props.switchAddComment)
    props.getAllPost();
  } catch (error) {
    console.error(error, error.message);
  }
}
</script>
