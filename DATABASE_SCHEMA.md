# Structure de la Base de Données - TaskFlow Pro

## 📊 Vue d'ensemble

Ce document décrit la structure complète de la base de données pour TaskFlow Pro, une plateforme de gestion de projet avec modèle B2B (Business-to-Business).

**Modèle:**
- Les entreprises paient des abonnements
- Le propriétaire de l'entreprise crée et gère les comptes des employés
- Les utilisateurs peuvent avoir un compte personnel gratuit ou être membres d'une entreprise

---

## 🗄️ Tables Principales

### 1. users

Table des utilisateurs (comptes personnels et membres d'entreprise)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  account_type VARCHAR(50) DEFAULT 'personal',
  -- 'personal', 'business_owner', 'business_member'

  -- Profil personnel (gamification)
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_tasks_completed INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]',
  theme VARCHAR(50) DEFAULT 'default',
  statistics JSONB DEFAULT '{}',

  -- Authentification
  email_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_account_type (account_type)
);
```

### 2. companies

Table des entreprises

```sql
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  industry VARCHAR(100),
  size VARCHAR(50),
  -- 'small', 'medium', 'large', 'enterprise'
  website VARCHAR(255),

  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,

  settings JSONB DEFAULT '{
    "allowSelfRegistration": false,
    "requireApproval": true,
    "defaultUserRole": "member",
    "ssoEnabled": false
  }',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_slug (slug),
  INDEX idx_owner_id (owner_id),
  INDEX idx_subscription_id (subscription_id)
);
```

### 3. subscriptions

Table des abonnements (plans payants)

```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,

  plan_id VARCHAR(50) NOT NULL,
  -- 'starter', 'professional', 'enterprise'

  status VARCHAR(50) DEFAULT 'trial',
  -- 'trial', 'active', 'past_due', 'cancelled', 'expired'

  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  trial_ends_at TIMESTAMP,

  max_users INTEGER NOT NULL,
  max_projects INTEGER NOT NULL,
  current_users INTEGER DEFAULT 0,
  current_projects INTEGER DEFAULT 0,

  billing_cycle VARCHAR(20) DEFAULT 'monthly',
  -- 'monthly', 'yearly'

  next_billing_date TIMESTAMP,
  cancel_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_company_id (company_id),
  INDEX idx_status (status),
  INDEX idx_next_billing_date (next_billing_date)
);
```

### 4. company_members

Table des membres d'entreprise

```sql
CREATE TABLE company_members (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  email VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  role VARCHAR(50) DEFAULT 'member',
  -- 'owner', 'admin', 'member'

  status VARCHAR(50) DEFAULT 'active',
  -- 'active', 'pending', 'suspended', 'deleted'

  invited_by INTEGER REFERENCES users(id),
  invited_at TIMESTAMP,
  joined_at TIMESTAMP,
  last_active_at TIMESTAMP,

  permissions JSONB DEFAULT '{
    "canCreateProjects": true,
    "canInviteMembers": false,
    "canManageBilling": false,
    "canDeleteProjects": true
  }',

  department VARCHAR(100),
  job_title VARCHAR(100),
  phone VARCHAR(20),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(company_id, user_id),
  INDEX idx_company_id (company_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_role (role)
);
```

### 5. billing

Table des informations de facturation

```sql
CREATE TABLE billing (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,

  billing_address JSONB DEFAULT '{
    "line1": "",
    "line2": "",
    "city": "",
    "state": "",
    "postalCode": "",
    "country": ""
  }',

  tax_id VARCHAR(50),
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  payment_method_id INTEGER REFERENCES payment_methods(id) ON DELETE SET NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(company_id),
  INDEX idx_company_id (company_id)
);
```

### 6. payment_methods

Table des méthodes de paiement

```sql
CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,

  type VARCHAR(20) DEFAULT 'card',
  -- 'card', 'bank_account'

  is_default BOOLEAN DEFAULT FALSE,

  card_details JSONB DEFAULT '{
    "last4": "",
    "brand": "",
    "expiryMonth": "",
    "expiryYear": ""
  }',

  bank_details JSONB DEFAULT '{
    "last4": "",
    "bankName": ""
  }',

  stripe_payment_method_id VARCHAR(255),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_company_id (company_id)
);
```

### 7. invoices

Table des factures

```sql
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,

  number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',

  status VARCHAR(50) DEFAULT 'pending',
  -- 'pending', 'paid', 'failed', 'cancelled'

  due_date TIMESTAMP,
  paid_at TIMESTAMP,

  items JSONB DEFAULT '[]',
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,

  pdf_url TEXT,
  stripe_invoice_id VARCHAR(255),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_company_id (company_id),
  INDEX idx_status (status),
  INDEX idx_due_date (due_date)
);
```

### 8. payments

Table des paiements

```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id) ON DELETE SET NULL,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,

  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',

  status VARCHAR(50) DEFAULT 'pending',
  -- 'pending', 'succeeded', 'failed', 'refunded'

  payment_method_id INTEGER REFERENCES payment_methods(id) ON DELETE SET NULL,
  transaction_id VARCHAR(255),

  failure_reason TEXT,
  refunded_amount DECIMAL(10, 2) DEFAULT 0,

  stripe_payment_intent_id VARCHAR(255),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_invoice_id (invoice_id),
  INDEX idx_company_id (company_id),
  INDEX idx_status (status)
);
```

### 9. projects

Table des projets

```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  mode VARCHAR(50) DEFAULT 'personal',
  -- 'professional', 'personal'

  color VARCHAR(7) DEFAULT '#3B82F6',
  icon VARCHAR(50) DEFAULT 'folder',

  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,

  is_archived BOOLEAN DEFAULT FALSE,

  settings JSONB DEFAULT '{
    "allowGuestAccess": false,
    "requireApproval": false,
    "notificationsEnabled": true
  }',

  planning JSONB DEFAULT '{
    "estimatedStartDate": null,
    "estimatedEndDate": null,
    "actualStartDate": null,
    "actualEndDate": null,
    "totalEstimatedHours": 0
  }',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_owner_id (owner_id),
  INDEX idx_company_id (company_id),
  INDEX idx_mode (mode),
  INDEX idx_is_archived (is_archived)
);
```

### 10. phases

Table des phases/niveaux de projet

```sql
CREATE TABLE phases (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,

  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6B7280',
  order_num INTEGER NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_project_id (project_id),
  INDEX idx_order_num (order_num)
);
```

### 11. tasks

Table des tâches

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  phase_id INTEGER REFERENCES phases(id) ON DELETE SET NULL,

  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,

  status VARCHAR(50) DEFAULT 'todo',
  -- 'todo', 'in_progress', 'review', 'done', 'blocked'

  priority VARCHAR(50) DEFAULT 'medium',
  -- 'low', 'medium', 'high', 'urgent'

  tags JSONB DEFAULT '[]',

  time_tracking JSONB DEFAULT '{
    "estimatedHours": 0,
    "actualHours": 0,
    "remainingHours": 0
  }',

  due_date TIMESTAMP,
  start_date TIMESTAMP,

  dependencies JSONB DEFAULT '[]',
  -- IDs des tâches dépendantes

  completed_at TIMESTAMP,

  ai_suggestions JSONB DEFAULT '[]',

  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_project_id (project_id),
  INDEX idx_phase_id (phase_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_due_date (due_date)
);
```

