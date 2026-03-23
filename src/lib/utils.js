import clsx from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') {
    return 'Request Price';
  }

  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function buildWhatsAppLink(message, phone = '254712345678') {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getPhoneHref(phone = '') {
  return `tel:${String(phone).replace(/[^\d+]/g, '')}`;
}

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  return error.message || fallback;
}

export function buildPartsQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const query = searchParams.toString();
  return query ? `/parts?${query}` : '/parts';
}

export function buildRequestQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const query = searchParams.toString();
  return query ? `/request-part?${query}` : '/request-part';
}

export function normalizeSearchText(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizeSearch(value = '') {
  return normalizeSearchText(value)
    .split(' ')
    .map((token) => token.trim())
    .filter(Boolean);
}

const keywordAliases = {
  brake: ['pad', 'pads', 'disc', 'rotor', 'caliper'],
  filter: ['oil', 'air', 'fuel', 'cabin'],
  mirror: ['side', 'door'],
  lamp: ['light', 'headlamp', 'taillamp', 'headlight'],
  shock: ['absorber', 'suspension', 'damper'],
  plug: ['spark', 'ignition'],
};

export function expandKeywords(tokens = []) {
  const expanded = new Set(tokens);
  tokens.forEach((token) => {
    Object.entries(keywordAliases).forEach(([key, aliases]) => {
      if (token === key || aliases.includes(token)) {
        expanded.add(key);
        aliases.forEach((alias) => expanded.add(alias));
      }
    });
  });
  return [...expanded];
}

export function matchesKeywordSearch(part, query) {
  if (!query) return true;

  const tokens = expandKeywords(tokenizeSearch(query));
  if (!tokens.length) return true;

  const haystack = normalizeSearchText(
    [
      part.name,
      part.description,
      part.vehicle_make,
      part.vehicle_model,
      part.vehicle_year,
      part.category?.name,
      part.stock_status,
      part.condition,
    ]
      .filter(Boolean)
      .join(' '),
  );

  return tokens.every((token) => haystack.includes(token));
}

export function scoreKeywordMatch(part, query) {
  if (!query) return 0;
  const tokens = expandKeywords(tokenizeSearch(query));
  const fields = [
    normalizeSearchText(part.name),
    normalizeSearchText(part.category?.name),
    normalizeSearchText(part.vehicle_make),
    normalizeSearchText(part.vehicle_model),
    normalizeSearchText(part.description),
  ];

  return tokens.reduce((score, token) => {
    if (fields[0]?.includes(token)) return score + 5;
    if (fields[1]?.includes(token)) return score + 4;
    if (fields[2]?.includes(token) || fields[3]?.includes(token)) return score + 3;
    if (fields[4]?.includes(token)) return score + 2;
    return score;
  }, 0);
}

function seededHash(value) {
  let hash = 0;
  const text = String(value);
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) % 2147483647;
  }
  return hash;
}

export function shuffleBySeed(items, seed = '') {
  return [...items].sort((first, second) => {
    const firstHash = seededHash(`${seed}-${first.id || first.slug || first.name}`);
    const secondHash = seededHash(`${seed}-${second.id || second.slug || second.name}`);
    return firstHash - secondHash;
  });
}
