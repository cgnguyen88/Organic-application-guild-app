const complianceItems = [
  // Pre-Certification
  {
    id: 'pc1', category: 'precert',
    label: { en: 'Confirm 3-year land transition period', es: 'Confirmar período de transición de 3 años' },
    description: {
      en: 'Verify that your land has been free of all USDA-prohibited substances (synthetic fertilizers, pesticides, etc.) for at least 3 years prior to the first organic harvest.',
      es: 'Verifica que tu tierra ha estado libre de todas las sustancias prohibidas por el USDA (fertilizantes sintéticos, pesticidas, etc.) durante al menos 3 años antes de la primera cosecha orgánica.',
    },
    why: {
      en: 'Required by 7 CFR §205.202. Crops harvested before the 3-year transition is complete cannot be sold as organic.',
      es: 'Requerido por 7 CFR §205.202. Los cultivos cosechados antes de completar la transición de 3 años no pueden venderse como orgánicos.',
    },
  },
  {
    id: 'pc2', category: 'precert',
    label: { en: 'Complete soil health assessment', es: 'Completar evaluación de salud del suelo' },
    description: {
      en: 'Conduct or obtain a soil test to document baseline fertility and absence of prohibited substances.',
      es: 'Realiza u obtén una prueba de suelo para documentar la fertilidad de referencia y la ausencia de sustancias prohibidas.',
    },
    why: {
      en: 'Demonstrates your commitment to building soil health through organic practices, which inspectors will review.',
      es: 'Demuestra tu compromiso de construir salud del suelo a través de prácticas orgánicas, que los inspectores revisarán.',
    },
  },
  {
    id: 'pc3', category: 'precert',
    label: { en: 'Conduct prohibited substance audit of all inputs', es: 'Realizar auditoría de sustancias prohibidas en todos los insumos' },
    description: {
      en: 'Review all fertilizers, pesticides, seeds, and other materials to confirm none are on the USDA prohibited list.',
      es: 'Revisa todos los fertilizantes, pesticidas, semillas y otros materiales para confirmar que ninguno está en la lista prohibida del USDA.',
    },
    why: {
      en: 'Using a single prohibited substance can result in loss of certification for the entire field or product line.',
      es: 'Usar una sola sustancia prohibida puede resultar en la pérdida de certificación de todo el campo o línea de productos.',
    },
  },
  {
    id: 'pc4', category: 'precert',
    label: { en: 'Establish physical buffers from non-organic land', es: 'Establecer barreras físicas de terrenos no orgánicos' },
    description: {
      en: 'Set up hedgerows, buffer zones, or other barriers to prevent contamination from neighboring conventional operations.',
      es: 'Establece setos, zonas de amortiguamiento u otras barreras para prevenir la contaminación de operaciones convencionales vecinas.',
    },
    why: {
      en: 'Commingling and contamination risks from adjacent non-organic land are a common inspection concern.',
      es: 'Los riesgos de mezcla y contaminación de tierras no orgánicas adyacentes son una preocupación frecuente en las inspecciones.',
    },
  },
  // Documentation
  {
    id: 'd1', category: 'documentation',
    label: { en: 'Draft your Organic System Plan (OSP)', es: 'Redactar tu Plan de Sistema Orgánico (OSP)' },
    description: {
      en: 'Prepare a complete OSP describing all practices, inputs, monitoring procedures, and recordkeeping systems.',
      es: 'Prepara un OSP completo que describa todas las prácticas, insumos, procedimientos de monitoreo y sistemas de registro.',
    },
    why: {
      en: 'The OSP is the foundational document required by all certifiers. Without it, your application cannot proceed.',
      es: 'El OSP es el documento fundamental requerido por todos los certificadores. Sin él, tu solicitud no puede continuar.',
    },
  },
  {
    id: 'd2', category: 'documentation',
    label: { en: 'Set up 5-year audit trail recordkeeping system', es: 'Establecer sistema de registro de rastro de auditoría de 5 años' },
    description: {
      en: 'Create a system to maintain records tracing all products from field/purchase through production to sale for at least 5 years.',
      es: 'Crea un sistema para mantener registros que rastreen todos los productos desde el campo/compra hasta la producción y venta durante al menos 5 años.',
    },
    why: {
      en: 'Inadequate recordkeeping is one of the most common reasons for certification denial or non-compliance findings.',
      es: 'El mantenimiento inadecuado de registros es una de las razones más comunes para la denegación de certificación.',
    },
  },
  {
    id: 'd3', category: 'documentation',
    label: { en: 'Document all input purchases with receipts', es: 'Documentar todas las compras de insumos con recibos' },
    description: {
      en: 'Keep invoices and product labels for every substance used, including OMRI-listed products.',
      es: 'Guarda facturas y etiquetas de productos para cada sustancia utilizada, incluyendo productos listados en OMRI.',
    },
    why: {
      en: 'Inspectors will verify mass balance between purchased inputs and harvested outputs.',
      es: 'Los inspectores verificarán el balance de masa entre los insumos comprados y las cosechas producidas.',
    },
  },
  {
    id: 'd4', category: 'documentation',
    label: { en: 'Prepare split-operation separation protocols (if applicable)', es: 'Preparar protocolos de separación para operación mixta (si aplica)' },
    description: {
      en: 'If you handle both organic and conventional products, document procedures to prevent commingling.',
      es: 'Si manejas tanto productos orgánicos como convencionales, documenta los procedimientos para evitar la mezcla.',
    },
    why: {
      en: 'Split operations face heightened scrutiny. Written protocols are mandatory to demonstrate separation.',
      es: 'Las operaciones mixtas enfrentan mayor escrutinio. Los protocolos escritos son obligatorios para demostrar separación.',
    },
  },
  // Certifier Process
  {
    id: 'c1', category: 'certifier',
    label: { en: 'Select a USDA-accredited certifying agent (ACA)', es: 'Seleccionar un agente certificador acreditado por USDA (ACA)' },
    description: {
      en: 'Choose from ACAs registered to operate in California (CCOF, MOCA, QAI, Oregon Tilth, etc.)',
      es: 'Elige entre los ACAs registrados para operar en California (CCOF, MOCA, QAI, Oregon Tilth, etc.)',
    },
    why: {
      en: 'Only USDA-accredited agents can issue organic certificates valid for sale in the US and internationally.',
      es: 'Solo los agentes acreditados por USDA pueden emitir certificados orgánicos válidos para ventas en EE.UU. e internacionalmente.',
    },
  },
  {
    id: 'c2', category: 'certifier',
    label: { en: 'Submit application, OSP, and certifier fees', es: 'Enviar solicitud, OSP y cuotas del certificador' },
    description: {
      en: 'Complete your certifier\'s application form, attach your OSP, and pay the application fee (may be non-refundable).',
      es: 'Completa el formulario de solicitud de tu certificador, adjunta tu OSP y paga la cuota de solicitud (puede ser no reembolsable).',
    },
    why: {
      en: 'The certifier cannot begin review or schedule an inspection until the application and fees are received.',
      es: 'El certificador no puede comenzar la revisión ni programar una inspección hasta que se reciban la solicitud y las cuotas.',
    },
  },
  {
    id: 'c3', category: 'certifier',
    label: { en: 'Application reviewed by certifier', es: 'Solicitud revisada por el certificador' },
    description: {
      en: 'Wait for the ACA to review your application for completeness and compliance with NOP standards.',
      es: 'Espera que el ACA revise tu solicitud para verificar su completitud y cumplimiento con las normas NOP.',
    },
    why: {
      en: 'The review may result in a request for additional information or a Notice of Non-compliance before inspection.',
      es: 'La revisión puede resultar en una solicitud de información adicional o un Aviso de Incumplimiento antes de la inspección.',
    },
  },
  {
    id: 'c4', category: 'certifier',
    label: { en: 'Schedule and complete on-site inspection', es: 'Programar y completar inspección en el sitio' },
    description: {
      en: 'Allow a certifier-appointed inspector to visit your operation during active production to verify your OSP.',
      es: 'Permite que un inspector designado por el certificador visite tu operación durante la producción activa para verificar tu OSP.',
    },
    why: {
      en: 'Inspections verify that your actual practices match your OSP. Discrepancies can delay or deny certification.',
      es: 'Las inspecciones verifican que tus prácticas reales coincidan con tu OSP. Las discrepancias pueden retrasar o denegar la certificación.',
    },
  },
  {
    id: 'c5', category: 'certifier',
    label: { en: 'Receive and review certificate of organic operation', es: 'Recibir y revisar el certificado de operación orgánica' },
    description: {
      en: 'Once the ACA approves your inspection, they will issue your certificate via the USDA Organic Integrity Database.',
      es: 'Una vez que el ACA aprueba tu inspección, emitirá tu certificado a través de la Base de Datos de Integridad Orgánica del USDA.',
    },
    why: {
      en: 'You must have this certificate before making any organic sales claims.',
      es: 'Debes tener este certificado antes de hacer cualquier afirmación de venta orgánica.',
    },
  },
  // State Registration
  {
    id: 's1', category: 'stateReg',
    label: { en: 'Register with CDFA or CDPH (California state)', es: 'Registrarse con CDFA o CDPH (estado de California)' },
    description: {
      en: 'Prior to your first organic sale in California, register with the appropriate state agency (CDFA for raw ag; CDPH for processed foods).',
      es: 'Antes de tu primera venta orgánica en California, regístrate con la agencia estatal correspondiente.',
    },
    why: {
      en: 'California requires state registration in addition to USDA certification — unique among US states.',
      es: 'California requiere registro estatal además de la certificación USDA — único entre los estados de EE.UU.',
    },
  },
  {
    id: 's2', category: 'stateReg',
    label: { en: 'Pay tiered state registration fee', es: 'Pagar la cuota de registro estatal escalonada' },
    description: {
      en: 'Pay the annual fee based on gross organic sales: $25 (<$5k), $75 ($10k–$50k), up to $3,000 (>$25M).',
      es: 'Paga la cuota anual según las ventas orgánicas brutas: $25 (<$5k), $75 ($10k–$50k), hasta $3,000 (>$25M).',
    },
    why: {
      en: 'The fee must be paid before registration is complete. OCCSP cost-share funds may offset this cost.',
      es: 'La cuota debe pagarse antes de completar el registro. Los fondos OCCSP pueden compensar este costo.',
    },
  },
  {
    id: 's3', category: 'stateReg',
    label: { en: 'Obtain OPPR (Organic Processed Product Registration) if processing', es: 'Obtener OPPR (Registro de Producto Procesado Orgánico) si procesas' },
    description: {
      en: 'Processors under CDPH must obtain an Organic Processed Product Registration (OPPR) and typically a Processed Food Registration (PFR) first.',
      es: 'Los procesadores bajo CDPH deben obtener un OPPR y típicamente un Registro de Alimento Procesado (PFR) primero.',
    },
    why: {
      en: 'Without OPPR, processed organic products cannot be legally sold in California.',
      es: 'Sin OPPR, los productos orgánicos procesados no pueden venderse legalmente en California.',
    },
  },
  {
    id: 's4', category: 'stateReg',
    label: { en: 'Apply for OCCSP cost-share reimbursement', es: 'Solicitar reembolso de costo compartido OCCSP' },
    description: {
      en: 'Apply for the USDA Organic Certified Cost Share Program through CDFA to recover up to 75% of certification costs.',
      es: 'Solicita el Programa de Costo Compartido de Certificación Orgánica del USDA a través del CDFA para recuperar hasta el 75% de los costos de certificación.',
    },
    why: {
      en: 'OCCSP can significantly reduce your financial burden. Applications are first-come, first-served while funds last.',
      es: 'OCCSP puede reducir significativamente tu carga financiera. Las solicitudes son por orden de llegada mientras haya fondos.',
    },
  },
  // Annual Maintenance
  {
    id: 'a1', category: 'annual',
    label: { en: 'Submit annual OSP update to certifier', es: 'Enviar actualización anual de OSP al certificador' },
    description: {
      en: 'Each year, update your Organic System Plan to reflect any changes in practices, inputs, or crops.',
      es: 'Cada año, actualiza tu Plan de Sistema Orgánico para reflejar cualquier cambio en prácticas, insumos o cultivos.',
    },
    why: {
      en: 'Annual updates are required to maintain continuous certification. Failure to update can trigger suspension.',
      es: 'Las actualizaciones anuales son requeridas para mantener la certificación continua.',
    },
  },
  {
    id: 'a2', category: 'annual',
    label: { en: 'Pay annual certifier and state fees', es: 'Pagar cuotas anuales del certificador y del estado' },
    description: {
      en: 'Renew both your certifier fees and your California state registration fee each year.',
      es: 'Renueva las cuotas del certificador y la cuota de registro estatal de California cada año.',
    },
    why: {
      en: 'Non-payment of annual fees results in suspension of your organic certificate.',
      es: 'El no pago de las cuotas anuales resulta en la suspensión de tu certificado orgánico.',
    },
  },
  {
    id: 'a3', category: 'annual',
    label: { en: 'Undergo annual on-site inspection', es: 'Someterse a inspección anual en el sitio' },
    description: {
      en: 'Allow your certifier\'s inspector to conduct the required annual on-site verification.',
      es: 'Permite que el inspector de tu certificador realice la verificación anual requerida en el sitio.',
    },
    why: {
      en: 'Annual inspections are a federal requirement. Refusing or failing inspection results in revocation.',
      es: 'Las inspecciones anuales son un requisito federal. Negarse o no pasar la inspección resulta en revocación.',
    },
  },
  {
    id: 'a4', category: 'annual',
    label: { en: 'Update CDFA/CDPH state registration', es: 'Actualizar registro estatal CDFA/CDPH' },
    description: {
      en: 'Renew your California state organic registration annually to remain in compliance with CASOP.',
      es: 'Renueva tu registro orgánico estatal de California anualmente para cumplir con CASOP.',
    },
    why: {
      en: 'State registration is separate from federal certification and must be renewed independently.',
      es: 'El registro estatal es independiente de la certificación federal y debe renovarse por separado.',
    },
  },
];

export default complianceItems;
