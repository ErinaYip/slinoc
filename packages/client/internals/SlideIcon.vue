<!--
Renders the `icon` field of a slide frontmatter.

Accepts an emoji, a Nerd Font glyph, or an UnoCSS icon class
(e.g. `i-carbon:code`).
-->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  icon?: string
}>()

// `i-carbon:code`, `i-ph:star-fill`, ... are rendered as UnoCSS icon classes
const isIconClass = computed(() => !!props.icon && /^i-[a-z0-9-]+(?::[a-z0-9-]+)?$/i.test(props.icon))
</script>

<template>
  <span class="slidev-slide-icon">
    <span v-if="isIconClass" :class="icon" />
    <template v-else-if="icon">
      {{ icon }}
    </template>
  </span>
</template>

<style scoped>
.slidev-slide-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25em;
  line-height: 1;
}
</style>
