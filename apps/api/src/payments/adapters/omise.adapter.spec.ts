import { OmiseAdapter } from './omise.adapter';

describe('OmiseAdapter.parseWebhook', () => {
  const adapter = new OmiseAdapter();

  it('อ่านสถานะ paid จาก charge.complete', () => {
    const body = JSON.stringify({
      key: 'charge.complete',
      data: { id: 'chrg_test_1', status: 'successful', metadata: { orderNo: 'GV123' } },
    });
    const r = adapter.parseWebhook(body);
    expect(r.chargeId).toBe('chrg_test_1');
    expect(r.status).toBe('paid');
    expect(r.orderNo).toBe('GV123');
  });

  it('อ่านสถานะ failed เมื่อไม่สำเร็จ', () => {
    const body = JSON.stringify({ data: { id: 'chrg_2', status: 'failed', paid: false } });
    expect(adapter.parseWebhook(body).status).toBe('failed');
  });
});
