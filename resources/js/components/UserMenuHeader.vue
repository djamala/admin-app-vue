<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import { LogOut, Settings, User as UserIcon } from '@lucide/vue';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const page = usePage();
const user = page.props.auth.user as { name: string; email: string; avatar?: string };

function initials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

function logout() {
    router.post('/logout');
}
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="relative h-9 w-9 rounded-full">
                <Avatar class="h-8 w-8">
                    <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                    <AvatarFallback>{{ initials(user.name) }}</AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-56">
            <DropdownMenuLabel class="flex flex-col">
                <span class="text-sm font-medium">{{ user.name }}</span>
                <span class="text-xs font-normal text-muted-foreground">{{ user.email }}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem as-child>
                <Link href="/settings/profile" class="flex items-center gap-2">
                    <UserIcon class="h-4 w-4" />
                    <span>Profil</span>
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem as-child>
                <Link href="/settings/appearance" class="flex items-center gap-2">
                    <Settings class="h-4 w-4" />
                    <span>Paramètres</span>
                </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem class="flex items-center gap-2 text-red-600 focus:text-red-600" @click="logout">
                <LogOut class="h-4 w-4" />
                <span>Se déconnecter</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
