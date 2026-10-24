import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Tag, CreditCard, Smartphone, Building, Sparkles } from 'lucide-react';
import { Course } from '../types';

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onSuccess: (courseId: string) => void;
}

export const EnrollModal: React.FC<EnrollModalProps> = ({
  isOpen,
  onClose,
  course,
  onSuccess,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();

    if (code === 'AGS50' || code === 'AHARI50') {
      const disc = Math.round(course.price * 0.5);
      setDiscountAmount(disc);
      setAppliedCoupon(`${code} (50% Extra Discount)`);
    } else if (code === 'WELCOME100') {
      const disc = Math.min(course.price, 100);
      setDiscountAmount(disc);
      setAppliedCoupon('WELCOME100 (₹100 Off)');
    } else {
      setCouponError('अमान्य कूपन कोड। मान्य कोड: AGS50 या WELCOME100 का उपयोग करें।');
    }
  };

  const finalPrice = Math.max(0, course.price - discountAmount);

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onSuccess(course.id);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-white text-slate-900 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="bg-[#0a2240] text-white p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              Direct Batch Enrolment
            </span>
            <h3 className="font-bold text-sm sm:text-base leading-tight">
              {isSuccess ? 'नामांकन सफल! (Enrolled Successfully)' : 'कोर्स में प्रवेश लें (Enroll Now)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">बधाई हो! आपका प्रवेश हो चुका है</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                {course.title} अब आपके प्रोफाइल में <strong>My Enrolled Batches</strong> में उपलब्ध है।
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-left text-xs border border-slate-200 space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Order ID:</span>
                <span className="text-slate-900 font-bold">AGS-ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Amount Paid:</span>
                <span className="text-emerald-700 font-bold">₹{finalPrice}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Validity:</span>
                <span className="text-slate-900">{course.validity}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#0a2240] text-white font-bold text-xs hover:bg-blue-900 shadow-sm transition-all"
            >
              क्लास शुरू करें (Go to My Batches)
            </button>
          </div>
        ) : (
          /* CHECKOUT BODY */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Course Summary Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-blue-700 uppercase">{course.category} Batch</span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">{course.title}</h4>
              <p className="text-[11px] text-slate-500">शिक्षक: {course.faculty}</p>
              <div className="text-[10px] text-slate-400 pt-1 flex items-center gap-3">
                <span>वैधता: {course.validity}</span>
                <span>•</span>
                <span>माध्यम: {course.medium}</span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">कूपन कोड (Promo Code)</label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. AGS50"
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl uppercase font-mono tracking-wider focus:outline-none focus:border-[#0a2240]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#0a2240] text-white text-xs font-bold hover:bg-blue-900"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>कूपन लागू: {appliedCoupon}</span>
                </div>
              )}
              {couponError && (
                <div className="text-[11px] text-rose-600 font-medium">{couponError}</div>
              )}
              <div className="text-[10px] text-slate-400">
                उपलब्ध कोड: <strong>AGS50</strong> (50% छूट) या <strong>WELCOME100</strong>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">भुगतान विधि (Payment Method)</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#0a2240] bg-blue-50 text-[#0a2240] font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-[11px]">UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#0a2240] bg-blue-50 text-[#0a2240] font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[11px]">Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#0a2240] bg-blue-50 text-[#0a2240] font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span className="text-[11px]">Net Banking</span>
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>मूल शुल्क (Original Fee):</span>
                <span className="line-through">₹{course.originalPrice}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>विशेष रियायती शुल्क (AGS Discounted):</span>
                <span>₹{course.price}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>कूपन छूट:</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>कुल देय राशि (Payable Amount):</span>
                <span className="text-[#0a2240] font-mono text-base">₹{finalPrice}</span>
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% सुरक्षित 256-Bit SSL भुगतान • Instant Course Activation</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {finalPrice === 0 ? 'मुफ्त में शुरू करें (Start Free)' : `भुगतान करें ₹${finalPrice} (Enroll Now)`}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
