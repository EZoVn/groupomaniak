<template>
  <h1>Post</h1>
  <section>
    <AddPost :getAllPost="getAllPost" />
    <div>
      <h2>Tout les posts</h2>
      <ul class="m-4 rounded-md border">
        <li
          class="m-4 flex flex-col gap-4 rounded-md border p-4"
          v-for="post in posts"
          :key="post.id"
        >
          <div class="flex items-center justify-between">
            <p class="font-bold">UserID {{ post.user_id }}</p>
            <div>
              <button class="m-2 border p-2" @click="deletePost(post.id)">
                Supprimer
              </button>
              <button @click="modifyPost = !modifyPost" class="m-2 border p-2">Modifier</button>

              <div v-if="modifyPost">
                <label for="post">Modifier un post</label>
                <input
                  v-model="modifyPostInput"
                  type="text"
                  placeholder="Commencer un post"
                />
                <div class="flex justify-around p-4">
                  <input
                    class="hidden"
                    ref="imgInput"
                    type="file"
                    @change="handleFileSelect"
                  />
                  <button
                    class="m-auto w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white"
                    @click="$refs.imgInput.click()"
                    name="ajoutPhoto"
                  >
                    Add Img
                  </button>
                  <button
                    class="m-auto w-max rounded bg-slate-400 px-6 py-2 text-sm font-normal text-white"
                    @click="addPost"
                  >
                    Publier
                  </button>
                </div>
              </div>

            </div>
          </div>
          <h3>{{ post.content }}</h3>
          <img v-if="post.imgUrl" :src="post.imgUrl" alt="description image" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import AddPost from "@/components/AddPost.vue";
import { ref, onMounted } from "vue";
const modifyPost = ref(false);
const posts = ref([]);

async function getAllPost() {
  try {
    const response = await fetch("http://localhost:8080/api/post");
    const data = await response.json();
    posts.value = data;
    console.log("getAllPost");
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

onMounted(getAllPost);
</script>
