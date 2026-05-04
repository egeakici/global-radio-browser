// Converts ISO 3166-1 alpha-2 country code to a flag emoji
export function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) return '🌐';
  return code
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join('');
}
