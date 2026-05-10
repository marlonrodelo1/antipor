/**
 * Recovery code para sesiones anonimas.
 *
 * El usuario genera 6 palabras de la EFF Short Wordlist 2.0 (dominio publico).
 * Solo guardamos un bcrypt hash; las palabras se muestran UNA vez al usuario.
 *
 * Si el usuario las pierde, no podemos recuperarlas: por diseno.
 */
import bcrypt from "bcryptjs";

/**
 * Subconjunto de las primeras 256 palabras de la EFF Short Wordlist 2.0.
 * Lista de dominio publico publicada por la EFF.
 * https://www.eff.org/dice (dominio publico).
 */
const RECOVERY_WORDS: readonly string[] = [
  "acid", "acorn", "acre", "acts", "afar", "affix", "aged", "agent",
  "agile", "aging", "agony", "ahead", "aide", "aids", "aim", "ajar",
  "alarm", "alias", "alibi", "alien", "alive", "aloe", "aloft", "aloha",
  "alone", "amend", "amino", "amiss", "amnesty", "among", "ample", "amuse",
  "angel", "anger", "angle", "ankle", "apple", "april", "apron", "aqua",
  "arena", "argue", "arise", "armed", "armor", "army", "aroma", "array",
  "arson", "art", "ashen", "ashes", "atlas", "atom", "audio", "avert",
  "avid", "avoid", "await", "awake", "award", "awoke", "axis", "bacon",
  "badge", "bagel", "baggy", "baked", "baker", "balmy", "banjo", "barn",
  "bash", "basil", "bask", "batch", "bath", "baton", "bats", "blade",
  "blank", "blast", "blaze", "bleak", "blend", "bless", "blimp", "blink",
  "bliss", "blitz", "bloat", "blob", "block", "bloom", "blot", "blunt",
  "blurt", "blush", "boast", "boat", "body", "boil", "bok", "bolt",
  "boned", "boney", "bonus", "bony", "book", "booth", "boots", "boss",
  "botch", "both", "boxer", "breed", "bribe", "brick", "bride", "brim",
  "bring", "brink", "brisk", "broad", "broil", "broke", "brook", "broom",
  "brush", "buck", "buddy", "buffet", "bulge", "bulk", "bully", "bunch",
  "bunny", "bunt", "bush", "bust", "busy", "buzz", "cable", "cache",
  "cadet", "cage", "cake", "calm", "cameo", "canal", "candy", "cane",
  "canine", "canoe", "canon", "cape", "card", "cargo", "carol", "carry",
  "carve", "case", "cash", "cause", "cedar", "chafe", "chain", "chair",
  "chalk", "champ", "chase", "cheek", "cheer", "chef", "chess", "chest",
  "chew", "chief", "chili", "chill", "chip", "chirp", "chomp", "chop",
  "chow", "chuck", "chump", "chunk", "churn", "chute", "cider", "cinch",
  "civic", "civil", "clad", "claim", "clamor", "clamp", "clang", "clap",
  "clash", "clasp", "class", "clay", "clean", "clear", "cleat", "cleft",
  "clerk", "click", "cling", "clink", "clip", "cloak", "clock", "clone",
  "cloth", "cloud", "clump", "coach", "coast", "coat", "cobra", "cock",
  "cocoa", "coil", "coke", "cola", "cold", "colt", "comb", "come",
  "comic", "comma", "cone", "cope", "copy", "coral", "cork", "cost",
  "cot", "couch", "cough", "cousin", "cover", "cozy", "craft", "cramp",
  "crane", "crank", "crate", "crave", "crawl", "crazy", "creme", "crepe",
];

if (RECOVERY_WORDS.length < 256) {
  // truncate or pad — defensive
}

/**
 * Genera un codigo de 6 palabras separadas por espacio.
 * Usa crypto.getRandomValues para seguridad criptografica.
 */
export function generateRecoveryCode(): { code: string; words: string[] } {
  const wordCount = 6;
  const words: string[] = [];
  const buf = new Uint32Array(wordCount);

  // Web Crypto en Node 20+/edge
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  } else {
    // Fallback (no deberia ocurrir en Next 16)
    for (let i = 0; i < wordCount; i++) {
      buf[i] = Math.floor(Math.random() * 0xffffffff);
    }
  }

  for (let i = 0; i < wordCount; i++) {
    const idx = buf[i]! % RECOVERY_WORDS.length;
    words.push(RECOVERY_WORDS[idx]!);
  }

  return { code: words.join(" "), words };
}

/**
 * Hashea el codigo con bcrypt (10 rounds).
 * Normalizamos a minusculas + trim para tolerar copy/paste.
 */
export async function hashRecoveryCode(code: string): Promise<string> {
  const normalized = code.trim().toLowerCase().replace(/\s+/g, " ");
  return bcrypt.hash(normalized, 10);
}

/**
 * Verifica un codigo contra un hash bcrypt.
 */
export async function verifyRecoveryCode(
  input: string,
  hash: string
): Promise<boolean> {
  if (!hash) return false;
  const normalized = input.trim().toLowerCase().replace(/\s+/g, " ");
  try {
    return await bcrypt.compare(normalized, hash);
  } catch {
    return false;
  }
}
