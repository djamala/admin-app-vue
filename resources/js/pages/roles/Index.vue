
<script setup lang="ts">
    import { Head, Link} from '@inertiajs/vue3';
    import { Button } from '@/components/ui/button'
    import roles from '@/routes/roles';
    import type { Role, BreadcrumbItem } from '@/types';
    import { columns } from '@/components/roles/columns';
    import DataTable from '@/components/roles/DataTable.vue';

    defineProps({ rolesData: Array<Role> });

    defineOptions({
        layout: {
            breadcrumbs: [
                {
                    title: 'Roles',
                    href: '/roles',
                },
            ] satisfies BreadcrumbItem[],
        },
    });



</script>


<template>
  <Head title="Roles" />

  <div class="container mx-auto py-10">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        Rôles
      </h1>

      <Button as-child>
        <Link :href="roles.create()">
          Créer un rôle
        </Link>
      </Button>
    </div>

    <DataTable :columns="columns" :data="rolesData" />
  </div>
</template>
