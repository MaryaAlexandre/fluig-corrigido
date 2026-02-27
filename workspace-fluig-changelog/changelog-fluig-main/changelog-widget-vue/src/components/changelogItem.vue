<template>
  <div class="card">
    <button class="header" @click="open = !open">
      <div class="left">
        <div class="version">
          v{{ item.version }}
        </div>
        <div class="meta">
          <span class="date">{{ formatDate(item.releaseDate) }}</span>
          <span class="summary">{{ item.summary }}</span>
        </div>
      </div>

      <div class="right">
        <span class="chev">{{ open ? '▲' : '▼' }}</span>
      </div>
    </button>

    <div v-if="open" class="body">
      <div class="badges">
        <span v-for="c in item.categories" :key="c" class="badge">{{ c }}</span>
        <span v-for="t in item.tags" :key="t" class="tag">#{{ t }}</span>
      </div>

      <div v-if="imageUrl" class="banner">
        <img :src="imageUrl" alt="banner" />
      </div>

      <ul class="changes">
        <li v-for="(ch, idx) in item.changes" :key="idx" class="change">
          <div class="change-top">
            <span class="type">{{ ch.type }}</span>
            <span class="title">{{ ch.title }}</span>
            <span v-if="ch.impact" class="impact">Impacto: {{ ch.impact }}</span>
          </div>
          <div v-if="ch.details" class="details">{{ ch.details }}</div>
          <div v-if="ch.module" class="module">Módulo: {{ ch.module }}</div>
        </li>
      </ul>

      <a v-if="detailsHref" class="details-link" :href="detailsHref">
        Ver detalhes
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  showDetailsLink: { type: Boolean, default: false }
})

const open = ref(false)

function formatDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR')
  } catch {
    return iso
  }
}


const imageUrl = computed(() => {
  if (!props.item.imageDocumentId) return ''
  return `/ecm/document/downloadURL/${props.item.imageDocumentId}`
})

const detailsHref = computed(() => {
  if (!props.showDetailsLink) return ''
  return `/portal/p/1/page/changelog-detalhe?version=${encodeURIComponent(props.item.version)}`
})
</script>

<style scoped>
.card { border: 1px solid #e6e6e6; border-radius: 10px; overflow: hidden; background: #fff; margin-bottom: 12px; }
.header { width: 100%; border: 0; background: #f8f9fb; padding: 14px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; }
.left { text-align:left; }
.version { font-weight: 700; font-size: 16px; }
.pin { margin-right: 6px; }
.meta { margin-top: 4px; display:flex; gap: 10px; flex-wrap: wrap; }
.date { opacity: 0.7; font-size: 13px; }
.summary { font-size: 13px; }
.body { padding: 14px; }
.badges { display:flex; gap: 8px; flex-wrap:wrap; margin-bottom: 12px; }
.badge { background:#eef2ff; padding: 4px 8px; border-radius:999px; font-size:12px; }
.tag { background:#f1f5f9; padding: 4px 8px; border-radius:999px; font-size:12px; }
.banner img { width: 100%; border-radius: 10px; margin-bottom: 12px; }
.changes { margin: 0; padding-left: 18px; }
.change { margin-bottom: 10px; }
.change-top { display:flex; gap: 10px; flex-wrap:wrap; align-items: baseline; }
.type { font-weight: 700; text-transform: uppercase; font-size: 11px; opacity: .7; }
.title { font-weight: 600; }
.impact { font-size: 12px; opacity: .8; }
.details, .module { font-size: 13px; opacity: .9; margin-top: 4px; }
.details-link { display:inline-block; margin-top: 10px; }
.chev { font-size: 12px; opacity: .8; }
</style>