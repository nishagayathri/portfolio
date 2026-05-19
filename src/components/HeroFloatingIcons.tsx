/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Synthwave pixel-art icons on the hero: each shortcut scrolls to a portfolio
 * section on click; dragging still repositions icons. CSS2D labels (scale 0.36).
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  CSS2DObject,
  CSS2DRenderer,
} from 'three/addons/renderers/CSS2DRenderer.js';

const PALETTE = {
  indigo1: '#1a1040',
  indigo2: '#2a1860',
  purple1: '#4a2080',
  purple2: '#6a30a0',
  purple3: '#8040c0',
  magenta1: '#c040a0',
  magenta2: '#e050b0',
  magenta3: '#ff60c0',
  hotPink: '#ff80d0',
  glow: '#ff90e0',
  white: '#ffc0f0',
  dark: '#0d0820',
  screenGlow: '#30ffff',
  screenMid: '#20c0e0',
  filament: '#ffdd66',
  warmGlow: '#ffaa44',
} as const;

function createPixelCanvas(size: number) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context unavailable');
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

function drawPixel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  pixelSize = 1
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, pixelSize, pixelSize);
}

function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawLaptopIcon() {
  const size = 32;
  const { canvas, ctx } = createPixelCanvas(size);

  ctx.clearRect(0, 0, size, size);

  drawRect(ctx, 7, 5, 18, 14, PALETTE.indigo2);
  drawRect(ctx, 8, 6, 16, 12, PALETTE.purple1);

  drawRect(ctx, 8, 6, 16, 13, PALETTE.purple2);
  drawRect(ctx, 9, 7, 14, 11, PALETTE.indigo1);

  drawRect(ctx, 10, 8, 12, 9, '#0c1028');
  for (let row = 0; row < 9; row++) {
    const colors = [
      PALETTE.screenGlow,
      PALETTE.screenMid,
      PALETTE.purple3,
      PALETTE.indigo2,
    ];
    const c = colors[row % colors.length];
    if (row % 2 === 0) {
      drawRect(ctx, 11, 8 + row, 10, 1, c + '40');
    }
    if (row === 2) drawRect(ctx, 11, 10, 8, 1, PALETTE.screenGlow + '90');
    if (row === 4) drawRect(ctx, 12, 12, 6, 1, PALETTE.magenta2 + '80');
    if (row === 6) drawRect(ctx, 11, 14, 9, 1, PALETTE.purple3 + '60');
  }

  drawRect(ctx, 9, 7, 1, 11, PALETTE.magenta1 + '60');
  drawRect(ctx, 23, 7, 1, 11, PALETTE.magenta1 + '60');
  drawRect(ctx, 9, 7, 14, 1, PALETTE.magenta2 + '50');

  drawRect(ctx, 6, 19, 20, 3, PALETTE.purple1);
  drawRect(ctx, 7, 19, 18, 1, PALETTE.purple2);
  drawRect(ctx, 5, 22, 22, 2, PALETTE.purple2);
  drawRect(ctx, 6, 22, 20, 1, PALETTE.purple3);

  for (let kx = 0; kx < 6; kx++) {
    drawPixel(ctx, 9 + kx * 2, 20, PALETTE.magenta1 + '80');
    drawPixel(ctx, 10 + kx * 2, 21, PALETTE.indigo2);
  }

  drawRect(ctx, 10, 18, 12, 1, PALETTE.magenta2 + '60');

  drawRect(ctx, 13, 23, 6, 1, PALETTE.indigo2);

  drawRect(ctx, 6, 24, 20, 1, PALETTE.magenta3 + '30');

  drawPixel(ctx, 6, 5, PALETTE.magenta3 + '20');
  drawPixel(ctx, 25, 5, PALETTE.magenta3 + '20');
  drawPixel(ctx, 15, 3, PALETTE.glow + '15');
  drawPixel(ctx, 16, 3, PALETTE.glow + '15');

  return canvas;
}

