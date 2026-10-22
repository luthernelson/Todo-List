<template>
  <div class="two-factor-verify">
    <div class="verify-content">
      <div class="verify-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <h3>{{ $t('twoFactor.verify.title') }}</h3>
      <p>{{ $t('twoFactor.verify.description') }}</p>

      <div class="code-input-section">
        <input
          v-model="code"
          type="text"
          maxlength="6"
          :placeholder="$t('twoFactor.verify.placeholder')"
          @input="formatCode"
          @keydown.enter="verify"
        />
      </div>

      <div v-if="error" class="error-message">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ error }}
      </div>

      <button @click="verify" class="btn-verify" :disabled="code.length !== 6">
        {{ $t('twoFactor.verify.verify') }}
      </button>

      <button @click="useBackupCode" class="btn-backup">
        {{ $t('twoFactor.verify.backupCode') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTwoFactorStore } from '@/stores/twoFactorStore'
import { useI18n } from 'vue-i18n'

const twoFactorStore = useTwoFactorStore()
const { t } = useI18n()

const code = ref('')
const error = ref('')

const emit = defineEmits(['verified', 'backupCode'])

const formatCode = () => {
  code.value = code.value.replace(/\D/g, '').slice(0, 6)
}

const verify = () => {
  error.value = ''

  if (twoFactorStore.verifyToken(code.value)) {
    emit('verified')
  } else {
    error.value = t('twoFactor.verify.invalidCode')
  }
}

const useBackupCode = () => {
  emit('backupCode')
}
</script>

<style scoped>
.two-factor-verify {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.verify-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
}

.verify-icon {
  width: 80px;
  height: 80px;
  background: #293848;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.verify-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 0.5rem;
}

.verify-content p {
  color: #6B7280;
  margin-bottom: 2rem;
}

.code-input-section {
  width: 100%;
  margin-bottom: 1rem;
}

.code-input-section input {
  width: 100%;
  padding: 1rem;
  font-size: 1.5rem;
  text-align: center;
  letter-spacing: 0.5rem;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.code-input-section input:focus {
  outline: none;
  border-color: #293848;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 8px;
  color: #991B1B;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.btn-verify {
  width: 100%;
  padding: 1rem;
  background: #293848;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.btn-verify:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-verify:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-backup {
  background: none;
  border: none;
  color: #6B7280;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-backup:hover {
  color: #293848;
  text-decoration: underline;
}
</style>
