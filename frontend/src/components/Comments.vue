<template>
  <div class="border p-4">
    <p v-if="props.post.comments === null">Aucun commentaire ..</p>
    <p v-else>Commentaires :</p>

    <button
      v-show="!switchAddComment"
      @click="switchAddComment = !switchAddComment"
      class="my-2 w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white"
    >
      Ajouter un commentaire
    </button>
    <button
      v-show="switchAddComment"
      @click="switchAddComment = !switchAddComment"
      class="my-2 w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white"
    >
      Fermer
    </button>
    <AddComment
      v-show="switchAddComment === true"
      :switchAddComment="switchAddComment"
      :getAllPost="props.getAllPost"
      :postId="props.post.post_id"
    />
    <div
      v-for="comment in props.post.comments"
      :key="comment.comment_id"
      v-show="comment.comment_content"
      class="flex justify-between border p-4"
    >
      <ul class="py-4 text-lg">
        <li>
          <span class="font-bold">userID : </span
          >{{ comment.comment_user_id }}
        </li>
        <li>
          <span class="font-bold">Commentaire : </span
          >{{ comment.comment_content }}
        </li>
      </ul>
      <div class="flex flex-col justify-around">
        <button
          @click="deleteComment(comment.comment_id)"
          class="m-auto w-32 rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white"
        >
          Supprimer
        </button>
        <button
          @click="switchModifyComment === comment.comment_id ? (switchModifyComment = null) : (switchModifyComment = comment.comment_id)"
          class="m-auto w-32 rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white"
        >
          Modifier
        </button>
      </div>
      <div v-if="switchModifyComment === comment.comment_id" class="flex py-4">
        <label for="comment"></label>
        <input
          class="w-full rounded-l p-2"
          v-model="newComment"
          type="text"
          placeholder="Modifier le commentaire"
        />
        <button
          class="w-max rounded-r bg-slate-400 px-6 py-2 text-sm font-normal text-white"
          type="submit"
          @click="modifyComment(newComment, comment.comment_id)"
        >
          Publier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AddComment from "./AddComment.vue";
import { apiFetch } from "@/_services/caller.service";
const props = defineProps({
  getAllPost: Function,
  post: Object,
});
const switchAddComment = ref(false);
const switchModifyComment = ref(null);
const newComment = ref("");

// Vérifier les userID avant de supprimer ou modifier les commentaires

async function deleteComment(commentId) {
  try {
    const response = await apiFetch(
      `http://localhost:8080/api/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response;
    console.log(data);
    props.getAllPost();
  } catch (error) {
    console.error(error);
  }
}
async function modifyComment(content, commentId) {
  try {
    console.log(content, commentId);
    const response = await apiFetch(
      `http://localhost:8080/api/comment/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
        }),
      },
    );
    const data = await response;
    newComment.value = "";
    switchModifyComment.value = false;
    console.log(data);
    props.getAllPost();
  } catch (error) {
    console.error(error);
  }
}
</script>