### 12. task_assignees

Table des assignations de tâches

```sql
CREATE TABLE task_assignees (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  role VARCHAR(50) DEFAULT 'assignee',
  -- 'assignee', 'reviewer'

  instructions TEXT,

  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,

  UNIQUE(task_id, user_id),
  INDEX idx_task_id (task_id),
  INDEX idx_user_id (user_id)
);
```

### 13. subtasks

Table des sous-tâches

```sql
CREATE TABLE subtasks (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,

  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  order_num INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_task_id (task_id),
  INDEX idx_order_num (order_num)
);
```

### 14. attachments

Table des pièces jointes (images, vidéos, fichiers)

```sql
CREATE TABLE attachments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,

  type VARCHAR(20) NOT NULL,
  -- 'image', 'video', 'file'

  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,

  size BIGINT,
  mime_type VARCHAR(100),

  uploaded_by INTEGER REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_task_id (task_id),
  INDEX idx_project_id (project_id),
  INDEX idx_type (type)
);
```

### 15. comments

Table des commentaires

```sql
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,

  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  username VARCHAR(100),

  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',

  is_private BOOLEAN DEFAULT FALSE,
  reply_to INTEGER REFERENCES comments(id) ON DELETE SET NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_task_id (task_id),
  INDEX idx_project_id (project_id),
  INDEX idx_user_id (user_id),
  INDEX idx_reply_to (reply_to)
);
```