function drawLightbulbIcon() {
  const size = 32;
  const { canvas, ctx } = createPixelCanvas(size);

  ctx.clearRect(0, 0, size, size);

  drawRect(ctx, 10, 2, 12, 12, PALETTE.purple1 + '30');
  drawRect(ctx, 9, 4, 14, 10, PALETTE.magenta1 + '18');
  drawRect(ctx, 11, 1, 10, 2, PALETTE.purple2 + '15');

  drawRect(ctx, 13, 3, 6, 1, PALETTE.purple3);
  drawRect(ctx, 12, 4, 8, 1, PALETTE.purple3);
  drawRect(ctx, 11, 5, 10, 2, PALETTE.purple2);
  drawRect(ctx, 11, 7, 10, 2, PALETTE.purple2);
  drawRect(ctx, 11, 9, 10, 2, PALETTE.purple1);
  drawRect(ctx, 12, 11, 8, 2, PALETTE.purple1);
  drawRect(ctx, 13, 13, 6, 1, PALETTE.indigo2);

  drawRect(ctx, 14, 6, 4, 1, PALETTE.warmGlow);
  drawRect(ctx, 15, 5, 2, 1, PALETTE.filament);
  drawRect(ctx, 14, 7, 4, 2, PALETTE.warmGlow + 'c0');
  drawRect(ctx, 15, 7, 2, 1, PALETTE.filament + 'e0');

  drawPixel(ctx, 14, 9, PALETTE.warmGlow + '90');
  drawPixel(ctx, 17, 9, PALETTE.warmGlow + '90');
  drawPixel(ctx, 14, 10, PALETTE.magenta2 + '70');
  drawPixel(ctx, 17, 10, PALETTE.magenta2 + '70');
  drawPixel(ctx, 15, 10, PALETTE.warmGlow + '50');
  drawPixel(ctx, 16, 10, PALETTE.warmGlow + '50');

  drawPixel(ctx, 12, 5, PALETTE.glow + '50');
  drawPixel(ctx, 12, 6, PALETTE.hotPink + '40');
  drawPixel(ctx, 19, 6, PALETTE.magenta3 + '25');

  drawRect(ctx, 13, 14, 6, 1, PALETTE.purple3);
  drawRect(ctx, 14, 15, 4, 1, PALETTE.magenta1);
  drawRect(ctx, 13, 16, 6, 1, PALETTE.purple2);
  drawRect(ctx, 14, 17, 4, 1, PALETTE.magenta1);
  drawRect(ctx, 13, 18, 6, 1, PALETTE.purple2);
  drawRect(ctx, 14, 19, 4, 1, PALETTE.indigo2);

  drawRect(ctx, 15, 20, 2, 1, PALETTE.purple3);

  const rays: [number, number][] = [
    [10, 3],
    [21, 3],
    [8, 7],
    [23, 7],
    [9, 11],
    [22, 11],
    [24, 5],
    [7, 5],
    [8, 9],
    [23, 9],
  ];
  rays.forEach(([rx, ry]) => {
    drawPixel(ctx, rx, ry, PALETTE.magenta3 + '35');
  });

  drawPixel(ctx, 16, 2, PALETTE.white + '30');
  drawPixel(ctx, 11, 3, PALETTE.glow + '20');
  drawPixel(ctx, 20, 4, PALETTE.glow + '20');

  return canvas;
}

