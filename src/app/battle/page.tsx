'use client';

import { useState } from 'react';
import BattleArena from '@/components/BattleArena';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

export default function BattlePage() {
    const [ingredients, setIngredients] = useState('');
    const [started, setStarted] = useState(false);

    return (
        <div className="min-h-screen py-10">
            <AnimatePresence mode="wait">
                {!started ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="max-w-xl mx-auto text-center space-y-8 mt-20"
                        key="input-screen"
                    >
                        <h1 className="text-5xl font-black italic tracking-tighter">
                            ENTER THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 to-chili-600">ARENA</span>
                        </h1>
                        <p className="text-white/60">Agni vs Veda needs fuel. What's in your pantry?</p>

                        <div className="relative flex items-center glass-card rounded-2xl p-2 bg-kitchen-900/80">
                            <input
                                type="text"
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                placeholder="E.g., Chicken, Chocolate, Chili"
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-600 px-6 py-4 text-lg"
                                onKeyDown={(e) => e.key === 'Enter' && setStarted(true)}
                                autoFocus
                            />
                            <button
                                onClick={() => setStarted(true)}
                                disabled={!ingredients.trim()}
                                className="bg-saffron-500 hover:bg-saffron-600 text-black p-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                <Send size={24} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key="battle-screen"
                    >
                        <BattleArena ingredients={ingredients} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
