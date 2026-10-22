<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ task ? 'Modifier la tâche' : 'Nouvelle tâche' }}</h2>
        <button @click="$emit('close')" class="btn btn-ghost btn-sm">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label>Titre *</label>
            <input v-model="formData.title" type="text" class="input" placeholder="Titre de la tâche" required />
          </div>

          <div class="form-group">
            <label>Priorité</label>
            <select v-model="formData.priority" class="select">
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea
            v-model="formData.description"
            class="textarea"
            placeholder="Description de la tâche..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Instructions détaillées</label>
          <textarea
            v-model="formData.instructions"
            class="textarea"
            placeholder="Instructions spécifiques pour les assignés..."
            rows="2"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Date de début</label>
            <input v-model="formData.startDate" type="date" class="input" />
          </div>

          <div class="form-group">
            <label>Date d'échéance</label>
            <input v-model="formData.dueDate" type="date" class="input" />
          </div>
        </div>

        <div class="form-group">
          <label>Temps estimé (heures)</label>
          <input
            v-model.number="formData.estimatedHours"
            type="number"
            class="input"
            min="0"
            step="0.5"
            placeholder="0"
          />
        </div>

        <div class="form-group">
          <label>Assigner à</label>
          <div class="assignees-list">
            <div
              v-for="member in projectMembers"
              :key="member.userId"
              :class="['assignee-item', { selected: isAssigneeSelected(member.userId) }]"
              @click="toggleAssignee(member)"
            >
              <div class="assignee-info">
                <div class="avatar avatar-sm">
                  {{ member.username.charAt(0).toUpperCase() }}
                </div>
                <span>{{ member.username }}</span>
              </div>
              <div v-if="isAssigneeSelected(member.userId)" class="assignee-instructions">
                <input
                  v-model="assigneeInstructions[member.userId]"
                  type="text"
                  class="input"
                  placeholder="Instructions spécifiques..."
                  @click.stop
                />
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Tags</label>
          <div class="tags-input">
            <input
              v-model="tagInput"
              type="text"
              class="input"
              placeholder="Ajouter un tag..."
              @keydown.enter.prevent="addTag"
            />
            <button type="button" @click="addTag" class="btn btn-secondary btn-sm">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
          <div class="tags-list">
            <span
              v-for="(tag, index) in formData.tags"
              :key="index"
              class="badge badge-gray"
            >
              {{ tag }}
              <button @click="removeTag(index)" class="remove-tag">
                <i class="fa-solid fa-times"></i>
              </button>
            </span>
          </div>
        </div>

        <div class="form-group">
          <label>Étapes personnalisées</label>
          <div class="steps-list">
            <div
              v-for="(step, index) in formData.steps"
              :key="index"
              class="step-item"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <input
                v-model="step.title"
                type="text"
                class="input"
                placeholder="Description de l'étape"
              />
              <button type="button" @click="removeStep(index)" class="btn btn-ghost btn-sm">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          <button type="button" @click="addStep" class="btn btn-ghost btn-sm">
            <i class="fa-solid fa-plus"></i>
            Ajouter une étape
          </button>
        </div>

        <div class="form-group">
          <label>Sous-tâches</label>
          <div class="subtasks-list">
            <div
              v-for="(subtask, index) in formData.subtasks"
              :key="index"
              class="subtask-item"
            >
              <input
                v-model="subtask.title"
                type="text"
                class="input"
                placeholder="Sous-tâche"
              />
              <button type="button" @click="removeSubtask(index)" class="btn btn-ghost btn-sm">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          <button type="button" @click="addSubtask" class="btn btn-ghost btn-sm">
            <i class="fa-solid fa-plus"></i>
            Ajouter une sous-tâche
          </button>
        </div>

        <div class="form-group">
          <label>Pièces jointes</label>
          <div class="attachments-area">
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              @change="handleFileUpload"
              style="display: none"
            />
            <button type="button" @click="$refs.fileInput.click()" class="btn btn-secondary w-full">
              <i class="fa-solid fa-cloud-upload-alt"></i>
              Ajouter des fichiers
            </button>
            <div class="attachments-list">
              <div
                v-for="(attachment, index) in formData.attachments"
                :key="index"
                class="attachment-item"
              >
                <div v-if="attachment.type?.startsWith('image/')" class="attachment-preview">
                  <img :src="attachment.preview" :alt="attachment.name" />
                </div>
                <div v-else class="attachment-icon">
                  <i class="fa-solid fa-file"></i>
                </div>
                <div class="attachment-info">
                  <span class="attachment-name">{{ attachment.name }}</span>
                  <span class="attachment-size">{{ formatFileSize(attachment.size) }}</span>
                </div>
                <button type="button" @click="removeAttachment(index)" class="btn btn-ghost btn-sm">
                  <i class="fa-solid fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Commentaires (en mode édition) -->
        <div v-if="task" class="form-group">
          <label>Commentaires</label>
          <div class="comments-section">
            <div v-if="formData.comments && formData.comments.length > 0" class="comments-list">
              <div
                v-for="(comment, index) in formData.comments"
                :key="comment.id || index"
                class="comment-item"
              >
                <div class="avatar avatar-sm">
                  {{ comment.username?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{{ comment.username || 'Utilisateur' }}</span>
                    <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                  <p class="comment-text">{{ comment.content }}</p>
                </div>
                <button
                  v-if="comment.userId === userStore.idUser"
                  @click="removeComment(index)"
                  class="btn btn-ghost btn-sm"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
            <div v-else class="no-comments">
              <p>Aucun commentaire pour le moment</p>
            </div>

            <div class="add-comment">
              <input
                v-model="newComment"
                type="text"
                class="input"
                placeholder="Ajouter un commentaire..."
                @keydown.enter.prevent="addComment"
              />
              <button type="button" @click="addComment" class="btn btn-primary btn-sm">
                <i class="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Annuler
          </button>
          <button type="submit" class="btn btn-primary">
            {{ task ? 'Sauvegarder' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useUserStore } from '@/stores/userStore'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  task: {
    type: Object,
    default: null,
  },
  phaseId: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits(['close', 'saved'])

const projectStore = useProjectStore()
const userStore = useUserStore()

const formData = ref({
  title: '',
  description: '',
  instructions: '',
  priority: 'medium',
  startDate: null,
  dueDate: null,
  estimatedHours: 0,
  assignees: [],
  tags: [],
  steps: [],
  subtasks: [],
  attachments: [],
  comments: [],
})

const tagInput = ref('')
const assigneeInstructions = ref({})
const fileInput = ref(null)
const newComment = ref('')

const projectMembers = computed(() => projectStore.activeProjectMembers)

onMounted(() => {
  if (props.task) {
    formData.value = {
      title: props.task.title,
      description: props.task.description,
      instructions: props.task.instructions,
      priority: props.task.priority,
      startDate: props.task.startDate,
      dueDate: props.task.dueDate,
      estimatedHours: props.task.timeTracking?.estimatedHours || 0,
      assignees: [...props.task.assignees],
      tags: [...props.task.tags],
      subtasks: [...(props.task.subtasks || [])],
      attachments: [...(props.task.attachments || [])],
      comments: [...(props.task.comments || [])],
    }

    // Initialiser les instructions par assigné
    props.task.assignees.forEach((assignee) => {
      assigneeInstructions.value[assignee.userId] = assignee.instructions || ''
    })

    // Générer les previews pour les images existantes
    formData.value.attachments.forEach(attachment => {
      if (attachment.type?.startsWith('image/') && attachment.url && !attachment.preview) {
        attachment.preview = attachment.url
      }
    })
  }
})

const isAssigneeSelected = (userId) => {
  return formData.value.assignees.some((a) => a.userId === userId)
}

const toggleAssignee = (member) => {
  const index = formData.value.assignees.findIndex((a) => a.userId === member.userId)
  if (index > -1) {
    formData.value.assignees.splice(index, 1)
    delete assigneeInstructions.value[member.userId]
  } else {
    formData.value.assignees.push({
      userId: member.userId,
      username: member.username,
      avatar: member.avatar,
      instructions: '',
    })
  }
}

const addTag = () => {
  if (tagInput.value.trim() && !formData.value.tags.includes(tagInput.value.trim())) {
    formData.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (index) => {
  formData.value.tags.splice(index, 1)
}

const addStep = () => {
  formData.value.steps.push({ title: '', completed: false })
}

const removeStep = (index) => {
  formData.value.steps.splice(index, 1)
}

const addSubtask = () => {
  formData.value.subtasks.push({ title: '', completed: false })
}

const removeSubtask = (index) => {
  formData.value.subtasks.splice(index, 1)
}

const handleFileUpload = (event) => {
  const files = event.target.files
  Array.from(files).forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.attachments.push({
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
        preview: e.target.result,
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeAttachment = (index) => {
  formData.value.attachments.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return 'À l\'instant'
  if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`
  if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)} h`

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const addComment = () => {
  if (newComment.value.trim()) {
    if (!formData.value.comments) {
      formData.value.comments = []
    }
    formData.value.comments.push({
      id: Date.now(),
      userId: userStore.idUser,
      username: userStore.username,
      content: newComment.value.trim(),
      createdAt: new Date().toISOString(),
    })
    newComment.value = ''
  }
}

const removeComment = (index) => {
  formData.value.comments.splice(index, 1)
}

const handleSubmit = () => {
  // Ajouter les instructions aux assignés
  formData.value.assignees = formData.value.assignees.map((assignee) => ({
    ...assignee,
    instructions: assigneeInstructions.value[assignee.userId] || '',
  }))

  const taskData = {
    ...formData.value,
    phaseId: props.phaseId,
    timeTracking: {
      estimatedHours: formData.value.estimatedHours,
      actualHours: 0,
      remainingHours: formData.value.estimatedHours,
    },
  }

  if (props.task) {
    emit('saved', { ...props.task, ...taskData })
  } else {
    emit('saved', {
      ...taskData,
      id: Date.now(),
      projectId: projectStore.currentProject?.id,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
}
</script>

<style scoped>
.modal-content {
  max-width: 700px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.assignees-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.assignee-item {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.assignee-item:hover {
  border-color: var(--color-primary);
}

.assignee-item.selected {
  border-color: var(--color-primary);
  background: var(--bg-secondary);
}

.assignee-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.assignee-instructions {
  margin-top: 0.5rem;
}

.tags-input {
  display: flex;
  gap: 0.5rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.remove-tag {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
  opacity: 0.6;
  transition: opacity var(--transition-base);
}

.remove-tag:hover {
  opacity: 1;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.step-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.step-number {
  width: 28px;
  height: 28px;
  background: #293848;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  flex-shrink: 0;
}

.subtasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.subtask-item {
  display: flex;
  gap: 0.5rem;
}

.attachments-area {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  padding: 1rem;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.attachment-preview {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
}

.attachment-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.attachment-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-400);
  flex-shrink: 0;
}

.attachment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.attachment-name {
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attachment-size {
  font-size: var(--font-size-xs);
  color: var(--color-gray-400);
}

/* Comments Section */
.comments-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
}

.comment-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.comment-author {
  font-weight: 500;
  font-size: var(--font-size-sm);
  color: var(--color-gray-900);
}

.comment-date {
  font-size: var(--font-size-xs);
  color: var(--color-gray-400);
}

.comment-text {
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  margin: 0;
  word-wrap: break-word;
}

.no-comments {
  text-align: center;
  padding: 1.5rem;
  color: var(--color-gray-400);
  font-size: var(--font-size-sm);
}

.add-comment {
  display: flex;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
