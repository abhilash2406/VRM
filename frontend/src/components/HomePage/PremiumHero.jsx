import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

/* ── MAGNETIC BUTTON ── */
const MagneticButton = ({ children, to, variant = 'primary' }) => {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 25 });
  const sy = useSpring(y, { stiffness: 300, damping: 25 });
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState([]);
  const isPrimary = variant === 'primary';
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: 'inline-block', position: 'relative' }}
      onMouseMove={e => { const r = ref.current?.getBoundingClientRect(); if (r) { x.set((e.clientX - r.left - r.width/2)*0.35); y.set((e.clientY - r.top - r.height/2)*0.35); }}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setHovered(false); }}
      onClick={e => { const r = ref.current?.getBoundingClientRect(); if (!r) return; const rp = {id:Date.now(),x:e.clientX-r.left,y:e.clientY-r.top}; setRipples(p=>[...p,rp]); setTimeout(()=>setRipples(p=>p.filter(i=>i.id!==rp.id)),700); }}
    >
      <Link to={to||'#'} style={{textDecoration:'none'}}>
        <motion.button animate={{scale:hovered?1.06:1}} transition={{type:'spring',stiffness:400,damping:20}}
          style={{ position:'relative', overflow:'hidden', padding:'16px 44px', fontSize:'1.05rem', fontWeight:700, letterSpacing:'0.5px', border:'none', borderRadius:'50px', cursor:'pointer', outline:'none', transition:'box-shadow 0.3s ease',
            ...(isPrimary ? { background:'linear-gradient(135deg,#00D4FF,#0066FF)', color:'#fff', boxShadow: hovered?'0 0 40px rgba(0,212,255,0.8)':'0 8px 30px rgba(0,212,255,0.4)' }
            : { background: hovered?'rgba(0,212,255,0.08)':'transparent', color:'#00D4FF', border:'2px solid #00D4FF', boxShadow: hovered?'0 0 30px rgba(0,212,255,0.4)':'0 4px 20px rgba(0,212,255,0.15)' }) }}
        >
          {children}
          {ripples.map(r=><span key={r.id} style={{position:'absolute',left:r.x,top:r.y,width:0,height:0,background:'rgba(255,255,255,0.35)',borderRadius:'50%',transform:'translate(-50%,-50%)',animation:'ripple 0.7s ease-out forwards',pointerEvents:'none'}}/>)}
        </motion.button>
      </Link>
    </motion.div>
  );
};

