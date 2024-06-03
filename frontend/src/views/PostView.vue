<template>
  <h1>Post</h1>
  <section>
    <AddPost :getAllPost="getAllPost" />
    <div>
      <h2>Tout les posts</h2>
      <ul class="m-4 rounded-md border">
        <li
          class="m-4 flex flex-col gap-4 rounded-md border p-4"
          v-for="(post, index) in posts"
          :key="post.post_id"
        >
          <div class="flex items-center justify-between">
            <p class="font-bold">UserID {{ post.user_id }}</p>
            <div>
              <button class="m-2 border p-2" @click="deletePost(post.post_id)">
                Supprimer
              </button>
              <button @click="switchModifyPost(post.post_id)" class="m-2 border p-2">
                Modifier
              </button>
            </div>
          </div>

          <div class="flex flex-col" v-if="modifyPostActive === post.post_id">
            <label class="text-center" for="post">Modifier un post</label>
            <input
              @input="modifyPostInput = $event.target.value"
              type="text"
              placeholder="Modifier le post"
            />
            <div class="flex justify-around p-4">
              <input
                class="hidden"
                ref="fileInput"
                type="file"
                @change="handleFileSelected"
              />
              <button
                class="m-auto w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white"
                @click="$refs.fileInput[index].click()"
                name="newImage"
              >
                Changer image
              </button>
              <button
                class="m-auto w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white"
                @click="modifyPost(modifyPostInput, post.post_id)"
              >
                Modifier
              </button>
            </div>
          </div>

          <h3>{{ post.post_content }}</h3>
          <img v-if="post.post_imgUrl" :src="post.post_imgUrl" alt="description image" class="rounded"/>
          <Comments :getAllPost="getAllPost" :post="post"/>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import AddPost from "@/components/AddPost.vue";
import Comments from '@/components/Comments.vue';
import { ref, onMounted } from "vue";
const modifyPostActive = ref(null);
const modifyPostInput = ref("");
const posts = ref([]);
const newImage = ref(null);

function getToken() {
  return localStorage.getItem("user");
}
function handleFileSelected(event) {
  newImage.value = event.target.files[0];
  console.log(event.target.files[0]);
}

const switchModifyPost = (index) => {
  if (modifyPostActive.value === index) {
    modifyPostActive.value = null;
  } else {
    modifyPostActive.value = index;
  }
};
async function getAllPost() {
  try {
    let user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    const response = await fetch("http://localhost:8080/api/post", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    });
    const data = await response.json();
    posts.value = data;
    console.log("getAllPost", data);
  } catch (error) {
    console.error(error);
  }
}

async function deletePost(postId) {
  console.log(postId);
  try {
    const response = await fetch(`http://localhost:8080/api/post/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    getAllPost();
  } catch (error) {
    console.error(error);
  }
}
async function modifyPost(content, postId) {
  try {
    console.log(content, postId, newImage.value);
    let user = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();
    formData.append("content", content);
    formData.append("userId", user.userId);
    formData.append("file", newImage.value);
    const response = await fetch(`http://localhost:8080/api/post/${postId}`, {
      method: "PUT",
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    newImage.value = null;
    modifyPostActive.value = null;
    getAllPost();
  } catch (error) {
    console.error(error);
  }
}
onMounted(getAllPost);
</script>
