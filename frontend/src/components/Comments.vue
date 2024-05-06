<template>
  <div class="border p-4">
    <p v-if="props.post.comment_content === null">Aucun commentaire ..</p>
    <p v-else>Commentaires :</p>

    <button @click="switchAddComment = !switchAddComment" class="m-auto w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white">Ajouter un commentaire</button>
    <AddComment v-show="switchAddComment === true" :getAllPost="props.getAllPost" :postId="props.post.post_id"/>
    <div v-show="props.post.comment_content" class="p-4 flex justify-between">
      <ul>
        <li>
          userID {{ props.post.comment_user_id }}
        </li>
        <li>
          content {{ props.post.comment_content }}
        </li>
        <li>
          postID {{ props.post.comment_post_id }}
        </li>
        <li>
          commentID {{ props.post.comment_id }}
        </li>
      </ul>
      <div class="flex flex-col justify-around ">
        <button @click="deleteComment(props.post.comment_id)" class="m-auto w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white">Supprimer</button>
        <button class="m-auto w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white">Modifier</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AddComment from './AddComment.vue';
const props = defineProps({
  getAllPost: Function,
  post: Number,
})
const switchAddComment = ref(false);

async function deleteComment (commentId) {
  console.log(commentId);
  try {
    const response = await fetch(`http://localhost:8080/api/comment/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    props.getAllPost();
  } catch (error) {
    console.error(error);
  }
}
</script>
