<template>
  <h1>Post</h1>
  <section>
    <AddPost :getAllPost="getAllPost" />
    <div>
      <h2>Tout les posts</h2>
      <ul>
        <li class="flex gap-4" v-for="post in posts" :key="post.id">
          <p>{{ post.user_id }}</p>
          <h3>{{ post.content }}</h3>
          <img v-if="post.imgUrl" :src="post.imgUrl" alt="description image" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import AddPost from '@/components/AddPost.vue';
import { ref, onMounted } from 'vue';

const posts = ref([]);

async function getAllPost() {
  try{
    const response = await fetch('http://localhost:8080/api/post')
    const data = await response.json();
    posts.value = data;
    console.log('getAllPost');
  } catch (error) {
    console.error(error);
  }
}
  onMounted(getAllPost);
</script>