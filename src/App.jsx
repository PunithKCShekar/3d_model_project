import React, { useState, useEffect } from 'react';
import CanvasContainer from './components/CanvasContainer';
import ControlPanel from './components/ControlPanel';
import WordmarkLogo from './components/WordmarkLogo';
import { Camera, Layers, FolderHeart, Trash2, HelpCircle } from 'lucide-react';

const DEFAULT_CONFIG = {
  sole: { color: '#121212', material: 'rubber', name: 'Sole' },
  upper: { color: '#262626', material: 'leather', name: 'Upper' },
  toe: { color: '#121212', material: 'leather', name: 'Toe Cap' },
  heel: { color: '#E6A028', material: 'leather', name: 'Heel' },
  tongue: { color: '#262626', material: 'knit', name: 'Tongue' },
  laces: { color: '#E6A028', material: 'knit', name: 'Laces' },
  stripe: { color: '#E6A028', material: 'metal', name: 'Accent Chevron' },
  lining: { color: '#262626', material: 'knit', name: 'Inside Collar' },
};

const COLORS = [
  { hex: '#121212', name: 'Obsidian Noir', premium: 0 },
  { hex: '#262626', name: 'Chamber Black', premium: 0 },
  { hex: '#E6A028', name: 'Warm Amber', premium: 15 },
  { hex: '#D4AF37', name: 'Gilded Gold', premium: 25 },
  { hex: '#F5F3EF', name: 'Alabaster Cream', premium: 0 },
  { hex: '#631010', name: 'Oxblood Crimson', premium: 10 },
  { hex: '#1E293B', name: 'Cobalt Shadow', premium: 0 },
  { hex: '#3F4E4F', name: 'Alpine Sage', premium: 5 },
];

const MATERIALS = [
  { id: 'rubber', name: 'Vulcanized Rubber', premium: 0 },
  { id: 'leather', name: 'Matte Leather', premium: 0 },
  { id: 'patent', name: 'Glossy Patent', premium: 15 },
  { id: 'knit', name: 'Tech Knit', premium: 0 },
  { id: 'metal', name: 'Anodized Chrome', premium: 30 },
  { id: 'carbon', name: 'Carbon Fiber', premium: 20 },
];

