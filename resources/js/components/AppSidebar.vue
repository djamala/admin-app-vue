<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { BookOpen, FolderGit2, LayoutGrid, Users, Package } from '@lucide/vue';
import AppLogo from '@/components/AppLogo.vue';
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavGroup } from '@/types';

// dans AppSidebar.vue
const navGroups: NavGroup[] = [
    {
        title: 'Général',
        items: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        ],
    },
    {
        title: 'Gestion',
        items: [
            {
                title: 'Utilisateurs',
                icon: Users,
                href: '#', // pas cliquable directement, sert juste de toggle
                items: [
                    { title: 'Liste', href: '/users' },
                    { title: 'Rôles', href: '/roles' },
                    { title: 'Permissions', href: '/permissions' },
                ],
            },
            {
                title: 'Produits',
                icon: Package,
                href: '#',
                items: [
                    { title: 'Catalogue', href: '/products' },
                    { title: 'Catégories', href: '/products/categories' },
                ],
            },
        ],
    },
];

const footerNavItems = [
    { title: 'Repository', href: 'https://github.com/laravel/vue-starter-kit', icon: FolderGit2 },
    { title: 'Documentation', href: 'https://laravel.com/docs/starter-kits#vue', icon: BookOpen },
];
</script>

<template>
    <Sidebar collapsible="icon" variant="floating">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="dashboard()">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :groups="navGroups" />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