function drawFileIcon() {
  const size = 32;
  const { canvas, ctx } = createPixelCanvas(size);

  ctx.clearRect(0, 0, size, size);

  const paper = '#0a0e24';
  const paperHi = '#10183a';

  drawRect(ctx, 9, 4, 15, 23, PALETTE.purple1 + '22');
  drawRect(ctx, 10, 5, 13, 21, PALETTE.indigo2);
  drawRect(ctx, 11, 6, 12, 19, paper);

  ctx.clearRect(19, 6, 4, 4);

  drawRect(ctx, 11, 6, 8, 19, paperHi);
  drawRect(ctx, 19, 10, 4, 15, paperHi);

  drawRect(ctx, 19, 6, 1, 4, PALETTE.purple2);
  drawRect(ctx, 19, 9, 4, 1, PALETTE.purple2);
  drawPixel(ctx, 20, 6, PALETTE.purple3);
  drawPixel(ctx, 21, 7, PALETTE.magenta2 + 'c0');
  drawPixel(ctx, 22, 8, PALETTE.magenta1 + 'a0');
  drawRect(ctx, 20, 6, 3, 1, PALETTE.magenta3 + '50');

  drawRect(ctx, 10, 5, 13, 1, PALETTE.magenta2 + '50');
  drawRect(ctx, 10, 5, 1, 21, PALETTE.magenta1 + '45');
  drawRect(ctx, 10, 25, 13, 1, PALETTE.magenta3 + '45');
  drawRect(ctx, 22, 10, 1, 16, PALETTE.magenta1 + '40');

  drawRect(ctx, 12, 7, 9, 1, PALETTE.indigo1);
  drawRect(ctx, 13, 7, 2, 1, PALETTE.screenGlow + '85');
  drawPixel(ctx, 16, 7, PALETTE.magenta3 + '75');
  drawPixel(ctx, 18, 7, PALETTE.screenMid + '70');

  drawRect(ctx, 12, 9, 2, 14, PALETTE.indigo1 + 'cc');
  drawRect(ctx, 12, 9, 1, 14, PALETTE.screenGlow + '40');

  drawRect(ctx, 15, 10, 6, 1, PALETTE.screenGlow + '95');
  drawRect(ctx, 15, 11, 4, 1, PALETTE.screenMid + '55');
  drawRect(ctx, 15, 12, 7, 1, PALETTE.screenGlow + '75');
  drawRect(ctx, 15, 14, 5, 1, PALETTE.magenta2 + '65');
  drawRect(ctx, 15, 15, 8, 1, PALETTE.screenMid + '65');
  drawRect(ctx, 15, 17, 6, 1, PALETTE.screenGlow + '70');
  drawRect(ctx, 15, 18, 4, 1, PALETTE.purple3 + '90');
  drawRect(ctx, 15, 20, 7, 1, PALETTE.magenta3 + '55');

  drawRect(ctx, 20, 11, 2, 1, PALETTE.magenta1 + '45');
  drawRect(ctx, 20, 13, 3, 1, PALETTE.purple2 + '80');
  drawRect(ctx, 20, 16, 2, 1, PALETTE.screenGlow + '50');

  drawPixel(ctx, 21, 21, PALETTE.glow + '45');
  drawPixel(ctx, 11, 24, PALETTE.magenta3 + '30');

  return canvas;
}

function makeTexture(canvas: HTMLCanvasElement) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

type DesktopIconSpec = {
  nx: number;
  ny: number;
  typeIndex: number;
  z: number;
  scale: number;
};

const ICON_LABELS = ['Projects', 'About Me', 'Resume'] as const;

/**
 * typeIndex order matches ICON_LABELS: laptop → projects, light bulb → about, file → contact.
 */
const SECTION_ID_BY_TYPE_INDEX = ['projects', 'about', 'contact'] as const;

const DRAG_THRESHOLD_PX = 8;

