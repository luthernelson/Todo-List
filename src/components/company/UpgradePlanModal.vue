<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Choisir un plan</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="plans-grid">
          <div
            v-for="plan in plans"
            :key="plan.id"
            :class="['plan-card', { active: selectedPlan === plan.id, popular: plan.id === 'professional' }]"
            @click="selectedPlan = plan.id"
          >
            <div v-if="plan.id === 'professional'" class="popular-badge">
              Populaire
            </div>
            <div class="plan-icon">
              <i :class="getPlanIcon(plan.id)"></i>
            </div>
            <h3 class="plan-name">{{ plan.name }}</h3>
            <div class="plan-price">
              <span class="price-amount">{{ plan.price }}€</span>
              <span class="price-period">/mois</span>
            </div>
            <div class="plan-limits">
              <div class="limit-item">
                <i class="fa-solid fa-users"></i>
                <span>{{ plan.maxUsers === -1 ? 'Illimité' : plan.maxUsers + ' utilisateurs' }}</span>
              </div>
              <div class="limit-item">
                <i class="fa-solid fa-folder"></i>
                <span>{{ plan.maxProjects === -1 ? 'Illimité' : plan.maxProjects + ' projets' }}</span>
              </div>
            </div>
            <ul class="plan-features">
              <li v-for="feature in plan.features" :key="feature">
                <i class="fa-solid fa-check"></i>
                {{ feature }}
              </li>
            </ul>
            <button
              :class="['plan-btn', { active: selectedPlan === plan.id }]"
              @click.stop="selectPlan(plan.id)"
            >
              {{ selectedPlan === plan.id ? 'Sélectionné' : 'Choisir' }}
            </button>
          </div>
        </div>

        <div class="billing-cycle">
          <label>
            <input v-model="billingCycle" type="radio" value="monthly" />
            <span>Mensuel</span>
          </label>
          <label>
            <input v-model="billingCycle" type="radio" value="yearly" />
            <span>Annuel <span class="discount">(-20%)</span></span>
          </label>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-secondary">
            Annuler
          </button>
          <button @click="confirmUpgrade" class="btn-primary">
            Confirmer l'upgrade
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SUBSCRIPTION_PLANS } from '@/types/projectModels'

const props = defineProps({
  currentPlan: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'upgraded'])

const selectedPlan = ref(props.currentPlan?.id || SUBSCRIPTION_PLANS.STARTER.id)
const billingCycle = ref('monthly')

const plans = Object.values(SUBSCRIPTION_PLANS)

const getPlanIcon = (planId) => {
  const icons = {
    starter: 'fa-solid fa-rocket',
    professional: 'fa-solid fa-building',
    enterprise: 'fa-solid fa-crown',
  }
  return icons[planId] || 'fa-solid fa-star'
}

const selectPlan = (planId) => {
  selectedPlan.value = planId
}

const confirmUpgrade = () => {
  emit('upgraded', selectedPlan.value)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 0.5rem;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.modal-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.plan-card {
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.plan-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
}

.plan-card.active {
  border-color: #667eea;
  background: #f0f4ff;
}

.plan-card.popular {
  border-color: #f59e0b;
}

.plan-card.popular:hover {
  border-color: #d97706;
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #f59e0b;
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.plan-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 0.5rem;
}

.plan-price {
  text-align: center;
  margin-bottom: 1.5rem;
}

.price-amount {
  font-size: 2.5rem;
  font-weight: 800;
  color: #667eea;
}

.price-period {
  font-size: 1rem;
  color: #6b7280;
}

.plan-limits {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.limit-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.limit-item i {
  color: #667eea;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.plan-features li i {
  color: #10b981;
}

.plan-btn {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #667eea;
  border-radius: 0.5rem;
  background: white;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.plan-btn:hover {
  background: #667eea;
  color: white;
}

.plan-btn.active {
  background: #667eea;
  color: white;
}

.billing-cycle {
  display: flex;
  gap: 2rem;
  justify-content: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
}

.billing-cycle label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.billing-cycle input[type="radio"] {
  cursor: pointer;
}

.discount {
  background: #10b981;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-secondary,
.btn-primary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 1024px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
}
</style>
