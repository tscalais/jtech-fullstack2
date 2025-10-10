<template>
  <div class="min-h-full">
    <Disclosure
      as="nav"
      class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300"
      v-slot="{ open }"
      v-if="autenticacaoStore.autenticado"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="shrink-0">
              <div class="size-12">
                <svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path d="M760.685714 936.228571H263.314286c-102.4 0-182.857143-80.457143-182.857143-182.857142V292.571429c0-102.4 80.457143-182.857143 182.857143-182.857143h504.685714C870.4 109.714286 950.857143 190.171429 950.857143 292.571429v460.8c-7.314286 95.085714-87.771429 182.857143-190.171429 182.857142zM263.314286 160.914286c-73.142857 0-131.657143 58.514286-131.657143 131.657143v460.8c0 73.142857 58.514286 131.657143 131.657143 131.657142h504.685714c73.142857 0 131.657143-58.514286 131.657143-131.657142V292.571429c0-73.142857-58.514286-131.657143-131.657143-131.657143H263.314286z" fill="#6366F1"/>
                  <path d="M731.428571 256V190.171429c0-73.142857-43.885714-131.657143-102.4-131.657143H387.657143c-58.514286 0-102.4 58.514286-102.4 131.657143V256H731.428571z" fill="#A5B4FC"/>
                  <path d="M731.428571 285.257143H263.314286v-21.942857-73.142857c0-87.771429 58.514286-160.914286 131.657143-160.914286h241.371428c73.142857 0 131.657143 73.142857 131.657143 160.914286v87.771428l-36.571429 7.314286z m-416.914285-58.514286h402.285714v-36.571428c0-58.514286-36.571429-102.4-80.457143-102.4H387.657143c-43.885714 0-80.457143 43.885714-80.457143 102.4v36.571428z" fill="#6366F1"/>
                  <path d="M833.828571 285.257143H190.171429c-14.628571 0-29.257143-14.628571-29.257143-29.257143s14.628571-29.257143 29.257143-29.257143h643.657142c14.628571 0 29.257143 14.628571 29.257143 29.257143s-14.628571 29.257143-29.257143 29.257143z" fill="#6366F1"/>
                  <path d="M378.88 546.157714l158.208 118.125715-30.573714 40.96L348.16 587.190857z" fill="#818CF8"/>
                  <path d="M468.260571 674.304l261.851429-275.894857 37.083429 35.254857-261.851429 275.894857z" fill="#818CF8"/>
                </svg>
              </div>
            </div>
            <div class="ml-6 relative hidden md:block">
              <FolderMenu />
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <Menu as="div" class="relative ml-3">
                <MenuButton
                  class="relative flex max-w-xs items-center rounded-full hover:text-white focus:outline-2 text-gray-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  <span class="absolute -inset-1.5" />
                  <span class="sr-only">Abrir menu do usuário</span>
                  <UserCircleIcon class="size-8" />
                </MenuButton>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline-1 outline-black/5 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                  >
                    <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                      <button
                        v-if="item.action"
                        @click="item.action"
                        :class="[
                          active ? 'bg-gray-100 outline-hidden dark:bg-white/5' : '',
                          'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full text-left',
                        ]"
                      >
                        {{ item.name }}
                      </button>
                      <a
                        v-else
                        :href="item.href"
                        :class="[
                          active ? 'bg-gray-100 outline-hidden dark:bg-white/5' : '',
                          'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300',
                        ]"
                        >{{ item.name }}</a
                      >
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
          <div class="-mr-2 flex md:hidden">
            <FolderListItem
              v-if="foldersStore.activeFolder"
              :folder="foldersStore.activeFolder"
              :active="true"
            />
            <DisclosureButton
              class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Abrir menu principal</span>
              <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
              <XMarkIcon v-else class="block size-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>
      <DisclosurePanel class="md:hidden">
        <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          <DisclosureButton
            v-for="item in navigation"
            :key="item.name"
            as="a"
            :href="item.href"
            :class="[
              item.current
                ? 'bg-gray-900 text-white dark:bg-gray-950/50'
                : 'text-gray-300 hover:bg-white/5 hover:text-white',
              'block rounded-md px-3 py-2 text-base font-medium',
            ]"
            :aria-current="item.current ? 'page' : undefined"
            >{{ item.name }}</DisclosureButton
          >
        </div>
        <div class="border-t border-white/10 pt-4 pb-3">
          <div class="flex items-center px-5">
            <div class="shrink-0">
              <UserCircleIcon class="size-10 text-gray-100" />
            </div>
            <div class="ml-3">
              <div class="text-base/5 font-medium text-white">{{ user.name }}</div>
              <div class="text-sm font-medium text-gray-400">{{ user.email }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1 px-2">
            <DisclosureButton
              v-for="item in userNavigation"
              :key="item.name"
              as="button"
              @click="item.action ? item.action() : null"
              class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white w-full text-left"
              >{{ item.name }}</DisclosureButton
            >
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <main>
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import FolderListItem from '@/components/FolderListItem.vue'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { useAutenticacaoStore } from '@/stores/auth'
import { useFoldersStore } from '@/stores/folders'
import { RouterView, useRouter } from 'vue-router'
import { computed } from 'vue'
import FolderMenu from '@/components/FolderMenu.vue'

const autenticacaoStore = useAutenticacaoStore()
const foldersStore = useFoldersStore()
const router = useRouter()

const user = computed(() => ({
  name: autenticacaoStore.usuario?.nomeUsuario || 'Usuário',
}))

const navigation = computed(() =>
  foldersStore.folders.map((folder) => ({
    name: folder.name,
    href: `/folders/${folder.id}`,
    current: router.currentRoute.value.path === `/folders/${folder.id}`,
  })),
)

const fazerLogout = () => {
  autenticacaoStore.sair()
  router.push('/login')
}

const userNavigation = computed(() => [
  { name: 'Seu perfil', href: '#' },
  { name: 'Configurações', href: '#' },
  { name: 'Sair', action: fazerLogout },
  { name: 'Registrar novo usuário', href: '/register' },
  {name : 'Login', href: '/login' },
])
</script>

<style>
/* Nenhum estilo global necessário, tudo via Tailwind */
</style>
