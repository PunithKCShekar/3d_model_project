import React from 'react';
import WordmarkLogo from './WordmarkLogo';
import { RotateCcw, Save, Cpu, Check, ChevronRight, BarChart2 } from 'lucide-react';

const PARTS_INFO = {
  sole: { label: 'Midsole & Outsole', id: 'sole_outsole_v4', icon: '👟' },
  upper: { label: 'Upper Main Body', id: 'upper_vamp_v4', icon: '📦' },
  toe: { label: 'Toe Cap Guard', id: 'toe_cap_v4', icon: '🛡️' },
  heel: { label: 'Heel Counter Tab', id: 'heel_counter_v4', icon: '📐' },
  tongue: { label: 'Tongue Cushion', id: 'tongue_v4', icon: '🧬' },
  laces: { label: 'Technical Lacing', id: 'laces_lacing_v4', icon: '🧶' },
  stripe: { label: 'Accent Chevron', id: 'accent_chevron_v4', icon: '⚡' },
  lining: { label: 'Interior Collar', id: 'lining_collar_v4', icon: '🕸️' },
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
  { id: 'rubber', name: 'Vulcanized Rubber', roughness: 0.50, metalness: 0.00, desc: 'Heavy duty matte elastomer', premium: 0 },
  { id: 'leather', name: 'Matte Leather', roughness: 0.60, metalness: 0.15, desc: 'Supple grain, natural feel', premium: 0 },
  { id: 'patent', name: 'Glossy Patent', roughness: 0.08, metalness: 0.35, desc: 'High specularity, liquid sheen', premium: 15 },
  { id: 'knit', name: 'Tech Knit', roughness: 0.95, metalness: 0.00, desc: 'Breathable structured weave', premium: 0 },
  { id: 'metal', name: 'Anodized Chrome', roughness: 0.20, metalness: 0.90, desc: 'Reflective structural finish', premium: 30 },
  { id: 'carbon', name: 'Carbon Fiber', roughness: 0.35, metalness: 0.70, desc: 'Woven composite structure', premium: 20 },
];

