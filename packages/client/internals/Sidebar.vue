<!--
Narrow left sidebar.

Every slide is listed as an icon (emoji, Nerd Font glyph or UnoCSS icon class)
stacked at the top. The icon viewport follows the focused slide so it is always
visible. The title of the focused slide is displayed in the middle of the
sidebar, rotated by 90 degrees.

Rendered by `pages/play.vue`, visibility is controlled by `useSidebar()`.
-->
<script setup lang="ts">
import type { SlideRoute } from '@slidev/types'
import { useElementSize } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'
import TitleRenderer from '#slidev/title-renderer'
import { useNav } from '../composables/useNav'
import { getSlidePath } from '../logic/slides'
import SlideIcon from './SlideIcon.vue'

const { slides, currentSlideNo } = useNav()

interface SidebarItem {
  no: number
  path: string
  title?: string
  icon?: string
  hidden: boolean
}

const items = computed<SidebarItem[]>(() => slides.value.map((route: SlideRoute) => ({
  no: route.no,
  path: getSlidePath(route, false),
  title: route.meta?.slide?.title,
  icon: route.meta?.slide?.frontmatter?.icon,
  hidden: Boolean(route.meta?.slide?.frontmatter?.hideInToc),
})))

const current = computed(() => items.value.find(item => item.no === currentSlideNo.value))

const list = ref<HTMLElement>()
const { height: listHeight } = useElementSize(list)

/**
 * Shift the visible icon window so the focused slide stays in view.
 * The container has no scrollbar, it is scrolled programmatically.
 */
function followActive() {
  const el = list.value
  const active = el?.querySelector<HTMLElement>('.slidev-sidebar-item-active')
  if (!el || !active)
    return

  const offset = active.offsetTop - (el.clientHeight - active.offsetHeight) / 2
  const max = Math.max(el.scrollHeight - el.clientHeight, 0)
  el.scrollTop = Math.min(Math.max(offset, 0), max)
}

watch(
  [currentSlideNo, listHeight, () => items.value.length],
  async () => {
    await nextTick()
    followActive()
  },
  { immediate: true },
)
</script>

<template>
  <aside class="slidev-sidebar">
    <nav ref="list" class="slidev-sidebar-icons">
      <RouterLink
        v-for="item of items"
        :key="item.no"
        :to="item.path"
        class="slidev-sidebar-item"
        :class="{
          'slidev-sidebar-item-active': item.no === currentSlideNo,
          'slidev-sidebar-item-hidden': item.hidden,
        }"
      >
        <span class="slidev-sidebar-item-icon">
          <SlideIcon v-if="item.icon" :icon="item.icon" />
          <span v-else class="slidev-sidebar-item-no">{{ item.no }}</span>
        </span>
      </RouterLink>
    </nav>
    <div class="slidev-sidebar-title-wrap">
      <div v-if="current" :key="current.no" class="slidev-sidebar-title">
        <TitleRenderer v-if="current.title" :no="current.no" />
        <template v-else>
          Slide {{ current.no }}
        </template>
      </div>
    </div>
    <div class="slidev-sidebar-spacer" />
  </aside>
</template>

<style scoped lang="postcss">
.slidev-sidebar {
  @apply flex flex-col items-center h-full overflow-hidden bg-main text-main border-r border-main select-none;
}

/* Icon viewport: top half, clipped, scrolled programmatically to follow the active slide */
.slidev-sidebar-icons {
  @apply relative flex flex-col items-center gap-1 flex-1 min-h-0 w-full overflow-hidden pt-2;
}

.slidev-sidebar-item {
  @apply flex items-center justify-center shrink-0 w-10 h-10 rounded text-lg no-underline text-main;
  @apply hover:(bg-active);
}

.slidev-sidebar-item-active {
  @apply bg-active text-primary;
}

.slidev-sidebar-item-hidden {
  @apply opacity-50;
}

.slidev-sidebar-item-icon {
  @apply flex items-center justify-center w-full h-full;
}

.slidev-sidebar-item-no {
  @apply text-xs opacity-50 tabular-nums;
}

/* Title band, kept vertically centered between the two equal spacers */
.slidev-sidebar-title-wrap {
  @apply flex items-center justify-center shrink-0 w-full overflow-hidden py-2;
  max-height: 50%;
}

/* Rotate the title by 90 degrees so it reads bottom-to-top */
.slidev-sidebar-title {
  @apply text-sm font-medium whitespace-nowrap overflow-hidden;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  max-height: 100%;
  text-overflow: ellipsis;
}

.slidev-sidebar-title :deep(p) {
  @apply m-0;
}

.slidev-sidebar-title :deep(div) {
  @apply inline;
}

.slidev-sidebar-spacer {
  @apply flex-1 min-h-0 w-full;
}
</style>
