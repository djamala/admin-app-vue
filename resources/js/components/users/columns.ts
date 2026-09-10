/* eslint-disable @stylistic/padding-line-between-statements */
// eslint-disable-next-line import/order
import type { ColumnDef } from '@tanstack/vue-table'
// eslint-disable-next-line import/order
// import { ArrowUpDown } from '@lucide/vue'
// import type { CheckedState } from 'reka-ui'
import { h } from 'vue'
import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
// eslint-disable-next-line import/order
import DataTableDropdown from './DataTableDropdown.vue'
// eslint-disable-next-line import/order
import type { User } from '@/types'
import DataTableColumnHeader from './DataTableColumnHeader.vue'


// export interface User {
//   id: string
//   name: string
//   email: string
//   role: 'admin' | 'editor' | 'viewer'
//   status: 'active' | 'invited' | 'suspended'
// }

// Couleur du badge selon le statut
function statusVariant(status: User['status']) {
  switch (status) {
    case 'active':
      return 'default'
    case 'invited':
      return 'secondary'
    case 'suspended':
      return 'destructive'
  }
}

export const columns: ColumnDef<User>[] = [
  // Colonne de sélection (checkbox)
//   {
//     id: 'select',
//     header: ({ table }) =>
//       h(Checkbox, {
//         'modelValue':
//           table.getIsAllPageRowsSelected()
//           || (table.getIsSomePageRowsSelected() && 'indeterminate'),
//         'onUpdate:modelValue': (value: boolean) =>
//           table.toggleAllPageRowsSelected(!!value),
//         'ariaLabel': 'Select all',
//       }),
//     cell: ({ row }) =>
//       h(Checkbox, {
//         'modelValue': row.getIsSelected(),
//         'onUpdate:modelValue': (value: boolean) => row.toggleSelected(!!value),
//         'ariaLabel': 'Select row',
//       }),
//     enableSorting: false,
//     enableHiding: false,
//   },

    // {
    //     id: 'select',
    //     header: ({ table }) =>
    //         h(Checkbox, {
    //         modelValue:
    //             table.getIsAllPageRowsSelected() ||
    //             (table.getIsSomePageRowsSelected() && 'indeterminate'),

    //         'onUpdate:modelValue': (value: CheckedState) => {
    //             table.toggleAllPageRowsSelected(value === true)
    //         },

    //         ariaLabel: 'Select all',
    //         }),

    //     cell: ({ row }) =>
    //         h(Checkbox, {
    //         modelValue: row.getIsSelected(),

    //         'onUpdate:modelValue': (value: CheckedState) => {
    //             row.toggleSelected(value === true)
    //         },

    //         ariaLabel: 'Select row',
    //         }),

    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
        'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all',
        }),
        cell: ({ row }) => h(Checkbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': value => row.toggleSelected(!!value),
        'ariaLabel': 'Select row',
        }),
        enableSorting: false,
        enableHiding: false,
    },

  // Nom — TRIABLE
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Nom' }),
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('name')),
    enableSorting: true,
  },

  // Email — PAS triable (juste un header texte simple)
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
    enableSorting: false,
  },

  // Rôle — PAS triable, mais filtrable par facette
  {
    accessorKey: 'role',
    header: 'Rôle',
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('role')),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
  },

  // Statut — TRIABLE
  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Statut' }),
    cell: ({ row }) => {
      const status = row.getValue('status') as User['status']
      return h(Badge, { variant: statusVariant(status), class: 'capitalize' }, () => status)
    },
    enableSorting: true,
  },

  // Actions par ligne
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original
      return h(DataTableDropdown, { user })
    },
  },
]
