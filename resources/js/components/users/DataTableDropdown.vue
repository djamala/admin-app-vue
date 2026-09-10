<script setup lang="ts">
import { MoreHorizontal } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { User } from '@/types'

const props = defineProps<{
  user: User
}>()

function copyId() {
  navigator.clipboard.writeText(props.user.id.toString())

  alert(`ID de l'utilisateur copié dans le presse-papiers : ${props.user.id}`)
}

function viewProfile() {
  // Logique pour afficher le profil de l'utilisateur
  alert(`Afficher le profil de l'utilisateur : ${props.user.name}`)
}

function editRole() {
  // Logique pour modifier le rôle de l'utilisateur
  alert(`Modifier le rôle de l'utilisateur : ${props.user.name}`)
}

function suspendAccount() {
  // Logique pour suspendre le compte de l'utilisateur
  alert(`Suspendre le compte de l'utilisateur : ${props.user.name}`)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">Ouvrir le menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="copyId">
        Copier l'ID utilisateur
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="viewProfile">
        Voir le profil
      </DropdownMenuItem>
      <DropdownMenuItem @click="editRole">
        Modifier le rôle
      </DropdownMenuItem>
      <DropdownMenuItem class="text-destructive" @click="suspendAccount">
        Suspendre le compte
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
