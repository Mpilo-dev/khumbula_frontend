/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		screens: {
  			dXL: {
  				max: '1920px'
  			},
  			dLG: {
  				max: '1600px'
  			},
  			dMD: {
  				max: '1400px'
  			},
  			dXS: {
  				max: '1200px'
  			},
  			tLG: {
  				max: '1024px'
  			},
  			tMD: {
  				max: '938px'
  			},
  			tSM: {
  				max: '768px'
  			},
  			tSM2: {
  				max: '612px'
  			},
  			mLG: {
  				max: '512px'
  			},
  			mMD: {
  				max: '414px'
  			},
  			mSM: {
  				max: '375px'
  			},
  			mXS: {
  				max: '312px'
  			}
  		},
  		container: {
  			center: true,
  			screens: {
  				'2xl': '1400px'
  			}
  		},
  		colors: {
  			khumbula_primary: '#1D6A63',
  			khumbula_secondary: '#F8D448',
  			khumbula_accent: '#F8D448',
  			khumbula_gray: '#8C8C8C',
  			khumbula_light_grey: '#C8C8C8',
  			khumbula_white: '#ffffff',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
