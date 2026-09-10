import { onMounted, ref } from 'vue';

export const primaryColors = [
    { name: 'Violet', value: '#7c3aed' },
    { name: 'Bleu', value: '#2563eb' },
    { name: 'Vert', value: '#16a34a' },
    { name: 'Rose', value: '#db2777' },
    { name: 'Orange', value: '#ea580c' },
] as const;

export const radiusOptions = ['0', '0.3', '0.5', '0.75', '1.0'] as const;

const DEFAULT_COLOR = primaryColors[0].value;
const DEFAULT_RADIUS = '0.5';

function applyColorToDOM(color: string) {
    // eslint-disable-next-line curly
    if (typeof document === 'undefined') return;

    document.documentElement.style.setProperty('--primary', color);
}

function applyRadiusToDOM(radius: string) {
    // eslint-disable-next-line curly
    if (typeof document === 'undefined') return;
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    document.documentElement.style.setProperty('--radius', `${radius}rem`);
}

/**
 * À appeler tôt (ex: app.ts) pour éviter le flash au chargement,
 * comme initializeTheme() pour l'apparence.
 */
export function initializeCustomizer(): void {
    // eslint-disable-next-line curly
    if (typeof window === 'undefined') return;

    const savedColor = localStorage.getItem('customizer-color') || DEFAULT_COLOR;
    const savedRadius = localStorage.getItem('customizer-radius') || DEFAULT_RADIUS;

    applyColorToDOM(savedColor);
    applyRadiusToDOM(savedRadius);
}

const selectedColor = ref(DEFAULT_COLOR);
const selectedRadius = ref(DEFAULT_RADIUS);

export function useCustomizer() {
    onMounted(() => {
        selectedColor.value = localStorage.getItem('customizer-color') || DEFAULT_COLOR;
        selectedRadius.value = localStorage.getItem('customizer-radius') || DEFAULT_RADIUS;

        // Au cas où initializeCustomizer() n'a pas été appelé globalement
        applyColorToDOM(selectedColor.value);
        applyRadiusToDOM(selectedRadius.value);
    });

    function updateColor(color: string) {
        selectedColor.value = color;
        localStorage.setItem('customizer-color', color);
        applyColorToDOM(color);
    }

    function updateRadius(radius: string) {
        selectedRadius.value = radius;
        localStorage.setItem('customizer-radius', radius);
        applyRadiusToDOM(radius);
    }

    function reset() {
        updateColor(DEFAULT_COLOR);
        updateRadius(DEFAULT_RADIUS);
    }

    return {
        selectedColor,
        selectedRadius,
        updateColor,
        updateRadius,
        reset,
    };
}
