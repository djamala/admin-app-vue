<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ChevronRight } from '@lucide/vue';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import type { NavGroup, NavItem } from '@/types';

defineProps<{
    groups: NavGroup[];
}>();

const { isCurrentUrl } = useCurrentUrl();

// Vérifie si l'item lui-même OU un de ses sous-liens est actif
function isGroupActive(item: NavItem): boolean {
    // eslint-disable-next-line curly
    if (isCurrentUrl(item.href)) return true;
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    return item.items?.some((sub) => isCurrentUrl(sub.href)) ?? false;
}
</script>

<template>
    <SidebarGroup v-for="group in groups" :key="group.title" class="px-2 py-0">
        <Collapsible default-open class="group/collapsible">
            <SidebarGroupLabel as-child class="cursor-pointer">
                <CollapsibleTrigger class="flex w-full items-center justify-between uppercase text-sidebar-text/70 transition-colors hover:text-sidebar-text group-data-[state=open]/collapsible:text-sidebar-text">
                    {{ group.title }}
                    <ChevronRight
                        class="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90"
                    />
                </CollapsibleTrigger>
            </SidebarGroupLabel>

            <CollapsibleContent>
                <SidebarMenu>
                    <template v-for="item in group.items" :key="item.title">
                        <!-- Item SANS sous-menu -->
                        <SidebarMenuItem v-if="!item.items?.length">
                            <SidebarMenuButton
                                as-child
                                :is-active="isCurrentUrl(item.href)"
                                :tooltip="item.title"
                            >
                                <Link :href="item.href">
                                    <component :is="item.icon" />
                                    <span>{{ item.title }}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <!-- Item AVEC sous-menu -->
                        <Collapsible
                            v-else
                            as-child
                            :default-open="isGroupActive(item)"
                            class="group/sub"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger as-child>
                                    <SidebarMenuButton
                                        :tooltip="item.title"
                                        :is-active="isGroupActive(item)"
                                    >
                                        <component :is="item.icon" />
                                        <span>{{ item.title }}</span>
                                        <ChevronRight
                                            class="ml-auto h-4 w-4 transition-transform group-data-[state=open]/sub:rotate-90"
                                        />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem
                                            v-for="sub in item.items"
                                            :key="sub.title"
                                        >
                                            <SidebarMenuSubButton
                                                as-child
                                                :is-active="isCurrentUrl(sub.href)"
                                            >
                                                <Link :href="sub.href">
                                                    <component :is="sub.icon" />
                                                    <span>{{ sub.title }}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </template>
                </SidebarMenu>
            </CollapsibleContent>
        </Collapsible>
    </SidebarGroup>
</template>
