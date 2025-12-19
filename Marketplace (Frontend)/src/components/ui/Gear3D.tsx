import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GearMeshProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
    speed?: number;
    color?: string;
    reverse?: boolean;
}

function GearMesh({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    speed = 0.5,
    color = '#60a5fa',
    reverse = false
}: GearMeshProps) {
    const meshRef = useRef<THREE.Group>(null);

    // Create gear shape with teeth
    const gearShape = useMemo(() => {
        const shape = new THREE.Shape();
        const outerRadius = 1;
        const innerRadius = 0.3;
        const teethCount = 12;
        const teethHeight = 0.25;
        const teethWidth = 0.15;

        // Draw gear with teeth
        for (let i = 0; i < teethCount; i++) {
            const angle = (i / teethCount) * Math.PI * 2;
            const nextAngle = ((i + 1) / teethCount) * Math.PI * 2;
            const midAngle = angle + (nextAngle - angle) * 0.5;

            const toothStart = angle + teethWidth * 0.5;
            const toothEnd = angle + teethWidth * 1.5;

            if (i === 0) {
                shape.moveTo(
                    Math.cos(angle) * outerRadius,
                    Math.sin(angle) * outerRadius
                );
            }

            // Tooth peak
            shape.lineTo(
                Math.cos(toothStart) * (outerRadius + teethHeight),
                Math.sin(toothStart) * (outerRadius + teethHeight)
            );
            shape.lineTo(
                Math.cos(toothEnd) * (outerRadius + teethHeight),
                Math.sin(toothEnd) * (outerRadius + teethHeight)
            );

            // Back to base
            shape.lineTo(
                Math.cos(nextAngle) * outerRadius,
                Math.sin(nextAngle) * outerRadius
            );
        }

        // Inner circle (hole)
        const holePath = new THREE.Path();
        holePath.moveTo(innerRadius, 0);
        for (let i = 1; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            holePath.lineTo(
                Math.cos(angle) * innerRadius,
                Math.sin(angle) * innerRadius
            );
        }
        shape.holes.push(holePath);

        return shape;
    }, []);

    // Animation
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.z += delta * speed * (reverse ? -1 : 1);
        }
    });

    const extrudeSettings = {
        steps: 1,
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 2,
    };

    return (
        <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
            <mesh castShadow receiveShadow>
                <extrudeGeometry args={[gearShape, extrudeSettings]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.8}
                    roughness={0.2}
                    envMapIntensity={1}
                />
            </mesh>
            {/* Center hub */}
            <mesh position={[0, 0, 0.15]}>
                <cylinderGeometry args={[0.15, 0.15, 0.25, 32]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
            </mesh>
        </group>
    );
}

interface Gear3DProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
    theme?: 'light' | 'dark' | 'auto';
}

export function Gear3D({ size = 'medium', className = '', theme = 'auto' }: Gear3DProps) {
    const dimensions = {
        small: { height: 150, scale: 0.6 },
        medium: { height: 250, scale: 0.9 },
        large: { height: 300, scale: 1.1 },
    };

    const { height, scale } = dimensions[size];

    // Theme-aware colors
    const colors = {
        light: {
            main: '#4f46e5',      // indigo-600
            secondary: '#7c3aed', // violet-600
            tertiary: '#8b5cf6',  // violet-500
            accent: '#6366f1',    // indigo-500
        },
        dark: {
            main: '#6366f1',      // indigo-500
            secondary: '#8b5cf6', // violet-500
            tertiary: '#a78bfa',  // violet-400
            accent: '#a78bfa',    // violet-400
        }
    };

    // Detect theme from DOM if auto
    const getTheme = () => {
        if (theme !== 'auto') return theme;
        if (typeof document !== 'undefined') {
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }
        return 'dark';
    };

    const currentTheme = getTheme();
    const themeColors = colors[currentTheme];

    return (
        <div className={`w-full ${className}`} style={{ height }}>
            <Canvas
                camera={{ position: [0, 0, 4], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                {/* Lighting - brighter for light mode */}
                <ambientLight intensity={currentTheme === 'light' ? 0.8 : 0.4} />
                <directionalLight position={[5, 5, 5]} intensity={currentTheme === 'light' ? 1.5 : 1} castShadow />
                <directionalLight position={[-5, -5, 5]} intensity={currentTheme === 'light' ? 0.5 : 0.3} />
                <pointLight position={[0, 0, 3]} intensity={currentTheme === 'light' ? 0.8 : 0.5} color={themeColors.accent} />

                {/* Main gear */}
                <GearMesh
                    position={[0, 0, 0]}
                    scale={scale}
                    speed={0.4}
                    color={themeColors.main}
                />

                {/* Secondary gear (interlocking) */}
                <GearMesh
                    position={[1.8 * scale, 0.8 * scale, -0.1]}
                    scale={scale * 0.6}
                    speed={0.67}
                    color={themeColors.secondary}
                    reverse
                />

                {/* Third small gear */}
                <GearMesh
                    position={[-1.5 * scale, -0.6 * scale, 0.1]}
                    scale={scale * 0.45}
                    speed={0.9}
                    color={themeColors.tertiary}
                />
            </Canvas>
        </div>
    );
}

export default Gear3D;
