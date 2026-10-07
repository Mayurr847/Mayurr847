import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const NewsletterSection: React.FC = () => {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitted(true);
    showToast("You're on the list ☕", 'Check your inbox for 10% off your next drink!', 'success');
  };

  return (
    <section className="py-20 lg:py-24 bg-[#F5EFE6] border-t border-[#1D1916]/10 relative overflow-hidden">
      {/* Background doodles */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-block px-3.5 py-1 rounded-full border border-[#8FAF78] text-[#8FAF78] font-['League_Spartan'] font-bold text-xs uppercase tracking-wider mb-4">
          DISPATCH
        </div>

        {/* Headline: GOOD THINGS, IN YOUR INBOX. */}
        <h2 className="font-['League_Spartan'] font-black text-4xl sm:text-5xl lg:text-6xl text-[#1D1916] tracking-[-0.04em] uppercase leading-[0.88]">
          GOOD THINGS,<br />
          IN YOUR INBOX.
        </h2>

        {/* Supporting Copy */}
        <p className="mt-4 font-sans text-base sm:text-lg text-[#5A5048] max-w-lg mx-auto">
          “New drinks, café gossip, occasional discounts. No spam. Promise.”
        </p>

        {/* Form or Success State */}
        <div className="mt-8 max-w-md mx-auto">
          {isSubmitted ? (
            <div className="p-6 rounded-2xl bg-[#8FAF78] text-[#1D1916] border-2 border-[#1D1916] shadow-brutal-lg animate-fadeIn flex flex-col items-center gap-2">
              <span className="text-3xl">☕</span>
              <h3 className="font-syne font-black text-2xl uppercase">
                You're on the list ☕
              </h3>
              <p className="font-space text-xs font-semibold text-[#1D1916]/90">
                We just sent a 10% welcome coupon to <span className="underline">{email}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className={`w-full px-5 py-3.5 text-sm bg-[#F6F0E6] border-2 rounded-full font-sans focus:bg-white focus:outline-none shadow-brutal ${
                      error ? 'border-[#D94A45]' : 'border-[#1D1916]'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#1D1916] hover:bg-[#2E2722] text-[#F6F0E6] font-space font-bold text-sm px-8 py-3.5 rounded-full border-2 border-[#1D1916] shadow-brutal hover:shadow-brutal-lg flex items-center justify-center gap-2 transition-all shrink-0 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>I'm In</span>
                  <span className="text-[#F4D35E]">→</span>
                </button>
              </div>

              {error && (
                <p className="text-xs text-[#D94A45] font-space font-bold text-left pl-4 pt-1">
                  {error}
                </p>
              )}

              <p className="text-[11px] font-handwritten text-[#5A5048] font-bold pt-2">
                *unsubscribe whenever, we won’t cry (much).
              </p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
