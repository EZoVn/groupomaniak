<template>
  <div class="border p-4">
    <p v-if="props.post.comment_content === null">Aucun commentaire ..</p>
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
      :getAllPost="props.getAllPost"
      :postId="props.post.post_id"
    />
    <div
      v-show="props.post.comment_content"
      class="flex justify-between border p-4"
    >
      <ul class="py-4 text-lg">
        <li>
          <span class="font-bold">userID : </span
          >{{ props.post.comment_user_id }}
        </li>
        <li>
          <span class="font-bold">Commentaire : </span
          >{{ props.post.comment_content }}
        </li>
      </ul>
      <div class="flex flex-col justify-around">
        <button
          @click="deleteComment(props.post.comment_id)"
          class="m-auto w-32 rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white"
        >
          Supprimer
        </button>
        <button
          @click="switchModifyComment = !switchModifyComment"
          class="m-auto w-32 rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white"
        >
          Modifier
        </button>
      </div>
      <div v-if="switchModifyComment" class="flex py-4">
        <label for="comment"></label>
        <input
          class="w-full rounded-l p-2"
          v-model="comment"
          type="text"
          placeholder="Modifier le commentaire"
        />
        <button
          class="w-max rounded-r bg-slate-400 px-6 py-2 text-sm font-normal text-white"
          type="submit"
          @click="modifyComment(comment, props.post.comment_id)"
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
const props = defineProps({
  getAllPost: Function,
  post: Object,
});
const switchAddComment = ref(false);
const switchModifyComment = ref(false);
const comment = ref("");

// let user = JSON.parse(localStorage.getItem("user"));

// Vérifier les userID avant de supprimer ou modifier les commentaires

async function deleteComment(commentId) {
  console.log(commentId);
  try {
    const response = await fetch(
      `http://localhost:8080/api/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    console.log(data);
    props.getAllPost();
  } catch (error) {
    console.error(error);
  }
}
async function modifyComment(content, commentId) {
  try {

    console.log(content, commentId);
    const response = await fetch(
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
    const data = await response.json();
    comment.value = "";
    switchModifyComment.value = false;
    console.log(data);
    props.getAllPost();
  } catch (error) {
    console.error(error);
  }
}
</script>
