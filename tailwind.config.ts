import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },

            typography: ({ theme }: { theme: any }) => ({
                light: {
                    css: {
                        '--tw-prose-body': theme('colors.zinc[200]'),
                        '--tw-prose-headings': theme('colors.white'),
                        '--tw-prose-lead': theme('colors.zinc[400]'),
                        '--tw-prose-links': theme('colors.white'),
                        '--tw-prose-bold': theme('colors.white'),
                        '--tw-prose-counters': theme('colors.zinc[400]'),
                        '--tw-prose-bullets': theme('colors.zinc[600]'),
                        '--tw-prose-hr': theme('colors.zinc[600]'),
                        '--tw-prose-quotes': theme('colors.zinc[200]'),
                        '--tw-prose-quote-borders': theme('colors.zinc[600]'),
                        '--tw-prose-captions': theme('colors.zinc[400]'),
                        '--tw-prose-code': theme('colors.white'),
                        '--tw-prose-pre-code': theme('colors.zinc[200]'),
                        '--tw-prose-pre-bg': theme('colors.zinc[600]'),
                        '--tw-prose-th-borders': theme('colors.zinc[600]'),
                        '--tw-prose-td-borders': theme('colors.zinc[400]'),
                        '--tw-prose-invert-body': theme('colors.zinc[200]'),
                        '--tw-prose-invert-headings': theme('colors.white'),
                        '--tw-prose-invert-lead': theme('colors.zinc[400]'),
                        '--tw-prose-invert-links': theme('colors.white'),
                        '--tw-prose-invert-bold': theme('colors.white'),
                        '--tw-prose-invert-counters': theme('colors.zinc[400]'),
                        '--tw-prose-invert-bullets': theme('colors.zinc[600]'),
                        '--tw-prose-invert-hr': theme('colors.zinc[600]'),
                        '--tw-prose-invert-quotes': theme('colors.zinc[200]'),
                        '--tw-prose-invert-quote-borders': theme('colors.zinc[600]'),
                        '--tw-prose-invert-captions': theme('colors.zinc[400]'),
                        '--tw-prose-invert-code': theme('colors.white'),
                        '--tw-prose-invert-pre-code': theme('colors.zinc[200]'),
                        '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
                        '--tw-prose-invert-th-borders': theme('colors.zinc[600]'),
                        '--tw-prose-invert-td-borders': theme('colors.zinc[400]'),
                        'code::before': { content: 'none' },
                        'code::after': { content: 'none' },
                    },
                },
            }),
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
export default config;
