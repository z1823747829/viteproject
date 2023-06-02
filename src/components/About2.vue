<template>
  <md-editor v-model="content" preview-only preview-theme="github"/>


</template>

<script lang="ts" setup>

import MdEditor from "md-editor-v3";
import {ref} from "vue";

const content = ref('')
</script>

<style scoped>

</style>