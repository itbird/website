export const intervals = [5, 10, 15, 30, 60];
export function journey(hours) {
  if (!Number.isFinite(hours) || hours < 0 || hours > 6) throw new RangeError('Interruption must be 0–6 hours');
  return {exposure: hours * 12, points: hours === 0 ? [[0,4],[12,4]] : [[0,4],[3,4],[3,16],[3+hours,16],[3+hours,4],[12,4]]};
}
export function temperature(t) { return t <= 35 || t >= 55 ? 4 : 4 + 8 * (1 - Math.abs(t - 45) / 10); }
export function samples(interval) {
  if (!intervals.includes(interval)) throw new RangeError('Unsupported interval');
  const points = Array.from({length: 120 / interval + 1}, (_,i) => [i*interval, temperature(i*interval)]);
  return {points, peak: Math.max(...points.map(p=>p[1]))};
}
export function annualSaved(percent) {
  if (!Number.isFinite(percent) || percent < 0 || percent > 10) throw new RangeError('Share must be 0–10 percent');
  return 10000 * percent / 100 * 52;
}
