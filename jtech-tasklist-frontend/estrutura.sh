#!/bin/bash

# --- Script para criar a estrutura de arquivos e pastas do projeto ---

# Define a pasta raiz
ROOT_DIR="src"

echo "Criando estrutura de pastas e arquivos em: $ROOT_DIR"
echo "---------------------------------------------------------"

# 1. Cria as pastas principais (usando -p para criar subdiretórios se não existirem)
mkdir -p "$ROOT_DIR/assets/styles"
mkdir -p "$ROOT_DIR/components/common"
mkdir -p "$ROOT_DIR/components/folder"
mkdir -p "$ROOT_DIR/components/task"
mkdir -p "$ROOT_DIR/components/layout"
mkdir -p "$ROOT_DIR/composables"
mkdir -p "$ROOT_DIR/stores"
mkdir -p "$ROOT_DIR/types"
mkdir -p "$ROOT_DIR/views"

echo "Pastas criadas com sucesso."

# 2. Cria os arquivos vazios (touch)

# Arquivos na raiz de src/
touch "$ROOT_DIR/App.vue"
touch "$ROOT_DIR/main.ts"

# Arquivos em assets/styles/
touch "$ROOT_DIR/assets/styles/tailwind.css"

# Arquivos em components/common/
touch "$ROOT_DIR/components/common/BaseButton.vue"
touch "$ROOT_DIR/components/common/BaseInput.vue"
touch "$ROOT_DIR/components/common/BaseModal.vue"

# Arquivos em components/folder/
touch "$ROOT_DIR/components/folder/FolderDropdown.vue"

# Arquivos em components/task/
touch "$ROOT_DIR/components/task/TaskCard.vue"
touch "$ROOT_DIR/components/task/TaskListGrid.vue"
touch "$ROOT_DIR/components/task/TaskDetailsModal.vue"
touch "$ROOT_DIR/components/task/QuickTaskForm.vue"
touch "$ROOT_DIR/components/task/TagFilter.vue"

# Arquivos em components/layout/
touch "$ROOT_DIR/components/layout/AppHeader.vue"

# Arquivos em composables/
touch "$ROOT_DIR/composables/useClickOutside.ts"

# Arquivos em stores/
touch "$ROOT_DIR/stores/auth.ts"
touch "$ROOT_DIR/stores/folders.ts"
touch "$ROOT_DIR/stores/tasks.ts"

# Arquivos em types/
touch "$ROOT_DIR/types/folder.ts"
touch "$ROOT_DIR/types/task.ts"

# Arquivos em views/
touch "$ROOT_DIR/views/DashboardView.vue"

echo "Arquivos vazios criados com sucesso."
echo "---------------------------------------------------------"
echo "Estrutura finalizada em $ROOT_DIR/"

# Opcional: Lista a estrutura criada para confirmação
# tree "$ROOT_DIR"
