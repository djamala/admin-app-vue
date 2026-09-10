/* eslint-disable @stylistic/padding-line-between-statements */
// eslint-disable-next-line import/order
import type { ColumnDef } from '@tanstack/vue-table'
// eslint-disable-next-line import/order
// import { ArrowUpDown } from '@lucide/vue'
// import type { CheckedState } from 'reka-ui'
import { h } from 'vue'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
// eslint-disable-next-line import/order
import DataTableDropdown from './DataTableDropdown.vue'
// eslint-disable-next-line import/order
import type { Permission } from '@/types'
import DataTableColumnHeader from './DataTableColumnHeader.vue'



export const columns: ColumnDef<Permission>[] = [

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

    // Actions par ligne
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
        const permission = row.original
        return h(DataTableDropdown, { permission })
        },
    },
]