### 16. discussions

Table des discussions (messages de groupe et privés)

```sql
CREATE TABLE discussions (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  conversation_id INTEGER,
  -- null = groupe global, ID = conversation privée

  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  sender_name VARCHAR(100),

  recipient_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  -- null = message de groupe

  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',

  type VARCHAR(20) DEFAULT 'text',
  -- 'text', 'image', 'video', 'file'

  is_read BOOLEAN DEFAULT FALSE,
  read_by JSONB DEFAULT '[]',
  -- IDs des utilisateurs qui ont lu

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_project_id (project_id),
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_recipient_id (recipient_id),
  INDEX idx_created_at (created_at)
);
```

### 17. dashboard_widgets

Table des widgets de dashboard personnalisables

```sql
CREATE TABLE dashboard_widgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,

  type VARCHAR(50) NOT NULL,
  -- 'stat', 'chart', 'task-list', 'calendar', 'timer'

  title VARCHAR(255),
  position JSONB DEFAULT '{"x": 0, "y": 0, "w": 4, "h": 3}',
  config JSONB DEFAULT '{}',

  is_visible BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_user_id (user_id),
  INDEX idx_company_id (company_id)
);
```

### 18. ai_suggestions

Table des suggestions de l'IA

```sql
CREATE TABLE ai_suggestions (
  id SERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,

  type VARCHAR(50) NOT NULL,
  -- 'planning', 'bottleneck', 'optimization'

  title VARCHAR(255) NOT NULL,
  description TEXT,
  confidence DECIMAL(3, 2) DEFAULT 0.8,
  -- 0-1

  suggested_action TEXT,
  is_applied BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_task_id (task_id),
  INDEX idx_project_id (project_id),
  INDEX idx_type (type),
  INDEX idx_is_applied (is_applied)
);
```

### 19. invitations

Table des invitations (pour tracking)

```sql
CREATE TABLE invitations (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,

  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',

  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,

  status VARCHAR(50) DEFAULT 'pending',
  -- 'pending', 'accepted', 'declined', 'expired'

  invited_by INTEGER REFERENCES users(id),
  accepted_at TIMESTAMP,
  declined_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_token (token),
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_expires_at (expires_at)
);
```

---

## 🔗 Relations

```
users (1) ───< (N) company_members
users (1) ───< (N) projects (owner)
users (1) ───< (N) tasks (created_by)
users (1) ───< (N) task_assignees
users (1) ───< (N) comments
users (1) ───< (N) discussions

companies (1) ───< (N) projects
companies (1) ───< (N) company_members
companies (1) ───< (1) subscriptions
companies (1) ───< (1) billing
companies (1) ───< (N) payment_methods
companies (1) ───< (N) invoices
companies (1) ───< (N) payments

subscriptions (1) ───< (N) invoices
subscriptions (1) ───< (N) payments

projects (1) ───< (N) phases
projects (1) ───< (N) tasks
projects (1) ───< (N) attachments
projects (1) ───< (N) comments
projects (1) ───< (N) discussions

phases (1) ───< (N) tasks

tasks (1) ───< (N) task_assignees
tasks (1) ───< (N) subtasks
tasks (1) ───< (N) attachments
tasks (1) ───< (N) comments
tasks (1) ───< (N) ai_suggestions
```

---

## 📊 Index Recommandés

### Index de Performance

