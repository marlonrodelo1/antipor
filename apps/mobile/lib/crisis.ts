/**
 * Deteccion de palabras clave de crisis (suicidio, autolesion, menores).
 * Reimplementacion local: packages/ai todavia no esta linkado al workspace
 * mobile. Mantener sincronizado con packages/ai/index.ts.
 */

const CRISIS_KEYWORDS: readonly string[] = [
  'suicid',
  'matarme',
  'quitarme la vida',
  'acabar con todo',
  'no quiero seguir',
  'hacerme dano',
  'hacerme daño',
  'autolesion',
  'autolesión',
  'cortarme',
  'menor de edad',
  'ninas',
  'niñas',
  'ninos',
  'niños',
  'abuso',
];

const stripDiacritics = (s: string): string =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '');

export function containsCrisisKeyword(text: string): boolean {
  if (!text) return false;
  const haystack = stripDiacritics(text.toLowerCase());
  return CRISIS_KEYWORDS.some((kw) =>
    haystack.includes(stripDiacritics(kw.toLowerCase()))
  );
}

export interface CrisisResource {
  name: string;
  phone: string;
  detail: string;
}

export const CRISIS_RESOURCES: readonly CrisisResource[] = [
  {
    name: '024 - Linea de prevencion del suicidio',
    phone: '024',
    detail: 'Espana. Gratis, 24 horas, confidencial.',
  },
  {
    name: 'Telefono de la Esperanza',
    phone: '717 003 717',
    detail: 'Escucha 24 h en toda Espana.',
  },
  {
    name: 'ANAR (menores y familias)',
    phone: '900 20 20 10',
    detail: 'Si lo que pasa tiene que ver con un menor.',
  },
];

export const CRISIS_LEAD_TEXT =
  'Para. Lo que has dicho importa, y no es algo para resolver tu solo ahora mismo. Aqui tienes gente que sabe acompanar esto.';