export default function ControlPanel({
  config,
  updateConfig,
  activePart,
  setActivePart,
  calculatePrice,
  onReset,
  onSave,
}) {
  const activePartInfo = PARTS_INFO[activePart];
  const activeConfig = config[activePart];

  return (
    <div className="flex flex-col h-full bg-bg-panel border-l border-border-dark select-none overflow-y-auto">
      {/* Brand Header */}
      <div className="p-6 border-b border-border-dark flex justify-between items-center shrink-0">
        <WordmarkLogo />
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-secondary">
            SYS_ONLINE_4.1.0
          </span>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col gap-6">
        {/* Confident Header */}
        <div>
          <h2 className="font-display text-4xl font-bold tracking-tight text-text-primary uppercase leading-none">
            Design Your <span className="text-brand block mt-1">Signature.</span>
          </h2>
          <p className="font-sans text-xs text-text-secondary mt-2.5 leading-relaxed">
            Configure raw materials, micro-textures, and optical parameters to compose your bespoke shoe configuration.
          </p>
        </div>

        {/* Part Selection Carousel/Dropdown */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="font-mono text-[9px] tracking-widest text-text-secondary uppercase">
              01 // Component Target
            </label>
            <span className="font-mono text-[9px] text-brand">
              [ {Object.keys(PARTS_INFO).indexOf(activePart) + 1} / {Object.keys(PARTS_INFO).length} ]
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-1.5">
            {Object.entries(PARTS_INFO).map(([key, info]) => {
              const isActive = activePart === key;
              return (
                <button
                  key={key}
                  id={`part-select-${key}`}
                  onClick={() => setActivePart(key)}
                  className={`flex flex-col items-center justify-center py-3 px-1 rounded-md border text-center transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'border-brand bg-brand-glow/10 text-brand shadow-[0_0_15px_rgba(230,160,40,0.05)]'
                      : 'border-border-dark/60 hover:border-text-secondary bg-bg-darker/35 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="text-lg mb-1 filter grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all">
                    {info.icon}
                  </span>
                  <span className="font-mono text-[8px] font-semibold uppercase tracking-wider truncate w-full px-1">
                    {key}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Customization Details for Active Part */}
        <div className="flex-grow flex flex-col gap-5 border border-border-dark bg-bg-darker/40 rounded-lg p-5">
          {/* Active Part Header */}
          <div className="flex items-center justify-between border-b border-border-dark/60 pb-3">
            <div>
              <span className="font-display text-sm font-bold uppercase tracking-widest text-text-primary">
                {activePartInfo?.label}
              </span>
              <div className="font-mono text-[9px] text-text-secondary mt-0.5 uppercase tracking-wider">
                PART_SYS_REF: {activePartInfo?.id}
              </div>
            </div>
            {/* Tech tag */}
            <div className="font-mono text-[8px] text-brand bg-brand/5 px-2.5 py-1 rounded border border-brand/25">
              MOD_{activeConfig?.material.toUpperCase()}_{activeConfig?.color.substring(1, 4)}
            </div>
          </div>

          {/* Color Selection */}
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[9px] tracking-widest text-text-secondary uppercase">
              02 // Surface Tint
            </span>
            <div className="grid grid-cols-4 gap-3">
              {COLORS.map((color) => {
                const isSelected = activeConfig?.color.toLowerCase() === color.hex.toLowerCase();
                const colorId = color.name.toLowerCase().replace(/\s+/g, '-');
                return (
                  <button
                    key={color.hex}
                    id={`color-select-${colorId}`}
                    onClick={() => updateConfig(activePart, { color: color.hex })}
                    className="group relative flex flex-col items-center gap-1.5 cursor-pointer"
                  >
                    {/* Circle Color Selector */}
                    <div
                      style={{
                        backgroundColor: color.hex,
                        boxShadow: isSelected
                          ? `0 0 0 2px var(--color-bg-dark), 0 0 0 4px var(--color-brand)`
                          : `0 0 8px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255,255,255,0.05)`,
                      }}
                      className="w-9 h-9 rounded-full transition-all duration-300 group-hover:scale-105"
                    />
                    {/* Hover Glow Effect */}
                    <div
                      style={{ backgroundColor: color.hex }}
                      className="absolute -inset-1 rounded-full filter blur opacity-0 group-hover:opacity-25 transition-opacity duration-350 -z-10"
                    />
                    <span className="font-sans text-[9px] text-text-secondary group-hover:text-text-primary text-center truncate w-full mt-0.5">
                      {color.name}
                    </span>
                    {color.premium > 0 && (
                      <span className="absolute -top-1.5 -right-1 bg-brand text-bg-darker font-mono font-bold text-[7px] px-1 py-0.5 rounded-full leading-none">
                        +${color.premium}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Material Selection */}
          <div className="flex flex-col gap-2.5 flex-grow">
            <span className="font-mono text-[9px] tracking-widest text-text-secondary uppercase">
              03 // Texture & Specular Properties
            </span>
            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[170px] pr-1">
              {MATERIALS.map((mat) => {
                const isSelected = activeConfig?.material === mat.id;
                return (
                  <button
                    key={mat.id}
                    id={`material-select-${mat.id}`}
                    onClick={() => updateConfig(activePart, { material: mat.id })}
                    className={`flex flex-col text-left p-3.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-brand bg-brand-glow/5 text-text-primary shadow-[0_0_12px_rgba(230,160,40,0.05)]'
                        : 'border-border-dark/60 hover:border-text-secondary bg-bg-darker/50 text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-display text-xs font-bold uppercase tracking-wider">
                        {mat.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand" />}
                    </div>
                    <span className="font-sans text-[10px] mt-1 leading-snug line-clamp-2">
                      {mat.desc}
                    </span>
                    
                    {/* Professional Telemetry Mini Charts for roughness/metalness */}
                    <div className="flex flex-col gap-1.5 mt-3 pt-2.5 border-t border-border-dark/40 font-mono text-[8px] text-text-secondary w-full">
                      <div className="flex justify-between items-center">
                        <span>ROUGHNESS</span>
                        <span className={isSelected ? 'text-brand' : ''}>{mat.roughness.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-1 bg-bg-darker rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${isSelected ? 'bg-brand' : 'bg-text-secondary/60'} transition-all duration-500`}
                          style={{ width: `${mat.roughness * 100}%` }} 
                        />
                      </div>
                      
                      <div className="flex justify-between items-center mt-0.5">
                        <span>METALNESS</span>
                        <span className={isSelected ? 'text-brand' : ''}>{mat.metalness.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-1 bg-bg-darker rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${isSelected ? 'bg-brand' : 'bg-text-secondary/60'} transition-all duration-500`} 
                          style={{ width: `${mat.metalness * 100}%` }} 
                        />
                      </div>
                    </div>

                    {mat.premium > 0 && (
                      <div className="mt-2.5 font-mono text-[8px] text-brand font-bold uppercase tracking-wider">
                        Premium: +${mat.premium}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Config Spec Printout */}
        <details className="group border border-border-dark/60 rounded-md bg-bg-darker/20">
          <summary className="p-3.5 font-mono text-[9px] text-text-secondary uppercase tracking-widest cursor-pointer flex justify-between items-center hover:text-text-primary select-none">
            <span className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-brand" /> 04 // Technical Manifest
            </span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-open:rotate-90" />
          </summary>
          <div className="p-3.5 pt-0 border-t border-border-dark/40 font-mono text-[9px] text-text-secondary leading-relaxed bg-bg-darker/30 select-text overflow-x-auto max-h-[140px]">
            <pre id="technical-json-manifest" className="whitespace-pre-wrap">{JSON.stringify(config, null, 2)}</pre>
          </div>
        </details>
      </div>

      {/* Footer Config Controls & Pricing */}
      <div className="p-6 border-t border-border-dark bg-bg-darker/60 flex flex-col gap-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
              Est. Custom Value
            </div>
            <div id="price-value-display" className="font-display text-2xl font-bold text-text-primary mt-1">
              ${calculatePrice().toFixed(2)}{' '}
              <span className="font-sans text-xs text-text-secondary font-medium tracking-normal">
                USD
              </span>
            </div>
          </div>
          <button
            id="reset-config-button"
            onClick={onReset}
            className="flex items-center gap-1.5 font-mono text-[9px] text-text-secondary hover:text-brand transition-colors cursor-pointer border border-border-dark/60 hover:border-brand/40 px-3 py-2 rounded-md bg-bg-darker/25"
          >
            <RotateCcw className="w-3.5 h-3.5" /> RESET CONFIG
          </button>
        </div>

        <button
          id="save-config-button"
          onClick={onSave}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-md bg-brand hover:bg-brand/90 text-bg-darker font-display font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:shadow-[0_0_25px_rgba(230,160,40,0.25)] hover:scale-[1.01] cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>
    </div>
  );
}
