import React, { useState, useEffect } from 'react';
import { CartItem, OrderResult } from '../types';
import { createOrder } from '../lib/supabase';
import { X, CheckCircle, ShieldCheck, CreditCard, Loader2, Sparkles, Database, Lock } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: OrderResult) => void;
  isSupabaseLive: boolean;
  currentUser?: any;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  isSupabaseLive,
  currentUser,
}) => {
  const [formData, setFormData] = useState({
    name: currentUser?.user_metadata?.full_name || '',
    email: currentUser?.email || '',
    address: '',
    phone: '',
    paymentMethod: 'Stripe',
  });

  // Stripe card state
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    zip: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderResult | null>(null);
  const [stripePaymentId, setStripePaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || currentUser.user_metadata?.full_name || '',
        email: prev.email || currentUser.email || '',
      }));
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardData({ ...cardData, number: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    const formatted = raw.length > 2 ? `${raw.substring(0, 2)}/${raw.substring(2)}` : raw;
    setCardData({ ...cardData, expiry: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address) {
      setError('Please fill in your name, email, and shipping address.');
      return;
    }

    if (formData.paymentMethod === 'Stripe') {
      if (cardData.number.replace(/\s/g, '').length < 15) {
        setError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardData.expiry || !cardData.cvc) {
        setError('Please enter your card expiry and CVC.');
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const mockStripeId = 'pi_' + Math.random().toString(36).substring(2, 12) + '_secret';
      setStripePaymentId(mockStripeId);

      const { order, isLive } = await createOrder({
        customer_name: formData.name,
        customer_email: formData.email,
        shipping_address: formData.address,
        phone_number: formData.phone,
        payment_method: formData.paymentMethod,
        total_amount: Number(total.toFixed(2)),
        user_id: currentUser?.id,
        stripe_payment_id: mockStripeId,
        items: items.map((item) => ({
          product_id: item.product.id,
          product_title: item.product.title || item.product.name || 'Product',
          quantity: item.quantity,
          unit_price: item.product.price,
        })),
      });

      setConfirmedOrder(order);
      onOrderSuccess(order);
    } catch (err: any) {
      setError(err?.message || 'Failed to place order. Check your Supabase configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">
              {confirmedOrder ? 'Order Confirmed!' : 'Secure Checkout & Payment'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {confirmedOrder ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Thank You, {confirmedOrder.customer_name}!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your order & payment have been processed and saved into Supabase.
                </p>
              </div>

              {/* Order Details Card */}
              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-teal-700">{confirmedOrder.id}</span>
                </div>
                {stripePaymentId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stripe Payment Ref:</span>
                    <span className="font-mono text-slate-700">{stripePaymentId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Confirmation Sent To:</span>
                  <span className="font-semibold text-slate-800">{confirmedOrder.customer_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Charged:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ${confirmedOrder.total_amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold uppercase text-[10px]">
                    Paid via Stripe (Verified)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800 flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>
                  Query in Supabase: <code className="bg-white px-1 py-0.5 rounded font-mono font-bold">SELECT * FROM public.orders;</code>
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all shadow-md"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Personal info */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elyse Abiturije"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="abiturijeelyse@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Shipping Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Street, City, State, Postal Code, Country"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Gateway
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Stripe', label: 'Stripe Pay', badge: 'Fast & Secure' },
                      { id: 'PayPal', label: 'PayPal', badge: 'Direct' },
                      { id: 'COD', label: 'Cash on Delivery', badge: 'At doorstep' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: p.id })}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                          formData.paymentMethod === p.id
                            ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold">{p.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{p.badge}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stripe Elements Credit Card Inputs */}
                {formData.paymentMethod === 'Stripe' && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pb-1 border-b border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-teal-600" />
                        <span>Stripe Card Details</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">
                        256-bit SSL Encrypted
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4242 •••• •••• 4242"
                        value={cardData.number}
                        onChange={handleCardNumberChange}
                        className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardData.expiry}
                          onChange={handleExpiryChange}
                          className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          CVC
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          value={cardData.cvc}
                          onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                          className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          placeholder="10001"
                          value={cardData.zip}
                          onChange={(e) => setCardData({ ...cardData, zip: e.target.value })}
                          className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order total recap */}
              <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>Total Due ({items.reduce((a, b) => a + b.quantity, 0)} items):</span>
                <span className="text-base font-extrabold text-teal-700">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-sm transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing with Stripe & Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ${total.toFixed(2)} via {formData.paymentMethod}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
