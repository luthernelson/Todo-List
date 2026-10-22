import { Users, Task } from "./profile"

export const initData = () => {
  if (!localStorage.getItem('Users')){
    localStorage.setItem('Users', JSON.stringify(Users));
  }
  
  if ( !localStorage.getItem('Tasks')){
    localStorage.setItem('Tasks', JSON.stringify(Task));
  }

  // Mock Projects
  if (!localStorage.getItem('Projects')) {
    const mockProjects = [
      {
        id: 1,
        name: 'Site Web E-commerce',
        description: 'Développement d\'un site e-commerce complet avec panier et paiement',
        color: '#667eea',
        icon: 'code',
        status: 'active',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            id: 1,
            title: 'Créer la page d\'accueil',
            description: 'Design et développement de la landing page',
            status: 'done',
            priority: 'high',
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            assigneeId: 1,
            phaseId: 1,
            timeTracking: {
              estimatedHours: 8,
              actualHours: 6,
            },
          },
          {
            id: 2,
            title: 'Configurer la base de données',
            description: 'Setup de la base de données PostgreSQL',
            status: 'done',
            priority: 'high',
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            assigneeId: 2,
            phaseId: 1,
            timeTracking: {
              estimatedHours: 4,
              actualHours: 5,
            },
          },
          {
            id: 3,
            title: 'Intégrer le système de paiement',
            description: 'Stripe integration pour les paiements',
            status: 'in_progress',
            priority: 'high',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            assigneeId: 1,
            phaseId: 2,
            timeTracking: {
              estimatedHours: 12,
              actualHours: 4,
            },
          },
          {
            id: 4,
            title: 'Créer le panier d\'achat',
            description: 'Fonctionnalité panier avec gestion des quantités',
            status: 'todo',
            priority: 'medium',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            assigneeId: 2,
            phaseId: 2,
            timeTracking: {
              estimatedHours: 6,
              actualHours: 0,
            },
          },
        ],
        phases: [
          { id: 1, name: 'Phase 1: Setup', color: '#667eea', startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
          { id: 2, name: 'Phase 2: Développement', color: '#10b981', startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
          { id: 3, name: 'Phase 3: Tests', color: '#f59e0b', startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
        ],
        planning: {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          totalEstimatedHours: 30,
        },
        budget: {
          enabled: true,
          total: 5000,
          spent: 1200,
          currency: 'EUR',
        },
        members: [1, 2],
      },
      {
        id: 2,
        name: 'Application Mobile',
        description: 'App mobile iOS et Android pour gestion de tâches',
        color: '#10b981',
        icon: 'mobile',
        status: 'active',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            id: 5,
            title: 'Design des maquettes',
            description: 'Création des wireframes et designs UI',
            status: 'done',
            priority: 'high',
            dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            assigneeId: 1,
            phaseId: 1,
            timeTracking: {
              estimatedHours: 16,
              actualHours: 14,
            },
          },
          {
            id: 6,
            title: 'Développement backend API',
            description: 'API RESTful pour l\'application mobile',
            status: 'in_progress',
            priority: 'high',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            assigneeId: 2,
            phaseId: 2,
            timeTracking: {
              estimatedHours: 20,
              actualHours: 8,
            },
          },
        ],
        phases: [
          { id: 1, name: 'Design', color: '#ec4899', startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
          { id: 2, name: 'Développement', color: '#8b5cf6', startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        ],
        planning: {
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          totalEstimatedHours: 36,
        },
        budget: {
          enabled: false,
        },
        members: [1, 2],
      },
      {
        id: 3,
        name: 'Marketing Campaign',
        description: 'Campagne marketing pour le lancement produit',
        color: '#f59e0b',
        icon: 'rocket',
        status: 'planning',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tasks: [
          {
            id: 7,
            title: 'Créer les visuels publicitaires',
            description: 'Design des banners et assets marketing',
            status: 'todo',
            priority: 'medium',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            assigneeId: 1,
            phaseId: 1,
            timeTracking: {
              estimatedHours: 10,
              actualHours: 0,
            },
          },
        ],
        phases: [
          { id: 1, name: 'Préparation', color: '#f59e0b', startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        ],
        planning: {
          startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          totalEstimatedHours: 40,
        },
        budget: {
          enabled: true,
          total: 10000,
          spent: 0,
          currency: 'EUR',
        },
        members: [1],
      },
    ]
    localStorage.setItem('Projects', JSON.stringify(mockProjects))
  }

  // Mock Companies
  if (!localStorage.getItem('Companies')) {
    const mockCompanies = [
      {
        id: 1,
        name: 'TechCorp Inc.',
        slug: 'techcorp',
        description: 'Entreprise technologique innovante spécialisée dans le développement de logiciels',
        industry: 'technology',
        size: 'medium',
        website: 'https://techcorp.com',
        ownerId: 4,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        subscription: {
          id: 1,
          companyId: 1,
          planId: 'starter',
          status: 'trial',
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          maxUsers: 5,
          maxProjects: 10,
          currentUsers: 3,
          currentProjects: 5,
          billingCycle: 'monthly',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        members: [
          {
            id: 1,
            companyId: 1,
            userId: 4,
            email: 'owner@company.com',
            username: 'CompanyOwner',
            role: 'owner',
            status: 'active',
            joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 2,
            companyId: 1,
            userId: 5,
            email: 'member@company.com',
            username: 'CompanyMember',
            role: 'member',
            status: 'active',
            joinedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 3,
            companyId: 1,
            userId: 2,
            email: 'user1@workstream.com',
            username: 'UserPerso1',
            role: 'admin',
            status: 'active',
            joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        invoices: [
          {
            id: 1,
            companyId: 1,
            number: 'INV-001',
            amount: 29,
            status: 'paid',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            paidAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
            total: 29,
          },
        ],
      },
    ]
    localStorage.setItem('Companies', JSON.stringify(mockCompanies))
  }
}
