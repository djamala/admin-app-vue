<script setup lang="ts">
import type { Column } from '@tanstack/vue-table'
// eslint-disable-next-line import/order
import { ArrowDown, ArrowUp, ChevronsUpDown } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps {
  column: Column<any, any>
  title: string
}

defineProps<DataTableColumnHeaderProps>()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div v-if="column.getCanSort()" :class="cn('flex items-center space-x-2', $attrs.class ?? '')">
    <Button
      variant="ghost"
      size="sm"
      class="-ml-3 h-8 data-[state=open]:bg-accent"
      @click="column.toggleSorting(column.getIsSorted() === 'asc')"
    >
      <span>{{ title }}</span>
      <ArrowDown v-if="column.getIsSorted() === 'desc'" class="ml-2 h-4 w-4" />
      <ArrowUp v-else-if="column.getIsSorted() === 'asc'" class="ml-2 h-4 w-4" />
      <ChevronsUpDown v-else class="ml-2 h-4 w-4" />
    </Button>
  </div>

  <div v-else :class="$attrs.class">
    {{ title }}
  </div>
</template>