```sql
-- Requêtes fréquentes
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_tasks_phase_status ON tasks(phase_id, status);
CREATE INDEX idx_tasks_due_date_status ON tasks(due_date, status) WHERE due_date IS NOT NULL;
CREATE INDEX idx_discussions_project_created ON discussions(project_id, created_at DESC);
CREATE INDEX idx_comments_task_created ON comments(task_id, created_at DESC);

-- Recherche
CREATE INDEX idx_tasks_title_gin ON tasks USING gin(to_tsvector('french', title));
CREATE INDEX idx_projects_name_gin ON projects USING gin(to_tsvector('french', name));
```

---

## 🔐 Sécurité

### Chiffrement

Pour les données sensibles (mots de passe, tokens):

```sql
-- Utiliser bcrypt ou argon2 pour les mots de passe
-- Exemple avec bcrypt
password_hash VARCHAR(255) NOT NULL
-- Hash généré côté application avant insertion
```

### Row Level Security (PostgreSQL)

```sql
-- Activer RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Politique: Les membres ne peuvent voir que leur entreprise
CREATE POLICY company_isolation ON companies
  FOR ALL
  USING (
    id IN (
      SELECT company_id FROM company_members
      WHERE user_id = current_setting('app.current_user_id')::INTEGER
    )
  );
```

---

## 📈 Optimisations

### Partitionnement

Pour les grandes tables:

```sql
-- Partitionner discussions par date
CREATE TABLE discussions_2024 PARTITION OF discussions
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### Materialized Views

Pour les statistiques:

```sql
CREATE MATERIALIZED VIEW project_stats AS
SELECT
  p.id as project_id,
  p.name as project_name,
  COUNT(DISTINCT t.id) as total_tasks,
  COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as completed_tasks,
  COUNT(DISTINCT cm.user_id) as total_members
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
LEFT JOIN company_members cm ON p.company_id = cm.company_id
GROUP BY p.id, p.name;

-- Rafraîchir quotidiennement
REFRESH MATERIALIZED VIEW project_stats;
```

---

## 🔄 Triggers

### Mise à jour automatique des timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer à toutes les tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Mise à jour des compteurs

```sql
-- Incrémenter current_users quand un membre est ajouté
CREATE OR REPLACE FUNCTION increment_subscription_users()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE subscriptions
  SET current_users = current_users + 1
  WHERE id = (SELECT subscription_id FROM companies WHERE id = NEW.company_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_member_added
  AFTER INSERT ON company_members
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION increment_subscription_users();
```

---

## 🚀 Migration Database

### Script de création complet

```bash
# Exécuter dans PostgreSQL
psql -U username -d database_name < schema.sql
```

### Versions

- **v1.0**: Structure initiale
- **v1.1**: Ajout de l'IA et de la gamification
- **v1.2**: Modèle B2B complet

---

## 📝 Notes Importantes

1. **Foreign Keys**: Tous les ON DELETE sont en CASCADE ou SET NULL selon le cas
2. **JSONB**: Utilisé pour les données flexibles (settings, permissions, etc.)
3. **Timestamps**: created_at et updated_at sur toutes les tables
4. **Indexes**: Créés sur les colonnes fréquemment interrogées
5. **Constraints**: UNIQUE sur les champs qui doivent être uniques
6. **Enum**: Les valeurs énumérées sont stockées en VARCHAR pour flexibilité

---

## 🔧 Outils Recommandés

### Développement
- **pgAdmin**: Interface graphique PostgreSQL
- **DBeaver**: Client universel de base de données
- **Prisma**: ORM TypeScript (recommandé pour Node.js)

### Production
- **AWS RDS**: Managed PostgreSQL
- **Google Cloud SQL**: Managed PostgreSQL
- **DigitalOcean Managed Databases**: Option économique

### Monitoring
- **pgAdmin**: Monitoring intégré
- **Datadog**: Monitoring avancé
- **New Relic**: APM et monitoring

---

## 📊 Estimation de Taille

Pour une entreprise moyenne:
- **100 utilisateurs**
- **50 projets**
- **500 tâches**
- **2000 commentaires**
- **1000 discussions**

Estimation: ~50-100 MB de données

Pour 1000 entreprises:
- **100,000 utilisateurs**
- **50,000 projets**
- **500,000 tâches**
- **2,000,000 commentaires**
- **1,000,000 discussions**

Estimation: ~50-100 GB de données

---

**Fin de la documentation de la base de données**
