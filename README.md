# VESPER Atelier — Interactive 3D Product Customizer

An immersive, high-fidelity 3D product customization laboratory built using **React.js, Vite, Three.js (React Three Fiber & Drei), and Tailwind CSS v4**.

This application places a designer sneaker in a cinematic museum spotlight environment, letting users customize individual components, surface finishes, and textures in real-time. It features photographic viewfinder overlays, diagnostic telemetry, camera view anchors, an exploded blueprint view, and a persistent configuration archive.

---

## 💻 1. Technology Overview

This project is built using a modern frontend stack optimized for real-time 3D rendering and state coordination:

### Core Framework & Build Tool
* **React.js (v19)**: Leveraged for component-based UI composition, declarative state management, and real-time interface rendering.
* **Vite**: Used as the frontend bundler and development environment. Vite provides lightning-fast Hot Module Replacement (HMR) and optimized Rollup-based production building.

### 3D Graphics Engine
* **Three.js**: The underlying WebGL graphics library used to render the 3D scene, calculate lighting physics, handle shadows, and apply physically based rendering (PBR) materials.
* **React Three Fiber (R3F)**: A React renderer for Three.js. It allows 3D scenes to be declared as standard, reactive React components, enabling seamless binding between UI state (React hooks) and 3D mesh properties.
* **Drei**: A collection of useful helpers, controls, and shading presets for R3F. It provides the `<OrbitControls>` camera controllers, `<ContactShadows>` for soft floor shadows, and `<Environment>` map loaders for realistic specular reflections.

### Design System & Layout
* **Tailwind CSS v4**: Utilized for utility-first styling. Features CSS-in-JS compilation, custom font integration, and custom theme definitions using CSS variables.
* **Lucide React**: Provides sleek, modern SVG vector icons for UI buttons, status checkers, and resets.

---

## ⚙️ 2. Project Setup Guide

Follow these steps to run and build the customizer locally on your system:

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/PunithKCShekar/3d_model_project.git
   cd 3d_model_project
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

### Running Locally
To launch the hot-reloading local development server:
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your web browser.

### Building for Production
To generate minified, static HTML/CSS/JS bundles optimized for hosting providers (e.g. Vercel, Netlify, Github Pages):
```bash
npm run build
```
The optimized production files will be placed inside the `dist/` directory.

---

## 🛠️ 3. Feature Documentation

### 3.1 3D Canvas & Camera Controls (`CanvasContainer.jsx`)
* **OrbitControls**: Mouse dragging rotates the sneaker 360°, scrolling zooms in/out, and panning is restricted to keep the product centered.
* **ContactShadows**: Positioned at `y: -0.6` to cast soft, realistic floor shadows under the shoe.
* **Lighting Rig**:
  * Overhead `spotLight` acting as the key studio spotlight.
  * Side `directionalLight` providing soft fill illumination.
  * Backwards-facing `pointLight` emitting the brand's warm amber color to silhouette the sneaker.
  * Low-intensity `ambientLight` to preserve moody shadows.
* **Environment Reflections**: Integrates Drei's `Environment` with the `"studio"` preset to load pre-baked HDRI reflections, allowing metallic materials to realistically reflect light.

### 3.2 Sneaker Part Customization & Shading (`SneakerModel.jsx`)
* The sneaker is constructed out of 8 discrete, customizable parts: `sole` (midsole/outsole), `upper` (main body), `toe` (front guard), `heel` (back counter), `tongue` (inside cushion), `laces` (cross lacing), `stripe` (accent chevron logo), and `lining` (collar interior).
* **PBR Shading Model**: Each part config translates into physical material settings inside `<meshPhysicalMaterial>`:
  * **Matte Leather**: Moderate roughness (`0.6`), low metalness (`0.15`).
  * **Glossy Patent**: Low roughness (`0.08`), clearcoat reflections (`1.0`).
  * **Tech Knit**: High roughness (`0.95`), zero metalness (`0.0`).
  * **Vulcanized Rubber**: Mid roughness (`0.50`), zero metalness (`0.0`).
  * **Anodized Chrome**: Low roughness (`0.20`), high metalness (`0.90`).
  * **Carbon Fiber**: Mid-low roughness (`0.35`), high metalness (`0.70`).
* **Emissive Flash Animation**: Changes in a part's color or material trigger a temporary increase in `emissiveIntensity` (up to `1.5`), which decays back to `0` over a 200ms lerp loop (`useFrame`), creating a brief emissive flash.

### 3.3 Exploded Blueprint View
* Click the **Exploded View: ON/OFF** toggle to separate the sneaker components.
* When active, each mesh adds a custom 3D offset vector to its original coordinates. The coordinates interpolate smoothly (`lerp`) inside the `useFrame` loop, showing a diagnostic exploded assembly diagram.

### 3.4 Smooth Camera Preset Snappers (`CameraController.jsx`)
* Snaps the camera viewpoint to specific coordinates based on preset vectors:
  * `angle`: `[3, 1.2, 3]` (isometric diagnostics)
  * `side`: `[0, 0, 3.8]` (profile outline)
  * `top`: `[0, 3.8, 0.01]` (aerial view of lacing/tongue)
  * `front`: `[3.8, -0.1, 0]` (toe cap detail)
  * `heel`: `[-3.8, 0.1, 0]` (rear stabilizer view)
* Smoothly interpolates (`lerp`) camera coordinates to prevent sudden cuts.

### 3.5 Real-time Pricing Engine
* Base sneaker price starts at `$220.00`.
* Customization premium values:
  * **Colors**: Warm Amber (`+$15`), Gilded Gold (`+$25`), Oxblood Crimson (`+$10`), Alpine Sage (`+$5`).
  * **Materials**: Glossy Patent (`+$15`), Anodized Chrome (`+$30`), Carbon Fiber (`+$20`).
* The UI price tags and sidebar values recalculate automatically on every state change.

### 3.6 Local Storage saved configs
* Click **Save Configuration** to store design states.
* Designs are saved as JSON structures inside a `vesper_saved_configs` array in `localStorage`.
* Users can view their library in a sliding drawer, showing thumbnail swatches, customized pricing, timestamps, and delete controls.
