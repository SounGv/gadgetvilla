import { formatTHB, cn } from './utils';

describe('formatTHB', () => {
  it('จัดรูปแบบเงินบาท', () => {
    expect(formatTHB(1590)).toContain('1,590');
    expect(formatTHB(0)).toContain('0');
  });
});

describe('cn', () => {
  it('รวม class และ dedupe tailwind', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-fg', false && 'hidden', 'font-bold')).toBe('text-fg font-bold');
  });
});