/* ── SPLIT HEADING ── */
const SplitHeading = ({ text }) => (
  <h1 style={{fontSize:'clamp(3rem,7vw,6rem)',fontWeight:900,color:'#fff',lineHeight:1.1,letterSpacing:'-1px',margin:0,textShadow:'0 4px 40px rgba(0,0,0,0.6)'}}>
    {text.split(' ').map((word,i)=>(
      <motion.span key={i} initial={{opacity:0,y:60}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.4+i*0.12,ease:[0.22,1,0.36,1]}} style={{display:'inline-block',marginRight:'0.25em'}}>
        {word==='Limits'?<span style={{background:'linear-gradient(90deg,#00D4FF,#0066FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{word}</span>:word}
      </motion.span>
    ))}
  </h1>
);

/* ── 3D SCENE — NEOM Night City ── */
const Scene3D = ({ isHovered, mouseRef }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    el.appendChild(renderer.domElement);

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.008);
    scene.background = new THREE.Color(0x0f172a);

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 600);
    camera.position.set(-8, 4.5, 18);
    camera.lookAt(0, 1.5, 0);

    // ── High-Density Starry Sky (Increased star count, fog-immune) ──
    const starCount = 3800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 550;
      starPos[i * 3 + 1] = 6 + Math.random() * 240;
      starPos[i * 3 + 2] = -340 + Math.random() * 420;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.75,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      fog: false
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Secondary layer of diamond twinkling cyan stars
    const cyanStarCount = 600;
    const cyanStarPos = new Float32Array(cyanStarCount * 3);
    for (let i = 0; i < cyanStarCount; i++) {
      cyanStarPos[i * 3]     = (Math.random() - 0.5) * 520;
      cyanStarPos[i * 3 + 1] = 10 + Math.random() * 220;
      cyanStarPos[i * 3 + 2] = -320 + Math.random() * 400;
    }
    const cyanStarGeo = new THREE.BufferGeometry();
    cyanStarGeo.setAttribute('position', new THREE.BufferAttribute(cyanStarPos, 3));
    const cyanStarMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.4,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95,
      fog: false
    });
    const cyanStarField = new THREE.Points(cyanStarGeo, cyanStarMat);
    scene.add(cyanStarField);

    // ── Night Lighting ──
    scene.add(new THREE.AmbientLight(0x0a0a2a, 1.2));
    const nightLight = new THREE.DirectionalLight(0x224488, 0.7);
    nightLight.position.set(-60, 50, -100);
    nightLight.target.position.set(0, 0, -50);
    nightLight.castShadow = true;
    nightLight.shadow.mapSize.set(2048, 2048);
    scene.add(nightLight);
    scene.add(nightLight.target);
    // Cyan road fill light
    const fillCyan = new THREE.PointLight(0x00ffff, 2, 40);
    fillCyan.position.set(-5, 3, 5);
    scene.add(fillCyan);
    // Blue accent
    const fillBlue = new THREE.PointLight(0x0066ff, 1.5, 50);
    fillBlue.position.set(10, 5, -10);
    scene.add(fillBlue);

    // ── Road ──
    const roadLen = 400;
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x0a0a14, roughness: 0.6, metalness: 0.3 });
    const road = new THREE.Mesh(new THREE.PlaneGeometry(28, roadLen, 1, 60), roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(6, 0, -roadLen / 2 + 30);
    road.receiveShadow = true;
    scene.add(road);

    // LED road edge strips (NEOM signature neon lines)
    const neonLineMat  = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const neonLineMat2 = new THREE.MeshBasicMaterial({ color: 0x0066ff });
    const ledGeo = new THREE.PlaneGeometry(0.14, roadLen);
    const makeLED = (x, mat) => {
      const m = new THREE.Mesh(ledGeo, mat);
      m.rotation.x = -Math.PI / 2; m.position.set(x, 0.02, road.position.z);
      scene.add(m);
    };
    makeLED(-8.5, neonLineMat); makeLED(20.5, neonLineMat);  // outer cyan
    makeLED(-0.8, neonLineMat2); makeLED(-0.5, neonLineMat2); // barrier divider blue

    // Dashed center lane lines (cyan glow)
    const dashGeo = new THREE.PlaneGeometry(0.18, 3.2);
    const dashMat = new THREE.MeshBasicMaterial({ color: 0x00ddff });
    const DASHES = 60;
    const dashMeshes = [];
    for (let i = 0; i < DASHES; i++) {
      const d = new THREE.Mesh(dashGeo, dashMat);
      d.rotation.x = -Math.PI / 2;
      d.position.set(6, 0.015, -i * 7 + 30);
      scene.add(d);
      dashMeshes.push(d);
    }

    // Road glow plane (subtle neon reflection)
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x0022aa, transparent: true, opacity: 0.12 });
    const glowPlane = new THREE.Mesh(new THREE.PlaneGeometry(28, roadLen), glowMat);
    glowPlane.rotation.x = -Math.PI / 2;
    glowPlane.position.set(6, 0.03, road.position.z);
    scene.add(glowPlane);

    // ── Jersey Barriers — NEOM glowing ──
    const barrierMat  = new THREE.MeshStandardMaterial({ color: 0x111122, roughness: 0.4, metalness: 0.7 });
    const barrierNeon = new THREE.MeshBasicMaterial({ color: 0x0066ff });
    for (let i = 0; i < 50; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.1, 3.4), barrierMat);
      b.position.set(-1, 0.55, -i * 8 + 25);
      b.castShadow = true; scene.add(b);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.1, 3.42), barrierNeon);
      stripe.position.set(-1, 0.88, -i * 8 + 25);
      scene.add(stripe);
    }

    // ── Futuristic towers (Left & Right side city) ──
    const towerDefs = [
      // Right side only (Left side is now sea)
      [22, 45, 5, -80,  0x0a1a2a], [28, 35, 6, -150, 0x060d1a],
      [18, 55, 4, -220, 0x080f20], [32, 28, 5, -60,  0x0a1525],
      [26, 65, 7, -300, 0x06101e], [20, 40, 4.5, -180, 0x0a1a2a],
      [30, 50, 6, -260, 0x080e1c], [24, 38, 5, -120, 0x060c18],
    ];
    towerDefs.forEach(([tx, th, tw, tz, col]) => {
      // Main tower
      const tower = new THREE.Mesh(new THREE.BoxGeometry(tw, th, tw), new THREE.MeshStandardMaterial({ color: col, roughness: 0.1, metalness: 0.85 }));
      tower.position.set(tx, th / 2, tz);
      tower.castShadow = true; scene.add(tower);
      // Glass face overlay (blue-tinted)
      const glass = new THREE.Mesh(new THREE.BoxGeometry(tw + 0.1, th, tw + 0.1), new THREE.MeshStandardMaterial({ color: 0x0033aa, transparent: true, opacity: 0.1, roughness: 0.05, metalness: 1 }));
      glass.position.copy(tower.position); scene.add(glass);
      // Rooftop cyan beacon
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
      beacon.position.set(tx, th + 0.4, tz); scene.add(beacon);
      // Vertical neon strips on facade
      [0, 1].forEach(s => {
        const ns = new THREE.Mesh(new THREE.BoxGeometry(0.1, th, 0.1), new THREE.MeshBasicMaterial({ color: s === 0 ? 0x00ffff : 0x0066ff }));
        ns.position.set(tx + (s === 0 ? tw / 2 : -tw / 2), th / 2, tz + tw / 2);
        scene.add(ns);
      });
      // Window grid (emissive dots)
      const winsPerRow = 3, rows = Math.floor(th / 4);
      const winGeo = new THREE.PlaneGeometry(0.6, 0.5);
      const winMat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.4 ? 0x00aaff : 0x00d4ff });
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < winsPerRow; c++) {
          if (Math.random() > 0.55) {
            const w = new THREE.Mesh(winGeo, winMat);
            w.position.set(tx + (c - 1) * (tw / 3), 2 + r * 4, tz + tw / 2 + 0.05);
            scene.add(w);
          }
        }
      }
    });

    // ── Modern Small Buildings & Smart Villas (Right roadside foreground & midground) ──
    const smallBuildingDefs = [
      // [x, y-height, width, depth, z, color]
      [24, 7,  6, 7,   18, 0x091424],
      [27, 10, 5, 8,    4, 0x07111e],
      [23, 6,  7, 6,  -12, 0x0a1628],
      [26, 12, 6, 8,  -28, 0x060f1c],
      [24, 8,  5, 7,  -44, 0x081322],
      [28, 11, 7, 9,  -60, 0x07101d]
    ];
    
    // Sidewalk pavement along the small buildings
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x0a101f, roughness: 0.8, metalness: 0.2 });
    const sidewalk = new THREE.Mesh(new THREE.PlaneGeometry(16, 130), sidewalkMat);
    sidewalk.rotation.x = -Math.PI / 2;
    sidewalk.position.set(28, 0.04, -20);
    scene.add(sidewalk);

    // Glowing sidewalk edge curb
    const curbMat = new THREE.MeshBasicMaterial({ color: 0x0088ff });
    const curb = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 130), curbMat);
    curb.position.set(20.8, 0.05, -20);
    scene.add(curb);

    smallBuildingDefs.forEach(([bx, bh, bw, bd, bz, bcol]) => {
      const bGroup = new THREE.Group();
      
      // Main structure
      const mainMat = new THREE.MeshStandardMaterial({ color: bcol, roughness: 0.3, metalness: 0.7 });
      const mainMesh = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), mainMat);
      mainMesh.position.y = bh / 2;
      mainMesh.castShadow = true;
      bGroup.add(mainMesh);

      // Overhanging cantilever upper floor / terrace
      const deckMat = new THREE.MeshStandardMaterial({ color: 0x060d18, roughness: 0.2, metalness: 0.8 });
      const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.6, 0.3, bd + 0.6), deckMat);
      deckMesh.position.y = bh;
      bGroup.add(deckMesh);

      // Rooftop glowing perimeter neon rail
      const roofNeonMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
      const roofRail = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.7, 0.12, bd + 0.7), roofNeonMat);
      roofRail.position.y = bh + 0.2;
      bGroup.add(roofRail);

      // Architectural vertical accent strip
      const vStrip = new THREE.Mesh(new THREE.BoxGeometry(0.12, bh, 0.12), roofNeonMat);
      vStrip.position.set(-bw / 2 + 0.1, bh / 2, bd / 2 + 0.05);
      bGroup.add(vStrip);

      // Horizontal panoramic window ribbon (warm cyan/ice-blue interior glow)
      const winFloor1 = new THREE.Mesh(
        new THREE.PlaneGeometry(bw * 0.75, 1.2),
        new THREE.MeshBasicMaterial({ color: 0x00e5ff })
      );
      winFloor1.position.set(0, bh * 0.35, bd / 2 + 0.06);
      bGroup.add(winFloor1);

      if (bh >= 8) {
        const winFloor2 = new THREE.Mesh(
          new THREE.PlaneGeometry(bw * 0.65, 1.1),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        winFloor2.position.set(0, bh * 0.72, bd / 2 + 0.06);
        bGroup.add(winFloor2);
      }

      // Entrance canopy / door light
      const entranceDoor = new THREE.Mesh(
        new THREE.PlaneGeometry(1.6, 2.2),
        new THREE.MeshBasicMaterial({ color: 0x0088ff })
      );
      entranceDoor.position.set(bw * 0.2, 1.1, bd / 2 + 0.06);
      bGroup.add(entranceDoor);

      // Soft ambient light on building
      const bLight = new THREE.PointLight(0x00d4ff, 0.6, 14);
      bLight.position.set(0, bh * 0.5, bd / 2 + 1);
      bGroup.add(bLight);

      bGroup.position.set(bx, 0, bz);
      scene.add(bGroup);
    });

    // ── Coastal Seawall Barrier (Left road edge overlooking sea) ──
    const seawallMat = new THREE.MeshStandardMaterial({ color: 0x091220, roughness: 0.4, metalness: 0.8 });
    const seawallRailMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
    for (let i = 0; i < 45; i++) {
      const sp = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.75, 7.5), seawallMat);
      sp.position.set(-8.8, 0.38, -i * 8 + 25);
      scene.add(sp);
      const sr = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 7.52), seawallRailMat);
      sr.position.set(-8.8, 0.76, -i * 8 + 25);
      scene.add(sr);
    }

    // ── Sea & Water Surface (Left side) ──
    const seaGeo = new THREE.PlaneGeometry(180, 600);
    const seaMat = new THREE.MeshStandardMaterial({
      color: 0x001326,
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.88
    });
    const sea = new THREE.Mesh(seaGeo, seaMat);
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(-95, -0.28, -150);
    scene.add(sea);

    // Water reflective sheen strips
    const sheenMat = new THREE.MeshBasicMaterial({ color: 0x005588, transparent: true, opacity: 0.08 });
    for (let i = 0; i < 12; i++) {
      const sheen = new THREE.Mesh(new THREE.PlaneGeometry(160, 4 + (i % 3) * 3), sheenMat);
      sheen.rotation.x = -Math.PI / 2;
      sheen.position.set(-90, -0.26, -i * 35 + 10);
      scene.add(sheen);
    }

    // ── Fleet of Ships, Yachts, Boats & Buoys ──
    const fleet = [];
    const buoyLights = [];

    const cyanLightMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const blueLightMat = new THREE.MeshBasicMaterial({ color: 0x0088ff });
    const iceLightMat  = new THREE.MeshBasicMaterial({ color: 0x7dd3fc });
    const darkHullMat  = new THREE.MeshStandardMaterial({ color: 0x060f1c, roughness: 0.5, metalness: 0.6 });
    const navyHullMat  = new THREE.MeshStandardMaterial({ color: 0x0a192f, roughness: 0.4, metalness: 0.7 });
    const glassCabinMat = new THREE.MeshStandardMaterial({ color: 0x004488, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.6 });
    const wakeMat      = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.18 });

    // 1. CARGO & CONTAINER VESSELS
    const containerColors = [0x00ffff, 0x0088ff, 0x0284c7, 0x0369a1, 0x0f172a, 0x00e5c0, 0x1e3a8a];
    const makeCargoShip = (x, z, scale = 1, speed = 0.8) => {
      const g = new THREE.Group();
      const length = 26 * scale;
      const width  = 6.5 * scale;
      const height = 2.4 * scale;

      const hull = new THREE.Mesh(new THREE.BoxGeometry(width, height, length), darkHullMat);
      hull.position.y = height * 0.45;
      g.add(hull);

      const trim = new THREE.Mesh(new THREE.BoxGeometry(width + 0.15, 0.12 * scale, length + 0.15), cyanLightMat);
      trim.position.y = height * 0.85;
      g.add(trim);

      const cRows = 4, cCols = 2, cTiers = 2;
      const cw = (width * 0.82) / cCols;
      const cl = 4.2 * scale;
      const ch = 1.3 * scale;
      for (let r = 0; r < cRows; r++) {
        for (let c = 0; c < cCols; c++) {
          for (let l = 0; l < cTiers; l++) {
            if (Math.random() > 0.15) {
              const col = containerColors[(r * 3 + c * 2 + l) % containerColors.length];
              const cBox = new THREE.Mesh(
                new THREE.BoxGeometry(cw * 0.92, ch * 0.92, cl * 0.92),
                new THREE.MeshStandardMaterial({ color: col, roughness: 0.5, metalness: 0.3 })
              );
              cBox.position.set(
                (c - 0.5) * cw,
                height + ch * 0.5 + l * ch,
                (r - 1.5) * (cl * 1.05) + 2 * scale
              );
              g.add(cBox);
            }
          }
        }
      }

      const bridgeH = 3.6 * scale;
      const bridge = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.75, bridgeH, 4.5 * scale),
        navyHullMat
      );
      bridge.position.set(0, height + bridgeH * 0.5, -length * 0.38);
      g.add(bridge);

      const bridgeGlass = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.77, 0.7 * scale, 4.55 * scale),
        cyanLightMat
      );
      bridgeGlass.position.set(0, height + bridgeH * 0.78, -length * 0.38);
      g.add(bridgeGlass);

      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 3 * scale, 6), darkHullMat);
      mast.position.set(0, height + bridgeH + 1.5 * scale, -length * 0.38);
      g.add(mast);

      const mastBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.3 * scale, 8, 8), cyanLightMat);
      mastBeacon.position.set(0, height + bridgeH + 3 * scale, -length * 0.38);
      g.add(mastBeacon);

      const pLight = new THREE.PointLight(0x00ffff, 0.8, 25);
      pLight.position.copy(mastBeacon.position);
      g.add(pLight);

      const wake = new THREE.Mesh(new THREE.PlaneGeometry(width * 1.4, length * 0.8), wakeMat);
      wake.rotation.x = -Math.PI / 2;
      wake.position.set(0, 0.02, -length * 0.75);
      g.add(wake);

      g.position.set(x, -0.2, z);
      scene.add(g);
      fleet.push({
        group: g,
        baseY: -0.2,
        phase: Math.random() * Math.PI * 2,
        bobFreq: 0.9 + Math.random() * 0.3,
        bobAmp: 0.05 * scale,
        rollAmp: 0.012,
        pitchAmp: 0.008,
        speed: speed
      });
    };

    // 2. LUXURY CYBER YACHTS
    const makeYacht = (x, z, scale = 1, speed = 1.5) => {
      const g = new THREE.Group();
      const length = 15 * scale;
      const width  = 4.2 * scale;

      const hull = new THREE.Mesh(new THREE.BoxGeometry(width, 1.6 * scale, length), navyHullMat);
      hull.position.y = 0.8 * scale;
      g.add(hull);

      const bow = new THREE.Mesh(new THREE.ConeGeometry(width * 0.5, 3.5 * scale, 4), navyHullMat);
      bow.rotation.x = Math.PI / 2;
      bow.rotation.y = Math.PI / 4;
      bow.position.set(0, 0.8 * scale, length * 0.55);
      g.add(bow);

      const deck1 = new THREE.Mesh(new THREE.BoxGeometry(width * 0.8, 1.2 * scale, length * 0.65), glassCabinMat);
      deck1.position.set(0, 1.9 * scale, -length * 0.05);
      g.add(deck1);

      const deck2 = new THREE.Mesh(new THREE.BoxGeometry(width * 0.6, 0.9 * scale, length * 0.35), darkHullMat);
      deck2.position.set(0, 2.7 * scale, -length * 0.12);
      g.add(deck2);

      const strip1 = new THREE.Mesh(new THREE.BoxGeometry(width + 0.1, 0.08, length + 0.1), cyanLightMat);
      strip1.position.y = 1.35 * scale;
      g.add(strip1);

      const strip2 = new THREE.Mesh(new THREE.BoxGeometry(width * 0.82, 0.06, length * 0.66), blueLightMat);
      strip2.position.y = 2.45 * scale;
      g.add(strip2);

      const arch = new THREE.Mesh(new THREE.BoxGeometry(width * 0.62, 1.2 * scale, 0.3 * scale), cyanLightMat);
      arch.position.set(0, 3.2 * scale, -length * 0.25);
      g.add(arch);

      const underGlow = new THREE.PointLight(0x00ffff, 1.2, 16);
      underGlow.position.set(0, 0.2, 0);
      g.add(underGlow);

      const wake = new THREE.Mesh(new THREE.PlaneGeometry(width * 1.5, length * 0.9), wakeMat);
      wake.rotation.x = -Math.PI / 2;
      wake.position.set(0, 0.02, -length * 0.65);
      g.add(wake);

      g.position.set(x, -0.2, z);
      scene.add(g);
      fleet.push({
        group: g,
        baseY: -0.2,
        phase: Math.random() * Math.PI * 2,
        bobFreq: 1.4 + Math.random() * 0.4,
        bobAmp: 0.09 * scale,
        rollAmp: 0.025,
        pitchAmp: 0.018,
        speed: speed
      });
    };

    // 3. HIGH-SPEED PATROL / SPEEDBOATS
    const makeSpeedboat = (x, z, scale = 1, speed = 3.5) => {
      const g = new THREE.Group();
      const length = 7.5 * scale;
      const width  = 2.6 * scale;

      const hull = new THREE.Mesh(new THREE.BoxGeometry(width, 1.0 * scale, length), darkHullMat);
      hull.position.y = 0.5 * scale;
      g.add(hull);

      const cockpit = new THREE.Mesh(new THREE.BoxGeometry(width * 0.75, 0.65 * scale, length * 0.45), glassCabinMat);
      cockpit.position.set(0, 1.05 * scale, -length * 0.08);
      g.add(cockpit);

      const trim = new THREE.Mesh(new THREE.BoxGeometry(width + 0.08, 0.08, length + 0.08), cyanLightMat);
      trim.position.y = 0.85 * scale;
      g.add(trim);

      const bowLight = new THREE.Mesh(new THREE.SphereGeometry(0.18 * scale, 8, 8), iceLightMat);
      bowLight.position.set(0, 0.8 * scale, length * 0.48);
      g.add(bowLight);

      const spot = new THREE.PointLight(0x00ffff, 1.5, 12);
      spot.position.copy(bowLight.position);
      g.add(spot);

      const wake = new THREE.Mesh(new THREE.PlaneGeometry(width * 1.8, length * 1.4), wakeMat);
      wake.rotation.x = -Math.PI / 2;
      wake.position.set(0, 0.02, -length * 0.8);
      g.add(wake);

      g.position.set(x, -0.2, z);
      scene.add(g);
      fleet.push({
        group: g,
        baseY: -0.2,
        phase: Math.random() * Math.PI * 2,
        bobFreq: 2.0 + Math.random() * 0.5,
        bobAmp: 0.12 * scale,
        rollAmp: 0.035,
        pitchAmp: 0.025,
        speed: speed
      });
    };

    // 4. CHANNEL NAVIGATION BUOYS
    const buoyMat = new THREE.MeshStandardMaterial({ color: 0x071526, roughness: 0.3, metalness: 0.8 });
    const makeBuoy = (x, z, lightColor = 0x00ffff) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 1.4, 12), buoyMat);
      body.position.y = 0.7;
      g.add(body);

      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.07, 8, 16), new THREE.MeshBasicMaterial({ color: lightColor }));
      collar.rotation.x = Math.PI / 2;
      collar.position.y = 0.9;
      g.add(collar);

      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshBasicMaterial({ color: lightColor }));
      beacon.position.y = 1.6;
      g.add(beacon);

      const bl = new THREE.PointLight(lightColor, 1.0, 10);
      bl.position.copy(beacon.position);
      g.add(bl);
      buoyLights.push(bl);

      g.position.set(x, -0.25, z);
      scene.add(g);
      fleet.push({
        group: g,
        baseY: -0.25,
        phase: Math.random() * Math.PI * 2,
        bobFreq: 1.8 + Math.random() * 0.4,
        bobAmp: 0.08,
        rollAmp: 0.04,
        pitchAmp: 0.04,
        speed: 0
      });
    };

    // Place Channel Buoys along the highway shore line (4 well-spaced buoys)
    [15, -60, -145, -230].forEach((bz, idx) => {
      makeBuoy(-13.5, bz, idx % 2 === 0 ? 0x00ffff : 0x0088ff);
    });

    // Place High-Speed Patrols / Speedboats (3 energetic boats)
    makeSpeedboat(-17,   8, 0.9, 3.6);
    makeSpeedboat(-19, -75, 1.0, 4.0);
    makeSpeedboat(-16, -170, 0.9, 3.8);

    // Place Luxury Cyber Yachts (3 elegant cruisers)
    makeYacht(-25,  -45, 1.05, 1.8);
    makeYacht(-35, -125, 1.2,  1.5);
    makeYacht(-30, -220, 1.1,  1.6);

    // Place Heavy Container / Cargo Vessels (2 stately cargo titans)
    makeCargoShip(-48,  -90, 1.1, 0.8);
    makeCargoShip(-68, -240, 1.3, 0.6);

    // ── Street Lights (smart poles) ──
    for (let i = 0; i < 20; i++) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 6, 8), new THREE.MeshStandardMaterial({ color: 0x111133, metalness: 0.8, roughness: 0.3 }));
      const side = i % 2 === 0 ? -9.5 : 21.5;
      pole.position.set(side, 3, -i * 20 + 25);
      scene.add(pole);
      const lampLight = new THREE.PointLight(i % 2 === 0 ? 0x00ffff : 0x0066ff, 1.5, 18);
      lampLight.position.set(side, 6.5, -i * 20 + 25);
      scene.add(lampLight);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00ffff : 0x00d4ff }));
      lamp.position.copy(lampLight.position); scene.add(lamp);
    }

    // ── Delivery Truck — NEOM Autonomous ──
    const truckGroup = new THREE.Group();
    // Sleek body (rounded feel via tapered box)
    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.5, 7), new THREE.MeshStandardMaterial({ color: 0x06091a, roughness: 0.1, metalness: 0.95 }));
    bodyMesh.position.set(0, 1.75, 0); bodyMesh.castShadow = true; truckGroup.add(bodyMesh);
    // Cyan livery strips
    [-0.85, 0.85].forEach(bx => {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.52, 7.02), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
      strip.position.set(bx, 1.75, 0); truckGroup.add(strip);
    });
    // NEOM logo strip on side
    const logoStrip = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.32, 7.02), new THREE.MeshBasicMaterial({ color: 0x0088ff }));
    logoStrip.position.set(0, 2.4, 0); truckGroup.add(logoStrip);
    // Cab
    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.1, 2.8), new THREE.MeshStandardMaterial({ color: 0x04061a, roughness: 0.05, metalness: 1.0 }));
    cab.position.set(0, 1.55, 4.9); cab.castShadow = true; truckGroup.add(cab);
    // Windshield (blue holographic tint)
    const ws = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.95), new THREE.MeshStandardMaterial({ color: 0x00aaff, transparent: true, opacity: 0.4, roughness: 0.0, metalness: 1 }));
    ws.position.set(0, 1.85, 6.31); ws.rotation.x = -0.12; truckGroup.add(ws);
    // HUD display glow on windshield
    const hud = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.35), new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6 }));
    hud.position.set(0, 1.95, 6.33); truckGroup.add(hud);
    // Headlights — cyan NEOM
    [-0.82, 0.82].forEach(hx => {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.08), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
      hl.position.set(hx, 1.15, 6.36); truckGroup.add(hl);
      const spot = new THREE.SpotLight(0x00ffff, 4, 35, Math.PI / 7, 0.3);
      spot.position.set(hx, 1.15, 6.4);
      spot.target.position.set(hx * 1.1, 0, 30);
      scene.add(spot); scene.add(spot.target);
    });
    // Undercarriage neon glow
    const underGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 6.8), new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
    underGlow.rotation.x = -Math.PI / 2; underGlow.position.set(0, 0.1, 0); truckGroup.add(underGlow);
    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.38, 20);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x080810, roughness: 0.8, metalness: 0.5 });
    const rimMat   = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x003366, emissiveIntensity: 1, roughness: 0.1, metalness: 1 });
    const wheels = [];
    [[-1.3,-3],[1.3,-3],[-1.3,3],[1.3,3],[-1.3,2],[1.3,2]].forEach(([wx,wz]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(wx, 0.6, wz); w.rotation.z = Math.PI / 2; w.castShadow = true;
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.4, 12), rimMat);
      rim.rotation.z = Math.PI / 2; w.add(rim);
      truckGroup.add(w); wheels.push(w);
    });
    truckGroup.position.set(-5, 0, 0);
    scene.add(truckGroup);

    // ── Electric Cars ──
    const carPalette = [0x00ffff, 0x0066ff, 0x0088ff, 0x00d4ff, 0x00aaff, 0x0055aa];
    const carGroups = [];
    carPalette.forEach((col, i) => {
      const cg = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.75, 3.8), new THREE.MeshStandardMaterial({ color: 0x06091a, roughness: 0.1, metalness: 0.95 }));
      body.position.y = 0.75; body.castShadow = true; cg.add(body);
      // Neon trim
      const trim = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.1, 3.82), new THREE.MeshBasicMaterial({ color: col }));
      trim.position.y = 1.12; cg.add(trim);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 2.1), new THREE.MeshStandardMaterial({ color: 0x04060f, roughness: 0.05, metalness: 1 }));
      roof.position.set(0, 1.42, -0.2); cg.add(roof);
      const ws2 = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.5), new THREE.MeshStandardMaterial({ color: col, transparent: true, opacity: 0.3 }));
      ws2.position.set(0, 1.35, 1.06); cg.add(ws2);
      const tailLight = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.1, 0.06), new THREE.MeshBasicMaterial({ color: col }));
      tailLight.position.set(0, 0.82, -1.93); cg.add(tailLight);
      const underCar = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 3.6), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
      underCar.rotation.x = -Math.PI / 2; underCar.position.y = 0.06; cg.add(underCar);
      [[-0.95,-1.2],[0.95,-1.2],[-0.95,1.2],[0.95,1.2]].forEach(([cx,cz]) => {
        const cw = new THREE.Mesh(new THREE.CylinderGeometry(0.32,0.32,0.26,16), new THREE.MeshStandardMaterial({ color: 0x050508, roughness: 0.8 }));
        cw.position.set(cx,0.32,cz); cw.rotation.z = Math.PI/2; cg.add(cw);
      });
      cg.position.set(6 + (i % 2) * 4.5, 0, -i * 22 - 15);
      scene.add(cg);
      carGroups.push({ group: cg, col });
    });

    // ── Animate ──
    let animId;
    const clock = new THREE.Clock();
    const camTarget = new THREE.Vector3(0, 1.5, 0);
    const camPos = new THREE.Vector3(-8, 4.5, 18);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();
      const speed = isHovered.current ? 22 : 12;

      // Scroll dashes
      dashMeshes.forEach(d => {
        d.position.z = ((d.position.z + speed * delta - 30 + roadLen) % roadLen) - roadLen + 30;
      });

      // Cars move forward
      carGroups.forEach(({ group }) => {
        group.position.z += speed * delta * 0.9;
        if (group.position.z > 35) group.position.z -= roadLen * 0.5;
      });

      // Truck bounce + wheel spin
      truckGroup.position.y = Math.sin(t * 7) * 0.03;
      truckGroup.rotation.z = Math.sin(t * 3) * 0.007;
      wheels.forEach(w => { w.rotation.x += speed * delta * 1.2; });

      // Pulsing neon (cyan fill light pulse)
      fillCyan.intensity = 1.5 + Math.sin(t * 2.5) * 0.6;
      fillBlue.intensity = 1.2 + Math.cos(t * 1.8) * 0.5;

      // Fleet (Boats, Ships, Yachts, Buoys) gentle ocean bobbing & cruising
      fleet.forEach(b => {
        b.group.position.y = b.baseY + Math.sin(t * b.bobFreq + b.phase) * b.bobAmp;
        b.group.rotation.z = Math.sin(t * (b.bobFreq * 0.8) + b.phase) * b.rollAmp;
        b.group.rotation.x = Math.cos(t * (b.bobFreq * 0.7) + b.phase) * b.pitchAmp;
        if (b.speed) {
          b.group.position.z += b.speed * delta * (isHovered.current ? 1.6 : 1.0);
          if (b.speed > 0 && b.group.position.z > 35) {
            b.group.position.z = -380;
          }
        }
      });

      // Pulsing buoy beacons
      buoyLights.forEach((bl, i) => {
        bl.intensity = 0.6 + Math.sin(t * 3.5 + i * 1.3) * 0.6;
      });

      // Sky stars rotation & diamond twinkle
      starField.rotation.y = t * 0.0015;
      cyanStarField.rotation.y = t * 0.002;
      cyanStarMat.opacity = 0.75 + Math.sin(t * 2.5) * 0.25;

      // Camera spring
      const mx = mouseRef.current.x ?? 0.5;
      const my = mouseRef.current.y ?? 0.5;
      camPos.x += ((-8 + (mx - 0.5) * 6) - camPos.x) * 0.04;
      camPos.y += ((4.5 - (my - 0.5) * 2.5) - camPos.y) * 0.04;
      camPos.z += ((isHovered.current ? 14 : 18) - camPos.z) * 0.04;
      camera.position.copy(camPos);
      camera.position.x += Math.sin(t * 17) * 0.012;
      camera.position.y += Math.cos(t * 11) * 0.007;
      camTarget.x += ((mx - 0.5) * 8 - camTarget.x) * 0.05;
      camTarget.y = 1.5;
      camera.lookAt(camTarget);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />;
};
/* ── MAIN COMPONENT ── */
const PremiumHero = () => {
  const heroRef   = useRef(null);
  const contentRef = useRef(null);
  const isHovered = useRef(false);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });
  const [hoverState, setHoverState] = useState(false);

  const handleMouseMove = useCallback((e) => {
    mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
  }, []);

  useEffect(() => {
    import('gsap').then(({ gsap }) =>
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        const hero = heroRef.current, content = contentRef.current;
        if (!hero || !content) return;
        const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start:'top top', end:'bottom top', scrub:true }});
        tl.to(content, { y:-100, opacity:0, ease:'none' }, 0);
        return () => ScrollTrigger.getAll().forEach(t => t.kill());
      })
    );
  }, []);

  return (
    <>
      <style>{`@keyframes ripple{to{width:300px;height:300px;opacity:0}}`}</style>
      <section ref={heroRef} onMouseMove={handleMouseMove}
        onMouseEnter={() => { isHovered.current = true; setHoverState(true); }}
        onMouseLeave={() => { isHovered.current = false; setHoverState(false); mouseRef.current={x:0.5,y:0.5}; }}
        style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'#0f172a' }}
      >
        <Scene3D isHovered={isHovered} mouseRef={mouseRef} />

        {/* Content overlay */}
        <div ref={contentRef} style={{ position:'relative', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'0 32px', maxWidth:900, pointerEvents:'none' }}>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.2}}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 22px', borderRadius:50, border:'1px solid rgba(0,212,255,0.4)', background:'rgba(0,212,255,0.08)', backdropFilter:'blur(12px)', marginBottom:32, pointerEvents:'auto' }}>
            <span style={{width:8,height:8,borderRadius:'50%',background:'#00D4FF',boxShadow:'0 0 12px #00D4FF',display:'inline-block'}}/>
            <span style={{color:'#93c5fd',fontSize:'0.82rem',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase'}}>Premium Vehicle Rental</span>
          </motion.div>

          <SplitHeading text="Drive Without Limits" />

          <motion.p initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.9}}
            style={{fontSize:'clamp(1.1rem,2.5vw,1.3rem)',color:'rgba(203,213,225,0.85)',marginTop:24,marginBottom:48,lineHeight:1.8,maxWidth:600,textShadow:'0 2px 20px rgba(0,0,0,0.7)'}}>
            Rent premium cars anytime, anywhere with a seamless booking experience.
          </motion.p>

          <motion.div initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} transition={{duration:0.7,delay:1.15}}
            style={{display:'flex',gap:20,flexWrap:'wrap',justifyContent:'center',pointerEvents:'auto'}}>
            <MagneticButton to="/login" variant="primary"><span style={{display:'flex',alignItems:'center',gap:10}}><i className="fas fa-bolt"/> Book Now</span></MagneticButton>
          </motion.div>


        </div>
        
        {/* Seamless blend gradient */}
        <div style={{ position:'absolute', bottom:0, left:0, width:'100%', height:'250px', background:'linear-gradient(to bottom, transparent 0%, #0f172a 90%, #0f172a 100%)', zIndex:20, pointerEvents:'none' }} />
      </section>
    </>
  );
};

export default PremiumHero;
