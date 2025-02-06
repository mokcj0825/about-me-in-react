import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Theater: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsRef = useRef<THREE.Mesh[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const phaseOffsetsRef = useRef<number[]>([]);
  const mountedRef = useRef<boolean>(false); 

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove any existing canvas first
    const existingCanvas = containerRef.current.querySelector('canvas');
    if (existingCanvas) {
      containerRef.current.removeChild(existingCanvas);
    }

    // Scene setup
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0x1a1a1a);
    
    // Camera setup
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current.position.z = 15;
    cameraRef.current.position.y = 5;
    cameraRef.current.lookAt(0, 0, 0);

    // Renderer setup
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    rendererRef.current.shadowMap.enabled = true;
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    ground.receiveShadow = true;
    sceneRef.current.add(ground);

    // Create various geometric shapes
    const shapes = [
      new THREE.TorusKnotGeometry(1, 0.3, 100, 16),
      new THREE.OctahedronGeometry(1.5),
      new THREE.TetrahedronGeometry(1.5),
      new THREE.IcosahedronGeometry(1.2),
    ];

    // Create objects with different materials
    shapes.forEach((geometry, i) => {
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(i * 0.25, 0.7, 0.5),
        metalness: 0.2,
        roughness: 0.3,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (i - 1.5) * 4;
      mesh.position.y = Math.sin(i) * 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      objectsRef.current.push(mesh);
      phaseOffsetsRef.current.push(Math.random() * Math.PI * 2);
      (sceneRef.current as THREE.Scene).add(mesh);
    });

    // Add lights
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(10, 10, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    sceneRef.current.add(mainLight);

    const hemisphereLight = new THREE.HemisphereLight(0x606060, 0x404040);
    sceneRef.current.add(hemisphereLight);

    // Add point lights for extra visual interest
    const colors = [0xff0000, 0x00ff00, 0x0000ff];
    colors.forEach((color, i) => {
      const light = new THREE.PointLight(color, 1, 20);
      light.position.set(
        Math.sin(Math.PI * 2 / 3 * i) * 8,
        3,
        Math.cos(Math.PI * 2 / 3 * i) * 8
      );
      (sceneRef.current as THREE.Scene).add(light);
    });
    
    // Store a unique phase for each object

    // Animation function
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      objectsRef.current.forEach((mesh, i) => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.015;
        if (phaseOffsetsRef.current.length > i) {
          const time = Date.now() * 0.001;
          mesh.position.y = Math.sin(time + phaseOffsetsRef.current[i]) * 2;
        }
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        
        // Dispose scene, materials, geometries
        if (sceneRef.current) {
          sceneRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.geometry.dispose();
              const materials = Array.isArray(child.material) 
                ? child.material 
                : [child.material];
              materials.forEach(material => material.dispose());
            }
          });
          sceneRef.current.clear();
        }
    
        // Dispose renderer
        if (rendererRef.current) {
          rendererRef.current.dispose();
          if (containerRef.current) {
            containerRef.current.removeChild(rendererRef.current.domElement);
          }
        }
    
        // Cancel animation
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
    
        // Reset refs
        sceneRef.current = null;
        cameraRef.current = null;
        rendererRef.current = null;
        objectsRef.current = [];
        phaseOffsetsRef.current = [];
      };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
    />
  );
};

export default Theater;