'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QrCode, CreditCard, Smartphone } from 'lucide-react';
import { checkoutSchema, type CheckoutForm } from '@/lib/validations/checkout';
import { useCart } from '@/store/cart';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { formatTHB, cn } from '@/lib/utils';
import { calcShipping } from '@/lib/pricing';

const carriers = [
  { value: 'flash', label: 'Flash Express' },
  { value: 'jt', label: 'J&T Express' },
  { value: 'kerry', label: 'Kerry' },
  { value: 'thaipost', label: 'ไปรษณีย์ไทย' },
  { value: 'dhl', label: 'DHL' },
] as const;

const payments = [
  { value: 'promptpay', label: 'PromptPay', icon: QrCode },
  { value: 'credit_card', label: 'บัตรเครดิต/เดบิต', icon: CreditCard },
  { value: 'mobile_banking', label: 'Mobile Banking', icon: Smartphone },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [qr, setQr] = useState<{ image: string; orderNo: string } | null>(null);
  const { items, subtotal, clear } = useCart();
  useEffect(() => setMounted(true), []);

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { carrier: 'flash', paymentMethod: 'promptpay', wantTaxInvoice: false },
  });

  const paymentMethod = watch('paymentMethod');
  const carrier = watch('carrier');

  if (!mounted) return <div className="container-gv py-20 text-center text-fg-muted">กำลังโหลด…</div>;
  if (items.length === 0 && !qr)
    return <div className="container-gv py-24 text-center text-fg-muted">ไม่มีสินค้าในตะกร้า</div>;

  const sub = subtotal();
  const shipping = calcShipping(sub);
  const total = sub + shipping;

  const onSubmit = async (form: CheckoutForm) => {
    setSubmitError('');
    try {
      const { data: order } = await api.post('/orders', {
        ...form,
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      });

      const { data: charge } = await api.post('/payments/charge', {
        orderNo: order.orderNo,
        amount: order.grandTotal,
        method: form.paymentMethod,
        returnUri: `${window.location.origin}/tracking?order=${order.orderNo}`,
      });

      clear();

      if (form.paymentMethod === 'promptpay' && charge.qrImageUri) {
        setQr({ image: charge.qrImageUri, orderNo: order.orderNo });
      } else if (charge.authorizeUri) {
        window.location.href = charge.authorizeUri; // บัตร/banking → 3DS
      } else {
        router.push(`/tracking?order=${order.orderNo}`);
      }
    } catch {
      setSubmitError('ทำรายการไม่สำเร็จ กรุณาลองใหม่ (ต้องเชื่อม API + ตั้งค่า OMISE_SECRET_KEY จริง)');
    }
  };

  if (qr) {
    return (
      <div className="container-gv flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold">สแกนจ่ายด้วย PromptPay</h1>
        <p className="text-fg-muted">คำสั่งซื้อ {qr.orderNo}</p>
        <div className="relative h-64 w-64 overflow-hidden rounded-lg border border-border bg-white p-3">
          <Image src={qr.image} alt="PromptPay QR" fill className="object-contain" unoptimized />
        </div>
        <p className="text-sm text-fg-muted">เปิดแอปธนาคาร → สแกน QR → ยืนยันยอด {formatTHB(total)}</p>
        <Button variant="accent" size="lg" onClick={() => router.push(`/tracking?order=${qr.orderNo}`)}>
          ชำระเงินแล้ว ดูสถานะคำสั่งซื้อ
        </Button>
      </div>
    );
  }

  const field = 'w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent';
  const errText = 'mt-1 text-xs text-error';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container-gv py-10">
      <h1 className="mb-8 text-3xl font-extrabold">ชำระเงิน</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold">ที่อยู่จัดส่ง</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><input placeholder="ชื่อ-นามสกุล" className={field} {...register('name')} />{errors.name && <p className={errText}>{errors.name.message}</p>}</div>
              <div><input placeholder="เบอร์โทร" className={field} {...register('phone')} />{errors.phone && <p className={errText}>{errors.phone.message}</p>}</div>
              <div className="sm:col-span-2"><input placeholder="อีเมล" className={field} {...register('email')} />{errors.email && <p className={errText}>{errors.email.message}</p>}</div>
              <div className="sm:col-span-2"><input placeholder="ที่อยู่ (บ้านเลขที่ ถนน)" className={field} {...register('line1')} />{errors.line1 && <p className={errText}>{errors.line1.message}</p>}</div>
              <div><input placeholder="ตำบล/แขวง" className={field} {...register('subdistrict')} />{errors.subdistrict && <p className={errText}>{errors.subdistrict.message}</p>}</div>
              <div><input placeholder="อำเภอ/เขต" className={field} {...register('district')} />{errors.district && <p className={errText}>{errors.district.message}</p>}</div>
              <div><input placeholder="จังหวัด" className={field} {...register('province')} />{errors.province && <p className={errText}>{errors.province.message}</p>}</div>
              <div><input placeholder="รหัสไปรษณีย์" className={field} {...register('postalCode')} />{errors.postalCode && <p className={errText}>{errors.postalCode.message}</p>}</div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold">วิธีจัดส่ง</h2>
            <div className="flex flex-wrap gap-2">
              {carriers.map((c) => (
                <button type="button" key={c.value} onClick={() => setValue('carrier', c.value)}
                  className={cn('rounded-md border px-4 py-2 text-sm font-semibold transition-colors', carrier === c.value ? 'border-accent bg-accent/10 text-accent' : 'border-border')}>
                  {c.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold">วิธีชำระเงิน</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {payments.map((p) => (
                <button type="button" key={p.value} onClick={() => setValue('paymentMethod', p.value)}
                  className={cn('flex items-center gap-3 rounded-md border px-4 py-3 text-sm font-semibold transition-colors', paymentMethod === p.value ? 'border-accent bg-accent/10 text-accent' : 'border-border')}>
                  <p.icon className="h-5 w-5" />{p.label}
                </button>
              ))}
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('wantTaxInvoice')} /> ต้องการใบกำกับภาษี
            </label>
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-bold">สรุปคำสั่งซื้อ</h2>
          <div className="max-h-56 space-y-3 overflow-auto">
            {items.map((i) => (
              <div key={i.variantId} className="flex justify-between gap-2 text-sm">
                <span className="line-clamp-2 text-fg-muted">{i.name} × {i.quantity}</span>
                <span className="tabular whitespace-nowrap font-semibold">{formatTHB(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="my-4 border-t border-border" />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-fg-muted">ยอดรวมสินค้า</dt><dd className="tabular">{formatTHB(sub)}</dd></div>
            <div className="flex justify-between"><dt className="text-fg-muted">ค่าจัดส่ง</dt><dd className="tabular">{shipping === 0 ? 'ฟรี' : formatTHB(shipping)}</dd></div>
          </dl>
          <div className="my-4 border-t border-border" />
          <div className="flex justify-between text-lg font-extrabold"><span>รวมทั้งหมด</span><span className="tabular">{formatTHB(total)}</span></div>
          {submitError && <p className="mt-3 text-xs text-error">{submitError}</p>}
          <Button type="submit" variant="accent" size="lg" loading={isSubmitting} className="mt-6 w-full">ยืนยันสั่งซื้อ</Button>
        </aside>
      </div>
    </form>
  );
}
