export type IndustrySector = 
  | 'agribusiness'
  | 'tech'
  | 'logistics'
  | 'manufacturing'
  | 'hospitality'
  | 'healthcare'
  | 'finance'
  | 'commerce';

export interface SectorTheme {
  id: IndustrySector;
  name: string;
  tagline: string;
  primaryColorHex: string;
  // CSS Classes
  btnPrimary: string;
  btnSecondary: string;
  badge: string;
  badgeSuccess: string;
  textAccent: string;
  bgSurface: string;
  bgLight: string;
  borderAccent: string;
  activeNav: string;
  activeTab: string;
  avatarBg: string;
  chartPrimary: string;
  chartSecondary: string;
  ringFocus: string;
  // CSS Custom Properties for dynamic styling
  cssVariables: {
    '--brand-primary': string;
    '--brand-primary-hover': string;
    '--brand-badge-bg': string;
    '--brand-badge-text': string;
    '--brand-badge-border': string;
    '--brand-surface': string;
    '--brand-text': string;
  };
}

export const SECTOR_THEMES: Record<IndustrySector, SectorTheme> = {
  agribusiness: {
    id: 'agribusiness',
    name: 'Agribusiness & Produce Export',
    tagline: 'Deep Teal & Earth Ochre',
    primaryColorHex: '#0f766e',
    btnPrimary: 'bg-teal-800 hover:bg-teal-900 text-white',
    btnSecondary: 'bg-teal-50 text-teal-950 hover:bg-teal-100 border border-teal-200',
    badge: 'bg-teal-50 text-teal-800 border border-teal-200',
    badgeSuccess: 'bg-teal-50 text-teal-800 border border-teal-200',
    textAccent: 'text-teal-800',
    bgSurface: 'bg-teal-50/50',
    bgLight: 'bg-teal-50',
    borderAccent: 'border-teal-300',
    activeNav: 'bg-teal-950/70 text-teal-300 font-bold border-l-2 border-teal-400',
    activeTab: 'border-teal-800 text-teal-900 bg-teal-50/50',
    avatarBg: 'bg-teal-800',
    chartPrimary: '#0f766e',
    chartSecondary: '#14b8a6',
    ringFocus: 'focus:ring-teal-800',
    cssVariables: {
      '--brand-primary': '#0f766e',
      '--brand-primary-hover': '#115e59',
      '--brand-badge-bg': '#f0fdfa',
      '--brand-badge-text': '#0f766e',
      '--brand-badge-border': '#99f6e4',
      '--brand-surface': '#f0fdfa',
      '--brand-text': '#0f766e',
    },
  },
  tech: {
    id: 'tech',
    name: 'Technology, SaaS & Cloud',
    tagline: 'Deep Slate & Electric Cyan',
    primaryColorHex: '#0284c7',
    btnPrimary: 'bg-sky-800 hover:bg-sky-900 text-white',
    btnSecondary: 'bg-sky-50 text-sky-950 hover:bg-sky-100 border border-sky-200',
    badge: 'bg-sky-50 text-sky-900 border border-sky-200',
    badgeSuccess: 'bg-teal-50 text-teal-800 border border-teal-200',
    textAccent: 'text-sky-800',
    bgSurface: 'bg-sky-50/50',
    bgLight: 'bg-sky-50',
    borderAccent: 'border-sky-300',
    activeNav: 'bg-sky-950/60 text-sky-300 font-bold border-l-2 border-sky-400',
    activeTab: 'border-sky-800 text-sky-900 bg-sky-50/50',
    avatarBg: 'bg-sky-800',
    chartPrimary: '#0284c7',
    chartSecondary: '#0ea5e9',
    ringFocus: 'focus:ring-sky-800',
    cssVariables: {
      '--brand-primary': '#0284c7',
      '--brand-primary-hover': '#0369a1',
      '--brand-badge-bg': '#f0f9ff',
      '--brand-badge-text': '#0284c7',
      '--brand-badge-border': '#bae6fd',
      '--brand-surface': '#f0f9ff',
      '--brand-text': '#0284c7',
    },
  },
  logistics: {
    id: 'logistics',
    name: 'Freight, Logistics & Fleet',
    tagline: 'Industrial Amber & Deep Coal',
    primaryColorHex: '#b45309',
    btnPrimary: 'bg-amber-800 hover:bg-amber-900 text-white',
    btnSecondary: 'bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-200',
    badge: 'bg-amber-50 text-amber-900 border border-amber-200',
    badgeSuccess: 'bg-amber-50 text-amber-900 border border-amber-200',
    textAccent: 'text-amber-800',
    bgSurface: 'bg-amber-50/50',
    bgLight: 'bg-amber-50',
    borderAccent: 'border-amber-300',
    activeNav: 'bg-amber-950/60 text-amber-300 font-bold border-l-2 border-amber-400',
    activeTab: 'border-amber-800 text-amber-900 bg-amber-50/50',
    avatarBg: 'bg-amber-800',
    chartPrimary: '#b45309',
    chartSecondary: '#d97706',
    ringFocus: 'focus:ring-amber-800',
    cssVariables: {
      '--brand-primary': '#b45309',
      '--brand-primary-hover': '#92400e',
      '--brand-badge-bg': '#fffbeb',
      '--brand-badge-text': '#92400e',
      '--brand-badge-border': '#fde68a',
      '--brand-surface': '#fffbeb',
      '--brand-text': '#b45309',
    },
  },
  manufacturing: {
    id: 'manufacturing',
    name: 'Manufacturing & Industrial',
    tagline: 'Terracotta Rust & Oxide Stone',
    primaryColorHex: '#c2410c',
    btnPrimary: 'bg-orange-800 hover:bg-orange-900 text-white',
    btnSecondary: 'bg-orange-50 text-orange-950 hover:bg-orange-100 border border-orange-200',
    badge: 'bg-orange-50 text-orange-900 border border-orange-200',
    badgeSuccess: 'bg-orange-50 text-orange-900 border border-orange-200',
    textAccent: 'text-orange-800',
    bgSurface: 'bg-orange-50/50',
    bgLight: 'bg-orange-50',
    borderAccent: 'border-orange-300',
    activeNav: 'bg-orange-950/60 text-orange-300 font-bold border-l-2 border-orange-400',
    activeTab: 'border-orange-800 text-orange-900 bg-orange-50/50',
    avatarBg: 'bg-orange-800',
    chartPrimary: '#c2410c',
    chartSecondary: '#ea580c',
    ringFocus: 'focus:ring-orange-800',
    cssVariables: {
      '--brand-primary': '#c2410c',
      '--brand-primary-hover': '#9a3412',
      '--brand-badge-bg': '#fff7ed',
      '--brand-badge-text': '#9a3412',
      '--brand-badge-border': '#fed7aa',
      '--brand-surface': '#fff7ed',
      '--brand-text': '#c2410c',
    },
  },
  hospitality: {
    id: 'hospitality',
    name: 'Hospitality, Hotel & Tourism',
    tagline: 'Warm Burgundy & Deep Bronze',
    primaryColorHex: '#9f1239',
    btnPrimary: 'bg-rose-800 hover:bg-rose-900 text-white',
    btnSecondary: 'bg-rose-50 text-rose-950 hover:bg-rose-100 border border-rose-200',
    badge: 'bg-rose-50 text-rose-900 border border-rose-200',
    badgeSuccess: 'bg-rose-50 text-rose-900 border border-rose-200',
    textAccent: 'text-rose-800',
    bgSurface: 'bg-rose-50/50',
    bgLight: 'bg-rose-50',
    borderAccent: 'border-rose-300',
    activeNav: 'bg-rose-950/60 text-rose-300 font-bold border-l-2 border-rose-400',
    activeTab: 'border-rose-800 text-rose-900 bg-rose-50/50',
    avatarBg: 'bg-rose-800',
    chartPrimary: '#9f1239',
    chartSecondary: '#be123c',
    ringFocus: 'focus:ring-rose-800',
    cssVariables: {
      '--brand-primary': '#9f1239',
      '--brand-primary-hover': '#881337',
      '--brand-badge-bg': '#fff1f2',
      '--brand-badge-text': '#881337',
      '--brand-badge-border': '#fecdd3',
      '--brand-surface': '#fff1f2',
      '--brand-text': '#9f1239',
    },
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare & Pharmaceuticals',
    tagline: 'Clinical Teal & Deep Ocean',
    primaryColorHex: '#0f766e',
    btnPrimary: 'bg-teal-800 hover:bg-teal-900 text-white',
    btnSecondary: 'bg-teal-50 text-teal-950 hover:bg-teal-100 border border-teal-200',
    badge: 'bg-teal-50 text-teal-900 border border-teal-200',
    badgeSuccess: 'bg-teal-50 text-teal-900 border border-teal-200',
    textAccent: 'text-teal-800',
    bgSurface: 'bg-teal-50/50',
    bgLight: 'bg-teal-50',
    borderAccent: 'border-teal-300',
    activeNav: 'bg-teal-950/60 text-teal-300 font-bold border-l-2 border-teal-400',
    activeTab: 'border-teal-800 text-teal-900 bg-teal-50/50',
    avatarBg: 'bg-teal-800',
    chartPrimary: '#0f766e',
    chartSecondary: '#14b8a6',
    ringFocus: 'focus:ring-teal-800',
    cssVariables: {
      '--brand-primary': '#0f766e',
      '--brand-primary-hover': '#115e59',
      '--brand-badge-bg': '#f0fdfa',
      '--brand-badge-text': '#115e59',
      '--brand-badge-border': '#99f6e4',
      '--brand-surface': '#f0fdfa',
      '--brand-text': '#0f766e',
    },
  },
  finance: {
    id: 'finance',
    name: 'Financial Services & Treasury',
    tagline: 'Royal Navy & Gilded Ink',
    primaryColorHex: '#1e3a8a',
    btnPrimary: 'bg-blue-900 hover:bg-blue-950 text-white',
    btnSecondary: 'bg-blue-50 text-blue-950 hover:bg-blue-100 border border-blue-200',
    badge: 'bg-blue-50 text-blue-900 border border-blue-200',
    badgeSuccess: 'bg-teal-50 text-teal-800 border border-teal-200',
    textAccent: 'text-blue-900',
    bgSurface: 'bg-blue-50/50',
    bgLight: 'bg-blue-50',
    borderAccent: 'border-blue-300',
    activeNav: 'bg-blue-950/70 text-blue-300 font-bold border-l-2 border-blue-400',
    activeTab: 'border-blue-900 text-blue-950 bg-blue-50/50',
    avatarBg: 'bg-blue-900',
    chartPrimary: '#1e3a8a',
    chartSecondary: '#1d4ed8',
    ringFocus: 'focus:ring-blue-900',
    cssVariables: {
      '--brand-primary': '#1e3a8a',
      '--brand-primary-hover': '#172554',
      '--brand-badge-bg': '#eff6ff',
      '--brand-badge-text': '#1e3a8a',
      '--brand-badge-border': '#bfdbfe',
      '--brand-surface': '#eff6ff',
      '--brand-text': '#1e3a8a',
    },
  },
  commerce: {
    id: 'commerce',
    name: 'Wholesale & General Commerce',
    tagline: 'Corporate Teal & Earth Stone',
    primaryColorHex: '#0f766e',
    btnPrimary: 'bg-teal-800 hover:bg-teal-900 text-white',
    btnSecondary: 'bg-teal-50 text-teal-950 hover:bg-teal-100 border border-teal-200',
    badge: 'bg-teal-50 text-teal-800 border border-teal-200',
    badgeSuccess: 'bg-teal-50 text-teal-800 border border-teal-200',
    textAccent: 'text-teal-800',
    bgSurface: 'bg-teal-50/50',
    bgLight: 'bg-teal-50',
    borderAccent: 'border-teal-300',
    activeNav: 'bg-teal-950/70 text-teal-300 font-bold border-l-2 border-teal-400',
    activeTab: 'border-teal-800 text-teal-900 bg-teal-50/50',
    avatarBg: 'bg-teal-800',
    chartPrimary: '#0f766e',
    chartSecondary: '#14b8a6',
    ringFocus: 'focus:ring-teal-800',
    cssVariables: {
      '--brand-primary': '#0f766e',
      '--brand-primary-hover': '#115e59',
      '--brand-badge-bg': '#f0fdfa',
      '--brand-badge-text': '#0f766e',
      '--brand-badge-border': '#99f6e4',
      '--brand-surface': '#f0fdfa',
      '--brand-text': '#0f766e',
    },
  },
};

