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
        {word==='Limits'?<span style={{background:'linear-gradient(90deg,#00D4FF,#0066FF,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{word}</span>:word}
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
    scene.fog = new THREE.FogExp2(0x050010, 0.008);
    scene.background = new THREE.Color(0x020008);

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 600);
    camera.position.set(-8, 4.5, 18);
    camera.lookAt(0, 1.5, 0);

    // ── Stars ──
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 600;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, sizeAttenuation: true, transparent: true, opacity: 0.9 })));

    // ── Moon ──
    const moon = new THREE.Mesh(new THREE.SphereGeometry(5, 20, 20), new THREE.MeshStandardMaterial({ color: 0xdde8ff, emissive: 0xaabbff, emissiveIntensity: 0.4, roughness: 0.9 }));
    moon.position.set(-120, 90, -250);
    scene.add(moon);
    const moonGlow = new THREE.Mesh(new THREE.SphereGeometry(9, 16, 16), new THREE.MeshBasicMaterial({ color: 0x3355ff, transparent: true, opacity: 0.08, side: THREE.BackSide }));
    moonGlow.position.copy(moon.position);
    scene.add(moonGlow);

    // ── Lighting — Night ──
    scene.add(new THREE.AmbientLight(0x0a0a2a, 1.2));
    const moonLight = new THREE.DirectionalLight(0x3355aa, 0.6);
    moonLight.position.set(-80, 60, -100);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.set(2048, 2048);
    moonLight.shadow.camera.left = -60; moonLight.shadow.camera.right = 60;
    moonLight.shadow.camera.top = 40; moonLight.shadow.camera.bottom = -40;
    scene.add(moonLight);
    // Cyan road fill light
    const fillCyan = new THREE.PointLight(0x00ffff, 2, 40);
    fillCyan.position.set(-5, 3, 5);
    scene.add(fillCyan);
    // Purple accent
    const fillPurple = new THREE.PointLight(0xaa00ff, 1.5, 50);
    fillPurple.position.set(10, 5, -10);
    scene.add(fillPurple);

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
    const neonLineMat2 = new THREE.MeshBasicMaterial({ color: 0xaa44ff });
    const ledGeo = new THREE.PlaneGeometry(0.14, roadLen);
    const makeLED = (x, mat) => {
      const m = new THREE.Mesh(ledGeo, mat);
      m.rotation.x = -Math.PI / 2; m.position.set(x, 0.02, road.position.z);
      scene.add(m);
    };
    makeLED(-8.5, neonLineMat); makeLED(20.5, neonLineMat);  // outer cyan
    makeLED(-0.8, neonLineMat2); makeLED(-0.5, neonLineMat2); // barrier divider purple

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
    const barrierNeon = new THREE.MeshBasicMaterial({ color: 0xaa44ff });
    for (let i = 0; i < 50; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.1, 3.4), barrierMat);
      b.position.set(-1, 0.55, -i * 8 + 25);
      b.castShadow = true; scene.add(b);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.1, 3.42), barrierNeon);
      stripe.position.set(-1, 0.88, -i * 8 + 25);
      scene.add(stripe);
    }

    // ── NEOM Buildings — The Line & futuristic towers ──
    // "The Line" style long mirrored facade on the left
    const lineMat = new THREE.MeshStandardMaterial({ color: 0x0a0a1a, roughness: 0.05, metalness: 1.0, envMapIntensity: 1 });
    const lineFacade = new THREE.Mesh(new THREE.BoxGeometry(2, 60, 350), lineMat);
    lineFacade.position.set(-35, 30, -120);
    scene.add(lineFacade);
    // Neon strips on The Line
    for (let i = 0; i < 8; i++) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.18, 350), new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00ffff : 0xaa44ff }));
      strip.position.set(-35, 5 + i * 7, -120);
      scene.add(strip);
    }

    // Futuristic towers (right side city)
    const towerDefs = [
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
        const ns = new THREE.Mesh(new THREE.BoxGeometry(0.1, th, 0.1), new THREE.MeshBasicMaterial({ color: s === 0 ? 0x00ffff : 0xaa44ff }));
        ns.position.set(tx + (s === 0 ? tw / 2 : -tw / 2), th / 2, tz + tw / 2);
        scene.add(ns);
      });
      // Window grid (emissive dots)
      const winsPerRow = 3, rows = Math.floor(th / 4);
      const winGeo = new THREE.PlaneGeometry(0.6, 0.5);
      const winMat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.4 ? 0x00aaff : 0xaa66ff });
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

    // ── Street Lights (smart poles) ──
    for (let i = 0; i < 20; i++) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 6, 8), new THREE.MeshStandardMaterial({ color: 0x111133, metalness: 0.8, roughness: 0.3 }));
      const side = i % 2 === 0 ? -9.5 : 21.5;
      pole.position.set(side, 3, -i * 20 + 25);
      scene.add(pole);
      const lampLight = new THREE.PointLight(i % 2 === 0 ? 0x00ffff : 0xaa44ff, 1.5, 18);
      lampLight.position.set(side, 6.5, -i * 20 + 25);
      scene.add(lampLight);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00ffff : 0xcc66ff }));
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
    const carPalette = [0x00ffff, 0xaa44ff, 0x0088ff, 0xff44aa, 0x44ffaa, 0xffaa00];
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
      fillPurple.intensity = 1.2 + Math.cos(t * 1.8) * 0.5;

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
        style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'#060a14' }}
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
            <MagneticButton to="/vehicles" variant="primary"><span style={{display:'flex',alignItems:'center',gap:10}}><i className="fas fa-car"/> Explore Cars</span></MagneticButton>
            <MagneticButton to="/login" variant="outline"><span style={{display:'flex',alignItems:'center',gap:10}}><i className="fas fa-bolt"/> Book Now</span></MagneticButton>
          </motion.div>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2}}
            style={{marginTop:72,display:'flex',flexDirection:'column',alignItems:'center',gap:8,pointerEvents:'auto'}}>
            <span style={{color:'rgba(148,163,184,0.6)',fontSize:'0.72rem',letterSpacing:'3px',textTransform:'uppercase'}}>Scroll</span>
            <motion.div animate={{y:[0,8,0]}} transition={{duration:1.5,repeat:Infinity}}
              style={{width:24,height:36,borderRadius:12,border:'2px solid rgba(0,212,255,0.3)',display:'flex',alignItems:'flex-start',justifyContent:'center',padding:4}}>
              <motion.div animate={{y:[0,14,0],opacity:[1,0,1]}} transition={{duration:1.5,repeat:Infinity}} style={{width:4,height:8,borderRadius:2,background:'#00D4FF'}}/>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PremiumHero;