export default function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [activePart, setActivePart] = useState('stripe');
  const [lastUpdatedPart, setLastUpdatedPart] = useState(null);
  const [viewMode, setViewMode] = useState('angle');
  const [exploded, setExploded] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [savedOpen, setSavedOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load saved designs on mount
  useEffect(() => {
    const cached = localStorage.getItem('vesper_saved_configs');
    if (cached) {
      try {
        setSavedConfigs(JSON.parse(cached));
      } catch (e) {
        console.error('Error parsing saved configurations', e);
      }
    }
  }, []);

  // Toast notification helper
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Update specific part configuration
  const updateConfig = (part, newSettings) => {
    setConfig((prev) => ({
      ...prev,
      [part]: { ...prev[part], ...newSettings },
    }));
    setLastUpdatedPart(part);
  };

  // Pricing calculations based on selections
  const calculatePrice = () => {
    let total = 220; // Base Price
    Object.entries(config).forEach(([_, settings]) => {
      const colorPrem = COLORS.find((c) => c.hex.toLowerCase() === settings.color.toLowerCase())?.premium || 0;
      const matPrem = MATERIALS.find((m) => m.id === settings.material)?.premium || 0;
      total += colorPrem + matPrem;
    });
    return total;
  };

  // Reset to default
  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setActivePart('stripe');
    setLastUpdatedPart(null);
    setExploded(false);
    setViewMode('angle');
    triggerNotification('Configuration reset to signature spec', 'info');
  };

  // Save current configuration to library
  const handleSave = () => {
    const newSave = {
      id: Date.now(),
      name: `Silhouette #${savedConfigs.length + 1}`,
      config: { ...config },
      price: calculatePrice(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    const updated = [newSave, ...savedConfigs];
    setSavedConfigs(updated);
    localStorage.setItem('vesper_saved_configs', JSON.stringify(updated));
    triggerNotification('Configuration archived successfully');
  };

  // Delete saved configuration
  const handleDeleteConfig = (id, e) => {
    e.stopPropagation();
    const updated = savedConfigs.filter((item) => item.id !== id);
    setSavedConfigs(updated);
    localStorage.setItem('vesper_saved_configs', JSON.stringify(updated));
    triggerNotification('Configuration removed from library', 'info');
  };

  // Load a saved configuration
  const handleLoadConfig = (savedItem) => {
    setConfig(savedItem.config);
    setLastUpdatedPart(null);
    triggerNotification(`Loaded design: ${savedItem.name}`);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-bg-darker text-text-primary overflow-hidden font-sans">
      
      {/* Header/Navbar */}
      <header className="h-14 border-b border-border-dark bg-bg-darker/80 backdrop-blur-md flex items-center justify-between px-6 z-30 shrink-0 select-none">
        <div className="flex items-center gap-6">
          <WordmarkLogo />
          <nav className="hidden md:flex items-center gap-5 font-mono text-[9px] tracking-widest uppercase text-text-secondary">
            <span className="text-brand border-b border-brand/50 pb-0.5 pointer-events-none">01 // Customizer</span>
            <span className="hover:text-text-primary transition-colors cursor-help" title="3D Physical Rendering Engine active">02 // Engine Specs</span>
            <span className="hover:text-text-primary transition-colors cursor-help" title="Atelier Noir Customization Framework">03 // Atelier Framework</span>
          </nav>
        </div>
        <div className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-widest text-text-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <span>SYS_READY // WEBGL2</span>
        </div>
      </header>

      {/* Main Workspace Area (Split view) */}
      <div className="flex-grow flex flex-col lg:flex-row min-h-0 relative">
        
        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 bg-bg-panel border border-brand/30 rounded-lg shadow-2xl animate-fade-in-up backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-brand animate-ping" />
            <span className="font-mono text-xs uppercase tracking-wider">{notification.message}</span>
          </div>
        )}

        {/* Product Preview Section (Left 60% on desktop) */}
        <div className="relative w-full lg:w-[60%] h-[50vh] lg:h-full border-b lg:border-b-0 lg:border-r border-border-dark flex flex-col justify-between p-4 z-20">
          
          {/* Camera Viewfinder Corners / Crosshair Overlay (Professional CAD/Photography vibe) */}
          <div className="absolute inset-4 border border-border-dark/15 pointer-events-none z-10 rounded-md">
            {/* Viewfinder corner brackets */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-brand/45" />
            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-brand/45" />
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-brand/45" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-brand/45" />
            
            {/* Subtle crosshair in the absolute center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand">
                <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="0.75" />
                <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="0.75" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="0.75" />
              </svg>
            </div>
            
            {/* Viewfinder status bars */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 font-mono text-[7px] text-brand/50 uppercase tracking-widest">
              REC // ACTIVE_STAGE
            </div>
          </div>

          {/* Viewport Top Actions */}
          <div className="flex items-center justify-between w-full z-30 pointer-events-none">
            {/* Price Tag (Signature element: Frosted glass price tag badge) */}
            <div id="frosted-price-badge" className="pointer-events-auto bg-bg-glass backdrop-blur-md border border-border-dark rounded-lg p-3 flex flex-col shadow-lg">
              <span className="font-mono text-4xs text-text-secondary uppercase tracking-widest">
                VESPER S-04 Config
              </span>
              <span className="font-display text-lg font-bold text-brand mt-0.5">
                ${calculatePrice().toFixed(2)}{' '}
                <span className="font-sans text-[10px] text-text-primary font-normal uppercase">
                  USD
                </span>
              </span>
            </div>

            {/* Telemetry Panel */}
            <div className="hidden md:flex flex-col text-right font-mono text-[9px] text-text-secondary bg-bg-darker/60 border border-border-dark/30 rounded-md px-3 py-2 leading-relaxed">
              <div>FOCAL_LENGTH: 45mm</div>
              <div>SHADING: PHYSICAL_PBR</div>
              <div>RENDERER: WEBGL_2.0_GLSL3</div>
              <div>ACTIVE_CELLS: 12_COMPONENTS</div>
            </div>
          </div>

          {/* Floating Saved Designs Drawer Toggle Button */}
          <button
            id="library-toggle-button"
            onClick={() => setSavedOpen(!savedOpen)}
            className="absolute top-20 left-4 z-30 flex items-center gap-2 bg-bg-glass backdrop-blur-md border border-border-dark hover:border-brand/40 text-text-secondary hover:text-brand px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            <FolderHeart className="w-4 h-4" />
            <span>Library ({savedConfigs.length})</span>
          </button>

          {/* Sliding Library / Saved Configurations Panel */}
          {savedOpen && (
            <div id="saved-library-drawer" className="absolute top-32 left-4 bottom-24 w-[280px] bg-bg-glass backdrop-blur-xl border border-border-dark rounded-xl p-4 flex flex-col gap-3 z-30 shadow-2xl overflow-y-auto animate-fade-in">
              <div className="flex items-center justify-between border-b border-border-dark pb-2">
                <span className="font-display text-2xs font-bold uppercase tracking-widest text-text-primary">
                  Design Archive
                </span>
                <button
                  onClick={() => setSavedOpen(false)}
                  className="font-mono text-[10px] text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  [CLOSE]
                </button>
              </div>
              
              {savedConfigs.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-text-secondary font-mono text-3xs border border-dashed border-border-dark/60 rounded-lg">
                  <FolderHeart className="w-8 h-8 opacity-20 mb-2" />
                  NO ARCHIVED CONFIGS FOUND.<br/>SAVE A CONFIG TO ARCHIVE IT.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {savedConfigs.map((item) => (
                    <div
                      key={item.id}
                      id={`saved-config-item-${item.id}`}
                      onClick={() => handleLoadConfig(item)}
                      className="group border border-border-dark/60 hover:border-brand/60 bg-bg-darker/60 hover:bg-brand-glow/5 p-3 rounded-lg flex items-center justify-between transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex flex-col gap-1 w-[70%]">
                        <span className="font-display text-2xs font-bold text-text-primary truncate">
                          {item.name}
                        </span>
                        <span className="font-mono text-4xs text-brand font-medium">
                          ${item.price.toFixed(2)} USD • {item.timestamp}
                        </span>
                        {/* Color circles showing custom parts */}
                        <div className="flex gap-1 mt-1">
                          {Object.values(item.config).slice(0, 5).map((part, i) => (
                            <div
                              key={i}
                              style={{ backgroundColor: part.color }}
                              className="w-2 h-2 rounded-full border border-bg-darker"
                            />
                          ))}
                          {Object.values(item.config).length > 5 && (
                            <span className="font-mono text-[6px] text-text-secondary self-center">
                              +{Object.values(item.config).length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        id={`saved-config-delete-${item.id}`}
                        onClick={(e) => handleDeleteConfig(item.id, e)}
                        className="text-text-secondary hover:text-red-500 p-1.5 rounded hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3D Canvas Stage Wrapper */}
          <div id="three-canvas-container" className="absolute inset-0 z-0">
            <CanvasContainer
              config={config}
              activePart={activePart}
              setActivePart={setActivePart}
              lastUpdatedPart={lastUpdatedPart}
              viewMode={viewMode}
              exploded={exploded}
            />
          </div>

          {/* Exploded View & Active Part Overlay HUD */}
          <div className="absolute bottom-20 left-4 z-10 pointer-events-none flex flex-col gap-1 select-none">
            <div className="bg-bg-darker/70 backdrop-blur-sm border border-border-dark/40 rounded px-2.5 py-1 text-4xs font-mono text-text-secondary flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              TARGET: {activePart.toUpperCase()}
            </div>
            {exploded && (
              <div className="bg-brand/10 border border-brand/30 rounded px-2.5 py-1 text-4xs font-mono text-brand flex items-center gap-1.5 animate-pulse">
                EXPLODED_VIEW: MULTI-LAYER_EXPANSION
              </div>
            )}
          </div>

          {/* Studio Viewport Bottom Navigation & Controls */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 z-30 pointer-events-none mt-auto">
            {/* Camera View Angle Anchors */}
            <div className="pointer-events-auto flex items-center gap-1.5 bg-bg-glass backdrop-blur-md border border-border-dark p-1.5 rounded-lg shadow-lg">
              <div className="flex items-center gap-1 px-2 border-r border-border-dark font-mono text-[9px] uppercase text-text-secondary font-bold">
                <Camera className="w-3.5 h-3.5 text-brand" /> Views
              </div>
              {['angle', 'side', 'top', 'front', 'heel'].map((mode) => (
                <button
                  key={mode}
                  id={`camera-view-${mode}`}
                  onClick={() => setViewMode(mode)}
                  className={`px-2.5 py-1 rounded text-3xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    viewMode === mode
                      ? 'bg-brand text-bg-darker font-bold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-darker/50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Blueprint/Explode Controls */}
            <div className="pointer-events-auto flex items-center gap-2 bg-bg-glass backdrop-blur-md border border-border-dark p-1.5 rounded-lg shadow-lg">
              <button
                id="exploded-view-toggle"
                onClick={() => setExploded(!exploded)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-3xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  exploded
                    ? 'bg-brand/20 text-brand border border-brand/50 font-bold'
                    : 'text-text-secondary hover:text-text-primary border border-border-dark hover:border-text-secondary bg-bg-darker/30'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Exploded View: {exploded ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Tiny Instruction Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center hidden lg:block select-none opacity-40">
            <span className="font-mono text-4xs uppercase tracking-widest text-text-secondary flex items-center justify-center gap-1">
              <HelpCircle className="w-3 h-3 text-brand" /> Drag to spin 3D canvas • Scroll to zoom • Click parts to select
            </span>
          </div>

        </div>

        {/* Customization Panel Section (Right 40% on desktop) */}
        <div className="w-full lg:w-[40%] h-[50vh] lg:h-full z-20">
          <ControlPanel
            config={config}
            updateConfig={updateConfig}
            activePart={activePart}
            setActivePart={setActivePart}
            calculatePrice={calculatePrice}
            onReset={handleReset}
            onSave={handleSave}
          />
        </div>

      </div>

      {/* Footer */}
      <footer className="h-10 border-t border-border-dark bg-bg-darker/90 backdrop-blur-md flex items-center justify-between px-6 z-30 shrink-0 font-mono text-[9px] text-text-secondary uppercase tracking-widest select-none">
        <div>
          © 2026 VESPER ATELIER. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>LATENCY: 0.8ms</span>
          <span>RENDER_TIME: 1.2ms</span>
          <span>POLYGONS: 18,240</span>
        </div>
      </footer>
    </div>
  );
}
