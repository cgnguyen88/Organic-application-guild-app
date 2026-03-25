import { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export async function exportOSPtoWord(profile, lang = 'en') {
  const isEs = lang === 'es';

  const heading = (text, level = HeadingLevel.HEADING_1) =>
    new Paragraph({
      text,
      heading: level,
      spacing: { before: 300, after: 120 },
    });

  const body = (text) =>
    new Paragraph({
      children: [new TextRun({ text: text || '—', size: 24 })],
      spacing: { after: 100 },
    });

  const labelVal = (label, value) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: 24 }),
        new TextRun({ text: value || '—', size: 24 }),
      ],
      spacing: { after: 80 },
    });

  const divider = () =>
    new Paragraph({
      border: { bottom: { color: 'AAAAAA', space: 1, style: BorderStyle.SINGLE, size: 6 } },
      spacing: { after: 200 },
    });

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          children: [
            new TextRun({
              text: isEs ? 'PLAN DE SISTEMA ORGÁNICO (OSP)' : 'ORGANIC SYSTEM PLAN (OSP)',
              bold: true, size: 40, color: '002D54',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: isEs ? 'Programa Orgánico del Estado de California (CASOP)' : 'California State Organic Program (CASOP)',
              size: 26, color: '64748B',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        // Section 1: Operation Info
        heading(isEs ? '1. INFORMACIÓN DE LA OPERACIÓN' : '1. OPERATION INFORMATION'),
        labelVal(isEs ? 'Nombre de la Operación' : 'Operation Name', profile.operationName),
        labelVal(isEs ? 'Propietario / Operador' : 'Owner / Operator', profile.ownerName),
        labelVal(isEs ? 'Dirección' : 'Address', [profile.address, profile.city, profile.county, 'CA', profile.zip].filter(Boolean).join(', ')),
        labelVal(isEs ? 'Teléfono' : 'Phone', profile.phone),
        labelVal(isEs ? 'Correo Electrónico' : 'Email', profile.email),
        labelVal(isEs ? 'Tipo de Operación' : 'Operation Type', profile.operationType),
        labelVal(isEs ? 'Cultivos / Productos' : 'Crops / Products', profile.crops),
        labelVal(isEs ? 'Hectáreas' : 'Acreage', profile.acreage),
        labelVal(isEs ? 'Ventas Orgánicas Brutas Est.' : 'Est. Gross Organic Sales', profile.grossSales ? `$${profile.grossSales}` : ''),
        labelVal(isEs ? 'Camino de Registro' : 'Registration Path', profile.registrationPath),
        divider(),

        // Section 2: Land & Transition
        heading(isEs ? '2. TIERRA Y PERÍODO DE TRANSICIÓN' : '2. LAND & TRANSITION PERIOD'),
        labelVal(isEs ? 'Años libre de sustancias prohibidas' : 'Years free of prohibited substances', profile.landFreeYears),
        labelVal(isEs ? 'Última sustancia prohibida usada' : 'Last prohibited substance used', profile.lastProhibitedSubstance),
        divider(),

        // Section 3: Organic Practices
        heading(isEs ? '3. PRÁCTICAS DE PRODUCCIÓN ORGÁNICA' : '3. ORGANIC PRODUCTION PRACTICES'),
        body(profile.practices),
        divider(),

        // Section 4: Inputs
        heading(isEs ? '4. INSUMOS Y SUSTANCIAS' : '4. INPUTS & SUBSTANCES'),
        body(profile.inputs),
        divider(),

        // Section 5: Monitoring
        heading(isEs ? '5. MONITOREO Y MANTENIMIENTO DE REGISTROS' : '5. MONITORING & RECORDKEEPING'),
        body(profile.monitoring),
        body(isEs ? 'Nota: Todos los registros deben mantenerse durante al menos 5 años.' : 'Note: All records must be maintained for a minimum of 5 years.'),
        divider(),

        // Section 6: Buffers
        heading(isEs ? '6. BARRERAS FÍSICAS Y PREVENCIÓN DE CONTAMINACIÓN' : '6. PHYSICAL BUFFERS & CONTAMINATION PREVENTION'),
        body(profile.buffers),
        divider(),

        // Section 7: Certifier
        heading(isEs ? '7. AGENTE CERTIFICADOR' : '7. CERTIFYING AGENT'),
        labelVal(isEs ? 'Certificador Seleccionado' : 'Selected Certifier', profile.certifierName),
        labelVal(isEs ? 'Contacto' : 'Contact', profile.certifierContact),
        divider(),

        // Declaration
        heading(isEs ? '8. DECLARACIÓN' : '8. DECLARATION'),
        body(isEs
          ? 'Certifico que la información proporcionada en este Plan de Sistema Orgánico es precisa y completa según mi mejor conocimiento. Entiendo que la tergiversación intencional puede resultar en denegación, suspensión o revocación de la certificación orgánica bajo 7 CFR Parte 205.'
          : 'I certify that the information provided in this Organic System Plan is accurate and complete to the best of my knowledge. I understand that willful misrepresentation may result in denial, suspension, or revocation of organic certification under 7 CFR Part 205.'
        ),
        new Paragraph({ spacing: { after: 600 } }),
        labelVal(isEs ? 'Firma' : 'Signature', '___________________________________'),
        labelVal(isEs ? 'Fecha' : 'Date', '___________________________________'),

        // Notes
        ...(profile.registrationNotes ? [
          divider(),
          heading(isEs ? '9. NOTAS ADICIONALES' : '9. ADDITIONAL NOTES'),
          body(profile.registrationNotes),
        ] : []),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `OSP_${(profile.operationName || 'operation').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.docx`;
  saveAs(blob, filename);
}
