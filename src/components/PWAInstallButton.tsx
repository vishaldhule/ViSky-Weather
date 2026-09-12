import React, { useState } from 'react';
import { Smartphone, Download, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { AppLogoIcon } from './AppLogo';

interface PWAInstallButtonProps {
  variant?: 'header' | 'floating' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running in standalone PWA mode, don't show prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      setShowGuide(true);
    }
  };

  if (variant === 'banner') {
    return (
      <>
        <div id="pwa-mobile-banner" className="relative mx-3 mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-indigo-600/30 border border-cyan-400/30 backdrop-blur-xl flex items-center justify-between gap-3 shadow-lg shadow-blue-950/40">
          <div className="flex items-center gap-3 min-w-0">
            <AppLogoIcon size={38} className="shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white tracking-wide truncate">Get Indra Mobile App</div>
              <div className="text-[11px] text-white/60 truncate">Add to Home Screen for full offline app experience</div>
            </div>
          </div>
          <button
            id="pwa-banner-install-btn"
            onClick={handleInstallClick}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
        </div>

        {/* Modal Guide */}
        {showGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900/95 border border-white/15 p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <AppLogoIcon size={28} />
                  <h3 className="font-bold text-base">Install Indra App</h3>
                </div>
                <button 
                  onClick={() => setShowGuide(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isIOS ? (
                <div className="space-y-3.5 text-xs text-white/80">
                  <p className="text-white/60">Install directly onto your iPhone or iPad home screen:</p>
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-white">Step 1:</span> Tap the <strong className="text-cyan-300">Share</strong> button in Safari's bottom toolbar.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                      <PlusSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-white">Step 2:</span> Scroll down and tap <strong className="text-cyan-300">Add to Home Screen</strong>.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs text-white/80">
                  <p className="text-white/70">
                    To install on Android or Desktop browser:
                  </p>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-white">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Tap browser menu (3 dots)</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Select <strong>Install app</strong> or <strong>Add to Home screen</strong></span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 font-medium text-xs text-white transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        id="pwa-header-install-btn"
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 active:scale-95 text-cyan-300 border border-cyan-400/30 text-xs font-semibold backdrop-blur-md transition-all shadow-sm"
        title="Install Indra Mobile App"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* Modal Guide */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900/95 border border-white/15 p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <AppLogoIcon size={28} />
                <h3 className="font-bold text-base">Install Indra App</h3>
              </div>
              <button 
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3.5 text-xs text-white/80">
                <p className="text-white/60">Install directly onto your iPhone or iPad home screen:</p>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Step 1:</span> Tap the <strong className="text-cyan-300">Share</strong> button in Safari toolbar.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Step 2:</span> Tap <strong className="text-cyan-300">Add to Home Screen</strong>.
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-white/80">
                <p className="text-white/70">
                  To install on Android or your browser:
                </p>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Tap browser menu (3 dots)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Select <strong>Install app</strong> or <strong>Add to Home screen</strong></span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 font-medium text-xs text-white transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
