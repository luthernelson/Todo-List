import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import * as OTPAuth from 'otpauth'
import QRCode from 'qrcode'

export const useTwoFactorStore = defineStore('twoFactor', {
  state: () => ({
    twoFactorEnabled: useStorage('twoFactorEnabled', false, localStorage),
    twoFactorSecret: useStorage('twoFactorSecret', null, localStorage),
    backupCodes: useStorage('backupCodes', [], localStorage),
    showSetupModal: false,
    setupStep: 'intro', // intro, scan, verify, complete
    tempSecret: null,
    tempQRCode: null,
    verificationCode: '',
  }),

  getters: {
    isTwoFactorEnabled: (state) => state.twoFactorEnabled,
    hasBackupCodes: (state) => state.backupCodes.length > 0,
  },

  actions: {
    // Générer un nouveau secret TOTP
    generateSecret() {
      const secret = new OTPAuth.Secret({ size: 20 })
      this.tempSecret = secret.base32
      return this.tempSecret
    },

    // Générer le QR code pour l'application d'authentification
    async generateQRCode(email) {
      if (!this.tempSecret) {
        this.generateSecret()
      }

      const totp = new OTPAuth.TOTP({
        issuer: 'WorkStream',
        label: email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: this.tempSecret,
      })

      const uri = totp.toString()
      this.tempQRCode = await QRCode.toDataURL(uri, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1F2937',
          light: '#FFFFFF',
        },
      })

      return this.tempQRCode
    },

    // Vérifier le code TOTP
    verifyToken(token) {
      if (!this.tempSecret && !this.twoFactorSecret) {
        return false
      }

      const secret = this.tempSecret || this.twoFactorSecret
      const totp = new OTPAuth.TOTP({
        issuer: 'WorkStream',
        label: 'user',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret,
      })

      const delta = totp.validate({ token: token, window: 1 })
      return delta !== null
    },

    // Activer le 2FA après vérification réussie
    enableTwoFactor() {
      this.twoFactorSecret = this.tempSecret
      this.twoFactorEnabled = true
      this.generateBackupCodes()
      this.tempSecret = null
      this.tempQRCode = null
      this.setupStep = 'complete'
    },

    // Désactiver le 2FA
    disableTwoFactor() {
      this.twoFactorEnabled = false
      this.twoFactorSecret = null
      this.backupCodes = []
      this.tempSecret = null
      this.tempQRCode = null
    },

    // Générer des codes de récupération
    generateBackupCodes() {
      const codes = []
      for (let i = 0; i < 10; i++) {
        const code = this.generateBackupCode()
        codes.push(code)
      }
      this.backupCodes = codes
      return codes
    },

    generateBackupCode() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
      let code = ''
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      // Format: XXXX-XXXX
      return code.slice(0, 4) + '-' + code.slice(4)
    },

    // Vérifier un code de récupération
    verifyBackupCode(code) {
      const index = this.backupCodes.indexOf(code)
      if (index !== -1) {
        // Supprimer le code utilisé
        this.backupCodes.splice(index, 1)
        return true
      }
      return false
    },

    // Démarrer le processus de configuration
    startSetup() {
      this.showSetupModal = true
      this.setupStep = 'intro'
      this.tempSecret = null
      this.tempQRCode = null
      this.verificationCode = ''
    },

    // Annuler la configuration
    cancelSetup() {
      this.showSetupModal = false
      this.setupStep = 'intro'
      this.tempSecret = null
      this.tempQRCode = null
      this.verificationCode = ''
    },

    // Passer à l'étape suivante
    nextStep() {
      const steps = ['intro', 'scan', 'verify', 'complete']
      const currentIndex = steps.indexOf(this.setupStep)
      if (currentIndex < steps.length - 1) {
        this.setupStep = steps[currentIndex + 1]
      }
    },

    // Réinitialiser le modal
    resetModal() {
      this.showSetupModal = false
      this.setupStep = 'intro'
      this.tempSecret = null
      this.tempQRCode = null
      this.verificationCode = ''
    },
  },
})
