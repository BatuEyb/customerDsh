// src/utils/formatters.js
export function formatTurkishPhone(raw) {
    const digits = (raw || '').replace(/\D/g, '');
    const match = digits.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (!match) return raw;
    const [, area, prefix, part1, part2] = match;
    return `0 (${area}) ${prefix} ${part1} ${part2}`;
  }
  