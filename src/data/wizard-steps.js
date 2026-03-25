// Wizard step IDs (indexes 0-6)
export const STEP_IDS = [
  'profile',
  'eligibility',
  'land',
  'osp',
  'substances',
  'certifier',
  'registration',
];

// Fee tiers (California state registration)
export const FEE_TIERS = [
  { max: 4999,      fee: 25,    label: 'Up to $4,999' },
  { max: 9999,      fee: 50,    label: '$5,000 – $9,999' },
  { max: 50000,     fee: 75,    label: '$10,000 – $50,000' },
  { max: 100000,    fee: 150,   label: '$50,001 – $100,000' },
  { max: 250000,    fee: 250,   label: '$100,001 – $250,000' },
  { max: 500000,    fee: 500,   label: '$250,001 – $500,000' },
  { max: 1000000,   fee: 750,   label: '$500,001 – $1,000,000' },
  { max: 2500000,   fee: 1000,  label: '$1,000,001 – $2,500,000' },
  { max: 5000000,   fee: 1500,  label: '$2,500,001 – $5,000,000' },
  { max: 10000000,  fee: 2000,  label: '$5,000,001 – $10,000,000' },
  { max: 25000000,  fee: 2500,  label: '$10,000,001 – $25,000,000' },
  { max: Infinity,  fee: 3000,  label: 'Over $25,000,000' },
];

export function calculateStateFee(grossSales) {
  const amount = parseFloat(String(grossSales).replace(/[^0-9.]/g, '')) || 0;
  const tier = FEE_TIERS.find(t => amount <= t.max);
  return tier ? tier.fee : 3000;
}

// Allowed & prohibited substances summary
export const SUBSTANCES = {
  allowed: [
    { en: 'Compost (meeting NOP standards)', es: 'Composta (que cumple normas NOP)' },
    { en: 'OMRI-listed botanical pesticides', es: 'Pesticidas botánicos listados en OMRI' },
    { en: 'Copper-based fungicides (restricted use)', es: 'Fungicidas a base de cobre (uso restringido)' },
    { en: 'Sulfur-based pesticides', es: 'Pesticidas a base de azufre' },
    { en: 'Microbial pest management products', es: 'Productos de manejo de plagas microbianas' },
    { en: 'Pheromones for pest management', es: 'Feromonas para manejo de plagas' },
    { en: 'Plain soaps for insect control', es: 'Jabones simples para control de insectos' },
    { en: 'Lime (calcium carbonate)', es: 'Cal (carbonato de calcio)' },
    { en: 'Elemental sulfur', es: 'Azufre elemental' },
    { en: 'Fish emulsion (without synthetic preservatives)', es: 'Emulsión de pescado (sin conservantes sintéticos)' },
    { en: 'Kelp / seaweed', es: 'Algas marinas' },
    { en: 'Cover crops and green manures', es: 'Cultivos de cobertura y abonos verdes' },
    { en: 'Untreated seeds (when commercially available)', es: 'Semillas no tratadas (cuando estén disponibles comercialmente)' },
  ],
  prohibited: [
    { en: 'Synthetic fertilizers (e.g., ammonium nitrate, urea)', es: 'Fertilizantes sintéticos (p. ej., nitrato de amonio, urea)' },
    { en: 'Synthetic pesticides and herbicides', es: 'Pesticidas y herbicidas sintéticos' },
    { en: 'Genetically modified organisms (GMOs)', es: 'Organismos genéticamente modificados (OGM)' },
    { en: 'Sewage sludge (biosolids)', es: 'Lodos de aguas residuales (biosólidos)' },
    { en: 'Ionizing radiation', es: 'Radiación ionizante' },
    { en: 'Treated lumber in food contact situations', es: 'Madera tratada en contacto con alimentos' },
    { en: 'Synthetic growth regulators', es: 'Reguladores de crecimiento sintéticos' },
    { en: 'Systemic synthetic fungicides', es: 'Fungicidas sistémicos sintéticos' },
    { en: 'Atrazine and other synthetic herbicides', es: 'Atrazina y otros herbicidas sintéticos' },
    { en: 'Antibiotics in livestock production', es: 'Antibióticos en la producción ganadera' },
    { en: 'Synthetic hormones in livestock', es: 'Hormonas sintéticas en el ganado' },
  ],
};

export default STEP_IDS;