function scrollToPortfolioSection(typeIndex: number) {
  const id = SECTION_ID_BY_TYPE_INDEX[typeIndex];
  if (!id) return;
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

const DESKTOP_ICON_LAYOUT: DesktopIconSpec[] = [
  { nx: 0.4, ny: 0.3, typeIndex: 0, z: -0.08, scale: 0.45 },
  { nx: 0.15, ny: 0.58, typeIndex: 1, z: -0.079, scale: 0.45 },
  { nx: 0.55, ny: 0.3, typeIndex: 2, z: -0.078, scale: 0.45 },
];

/**
 * Normalized horizontal offset for the entire icon layer (share of viewport width).
 * Negative values shift all meshes left so the overlay matches the hero artwork.
 */
const HERO_ICON_NX_BIAS = -0.03;

export function HeroFloatingIcons() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = wrapRef.current;
    if (!container) return;

    const iconCanvases = [drawLaptopIcon(), drawLightbulbIcon(), drawFileIcon()];
    const textures = iconCanvases.map(makeTexture);
    const iconState: DesktopIconSpec[] = DESKTOP_ICON_LAYOUT.map((s) => ({
      ...s,
    }));

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.touchAction = 'none';
    container.appendChild(canvas);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.inset = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);

    const viewHeight = 4;
    const meshes: THREE.Mesh[] = [];
    const labelClickCleanups: Array<() => void> = [];
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const hitPoint = new THREE.Vector3();
    const dragOffset = new THREE.Vector3();
    let dragIndex = -1;
    let activePointerId: number | null = null;
    let clickCandidateMeshIdx = -1;
    let clickCandidatePointerId: number | null = null;
    let downClientX = 0;
    let downClientY = 0;

    function layout() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 1 || h < 1) return false;
      const aspectLocal = w / h;
      camera.left = (-aspectLocal * viewHeight) / 2;
      camera.right = (aspectLocal * viewHeight) / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, true);
      labelRenderer.setSize(w, h);
      return true;
    }

    let aspect =
      Math.max(container.clientWidth, 1) /
      Math.max(container.clientHeight, 1);
    if (!layout()) {
      aspect = 1;
    }

    function normXToWorld(nx: number) {
      return (nx - 0.5 + HERO_ICON_NX_BIAS) * aspect * viewHeight;
    }

    function worldToNormX(wx: number) {
      return wx / (aspect * viewHeight) + 0.5 - HERO_ICON_NX_BIAS;
    }

    function worldToNorm(mesh: THREE.Mesh, idx: number) {
      const spec = iconState[idx];
      spec.nx = worldToNormX(mesh.position.x);
      spec.ny = 0.5 - mesh.position.y / viewHeight;
      const pad = 0.02;
      spec.nx = Math.min(1 - pad, Math.max(pad, spec.nx));
      spec.ny = Math.min(1 - pad, Math.max(pad, spec.ny));
      mesh.position.x = normXToWorld(spec.nx);
      mesh.position.y = (0.5 - spec.ny) * viewHeight;
    }

    function applyLayoutPositions() {
      meshes.forEach((mesh, idx) => {
        const spec = iconState[idx];
        const worldX = normXToWorld(spec.nx);
        const worldY = (0.5 - spec.ny) * viewHeight;
        mesh.position.set(worldX, worldY, spec.z);
      });
    }

    iconState.forEach((spec, meshIndex) => {
      const tex = textures[spec.typeIndex];
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const meshGeo = new THREE.PlaneGeometry(1, 1);
      const mesh = new THREE.Mesh(meshGeo, mat);
      mesh.renderOrder = meshIndex;

      const worldX = normXToWorld(spec.nx);
      const worldY = (0.5 - spec.ny) * viewHeight;

      mesh.position.set(worldX, worldY, spec.z);
      mesh.scale.setScalar(spec.scale);

      const labelEl = document.createElement('div');
      labelEl.textContent = ICON_LABELS[spec.typeIndex];
      labelEl.style.cssText = [
        'color:#ffffff',
        'font-family:ui-sans-serif,system-ui,"Segoe UI",sans-serif',
        'font-size:12px',
        'font-weight:500',
        'letter-spacing:0.03em',
        'text-align:center',
        'white-space:nowrap',
        'pointer-events:auto',
        'cursor:pointer',
        'user-select:none',
        'text-shadow:-1px -1px 0 #0a0a0a,1px -1px 0 #0a0a0a,-1px 1px 0 #0a0a0a,1px 1px 0 #0a0a0a,0 -1px 0 #0a0a0a,0 1px 0 #0a0a0a,-1px 0 0 #0a0a0a,1px 0 0 #0a0a0a,0 2px 5px rgba(0,0,0,0.9)',
      ].join(';');

      const onLabelClick: EventListener = (e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollToPortfolioSection(spec.typeIndex);
      };
      labelEl.addEventListener('click', onLabelClick);
      labelClickCleanups.push(() =>
        labelEl.removeEventListener('click', onLabelClick)
      );

      const label = new CSS2DObject(labelEl);
      label.center.set(0.5, 1);
      label.position.set(0, -0.66, 0);
      mesh.add(label);

      scene.add(mesh);
      meshes.push(mesh);
    });

    function renderFrame() {
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    }

    function setPointerFromEvent(clientX: number, clientY: number) {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w < 1 || h < 1) return;
      pointer.x = ((clientX - rect.left) / w) * 2 - 1;
      pointer.y = -((clientY - rect.top) / h) * 2 + 1;
    }

    function pickIconIndex(): number {
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length === 0) return -1;
      const obj = hits[0].object;
      const idx = meshes.indexOf(obj as THREE.Mesh);
      return idx;
    }

    function updateHoverCursor() {
      if (dragIndex >= 0) return;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(meshes, false);
      canvas.style.cursor = hits.length > 0 ? 'pointer' : 'default';
    }

    function beginIconDrag(meshIdx: number, ev: PointerEvent) {
      const z = iconState[meshIdx].z;
      dragPlane.constant = -z;
      raycaster.setFromCamera(pointer, camera);
      if (!raycaster.ray.intersectPlane(dragPlane, hitPoint)) {
        return;
      }
      dragIndex = meshIdx;
      activePointerId = ev.pointerId;
      canvas.setPointerCapture(ev.pointerId);
      const mesh = meshes[meshIdx];
      dragOffset.set(
        mesh.position.x - hitPoint.x,
        mesh.position.y - hitPoint.y,
        0
      );
      canvas.style.cursor = 'grabbing';
    }

    function onPointerDown(ev: PointerEvent) {
      if (ev.button !== 0) return;
      setPointerFromEvent(ev.clientX, ev.clientY);
      const idx = pickIconIndex();
      if (idx < 0) return;
      ev.preventDefault();
      clickCandidateMeshIdx = idx;
      clickCandidatePointerId = ev.pointerId;
      downClientX = ev.clientX;
      downClientY = ev.clientY;
    }

    function onPointerMove(ev: PointerEvent) {
      setPointerFromEvent(ev.clientX, ev.clientY);
      if (
        clickCandidateMeshIdx >= 0 &&
        dragIndex < 0 &&
        clickCandidatePointerId === ev.pointerId
      ) {
        const dx = ev.clientX - downClientX;
        const dy = ev.clientY - downClientY;
        if (dx * dx + dy * dy >= DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) {
          beginIconDrag(clickCandidateMeshIdx, ev);
          clickCandidateMeshIdx = -1;
          clickCandidatePointerId = null;
        }
      }
      if (dragIndex >= 0) {
        const z = iconState[dragIndex].z;
        dragPlane.constant = -z;
        raycaster.setFromCamera(pointer, camera);
        if (raycaster.ray.intersectPlane(dragPlane, hitPoint)) {
          const mesh = meshes[dragIndex];
          mesh.position.x = hitPoint.x + dragOffset.x;
          mesh.position.y = hitPoint.y + dragOffset.y;
          mesh.position.z = z;
          worldToNorm(mesh, dragIndex);
          renderFrame();
        }
      } else {
        updateHoverCursor();
      }
    }

    function endDrag(ev: PointerEvent, allowNavigate: boolean) {
      if (
        allowNavigate &&
        clickCandidateMeshIdx >= 0 &&
        ev.pointerId === clickCandidatePointerId
      ) {
        scrollToPortfolioSection(iconState[clickCandidateMeshIdx].typeIndex);
      }
      clickCandidateMeshIdx = -1;
      clickCandidatePointerId = null;
      if (activePointerId !== null && ev.pointerId === activePointerId) {
        try {
          canvas.releasePointerCapture(ev.pointerId);
        } catch {
          /* already released */
        }
        activePointerId = null;
      }
      dragIndex = -1;
      setPointerFromEvent(ev.clientX, ev.clientY);
      updateHoverCursor();
    }

    function onLostPointerCapture() {
      clickCandidateMeshIdx = -1;
      clickCandidatePointerId = null;
      dragIndex = -1;
      activePointerId = null;
      canvas.style.cursor = 'default';
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    const onPointerUp = (ev: PointerEvent) => endDrag(ev, true);
    const onPointerCancel = (ev: PointerEvent) => endDrag(ev, false);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);
    canvas.addEventListener('lostpointercapture', onLostPointerCapture);

    renderFrame();

    const ro = new ResizeObserver(() => {
      if (!layout()) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      aspect = Math.max(w, 1) / Math.max(h, 1);
      applyLayoutPositions();
      renderFrame();
    });
    ro.observe(container);

    const syncAfterPaint = requestAnimationFrame(() => {
      if (layout()) {
        const w = container.clientWidth;
        const h = Math.max(container.clientHeight, 1);
        aspect = Math.max(w, 1) / Math.max(h, 1);
        applyLayoutPositions();
        renderFrame();
      }
    });

    return () => {
      cancelAnimationFrame(syncAfterPaint);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      labelClickCleanups.forEach((fn) => fn());
      canvas.removeEventListener('lostpointercapture', onLostPointerCapture);
      renderer.dispose();
      meshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      textures.forEach((t) => t.dispose());
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
      if (labelRenderer.domElement.parentNode === container) {
        container.removeChild(labelRenderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden [&_canvas]:pointer-events-auto [&_canvas]:block"
      aria-label="Hero shortcuts: Projects, About Me, and Resume — click to scroll, or drag to move"
    />
  );
}
