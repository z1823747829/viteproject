<template>
  <div style="text-align: left;margin: auto;width: 80%">
    <md-editor v-model="content" preview-only preview-theme="github"/>
  </div>

</template>

<script lang="ts" setup>

import MdEditor from "md-editor-v3";
import {onMounted, ref} from "vue";

const content = ref('')
onMounted(() => {
  fetch('/media/README.md')
      .then((res) => res.text())
      .then((text) => {
        content.value = text
      })
})
</script>

<style scoped>

</style>