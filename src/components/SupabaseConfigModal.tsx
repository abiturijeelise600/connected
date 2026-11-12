import React, { useState } from 'react';
import { getSupabaseCredentials, saveSupabaseCredentials, clearSupabaseCredentials } from '../lib/supabase';
import { X, Database, CheckCircle, Copy, Check, ExternalLink, KeyRound, Terminal, AlertTriangle } from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
  isSupabaseLive: boolean;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
  isSupabaseLive,
}) => {
  const current = getSupabaseCredentials();
  const [url, setUrl] = useState(current.url);
  const [key, setKey] = useState(current.key);
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(url, key);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onConfigSaved();
      onClose();
    }, 700);
  };

  const handleClear = () => {
    clearSupabaseCredentials();
    setUrl('');
    setKey('');
    onConfigSaved();
  };

  const sqlQuickSnippet = `-- Run this in your Supabase SQL Editor:
-- It creates products, orders, and order_items connected to your categories!
-- See the complete file in: supabase/schema.sql`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative border border-slate-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Connect Supabase Database</h2>
              <p className="text-xs text-slate-400">Project: abiturijeelyse@gmail.com's Project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          
          {/* Status banner */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isSupabaseLive 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {isSupabaseLive ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wide">
                {isSupabaseLive ? 'Connected to Supabase' : 'Waiting for Credentials'}
              </h4>
              <p className="text-xs mt-0.5 opacity-90">
                {isSupabaseLive 
                  ? 'Your store is actively querying and saving records to your live Supabase database.'
                  : 'Currently showing seed categories (Clothes, Shoes, Electronics, Accessories). Enter your API credentials below to connect live.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                required
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Found under: <strong>Project Settings → API → Project URL</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase anon / public API Key
              </label>
              <input
                type="password"
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Found under: <strong>Project Settings → API → Project API Keys (anon public)</strong>
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              {current.isConfigured && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  Disconnect / Reset
                </button>
              )}

              <button
                type="submit"
                className="ml-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Connected!</span>
                  </>
                ) : (
                  <span>Save & Connect</span>
                )}
              </button>
            </div>
          </form>

          {/* Database Schema Helper */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                <Terminal className="w-4 h-4" />
                <span>Database Tables & SQL Setup</span>
              </div>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Open Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-slate-400">
              We generated a complete <code className="text-teal-300 font-mono">supabase/schema.sql</code> file that creates your <code className="text-white font-mono">products</code>, <code className="text-white font-mono">orders</code>, and <code className="text-white font-mono">order_items</code> tables connected directly to your existing <code className="text-teal-300 font-mono">categories</code> table!
            </p>

            <div className="bg-slate-950 p-2.5 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800 flex items-center justify-between">
              <span>Path: /supabase/schema.sql</span>
              <span className="text-teal-400">Ready to run in SQL Editor</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
