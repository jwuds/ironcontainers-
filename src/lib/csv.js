function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function buildWooCsv(products) {
  const maxAttrs = products.reduce((m, p) => Math.max(m, p.attributes.length), 0);

  const baseCols = [
    'ID',
    'Type',
    'SKU',
    'Name',
    'Published',
    'Is featured?',
    'Visibility in catalog',
    'Short description',
    'Description',
    'Sale price',
    'Regular price',
    'Categories',
    'Tags',
    'Images',
    'Meta: source_url',
  ];

  const attrCols = [];
  for (let i = 1; i <= maxAttrs; i++) {
    attrCols.push(`Attribute ${i} name`, `Attribute ${i} value(s)`, `Attribute ${i} visible`, `Attribute ${i} global`);
  }

  const header = [...baseCols, ...attrCols];
  const lines = [header.map(csvEscape).join(',')];

  products.forEach((p, idx) => {
    const row = [
      idx + 1,
      p.type,
      p.sku,
      p.title,
      1,
      0,
      'visible',
      p.shortDescription,
      p.description,
      p.salePrice,
      p.regularPrice,
      p.categories.join(', '),
      '',
      p.images.join(', '),
      p.url,
    ];
    for (let i = 0; i < maxAttrs; i++) {
      const attr = p.attributes[i];
      if (attr) {
        const [name, value] = attr;
        row.push(name, Array.isArray(value) ? value.join(' | ') : value, 1, 0);
      } else {
        row.push('', '', '', '');
      }
    }
    lines.push(row.map(csvEscape).join(','));
  });

  return lines.join('\n');
}

module.exports = { buildWooCsv };
