'use client';

import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs';

export default function Header() {
    return (
        <header className="fixed top-0 w-full z-50 glass-card border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="text-3xl">⚔️</div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        <span className="text-saffron-500">ChefBot</span>
                        <span className="text-chili-500">ARENA</span>
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <SignedOut>
                        <div className="flex items-center gap-4">
                            <SignInButton mode="modal">
                                <button className="text-sm font-bold text-white/70 hover:text-white transition-colors">
                                    Login
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-2 px-4 rounded-full transition-all">
                                    Sign Up
                                </button>
                            </SignUpButton>
                            <a href="/battle" className="bg-saffron-500 hover:bg-saffron-600 text-black text-sm font-bold py-2 px-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,107,53,0.4)]">
                                Start Battling
                            </a>
                        </div>
                    </SignedOut>

                    <SignedIn>
                        <div className="flex items-center gap-4">
                            <UserButton
                                showName={false}
                                appearance={{
                                    elements: {
                                        avatarBox: "w-14 h-14 border-2 border-saffron-500 rounded-full shadow-[0_0_10px_rgba(255,107,53,0.5)] hover:scale-105 transition-transform",
                                        userButtonTrigger: "focus:shadow-none focus:outline-none"
                                    }
                                }}
                                afterSignOutUrl="/"
                            />
                            <a href="/battle" className="bg-saffron-500 hover:bg-saffron-600 text-black text-sm font-bold py-2 px-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,107,53,0.4)]">
                                Start Battling
                            </a>
                        </div>
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}
