import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const StereoLayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      100000,
    );
    camera.position.z = 3200;

    const scene = new THREE.Scene();
    scene.background = null; // White background

    // Create a simple gradient texture
    const createGradientTexture = () => {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext("2d");
      if (context) {
        const gradient = context.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, "#ffffff"); // White
        gradient.addColorStop(1, "#0000ff"); // Blue

        context.fillStyle = gradient;
        context.fillRect(0, 0, size, size);
      }

      return new THREE.CanvasTexture(canvas);
    };

    const gradientTexture = createGradientTexture();

    // Create bubble material with gradient texture and blending
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Base color
      envMap: gradientTexture, // Apply gradient texture
      transparent: true,
      opacity: 0.1, // Set desired opacity
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation, // Additive blending
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
    });

    // Create fewer, larger bubbles
    const bubbles: THREE.Mesh[] = [];
    const geometry = new THREE.SphereGeometry(200, 32, 32); // Bigger spheres

    for (let i = 0; i < 20; i++) {
      // Fewer bubbles
      const bubble = new THREE.Mesh(geometry, material);
      bubble.position.x = Math.random() * 4000 - 2000;
      bubble.position.y = Math.random() * 4000 - 2000;
      bubble.position.z = Math.random() * 2000 - 1000;
      scene.add(bubble);
      bubbles.push(bubble);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Gentle floating animation
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.0002;
      bubbles.forEach((bubble, i) => {
        // More natural floating movement
        bubble.position.y += Math.sin(time + i) * 2;
        bubble.position.x += Math.cos(time + i * 0.8) * 1.5;
        bubble.rotation.x += 0.02;
        bubble.rotation.y += 0.01;

        // Keep bubbles in view
        if (bubble.position.y > 2000) bubble.position.y = -2000;
        if (bubble.position.x > 2000) bubble.position.x = -2000;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  const backgroundStyle = {
    backgroundImage:
      "url(https://storage.googleapis.com/cj-mok-stash/fontaine01-bl.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
      <div
        ref={containerRef}
        style={{
          ...backgroundStyle,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default StereoLayer;