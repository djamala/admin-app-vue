<script setup lang="ts">
import { router } from "@inertiajs/vue3";
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
import roles from '@/routes/roles';
import type { Role } from '@/types'

const props = defineProps<{
  role: Role
}>()

function copyId() {
  navigator.clipboard.writeText(props.role.id.toString())

  alert(`ID du rôle copié dans le presse-papiers : ${props.role.id}`)
}

function viewRole() {
  // Logique pour afficher le profil du rôle
  alert(`Afficher le profil du rôle : ${props.role.name}`)
}

function editRole() {
  // Logique pour modifier le rôle
//   alert(`Modifier le rôle : ${props.role.name}`)
    router.get(roles.edit(props.role.id).url)
}

function deleteRole() {
  // Logique pour supprimer le rôle
//   alert(`Supprimer le rôle : ${props.role.name}`)

    if (confirm(`Êtes-vous sûr de vouloir supprimer le rôle : ${props.role.name} ?`)) {
        router.delete(roles.destroy(props.role.id).url)
    }
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
        Copier l'ID rôle
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="viewRole">
        Voir le rôle
      </DropdownMenuItem>
      <DropdownMenuItem @click="editRole">
        Modifier le rôle
      </DropdownMenuItem>
      <DropdownMenuItem class="text-destructive" @click="deleteRole">
        Supprimer le rôle
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
