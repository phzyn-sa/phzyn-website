/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, RefObject } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

export interface SawdustCanvasProps {
  emitterRef?: RefObject<HTMLDivElement | null>;
}

export function SawdustCanvas({ emitterRef }: SawdustCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouseX = -1000;
    let mouseY = -1000;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || window.innerWidth;
      canvas.height = rect?.height || 600;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color tones of sparkles and wood shavings matching the new brand theme
    const woodColors = [
      'rgba(16, 121, 142, ', // Brand Primary (#10798e)
      'rgba(250, 204, 21, ', // Yellow-400
      'rgba(113, 203, 221, ', // Brand Light Tint (#71cbdd)
      'rgba(251, 191, 36, ',  // Amber-400
      'rgba(255, 255, 255, ', // Pure sparkling white flecks
    ];

    const createParticle = (isInitial = false): Particle => {
      const size = Math.random() * 2.8 + 0.4;
      let x = Math.random() * canvas.width;
      let y = isInitial ? Math.random() * canvas.height : canvas.height + 10;
      let speedX = (Math.random() * 0.8 - 0.4) + 0.2; // slight drift to the right
      let speedY = -(Math.random() * 1.2 + 0.4);      // rising upwards
      let opacity = Math.random() * 0.7 + 0.3;
      const decay = Math.random() * 0.003 + 0.0015; // smooth particle lifetime decay

      if (emitterRef && emitterRef.current) {
        const rect = emitterRef.current.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const emX = rect.left - canvasRect.left + rect.width / 2;
        const emY = rect.top - canvasRect.top + rect.height / 2;

        if (emX > 0 && emX < canvas.width && emY > 0 && emY < canvas.height) {
          x = emX + (Math.random() * 20 - 10);
          y = emY + (Math.random() * 20 - 10);
          // Shoot in an upward arc (from angle 200 to 340 degrees)
          const angle = (Math.random() * 140 + 200) * (Math.PI / 180);
          const force = Math.random() * 2.5 + 0.8;
          speedX = Math.cos(angle) * force;
          speedY = Math.sin(angle) * force;
        }
      }

      return {
        x,
        y,
        size,
        speedX,
        speedY,
        opacity,
        decay,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.05 - 0.025),
        color: woodColors[Math.floor(Math.random() * woodColors.length)],
      };
    };

    // Initialize particles
    const maxParticles = 140;
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.parentElement?.addEventListener('mousemove', handleMouseMove);
    canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        // Move particle
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;
        
        // Decay opacity slowly as it rises
        p.opacity -= p.decay;

        // Apply mouse vortex attraction/repulsion if close
        if (mouseX !== -1000 && mouseY !== -1000) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            p.x += (dx / dist) * force * 4;
            p.y += (dy / dist) * force * 4;
          }
        }

        // Draw particle if still solid
        if (p.opacity > 0) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          
          if (p.size > 2) {
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size * 1.5, p.size);
          }
          ctx.restore();
        }

        // Respawn if off-screen or fully faded
        if (p.y < -20 || p.x < -20 || p.x > canvas.width + 20 || p.opacity <= 0) {
          particles[index] = createParticle(false);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 block"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
