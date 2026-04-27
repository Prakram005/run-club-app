import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 180;
const LOW_POWER_PARTICLE_COUNT = 80;

function createParticleSystem(count) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    positions[offset] = (Math.random() - 0.5) * 11;
    positions[offset + 1] = (Math.random() - 0.5) * 6;
    positions[offset + 2] = -Math.random() * 6 - 1;
    speeds[index] = 0.08 + Math.random() * 0.16;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xff4d4d,
    size: 0.035,
    transparent: true,
    opacity: 0.58,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  points.userData.speeds = speeds;
  return points;
}

function createFloatingObjects(isLowPower) {
  const redMaterial = new THREE.MeshStandardMaterial({
    color: 0xff2f2f,
    roughness: 0.45,
    metalness: 0.2,
    emissive: 0x3a0505,
    emissiveIntensity: 0.35
  });

  const charcoalMaterial = new THREE.MeshStandardMaterial({
    color: 0x161616,
    roughness: 0.58,
    metalness: 0.35,
    emissive: 0x1f0303,
    emissiveIntensity: 0.15
  });

  const geometries = [
    new THREE.IcosahedronGeometry(0.56, isLowPower ? 0 : 1),
    new THREE.OctahedronGeometry(0.48, 0),
    new THREE.SphereGeometry(0.34, isLowPower ? 12 : 18, isLowPower ? 8 : 12),
    new THREE.TorusGeometry(0.36, 0.08, isLowPower ? 8 : 12, isLowPower ? 18 : 28)
  ];

  const placements = [
    [-2.9, 0.55, -1.8],
    [2.65, 0.88, -2.35],
    [1.8, -1.05, -1.35],
    [-1.25, -1.28, -2.75]
  ];

  return placements.map((position, index) => {
    const mesh = new THREE.Mesh(geometries[index], index % 2 === 0 ? redMaterial : charcoalMaterial);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.set(Math.random(), Math.random(), Math.random());
    mesh.userData = {
      baseY: position[1],
      floatOffset: index * 0.9,
      rotationSpeed: 0.14 + index * 0.035
    };
    return mesh;
  });
}

export default function Hero3D({ intensity = 1 }) {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLowPower =
      reducedMotion ||
      navigator.hardwareConcurrency <= 4 ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isLowPower,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLowPower ? 1.25 : 1.8));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5.6);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.68);
    const directionalLight = new THREE.DirectionalLight(0xffdad2, 1.45);
    directionalLight.position.set(2.8, 3.5, 4);
    const rimLight = new THREE.DirectionalLight(0xff2525, 1.3);
    rimLight.position.set(-3.5, -1.2, 2.5);
    scene.add(ambientLight, directionalLight, rimLight);

    const group = new THREE.Group();
    const floatingObjects = createFloatingObjects(isLowPower);
    floatingObjects.forEach((mesh) => group.add(mesh));
    scene.add(group);

    const particles = createParticleSystem(isLowPower ? LOW_POWER_PARTICLE_COUNT : PARTICLE_COUNT);
    scene.add(particles);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 24, 16),
      new THREE.MeshBasicMaterial({
        color: 0xff1a1a,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    glow.scale.set(2.2, 0.75, 0.65);
    glow.position.set(1.25, -0.15, -3.1);
    scene.add(glow);

    const onPointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseRef.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    container.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onResize);

    const scrollState = { y: 0, z: 5.6 };
    const scrollTween = gsap.to(scrollState, {
      z: 4.75,
      y: -0.45,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: 0.7
      }
    });

    let frameId = 0;
    const clock = new THREE.Clock();

    const renderFrame = () => {
      const elapsed = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.033);
      const movementScale = isLowPower ? 0.45 : intensity;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseRef.current.x * 0.24, 0.045);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, scrollState.y - mouseRef.current.y * 0.16, 0.045);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, scrollState.z, 0.06);
      camera.lookAt(0, 0, 0);

      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, mouseRef.current.x * 0.18, 0.035);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -mouseRef.current.y * 0.09, 0.035);

      floatingObjects.forEach((mesh, index) => {
        mesh.rotation.x += delta * mesh.userData.rotationSpeed * movementScale;
        mesh.rotation.y += delta * (mesh.userData.rotationSpeed + 0.08) * movementScale;
        mesh.position.y = mesh.userData.baseY + Math.sin(elapsed * 0.85 + mesh.userData.floatOffset) * 0.18 * movementScale;
        mesh.position.x += Math.cos(elapsed * 0.35 + index) * 0.0009 * movementScale;
      });

      const positions = particles.geometry.attributes.position.array;
      const speeds = particles.userData.speeds;
      for (let index = 0; index < speeds.length; index += 1) {
        const offset = index * 3;
        positions[offset + 1] += delta * speeds[index] * movementScale;
        positions[offset] += Math.sin(elapsed + index) * 0.0008 * movementScale;
        if (positions[offset + 1] > 3.25) {
          positions[offset + 1] = -3.25;
          positions[offset] = (Math.random() - 0.5) * 11;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsed * 0.025 * movementScale;

      glow.material.opacity = 0.065 + Math.sin(elapsed * 1.2) * 0.02;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      window.cancelAnimationFrame(frameId);
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
      container.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      particles.geometry.dispose();
      particles.material.dispose();
      glow.geometry.dispose();
      glow.material.dispose();
      floatingObjects.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      renderer.domElement.remove();
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    />
  );
}
