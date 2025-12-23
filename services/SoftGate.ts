export type Intent =
  | "product_search"
  | "price_query"
  | "bulk_or_budget_search"
  | "comparison_search"
  | "planning_search"
  | "navigation"
  | "navigation_with_parameters";

export type ScoreMap = Record<Intent, number>;

export const ALL_INTENTS: Intent[] = [
  "product_search",
  "price_query",
  "bulk_or_budget_search",
  "comparison_search",
  "planning_search",
  "navigation",
  "navigation_with_parameters"
];

export function createEmptyScoreMap(initial?: Partial<ScoreMap>): ScoreMap {
  const base: ScoreMap = ALL_INTENTS.reduce((acc, intent) => {
    acc[intent] = 0;
    return acc;
  }, {} as ScoreMap);
  if (initial) {
    for (const intent of Object.keys(initial) as Intent[]) {
      if (intent in base) {
        base[intent] = initial[intent] ?? 0;
      }
    }
  }
  return base;
}

function normalize(q: string) {
  return q
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // remove accents
    .replace(/\s+/g, " ")
    .trim();
}

// --- cue regexes (accent-insensitive because we normalize) ---
const RE_PRICE =
  /\b(precio|precios|cuanto cuesta|cuanto vale|valor|costo|coste|a como|en cuanto|how much|\$|usd|dolar(?:es)?)\b/;

const RE_BULK =
  /\b(al por mayor|mayorista|por volumen|en cantidad|por caja|por pallet|descuento|oferta(?:s)?|barato|economico|low\s*cost|presupuesto|menor a \$?\d+|por menos de \$?\d+)\b/;

const RE_COMPARE =
  /\b(vs|versus|diferencia|comparar|comparativa(?:s)?|que es mejor|cual es mejor|cual conviene)\b/;

// light “A o B” heuristic: contains " o " and also a material/product-ish token
const RE_O = /\s o \s/;

const RE_PLANNING =
  /\b(que necesito|lista de material(?:es)?|material(?:es)? para|herramientas para|insumos para|como|solucion|que usar|cual sirve|recomiendas?|no se si|me conviene)\b/;

const RE_NAV_VERB = /^(ir|ver|mostrar|muestrame|abrir|entrar|llevarme|go|open)\b/;

const RE_UI_NOUN =
  /\b(panel|pagina|seccion|menu|configuracion|carrito|clientes?|facturas?|cotizaciones?|pedidos?|historial)\b/;

const RE_RECORD_FILTER =
  /\b(entre|desde|hasta|ultimo|ultimos|hoy|ayer|esta semana|este mes|ano|pendiente(?:s)?|pagad[ao]s?|estado|filtrar|ordenad[ao]s?)\b/;


export function applyBonuses(queryRaw: string, base: ScoreMap): { boosted: ScoreMap; reasons: string[] } {
  const q = normalize(queryRaw);
  const out: ScoreMap = { ...base };
  const reasons: string[] = [];

  const hasPrice = RE_PRICE.test(q);
  const hasBulk = RE_BULK.test(q);
  const hasCompare = RE_COMPARE.test(q) || (RE_O.test(q) && /\b(vs|pvc|cpvc|hdpe|drywall|fibrocemento|malla|pernos|techo|teja|ceramica|porcelanato)\b/.test(q));
  const hasPlanning = RE_PLANNING.test(q);
  const hasNav = RE_NAV_VERB.test(q) && RE_UI_NOUN.test(q);
  const hasNavParams = hasNav && RE_RECORD_FILTER.test(q);

  // ---- bonuses (start here, then tune) ----
  // PRICE
  if (hasPrice) {
    out.price_query += 0.08;
    reasons.push("bonus: price cue");
  }
  // PRICE + BULK => more likely budget/bulk than pure price
  if (hasPrice && hasBulk) {
    out.bulk_or_budget_search += 0.06;
    out.price_query -= 0.03; // small penalty prevents price swallowing "al por mayor"
    reasons.push("bonus: price+bulk -> favor bulk/budget");
  }

  // BULK/BUDGET
  if (hasBulk) {
    out.bulk_or_budget_search += 0.07;
    reasons.push("bonus: bulk/budget cue");
  }

  // COMPARISON
  if (hasCompare) {
    out.comparison_search += 0.07;
    reasons.push("bonus: comparison cue");
    if (hasPlanning) out.planning_search -= 0.02;
  }

  // PLANNING / RECOMMENDATION
  if (hasPlanning) {
    out.planning_search += 0.07;
    reasons.push("bonus: planning/recommendation cue");
    // planning vs product
    out.product_search -= 0.02;
  }

  // NAVIGATION
  if (hasNav) {
    out.navigation += 0.08;
    reasons.push("bonus: navigation cue");
  }
  if (hasNavParams) {
    out.navigation_with_parameters += 0.09;
    out.navigation -= 0.03;
    reasons.push("bonus: nav+filters -> nav_with_params");
  }

  for (const k of Object.keys(out) as Intent[]) {
    out[k] = Math.max(0, Math.min(1, out[k]));
  }
  return { boosted: out, reasons };
}

export function ruleRouter(queryRaw: string, base?: Partial<ScoreMap>) {
  const preparedBase = createEmptyScoreMap(base);
  return applyBonuses(queryRaw, preparedBase);
}