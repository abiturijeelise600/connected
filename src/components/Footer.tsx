import React from 'react';
import { ShoppingBag, Database, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span>NovaStore</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Fullstack Supabase e-commerce application powered by PostgreSQL, real-time catalog syncing, and instant checkout.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Categories (public.categories)
            </h4>
            <ul className="space-y-2">
              <li><span className="hover:text-teal-400 cursor-pointer">#1 Clothes</span></li>
              <li><span className="hover:text-teal-400 cursor-pointer">#2 Shoes</span></li>
              <li><span className="hover:text-teal-400 cursor-pointer">#3 Electronics</span></li>
              <li><span className="hover:text-teal-400 cursor-pointer">#4 Accessories</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Database Schema
            </h4>
            <ul className="space-y-2 font-mono text-[11px]">
              <li>public.categories</li>
              <li>public.products</li>
              <li>public.orders</li>
              <li>public.order_items</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Supabase Project
            </h4>
            <p className="leading-relaxed text-slate-400 mb-2">
              SQL scripts located in <code className="text-teal-400 font-mono">/supabase/schema.sql</code>. Copy & execute in your Supabase SQL Editor.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-teal-400 text-[11px]">
              <Database className="w-3.5 h-3.5" />
              <span>RLS Security Enabled</span>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} NovaStore. Built with React, TypeScript, Tailwind CSS & Supabase.
          </div>
          <div className="flex items-center gap-1">
            <span>Production ready e-commerce platform</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
