const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const normalizeContact = (value) => {
  const raw = String(value ?? '').trim();

  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { type: 'text', value: raw };
    }

    return { type: 'url', value: url.href };
  } catch {
    return { type: 'text', value: raw };
  }
};

const renderContactHtml = (value) => {
  const contact = normalizeContact(value);

  if (contact.type === 'url') {
    const safeUrl = escapeHtml(contact.value);
    return `<a href="${safeUrl}" style="color: #c49a6c; text-decoration: underline;">${safeUrl}</a>`;
  }

  return `<span>${escapeHtml(contact.value)}</span>`;
};

const safeSheetCell = (value) => {
  const text = String(value ?? '');

  if (/^\s*[=+\-@\t\r]/.test(text)) {
    return `'${text}`;
  }

  return text;
};

module.exports = {
  escapeHtml,
  normalizeContact,
  renderContactHtml,
  safeSheetCell,
};