/**
 * Resolves the SectorTheme given an organization's industry string.
 */
export function getSectorTheme(industryString?: string): SectorTheme {
  if (!industryString) return SECTOR_THEMES.agribusiness;

  const ind = industryString.toLowerCase();

  if (ind.includes('agro') || ind.includes('fresh') || ind.includes('farm') || ind.includes('produce') || ind.includes('agriculture')) {
    return SECTOR_THEMES.agribusiness;
  }
  if (ind.includes('software') || ind.includes('tech') || ind.includes('cloud') || ind.includes('saas') || ind.includes('it ') || ind.includes('digital')) {
    return SECTOR_THEMES.tech;
  }
  if (ind.includes('logistics') || ind.includes('freight') || ind.includes('transport') || ind.includes('fleet') || ind.includes('haulage')) {
    return SECTOR_THEMES.logistics;
  }
  if (ind.includes('manufactur') || ind.includes('construct') || ind.includes('industrial') || ind.includes('factory') || ind.includes('process')) {
    return SECTOR_THEMES.manufacturing;
  }
  if (ind.includes('hotel') || ind.includes('hospitality') || ind.includes('resort') || ind.includes('tourism') || ind.includes('restaurant') || ind.includes('culinary')) {
    return SECTOR_THEMES.hospitality;
  }
  if (ind.includes('health') || ind.includes('medical') || ind.includes('pharma') || ind.includes('clinic') || ind.includes('hospital')) {
    return SECTOR_THEMES.healthcare;
  }
  if (ind.includes('sacco') || ind.includes('finance') || ind.includes('bank') || ind.includes('investment') || ind.includes('treasury') || ind.includes('microfinance')) {
    return SECTOR_THEMES.finance;
  }

  return SECTOR_THEMES.commerce;
}
