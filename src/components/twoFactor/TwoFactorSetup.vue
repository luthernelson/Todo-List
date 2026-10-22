<template>
  <div v-if="twoFactorStore.showSetupModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ $t('twoFactor.setup.title') }}</h2>
        <button @click="closeModal" class="close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Étape 1: Introduction -->
        <div v-if="twoFactorStore.setupStep === 'intro'" class="setup-step">
          <div class="step-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3>{{ $t('twoFactor.setup.intro.title') }}</h3>
          <p>{{ $t('twoFactor.setup.intro.description') }}</p>

          <div class="info-box">
            <h4>{{ $t('twoFactor.setup.intro.howItWorks') }}</h4>
            <ol>
              <li>{{ $t('twoFactor.setup.intro.step1') }}</li>
              <li>{{ $t('twoFactor.setup.intro.step2') }}</li>
              <li>{{ $t('twoFactor.setup.intro.step3') }}</li>
            </ol>
          </div>

          <div class="warning-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>{{ $t('twoFactor.setup.intro.warning') }}</p>
          </div>

          <button @click="startScan" class="btn-primary">
            {{ $t('twoFactor.setup.intro.getStarted') }}
          </button>
        </div>

        <!-- Étape 2: Scanner le QR Code -->
        <div v-if="twoFactorStore.setupStep === 'scan'" class="setup-step">
          <div class="step-number">2</div>
          <h3>{{ $t('twoFactor.setup.scan.title') }}</h3>
          <p>{{ $t('twoFactor.setup.scan.description') }}</p>

          <div v-if="!twoFactorStore.tempQRCode" class="loading">
            <svg class="spinner" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            <p>{{ $t('twoFactor.loading') }}</p>
          </div>

          <div v-else class="qr-section">
            <div class="qr-code">
              <img :src="twoFactorStore.tempQRCode" alt="QR Code" />
            </div>

            <div class="manual-entry">
              <button @click="showSecret = !showSecret" class="text-btn">
                {{ showSecret ? $t('twoFactor.setup.scan.hideSecret') : $t('twoFactor.setup.scan.showSecret') }}
              </button>
              <div v-if="showSecret" class="secret-code">
                {{ twoFactorStore.tempSecret }}
              </div>
            </div>
          </div>

          <div class="step-actions">
            <button @click="cancelSetup" class="btn-secondary">
              {{ $t('common.cancel') }}
            </button>
            <button @click="goToVerify" class="btn-primary">
              {{ $t('twoFactor.setup.scan.next') }}
            </button>
          </div>
        </div>

        <!-- Étape 3: Vérifier le code -->
        <div v-if="twoFactorStore.setupStep === 'verify'" class="setup-step">
          <div class="step-number">3</div>
          <h3>{{ $t('twoFactor.setup.verify.title') }}</h3>
          <p>{{ $t('twoFactor.setup.verify.description') }}</p>

          <div class="verify-section">
            <div class="code-input">
              <input
                v-model="verificationCode"
                type="text"
                maxlength="6"
                placeholder="000000"
                @input="formatCode"
              />
            </div>

            <div v-if="verifyError" class="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ verifyError }}
            </div>

            <div v-if="verifySuccess" class="success-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {{ $t('twoFactor.setup.verify.success') }}
            </div>
          </div>

          <div class="step-actions">
            <button @click="goBackToScan" class="btn-secondary">
              {{ $t('common.back') }}
            </button>
            <button @click="verifyAndEnable" class="btn-primary" :disabled="verificationCode.length !== 6">
              {{ $t('twoFactor.setup.verify.enable') }}
            </button>
          </div>
        </div>

        <!-- Étape 4: Terminé - Codes de récupération -->
        <div v-if="twoFactorStore.setupStep === 'complete'" class="setup-step">
          <div class="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h3>{{ $t('twoFactor.setup.complete.title') }}</h3>
          <p>{{ $t('twoFactor.setup.complete.description') }}</p>

          <div class="backup-codes-section">
            <h4>{{ $t('twoFactor.setup.complete.backupCodesTitle') }}</h4>
            <p class="backup-warning">{{ $t('twoFactor.setup.complete.backupWarning') }}</p>

            <div class="backup-codes">
              <div v-for="(code, index) in twoFactorStore.backupCodes" :key="index" class="backup-code">
                {{ code }}
              </div>
            </div>

            <button @click="downloadBackupCodes" class="btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {{ $t('twoFactor.setup.complete.download') }}
            </button>
          </div>

          <button @click="closeModal" class="btn-primary">
            {{ $t('twoFactor.setup.complete.finish') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTwoFactorStore } from '@/stores/twoFactorStore'
import { useUserStore } from '@/stores/userStore'
import { useI18n } from 'vue-i18n'

const twoFactorStore = useTwoFactorStore()
const userStore = useUserStore()
const { t } = useI18n()

const showSecret = ref(false)
const verificationCode = ref('')
const verifyError = ref('')
const verifySuccess = ref(false)

const closeModal = () => {
  twoFactorStore.resetModal()
  showSecret.value = false
  verificationCode.value = ''
  verifyError.value = ''
  verifySuccess.value = false
}

const cancelSetup = () => {
  twoFactorStore.cancelSetup()
  showSecret.value = false
  verificationCode.value = ''
}

const startScan = async () => {
  twoFactorStore.nextStep()
  await twoFactorStore.generateQRCode(userStore.user?.email || 'user@workstream.com')
}

const goToVerify = () => {
  twoFactorStore.nextStep()
}

const goBackToScan = () => {
  twoFactorStore.setupStep = 'scan'
  verifyError.value = ''
}

const formatCode = () => {
  verificationCode.value = verificationCode.value.replace(/\D/g, '').slice(0, 6)
}

const verifyAndEnable = () => {
  verifyError.value = ''
  verifySuccess.value = false

  if (twoFactorStore.verifyToken(verificationCode.value)) {
    verifySuccess.value = true
    setTimeout(() => {
      twoFactorStore.enableTwoFactor()
      twoFactorStore.nextStep()
    }, 1000)
  } else {
    verifyError.value = t('twoFactor.setup.verify.invalidCode')
  }
}

const downloadBackupCodes = () => {
  const codes = twoFactorStore.backupCodes.join('\n')
  const blob = new Blob([codes], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'workstream-backup-codes.txt'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #F3F4F6;
  color: #1F2937;
}

.modal-body {
  padding: 2rem;
}

.setup-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.step-icon,
.success-icon {
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

.step-number {
  width: 60px;
  height: 60px;
  background: #293848;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.setup-step h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 0.5rem;
}

.setup-step p {
  color: #6B7280;
  margin-bottom: 1.5rem;
  max-width: 450px;
}

.info-box {
  background: #F0F9FF;
  border: 2px solid #BAE6FD;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
  width: 100%;
}

.info-box h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #0369A1;
  margin-bottom: 1rem;
}

.info-box ol {
  margin: 0;
  padding-left: 1.5rem;
  color: #0C4A6E;
}

.info-box li {
  margin-bottom: 0.5rem;
}

.warning-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #FEF3C7;
  border: 2px solid #FDE68A;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #92400E;
  font-size: 0.9rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.qr-code {
  padding: 1rem;
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
}

.qr-code img {
  width: 200px;
  height: 200px;
  display: block;
}

.manual-entry {
  text-align: center;
}

.text-btn {
  background: none;
  border: none;
  color: #293848;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
}

.text-btn:hover {
  text-decoration: underline;
}

.secret-code {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background: #F3F4F6;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  letter-spacing: 2px;
  color: #1F2937;
}

.verify-section {
  width: 100%;
  max-width: 300px;
  margin-bottom: 2rem;
}

.code-input input {
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

.code-input input:focus {
  outline: none;
  border-color: #293848;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.error-message,
.success-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.error-message {
  background: #FEF2F2;
  border: 1px solid #FECACA;
  color: #991B1B;
}

.success-message {
  background: #D1FAE5;
  border: 1px solid #A7F3D0;
  color: #065F46;
}

.step-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
}

.btn-primary,
.btn-secondary,
.btn-outline {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #293848;
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #6B7280;
  border: 2px solid #E5E7EB;
}

.btn-secondary:hover {
  border-color: #293848;
  color: #293848;
}

.btn-outline {
  background: white;
  color: #293848;
  border: 2px solid #293848;
  margin-top: 1rem;
}

.btn-outline:hover {
  background: #293848;
  color: white;
}

.backup-codes-section {
  width: 100%;
  background: #F0F9FF;
  border: 2px solid #BAE6FD;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.backup-codes-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #0369A1;
  margin-bottom: 0.5rem;
}

.backup-warning {
  color: #0C4A6E;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.backup-codes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.backup-code {
  padding: 0.5rem;
  background: white;
  border: 1px solid #BAE6FD;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  text-align: center;
  color: #0C4A6E;
}

@media (max-width: 640px) {
  .modal-content {
    margin: 1rem;
  }

  .backup-codes {
    grid-template-columns: 1fr;
  }

  .step-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
