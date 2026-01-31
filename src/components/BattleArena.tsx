'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AGENTS } from '@/lib/agents';
import { Flame, Swords, Trophy, RefreshCw, Share2, Check, ShoppingCart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BattleArena({ ingredients }: { ingredients: string }) {
    const [battleState, setBattleState] = useState<'loading' | 'battle' | 'results'>('loading');
    const [battleData, setBattleData] = useState<any>(null);
    const [currentRound, setCurrentRound] = useState(0); // 0 = Generate, 1 = Critique, 2 = Vote Phase, 3 = Verdict
    const [userVote, setUserVote] = useState<'agni' | 'veda' | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const startBattle = async () => {
            try {
                const res = await fetch('/api/battle', {
                    method: 'POST',
                    body: JSON.stringify({ ingredients }),
                });
                const data = await res.json();
                setBattleData(data);
                setBattleState('battle');

                // Auto-advance rounds
                // Phase 1 (Recipes) -> 5s -> Phase 2 (Critique)
                setTimeout(() => setCurrentRound(1), 5000);

                // Phase 2 (Critique) -> STOP HERE - User must click "Ready to Vote"

            } catch (e) {
                console.error(e);
            }
        };
        startBattle();
    }, [ingredients]);

    const handleVote = (chef: 'agni' | 'veda') => {
        setUserVote(chef);
        // Small delay after vote before showing verdict for dramatic effect
        setTimeout(() => setCurrentRound(3), 1500);
    };

    // Trigger Confetti on Verdict Reveal
    useEffect(() => {
        if (currentRound === 3) {
            const end = Date.now() + 3 * 1000;
            const colors = ['#FF6B35', '#10B981', '#ffffff'];

            (function frame() {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    }, [currentRound]);

    const handleShare = () => {
        const winner = battleData.rounds[2].winner === 'agni' ? "Agni (The Spice Warlord) 🔥" : "Veda (The Wellness Guru) 🌿";
        const text = `⚔️ CHEFBOT ARENA BATTLE RESULT ⚔️\n\nIngredients: ${ingredients}\nWinner: ${winner}\nMy Vote: ${userVote?.toUpperCase() || 'Spectator'}!\n\nJudge's Verdict: "${battleData.rounds[2].reason}"\n\nPlay now at chefbot-arena.com`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getShopLink = (query: string) => {
        return `https://www.swiggy.com/instamart/search?custom_back=true&query=${encodeURIComponent(query)}`;
    };


    // Recipe Modal State
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

    // Voting Review State
    const [isReviewing, setIsReviewing] = useState(false);
    const [showVoteButton, setShowVoteButton] = useState(false);

    // Show "Ready to Vote" button after critique phase
    useEffect(() => {
        if (currentRound === 1) {
            setTimeout(() => setShowVoteButton(true), 8000); // 8 seconds after critique starts
        }
    }, [currentRound]);

    if (battleState === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-saffron-500 blur-3xl opacity-20 animate-pulse"></div>
                    <Swords size={64} className="text-white animate-spin-slow relative z-10" />
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-widest animate-pulse">
                    Summoning Chefs...
                </h2>
            </div>
        );
    }

    if (battleData?.error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                <div className="p-4 bg-chili-500/10 rounded-full border border-chili-500/50 text-chili-500">
                    <Flame size={48} />
                </div>
                <h2 className="text-2xl font-bold text-chili-500">Battle Cancelled</h2>
                <p className="text-white/60 max-w-md">
                    "{battleData.error}"
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-all"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-2 relative">

            {/* RECIPE DETAILS MODAL (New Feature) */}
            <AnimatePresence>
                {selectedRecipe && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl overflow-y-auto"
                        onClick={() => setSelectedRecipe(null)}
                    >
                        <div className="min-h-screen flex items-center justify-center p-4 py-20">
                            <motion.div
                                initial={{ y: 50, scale: 0.95 }}
                                animate={{ y: 0, scale: 1 }}
                                exit={{ y: 50, scale: 0.95 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-kitchen-900 border border-white/10 p-4 md:p-8 rounded-3xl max-w-4xl w-full relative shadow-2xl"
                            >
                                {/* Mobile Back Button */}
                                <button
                                    onClick={() => setSelectedRecipe(null)}
                                    className="md:hidden sticky top-0 z-20 w-full mb-4 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl font-bold transition-all"
                                >
                                    <span className="text-xl">←</span> Back to Battle
                                </button>

                                {/* Desktop Close Button */}
                                <button
                                    onClick={() => setSelectedRecipe(null)}
                                    className="hidden md:block absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10 text-white text-xl"
                                >
                                    ✕
                                </button>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Visual Side */}
                                    <div className="space-y-6">

                                        <div className="aspect-square rounded-2xl overflow-hidden relative group shadow-2xl">
                                            {/* Fallback AI Image Visualization - IMPROVED */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${selectedRecipe.chef === 'agni' ? 'from-saffron-500 to-chili-900' : 'from-herb-500 to-emerald-900'} w-full h-full`}>
                                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                                    <div className="text-9xl mb-4 drop-shadow-2xl filter brightness-110 contrast-125 transform group-hover:scale-110 transition-transform duration-500">
                                                        {selectedRecipe.chef === 'agni' ? '🥘' : '🥗'}
                                                    </div>
                                                    <h3 className="text-white text-2xl font-black uppercase tracking-widest drop-shadow-md border-b-2 border-white/20 pb-2 mb-2">
                                                        {selectedRecipe.name}
                                                    </h3>
                                                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
                                                        AI Visualization
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <a
                                                href={getShopLink(ingredients)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-bold uppercase text-xs tracking-wider"
                                            >
                                                <ShoppingCart size={16} /> Shop Ingredients
                                            </a>
                                            <button
                                                onClick={() => window.alert("Image Saved to Gallery!")}
                                                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-bold uppercase text-xs tracking-wider"
                                            >
                                                <Share2 size={16} /> Save Card
                                            </button>
                                        </div>
                                    </div>

                                    {/* Text Side */}
                                    <div className="space-y-6 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                        <div>
                                            <h4 className={`text-sm font-bold uppercase tracking-widest mb-2 ${selectedRecipe.chef === 'agni' ? 'text-saffron-500' : 'text-herb-500'}`}>
                                                {selectedRecipe.chef === 'agni' ? AGENTS.agni.name : AGENTS.veda.name} Presents
                                            </h4>
                                            <h2 className="text-3xl font-black text-white leading-tight mb-4">{selectedRecipe.name}</h2>
                                            <p className="text-white/60 italic border-l-2 border-white/20 pl-4">"{selectedRecipe.description}"</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                <Flame size={18} className="text-chili-500" /> Instructions
                                            </h3>
                                            <div className="space-y-4">
                                                {selectedRecipe.steps.map((step: string, i: number) => (
                                                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-white/80">{i + 1}</span>
                                                        <p className="text-white/80 leading-relaxed text-sm">{step}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* VOTE OVERLAY (Phase 3) */}
            <AnimatePresence>
                {currentRound === 2 && !isReviewing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <div className="text-center space-y-8">
                            <h2 className="text-4xl font-black text-white uppercase tracking-widest animate-bounce">
                                Who Won? <span className="text-saffron-500">You Decide!</span>
                            </h2>
                            <div className="flex gap-8 justify-center">
                                <button
                                    onClick={() => handleVote('agni')}
                                    className="group relative p-1 rounded-2xl bg-gradient-to-br from-saffron-500 to-chili-600 hover:scale-110 transition-transform duration-300"
                                >
                                    <div className="bg-black/90 rounded-xl p-8 flex flex-col items-center gap-4 border border-white/10">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-saffron-500 shadow-lg">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={AGENTS.agni.avatar} className="w-full h-full object-cover" alt="Vote Agni" />
                                        </div>
                                        <span className="text-2xl font-bold text-saffron-500 uppercase tracking-widest">Vote Agni</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleVote('veda')}
                                    className="group relative p-1 rounded-2xl bg-gradient-to-br from-herb-500 to-emerald-600 hover:scale-110 transition-transform duration-300"
                                >
                                    <div className="bg-black/90 rounded-xl p-8 flex flex-col items-center gap-4 border border-white/10">
                                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-herb-500 shadow-lg">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={AGENTS.veda.avatar} className="w-full h-full object-cover" alt="Vote Veda" />
                                        </div>
                                        <span className="text-2xl font-bold text-herb-500 uppercase tracking-widest">Vote Veda</span>
                                    </div>
                                </button>
                            </div>

                            <button
                                onClick={() => setIsReviewing(true)}
                                className="mt-8 text-white/50 hover:text-white underline decoration-white/30 underline-offset-4 text-sm uppercase tracking-widest transition-colors"
                            >
                                Wait, let me review the recipes first
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RETURN TO VOTE FLOATING BUTTON */}
            {currentRound === 2 && isReviewing && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                >
                    <button
                        onClick={() => setIsReviewing(false)}
                        className="bg-saffron-500 hover:bg-saffron-600 text-black px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(255,107,53,0.5)] animate-bounce"
                    >
                        Ready to Vote! 🗳️
                    </button>
                </motion.div>
            )}

            {/* WINNER OVERLAY (Phase 4) */}
            <AnimatePresence>
                {currentRound === 3 && battleData.rounds[2] && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto"
                    >
                        <div className="min-h-screen flex items-center justify-center p-4 py-20">
                            <div className="bg-kitchen-800 border border-saffron-500/50 p-6 md:p-8 rounded-3xl max-w-2xl w-full text-center relative shadow-[0_0_50px_rgba(255,107,53,0.3)]">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-saffron-500 to-chili-500"></div>

                                <Trophy size={48} className="md:w-16 md:h-16 text-saffron-400 mx-auto mb-4 md:mb-6 animate-bounce" />

                                <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-white/50 mb-2">The Verdict</h2>
                                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 uppercase">
                                    Winner: <span className={battleData.rounds[2].winner === 'agni' ? 'text-saffron-500' : 'text-herb-500'}>
                                        {battleData.rounds[2].winner}
                                    </span>
                                </h1>

                                <div className="max-h-[40vh] overflow-y-auto mb-6 md:mb-8 custom-scrollbar">
                                    <p className="text-base md:text-xl text-white/80 italic leading-relaxed px-2">
                                        "{battleData.rounds[2].reason}"
                                    </p>
                                </div>

                                {userVote && (
                                    <div className="mb-6 p-4 bg-white/5 rounded-xl inline-block">
                                        <span className="text-white/60 text-sm">You Voted: </span>
                                        <span className={`font-bold uppercase ${userVote === 'agni' ? 'text-saffron-500' : 'text-herb-500'}`}>
                                            {userVote}
                                        </span>
                                        <span className="ml-2 text-white/40 text-sm">
                                            {userVote === battleData.rounds[2].winner ? "(You agreed with the AI!)" : "(The Judge disagreed!)"}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-center gap-4 flex-wrap">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all group"
                                    >
                                        <RefreshCw size={20} className="group-hover:rotate-180 transition-transform" />
                                        Battle Again
                                    </button>

                                    <button
                                        onClick={handleShare}
                                        className="flex items-center justify-center gap-2 px-6 py-4 bg-saffron-500 hover:bg-saffron-600 text-black rounded-xl font-bold transition-all group shadow-[0_0_15px_rgba(255,107,53,0.3)]"
                                    >
                                        {copied ? <Check size={20} /> : <Share2 size={20} />}
                                        {copied ? "Copied!" : "Share Result"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Battle Header */}
            <div className={`flex justify-between items-center mb-12 relative transition-opacity duration-500 ${currentRound >= 2 && !isReviewing ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
                <div className="flex items-center gap-4 bg-kitchen-800/50 p-4 rounded-2xl glass-card border-saffron-500/30">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-saffron-500 shadow-[0_0_15px_rgba(255,107,53,0.4)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={AGENTS.agni.avatar} alt="Agni" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-saffron-500 uppercase">{AGENTS.agni.name}</h2>
                        <p className="text-xs text-white/50 tracking-wider">The Spice Warlord</p>
                    </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                    <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest shadow-xl">
                        {currentRound === 0 && 'Phase 1: Creation'}
                        {currentRound === 1 && 'Phase 2: Roast & Critique'}
                        {currentRound === 2 && 'Phase 3: Voting'}
                        {currentRound === 3 && 'Phase 4: Verdict'}
                    </div>
                    <div className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 to-chili-500 mt-2">
                        VS
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-kitchen-800/50 p-4 rounded-2xl glass-card border-herb-500/30 text-right">
                    <div>
                        <h2 className="text-2xl font-black text-herb-500 uppercase">{AGENTS.veda.name}</h2>
                        <p className="text-xs text-white/50 tracking-wider">The Wellness Guru</p>
                    </div>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-herb-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={AGENTS.veda.avatar} alt="Veda" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* The Arena Split */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[500px] transition-opacity duration-500 ${currentRound >= 2 && !isReviewing ? 'opacity-20 blur-sm' : 'opacity-100'}`}>

                {/* Agni's Side */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="glass-card bg-kitchen-800/30 border-saffron-500/20 rounded-3xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-32 bg-saffron-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-saffron-500/10 transition-all"></div>

                    <AnimatePresence mode="wait">
                        {currentRound >= 0 && battleData?.rounds?.[0]?.agni && (
                            <motion.div
                                key="agni-recipe"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h3 className="text-3xl font-black mb-4 text-white leading-tight">
                                    {battleData.rounds[0].agni.name}
                                </h3>
                                <p className="text-white/70 italic mb-6">"{battleData.rounds[0].agni.description}"</p>
                                <ul className="space-y-2 text-sm text-white/60 mb-8">
                                    {battleData.rounds[0].agni.steps?.slice(0, 3).map((s: string, i: number) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="text-saffron-500 font-bold">{i + 1}.</span> {s}
                                        </li>
                                    ))}
                                    <li className="text-white/40 italic pl-6">... (Click for full recipe)</li>
                                </ul>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setSelectedRecipe({ ...battleData.rounds[0].agni, chef: 'agni' })}
                                        className="flex-1 flex items-center justify-center py-3 rounded-xl bg-saffron-500 text-black font-bold text-sm uppercase tracking-wider hover:bg-saffron-400 transition-colors shadow-lg"
                                    >
                                        View Full Recipe
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {currentRound >= 1 && battleData?.rounds?.[1]?.agni && (
                            <motion.div
                                key="agni-critique"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-black/40 p-6 rounded-xl border border-chili-500/40 relative mt-10"
                            >
                                <div className="absolute -top-3 -left-3 bg-chili-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                    ATTACK
                                </div>
                                <p className="text-xl italic text-chili-400 font-medium">
                                    "{battleData.rounds[1].agni.message}"
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Veda's Side */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="glass-card bg-kitchen-800/30 border-herb-500/20 rounded-3xl p-6 relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 p-32 bg-herb-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-herb-500/10 transition-all"></div>

                    <AnimatePresence mode="wait">
                        {currentRound >= 0 && battleData?.rounds?.[0]?.veda && (
                            <motion.div
                                key="veda-recipe"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h3 className="text-3xl font-black mb-4 text-white leading-tight">
                                    {battleData.rounds[0].veda.name}
                                </h3>
                                <p className="text-white/70 italic mb-6">"{battleData.rounds[0].veda.description}"</p>
                                <ul className="space-y-2 text-sm text-white/60 mb-8">
                                    {battleData.rounds[0].veda.steps?.slice(0, 3).map((s: string, i: number) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="text-herb-500 font-bold">{i + 1}.</span> {s}
                                        </li>
                                    ))}
                                    <li className="text-white/40 italic pl-6">... (Click for full recipe)</li>
                                </ul>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setSelectedRecipe({ ...battleData.rounds[0].veda, chef: 'veda' })}
                                        className="flex-1 flex items-center justify-center py-3 rounded-xl bg-herb-500 text-black font-bold text-sm uppercase tracking-wider hover:bg-herb-400 transition-colors shadow-lg"
                                    >
                                        View Full Recipe
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {currentRound >= 1 && battleData?.rounds?.[1]?.veda && (
                            <motion.div
                                key="veda-critique"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-black/40 p-6 rounded-xl border border-herb-500/40 relative mt-10"
                            >
                                <div className="absolute -top-3 -right-3 bg-herb-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                    COUNTER
                                </div>
                                <p className="text-xl italic text-herb-400 font-medium">
                                    "{battleData.rounds[1].veda.message}"
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

            </div>

            {/* Ready to Vote Button */}
            <AnimatePresence>
                {showVoteButton && currentRound === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center mt-12"
                    >
                        <button
                            onClick={() => setCurrentRound(2)}
                            className="group relative px-12 py-6 rounded-2xl bg-gradient-to-r from-saffron-500 to-chili-600 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,107,53,0.3)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-saffron-400 to-chili-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <span className="relative text-2xl font-black uppercase tracking-widest text-black flex items-center gap-3">
                                <Swords size={28} />
                                Ready to Vote
                                <Swords size={28} />
                            </span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
