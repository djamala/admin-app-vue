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
import permissions from '@/routes/permissions';
import type { Permission } from '@/types'

const props = defineProps<{
  permission: Permission
}>()

function copyId() {
  navigator.clipboard.writeText(props.permission.id.toString())

  alert(`ID de la permission copié dans le presse-papiers : ${props.permission.id}`)
}

function viewPermission() {
  // Logique pour afficher le profil de la permission
  alert(`Afficher le profil de la permission : ${props.permission.name}`)
}

function editPermission() {
  // Logique pour modifier le rôle de la permission
//   alert(`Modifier le rôle de la permission : ${props.permission.name}`)
    router.get(permissions.edit(props.permission.id).url)

}

function deletePermission() {
  // Logique pour suspendre le compte de la permission
//   alert(`Suspendre le compte de la permission : ${props.permission.name}`)

    if (confirm(`Êtes-vous sûr de vouloir supprimer la permission : ${props.permission.name} ?`)) {
        router.delete(permissions.destroy(props.permission.id).url)
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
        Copier l'ID permission
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="viewPermission">
        Voir la permission
      </DropdownMenuItem>
      <DropdownMenuItem @click="editPermission">
        Modifier la permission
      </DropdownMenuItem>
      <DropdownMenuItem class="text-destructive" @click="deletePermission">
        Supprimer la permission
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
