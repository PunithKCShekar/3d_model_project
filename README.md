# VESPER Atelier — Interactive 3D Product Customizer

An immersive, high-fidelity 3D product customization laboratory built with **React.js, Vite, Three.js (React Three Fiber & Drei), and Tailwind CSS v4**.

Designed using the **Atelier Noir** aesthetic movement, this application treats a premium sneaker as a museum piece under dramatic studio lighting, offering micro-animations, physical property charts, exploded blueprint views, and a persistent design library.

---

## 🖤 Design & Visual Accents

* **Atelier Noir Stage**: Moody near-black canvas (`oklch(0.13 0.005 80)`) with a warm, golden radial spotlight vignette.
* **Warm Amber Accents**: Highlight indicators, target component marks, and primary buttons utilizing signature warm gold (`oklch(0.75 0.15 80)`).
* **DSLR Viewfinder HUD**: Overlaid photographer's crop brackets, center target crosshair reticle, and recording state diagnostic text over the 3D viewport.
* **Telemetry Panels**: High-contrast, minimal monospace readouts showing active focal length, render modes, and coordinates.

---

## 🛠️ Core Engineering Features

### 1. High-Fidelity 3D Render Engine
* **PBR Material Properties**: Color and texture options are calculated using physical attributes (roughness, metalness, and clearcoat) to realistically render **Matte Leather**, **Glossy Patent**, **Tech Knit**, **Carbon Fiber**, **Vulcanized Rubber**, and **Anodized Chrome**.
* **Studio Light Controls**: Features overhead spotlight keylights, floor shadows (`ContactShadows`), directional fills, and brand-colored point backlights for a volumetric silhouette.
* **Reflective Environment**: Uses high-fidelity studio environment maps to bounce reflections off polished chrome and patent surfaces.

### 2. Exploded Blueprint View
* Separates individual component meshes (Outsole, Upper Main Body, Heel Tab, Tongue, Lacing, Accent Chevron, and Lining) along a smooth 3D translate vector (`lerp`), allowing users to inspect internal construction details.

### 3. Smooth Camera Preset Snappers
* Smoothly transitions the camera position and focus target using linear interpolation (`lerp`) across five camera views: `Isometric`, `Side Profile`, `Top Down`, `Front/Toe`, and `Heel/Back`.

### 4. Dynamic Pricing Engine
* Calculates estimated value in real-time based on selected premium materials and custom tints:
  * **Base Model**: `$220.00`
  * **Colors Premium**: *Warm Amber* (`+$15`), *Gilded Gold* (`+$25`), *Oxblood Crimson* (`+$10`), *Alpine Sage* (`+$5`).
  * **Textures Premium**: *Glossy Patent* (`+$15`), *Anodized Chrome* (`+$30`), *Carbon Fiber* (`+$20`).

### 5. Local Storage Saved Designs Archive
* Includes a fully integrated **Library Archive** allowing users to save, load, and delete multiple custom sneaker builds. Saved profiles are stored in the browser's `localStorage` cache.

---

## 📁 Key File Structure

```
ultimez/
├── src/
│   ├── App.jsx                       # Main state coordinator & Viewport HUD overlays
│   ├── index.css                     # Tailwind CSS v4 config, custom font imports & OKLCH variables
│   ├── components/
│   │   ├── SneakerModel.jsx          # Modular 3D sneaker meshes, material mapping & exploded view interpolation
│   │   ├── CanvasContainer.jsx       # R3F Canvas setup, studio lighting, shadows & environment maps
│   │   ├── ControlPanel.jsx          # Customizer rail, color/material swatches, live progress telemetry & pricing
│   │   ├── CameraController.jsx      # Linear camera interpolation controller (lerp) for snaps
│   │   └── WordmarkLogo.jsx          # Stylized perspective chevron mark & branding
│   └── main.jsx                      # App entry point
├── vite.config.js                    # Vite configuration including @tailwindcss/vite plugin
├── index.html                        # SEO title and description metadata configurations
└── package.json                      # Build & dependency declarations
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/PunithKCShekar/3d_model_project.git
   cd 3d_model_project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To launch the hot-reloading development server:
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your web browser.

### Building for Production
To bundle static assets optimized for production (Vercel, Netlify, Github Pages):
```bash
npm run build
```
The output bundle will be available in the `dist/` directory.
