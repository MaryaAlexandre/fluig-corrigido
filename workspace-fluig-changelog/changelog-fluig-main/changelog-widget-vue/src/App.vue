<template>
  <div class="wrap">
    <div class="topbar">
      <div class="title">{{ titleText }}</div>

      <div class="controls">
        <input
          class="input"
          v-model="q"
          placeholder="Buscar (ex.: login, relatório)"
        />

        <select class="select" v-model="category">
          <option value="">Categoria (todas)</option>
          <option v-for="c in allCategories" :key="c" :value="c">
            {{ c }}
          </option>
        </select>

        <select class="select" v-model="tag">
          <option value="">Tag (todas)</option>
          <option v-for="t in allTags" :key="t" :value="t">
            {{ t }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="state">Carregando...</div>

    <div v-else-if="error" class="state error">
      {{ error }}
    </div>

    <div v-else-if="filtered.length === 0" class="state">
      Nenhuma versão encontrada.
    </div>

    <div v-else>
      <ChangelogItem
        v-for="v in filtered"
        :key="v.version || v.id || v.documentId"
        :item="v"
        :showDetailsLink="true"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ChangelogItem from './components/changelogItem.vue'
import { fetchChangelogVersions } from './services/changelogService'

const props = defineProps({
  datasetName: { type: String, default: 'ds_changelog_html' },
  // se quiser mostrar tudo, passe statusPublico=""
  statusPublico: { type: String, default: 'ativo' },
  title: { type: String, default: 'Changelog' }
})

const loading = ref(true)
const error = ref('')
const versions = ref([])

const q = ref('')
const category = ref('')
const tag = ref('')

const titleText = computed(() => props.title || 'Changelog')

function toArray(value) {
  if (Array.isArray(value)) return value
  if (value == null) return []
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  }
  return []
}

function normalizeStatus(s) {
  return String(s || '').trim().toLowerCase()
}

function safeDate(d) {
  const dt = new Date(d)
  return isNaN(dt.getTime()) ? new Date(0) : dt
}

const allCategories = computed(() => {
  const set = new Set()
  versions.value.forEach(v => {
    toArray(v.categories).forEach(c => set.add(c))
  })
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
})

const allTags = computed(() => {
  const set = new Set()
  versions.value.forEach(v => {
    toArray(v.tags).forEach(t => set.add(t))
  })
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
})

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase()
  const wantStatus = normalizeStatus(props.statusPublico)

  const list = (versions.value || [])
    // status opcional: se wantStatus for vazio, não filtra por status
    .filter(v => !wantStatus || normalizeStatus(v.status) === wantStatus)
    .filter(v => {
      const cats = toArray(v.categories)
      const tags = toArray(v.tags)
      const changes = toArray(v.changes)

      if (category.value && !cats.includes(category.value)) return false
      if (tag.value && !tags.includes(tag.value)) return false
      if (!query) return true

      const hay = [
        v.version,
        v.summary,
        v.description,
        cats.join(' '),
        tags.join(' '),
        ...changes.map(ch => {
          if (typeof ch === 'string') return ch
          const type = ch.type || ch.changeType || ''
          const title = ch.title || ch.changeTitle || ''
          const details = ch.details || ch.changeDescription || ''
          const mod = ch.module || ch.area || ''
          return `${type} ${title} ${details} ${mod}`.trim()
        })
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return hay.includes(query)
    })

  return list.sort((a, b) => {
    const ap = !!a.pinned
    const bp = !!b.pinned
    if (ap !== bp) return ap ? -1 : 1
    return safeDate(b.releaseDate) - safeDate(a.releaseDate)
  })
})

onMounted(async () => {
  loading.value = true
  error.value = ''

  try {
    const data = await fetchChangelogVersions({ datasetName: props.datasetName })
    versions.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error(e)
    error.value =
      'Não foi possível carregar o changelog. Verifique permissões do dataset e o console do navegador.'
    versions.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.wrap { font-family: Arial, sans-serif; }
.topbar {
  padding: 14px;
  background: #ffffff;
  border: 1px solid #67d0e2;
  border-radius: 12px;
  margin-bottom: 12px;
}
.title { font-size: 18px; font-weight: 800; margin-bottom: 10px; }
.controls { display:flex; gap: 10px; flex-wrap: wrap; }
.input, .select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #1a49af;
}
.input { flex: 1; min-width: 220px; }
.state { padding: 16px; opacity: .85; }
.error { color: #7f1d1d; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; }
</style>