
<script setup lang="ts">
    import { Head, Link} from '@inertiajs/vue3';
    import { Button } from '@/components/ui/button'
    import { columns } from '@/components/users/columns';
    import DataTable from '@/components/users/DataTable.vue';
    import users from '@/routes/users';
    import type { User, BreadcrumbItem } from '@/types';

    defineProps({ usersData: Array<User> });

    defineOptions({
        layout: {
            breadcrumbs: [
                {
                    title: 'Users',
                    href: '/users',
                },
            ] satisfies BreadcrumbItem[],
        },
    });



</script>


<template>
  <Head title="Users" />

  <div class="container mx-auto py-10">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        Utilisateurs
      </h1>

      <Button as-child>
        <Link :href="users.create()">
          Créer un utilisateur
        </Link>
      </Button>
    </div>

    <DataTable :columns="columns" :data="usersData" />
  </div>
</template>
