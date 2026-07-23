import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Primary orange
        'brand-orange': '#EA580C',
        'brand-orange-hover': '#C2410C',
        'brand-orange-deep': '#9A3412',

        // Status colors
        'status-submitted-dot': '#F59E0B',
        'status-submitted-bg': '#FEF3E2',
        'status-submitted-text': '#B45309',
        'status-submitted-border': '#FBE2C1',

        'status-approved-dot': '#22C55E',
        'status-approved-bg': '#E7F6EC',
        'status-approved-text': '#15803D',
        'status-approved-border': '#C6EBD1',

        'status-rejected-text': '#B91C1C',
        'status-rejected-bg': '#FDECEC',
        'status-rejected-border': '#F6D3D3',
        'status-rejected-btn-border': '#F0CFCF',

        'status-draft-dot': '#A8A29E',
        'status-draft-bg': '#F5F3F0',
        'status-draft-text': '#78716C',
        'status-draft-border': '#E7E2DA',

        'status-cancelled-dot': '#B0A99F',
        'status-cancelled-bg': '#F1EEEA',
        'status-cancelled-text': '#8A817A',
        'status-cancelled-border': '#E4DED6',

        // Text colors
        'text-primary': '#1C1917',
        'text-body': '#44403C',
        'text-muted': '#57534E',
        'text-faint': '#A8A29E',

        // Backgrounds
        'bg-page': '#EDE8E2',
        'bg-app': '#F7F4F0',
        'bg-surface': '#FFFFFF',
        'bg-warm-tint': '#FBF7F2',
        'bg-orange-tint': '#FFF3EC',
        'bg-manager-dark': '#1C1917',

        // Borders
        'border-warm': '#EDE7DF',
        'border-warm-alt': '#E1DAD1',
        'border-warm-alt2': '#EFEAE3',
        'border-hairline': '#F2ECE4',
      },

      fontFamily: {
        mono: ["'JetBrains Mono'", 'ui-monospace', 'monospace'],
      },

      fontSize: {
        h1: ['25px', { fontWeight: '800', letterSpacing: '-0.6px', lineHeight: '1.2' }],
        h2: ['18px', { fontWeight: '800', letterSpacing: '-0.2px' }],
        h3: ['13px', { fontWeight: '800', letterSpacing: '-0.2px' }],
        body: ['14px', { fontWeight: '400', lineHeight: '1.75' }],
        'body-sm': ['13px', { fontWeight: '700', lineHeight: '1.5' }],
        'body-xs': ['11px', { fontWeight: '700', lineHeight: '1.5' }],
        label: ['11px', { fontWeight: '700', letterSpacing: '0.6px' }],
        meta: ['11px', { fontWeight: '400' }],
      },

      borderRadius: {
        btn: '12px',
        card: '16px',
        frame: '20px',
        'nav-pill': '11px',
        'avatar-sm': '11px',
        'avatar-md': '14px',
      },

      boxShadow: {
        'button-orange': '0 8px 20px -8px rgba(234, 88, 12, 0.6)',
        'button-green': '0 8px 20px -8px rgba(22, 163, 74, 0.55)',
        frame: '0 30px 60px -30px rgba(60, 40, 20, 0.28)',
      },

      spacing: {
        'sidebar-width': '250px',
        'content-h-padding': '40px',
        'content-v-padding': '34px',
      },

      width: {
        'app-frame': '1300px',
        'sidebar': '250px',
      },

      maxWidth: {
        'app-frame': '1300px',
      },
    },
  },
  plugins: [],
};

export default config;
