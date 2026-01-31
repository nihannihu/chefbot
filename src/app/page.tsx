'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ChefHat, Send, Sparkles } from 'lucide-react';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRoast = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-5xl mx-auto space-y-12 py-10">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 px-4"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-saffron-500/10 text-saffron-500 text-xs font-bold tracking-wider border border-saffron-500/20 uppercase shadow-[0_0_20px_rgba(255,107,53,0.2)]">
          Early Access: Alpha v0.1
        </span>
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9]">
          ROAST MY <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 via-chili-500 to-saffron-500 animate-gradient-x bg-[length:200%_auto]">
            FRIDGE
          </span>
        </h1>
        <p className="text-white/60 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
          Enter your sad leftovers. Our AI Chef <span className="text-chili-500 font-bold">"Agni"</span> will insult your choices, then fix your dinner.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-xl relative group px-4"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-saffron-500 to-chili-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center glass-card rounded-2xl p-2 bg-kitchen-900/80">
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Ex: 2 eggs, stale bread, ketchup, maggi..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-600 px-6 py-4 text-lg"
            onKeyDown={(e) => e.key === 'Enter' && handleRoast()}
            autoFocus
          />
          <button
            onClick={handleRoast}
            disabled={loading || !ingredients.trim()}
            className="bg-saffron-500 hover:bg-saffron-600 text-black p-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-saffron-500/20"
          >
            {loading ? <Flame className="animate-bounce" /> : <Send size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Result Section */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-saffron-500 font-bold animate-pulse text-xl"
          >
            Agni is judging your life choices...
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full grid md:grid-cols-2 gap-8 px-4"
          >
            {/* The Roast Card */}
            <div className="glass-card bg-kitchen-800/40 border-chili-500/30 rounded-3xl p-8 relative overflow-hidden group hover:border-chili-500/60 transition-all hover:shadow-[0_0_40px_rgba(230,57,70,0.1)]">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                <Flame size={200} />
              </div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-chili-500/20 text-chili-500">
                    <Flame size={24} />
                  </div>
                  <h3 className="text-chili-500 font-bold uppercase tracking-widest text-sm">Agni's Verdict</h3>
                </div>

                <p className="text-2xl md:text-3xl font-medium leading-tight italic text-white/90 mb-8 flex-grow">
                  "{result.roast}"
                </p>

                <div className="mt-auto">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-white/40">
                    <span>Spiciness Level</span>
                    <span>{result.spicinessLevel}/10</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(result.spicinessLevel || 5) * 10}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-saffron-500 to-chili-600 shadow-[0_0_10px_rgba(230,57,70,0.5)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* The Recipe Card */}
            <div className="glass-card bg-kitchen-800/40 border-saffron-500/30 rounded-3xl p-8 relative overflow-hidden group hover:border-saffron-500/60 transition-all hover:shadow-[0_0_40px_rgba(255,107,53,0.1)]">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                <ChefHat size={200} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-saffron-500/20 text-saffron-500">
                    <ChefHat size={24} />
                  </div>
                  <h3 className="text-saffron-500 font-bold uppercase tracking-widest text-sm">The Redemption</h3>
                </div>

                <h2 className="text-3xl font-bold mb-6 text-white">{result.recipeName}</h2>

                <div className="space-y-4 mb-8">
                  {result.steps?.slice(0, 4).map((step: string, i: number) => (
                    <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-saffron-500/20 text-saffron-500 flex items-center justify-center font-bold text-xs ring-1 ring-saffron-500/40">{i + 1}</span>
                      <p className="text-white/80 text-sm leading-relaxed">{step}</p>

                    </div>
                  ))}
                </div>
                <button
                  onClick={() => window.location.href = `/battle?ingredients=${encodeURIComponent(ingredients)}`}
                  className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group-hover:border-saffron-500/30"
                >
                  <Sparkles size={16} className="text-saffron-500" />
                  <span>View Full Battle Plan</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Section (Startup Feature) */}
      <div className="w-full max-w-4xl mt-20 pt-12 border-t border-white/5">
        <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest text-white/40">Global Chef Rankings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Agni', title: 'The Spice Warlord', wins: '1,240', winRate: '68%', color: 'from-saffron-500 to-chili-600' },
            { name: 'Veda', title: 'The Wellness Guru', wins: '982', winRate: '42%', color: 'from-herb-500 to-emerald-600' },
            { name: 'Kai', title: 'The Ocean Master', wins: 'Coming Soon', winRate: '-', color: 'from-blue-500 to-cyan-500' },
          ].map((chef, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${chef.color} flex items-center justify-center font-bold text-black text-xs`}>
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm">{chef.name}</h4>
                  <p className="text-xs text-white/40">{chef.title}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-saffron-500">{chef.wins}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider">Wins</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
