export const T = {
  bg:          '#FAF4EE',
  surface:     '#FFFFFF',
  surfaceAlt:  '#F4EAE1',
  ink:         '#3A241A',
  inkSoft:     '#6F5546',   // escurecido p/ contraste AA em texto pequeno
  line:        '#EADCD0',
  lineSoft:    '#F2E8DF',
  primary:     '#A8502F',
  primaryHover:'#923F22',
  primaryText: '#8A3F22',   // terracota p/ texto sobre primarySoft
  primaryInk:  '#FFF8F3',
  primarySoft: '#F2E2D8',
  accent:      '#C08A3E',
  green:       '#1F4A45',   // verde-petróleo do logo
  sage:        '#5E8B78',
  sageSoft:    '#E3EEE8',
  maxWidth:    1120,
  radius:      16,
  radiusSm:    11,
  heading:     "'Cormorant Garamond', Georgia, serif",
  headingWeight: 600 as number,
  body:        "'Manrope', system-ui, sans-serif",
  nav:         '#3A241A',
}

export const SERVICE_TINTS: Record<number, { tint: string; ink: string }> = {
  1: { tint: '#F0DDCF', ink: '#A8502F' },
  2: { tint: '#EADFD0', ink: '#9A7B3F' },
  3: { tint: '#E9D9CE', ink: '#8A5A45' },
  4: { tint: '#F2E0D6', ink: '#B5603A' },
  5: { tint: '#E6D6C6', ink: '#7C5A3A' },
}

const DEFAULT_TINT = { tint: '#F0DDCF', ink: '#A8502F' }

export function serviceTint(id: number): { tint: string; ink: string } {
  return SERVICE_TINTS[id] ?? DEFAULT_TINT
}

const SERVICE_ICONS: Record<number, string> = {
  1: 'polish',
  2: 'foot',
  3: 'hand',
  4: 'sparkle',
  5: 'nail',
}

export function serviceIcon(id: number): string {
  return SERVICE_ICONS[id] ?? 'polish'
}
