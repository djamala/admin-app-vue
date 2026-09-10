
<script setup lang="ts">
    import { Head, Link} from '@inertiajs/vue3';
    import { columns } from '@/components/permissions/columns';
    import DataTable from '@/components/permissions/DataTable.vue';
    import { Button } from '@/components/ui/button'
    import type { Permission, BreadcrumbItem } from '@/types';
    import permissions from '@/routes/permissions';

    defineProps({ permissionsData: Array<Permission> });

    defineOptions({
        layout: {
            breadcrumbs: [
                {
                    title: 'Permissions',
                    href: '/permissions',
                },
            ] satisfies BreadcrumbItem[],
        },
    });



</script>


<template>
  <Head title="Permissions" />

  <div class="container mx-auto py-10">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        Permissions
      </h1>

      <Button as-child>
        <Link :href="permissions.create()">
          Créer une permission
        </Link>
      </Button>
    </div>

    <DataTable :columns="columns" :data="permissionsData" />
  </div>
</template>
