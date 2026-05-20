import { useEffect, useRef, useState } from 'react';
import { GameState } from '../types';

interface GameCanvasProps {
  gameState: GameState;
  multiplier: number;
  countdown: number;
  totalCountdown: number;
  activePlayersCount: number;
}

// SVG string for the authentic Spribe Aviator plane
const REAL_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" width="150" height="74"><defs><path fill="#E50539" d="m133.55 31.85-.5-.1-.2.15q-.6.25-.5.75.85 4.75 2 9.25.15.65 1.05.55l.25-.1q4.05-2.3 6.95-6.4.95-1.25-.4-1.9-3-1.4-8.65-2.2m.35 2.1q-.05-.15-.05-.3.1-.25.4-.35l.15-.05 2.55.45q2.65.6 3.5 1 .75.35.65.65L134.6 37l-.7-3.05m1.75 10.85h-.8l.6 11.25q.1 1.4.85 3.25.3 1.05 1.2 3.15l4.45 10.95q.15.5.55.55.5.1.85-.25 1.45-1.3 1.35-2.75-.6-11.55-1.65-16.5L139.1 42.3q-1.5 1.45-2.95 2.3l-.5.2m6.8 26.5-.05-.3q-3.85-8.75-5.35-13.45-.3-.9.1-1.4l.7-.4L143.3 68q.8 2.3-.7 3.05l-.15.25M129.35.45q-.15-.35-.55-.4-.4-.15-.7.15-1.55 1.65-1.45 3.45.45 10.55 1.6 16l3.75 10.4.7-.3.5-.05q1.5.15 3.55.75l-.85-11.6q-.2-2.75-2.1-7.15L129.35.45m-.4 1.6.1.15q3.15 7.9 4.8 13 .65 1.55-.55 1.95l-.15.1-.05-.25q-4.6-9.05-5.3-11.55-.55-1.9 1-3.3l.15-.1Z" id="a"/><path fill="#E50539" d="M90.75-2.25q-2.25.2-4.3.75l-1.3 4.4q-2.05-1.7-4.2-3.15L76.8.6l.4 1.25q2.05 1.25 5.8 3.9-.65 1.95-1.9 4.75l2.4-.4q-.1 1.05-.65 1.5-.4.25-1.5.55l-2.2.45q-.7.15-.95 1.2-.1.65-.05 1.15l8-2.05.35-5.45q1.25 1.15 3.55 4.2l3.6-1.15q-.45-.4-5.35-5.5 2.1-6.3 2.45-7.25m-32.15-7.8q-5.2 2.8-9.1 4.6-1.6.65-2.4 1.7-.35.35-1.05 1.6-.25.5.2.6l14.25 5.1q-.2-.3-.15-.5 0-.15.3-.25 12.5-4 20.8-5.6 7-1.25 10.4-1.6 2.4-.15 4.9.1l2.25.4q.9.35.95 1.2.5 3.2 1.7 7.85 1.25 4.9 2.25 7.15-.45.65-1.15.55-.45 0-1.95-2-.25-.1-.55-.1-23.4 7.95-58.1 14.05-38.95 6.8-53.7 3.4v.1l-5.8 2.65q.85.9 3.1 3.15 3.05 1.5 8.95-.55l.85 2q.3 1.1 1.1 1.25.7.15 3.75-.3 11.15-1.5 38.2-5.75 29.45-4.6 38.3-6.4 17.25-3.4 24.05-6 5.05-1.95 6.15-3.85 1.3-2.25.05-7.6Q105-2.9 104.7-4.05q-.85-2.15-2.6-2.95-1.25-.6-3.4-.65-3.7 0-7.3.3-5.5.6-10.9 1.1-4.7.5-8.6-1.75-3.9-2.3-4.55-2.65-1.95-.95-3.25-1.05-1.9-.2-5.5 1.65m2.5 8q-.25-1.1 1.4-1.5.3-.05 3.6-1.1.6-.2.6-.75.1-.55-.35-.8L61.9-9.1q2.2-1.2 4.6.05 3.2 1.65 5.8 3.45.55.4.45.85-.1.5-.55.6l-10.45 3q-.5-.45-.65-.9m-39.8-4.8q-6.4-2-12.35 2.25v.05l4.5 6.5q.2.3.45.2L20.85 0l.2.9q.05.9-.3 1.6-.3.6-1 .95l-4.55 1.5 1.45 2.4L21.9 5.6q.45 2.25-.5 2.7l-3.3 1.4 3.35 5.5-2.05.6Q10 18.7 8.55 18.45q-2.85-.5-8.6-6.4Q-5.8 5.6-7.3 4.5q-2.35-1.8-6.15-1.25Q-16.5 3.7-21.9 6q-1.6.65-1.75 3.5l6.3-1.8q.25 1.9-.7 2.2-3.2 1.15-5.65 1.85-.9.5-.8 3.05l2.9-.65q.25-.1.4.1l9.95 12.45q.75-.05 3.3-.6l-7.1-10.75q-.1-.2-.05-.4.15-.2.3-.3 1.95-.55 2.85-.6 2.3-.15 3.95 1.45 1.7 1.65 4.1 3.1 3.65 2.1 6.85 2.4 1.6.2 1.5.75l-2.2.7q-.8.2-.85 1.35.05.55.2 1.05l24-4.95q.2-.15.4.05l2.35 2.8q.4.65 1.15.55 4.35-.35 22.45-4.2 18.05-4 19.4-4.8.65-.45.95-2 .1-.95-1.15-1.4Q31.45-3.85 21.3-6.85Z" id="b"/></defs><use xlink:href="#a"/><use xlink:href="#b" transform="translate(24.5 34.75)"/></svg>`;

export default function GameCanvas({
  gameState,
  multiplier,
  countdown,
  totalCountdown,
  activePlayersCount,
}: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const planeImageRef = useRef<HTMLImageElement | null>(null);
  const [isPlaneLoaded, setIsPlaneLoaded] = useState(false);

  // Load the authentic Spribe Aviator SVG vector image on component mount
  useEffect(() => {
    const img = new Image();
    const base64Data = btoa(unescape(encodeURIComponent(REAL_SVG_STRING)));
    img.src = 'data:image/svg+xml;base64,' + base64Data;
    img.onload = () => {
      planeImageRef.current = img;
      setIsPlaneLoaded(true);
    };
  }, []);

  // Keep track of dimensions
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

  // Monitor container resize and update canvas dimensions (to obey responsive design and Stage Sizing constraints)
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 300),
          height: Math.max(height, 250),
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Particle list to simulate movement speed
  const particlesRef = useRef<{ x: number; y: number; speed: number; size: number }[]>([]);

  // Initialize particles once
  useEffect(() => {
    const list = Array.from({ length: 25 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 450,
      speed: 1.5 + Math.random() * 4.5,
      size: 1 + Math.random() * 2,
    }));
    particlesRef.current = list;
  }, []);

  // Track continuously changing prop states via refs to achieve a stable 60fps render loop without effect teardowns
  const gameStateRef = useRef(gameState);
  const multiplierRef = useRef(multiplier);
  const countdownRef = useRef(countdown);
  const totalCountdownRef = useRef(totalCountdown);
  const lastStateRef = useRef(gameState);

  // Keep refs synchronized in a lightweight, cheap side-effect
  useEffect(() => {
    gameStateRef.current = gameState;
    multiplierRef.current = multiplier;
    countdownRef.current = countdown;
    totalCountdownRef.current = totalCountdown;
  }, [gameState, multiplier, countdown, totalCountdown]);

  // Main drawing engine matching Aviator aesthetics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    canvas.width = width;
    canvas.height = height;

    // Define coordinates grid to start from the exact bottom-left corner
    const startX = 0;
    const startY = height;
    const endXRange = width - 100;

    let localAnimationFrame: number;
    let smoothMultiplier = 1.0;
    let lastFlyingPlaneX = startX;
    let lastFlyingPlaneY = startY;
    let lastFlyingTiltAngle = -12 * (Math.PI / 180);
    let crashedAt: number | null = null;

    const render = () => {
      const timeMs = Date.now();
      const currentGameState = gameStateRef.current;
      const currentMultiplier = multiplierRef.current;
      const currentCountdown = countdownRef.current;
      const currentTotalCountdown = totalCountdownRef.current;

      // Handle transition detection
      if (currentGameState !== lastStateRef.current) {
        if (currentGameState === 'WAITING' || currentGameState === 'FLYING') {
          smoothMultiplier = 1.0;
        }
        lastStateRef.current = currentGameState;
      }

      // Smoothly interpolate towards the state multiplier target
      if (currentGameState === 'FLYING') {
        const diff = currentMultiplier - smoothMultiplier;
        smoothMultiplier += diff * 0.12; // buttery smooth 60fps transition step
      } else if (currentGameState === 'CRASHED') {
        const diff = currentMultiplier - smoothMultiplier;
        smoothMultiplier += diff * 0.12;
      } else {
        smoothMultiplier = 1.0;
      }

      // 1. Clear layout with solid premium carbon-black backing
      ctx.fillStyle = '#0a0a0b';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw radiating dark-grey laser stripe beams spreading from starting coordinate
      const beamCenterY = height;
      const beamCenterX = 0;
      const beamCount = 20;
      const maxDistance = Math.sqrt(width * width + height * height) * 1.5;

      ctx.save();
      // Period of the stripe pattern is 2 slices = Math.PI / beamCount. Set slow, continuous downward speed.
      const stripePeriod = Math.PI / beamCount;
      const angleOffset = (timeMs * 0.000036) % stripePeriod;

      // Extend the index range from -4 to beamCount + 4 so no empty gaps appear at boundaries as the beams drift
      for (let i = -4; i < beamCount + 4; i++) {
        const baseAngleStart = (i / beamCount) * (Math.PI / 2);
        const baseAngleEnd = ((i + 0.45) / beamCount) * (Math.PI / 2);

        // Add the seamless drifting offset
        const angleStart = baseAngleStart + angleOffset;
        const angleEnd = baseAngleEnd + angleOffset;

        // Ensure safe alternating colors for custom/negative index ranges
        const colorIndex = ((i % 2) + 2) % 2;
        ctx.fillStyle = colorIndex === 0 ? '#101112' : '#070708';

        ctx.beginPath();
        ctx.moveTo(beamCenterX, beamCenterY);
        ctx.arc(beamCenterX, beamCenterY, maxDistance, -angleStart, -angleEnd, true);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 2.5. Draw the beautiful blue-cyan ambient spotlight glow focused in the center-right
      ctx.save();
      const radialGlow = ctx.createRadialGradient(
        width * 0.52,
        height * 0.48,
        0,
        width * 0.52,
        height * 0.48,
        Math.max(width, height) * 0.5
      );
      radialGlow.addColorStop(0, 'rgba(14, 116, 144, 0.42)'); // Bright steel cyan/blue
      radialGlow.addColorStop(0.3, 'rgba(3, 105, 161, 0.18)'); // Ocean blue ambient
      radialGlow.addColorStop(0.65, 'rgba(3, 105, 161, 0.03)');
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 3. Draw grid lines with elegant hyper-subtle integration
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      
      // Vertical grid lines
      const verticalLines = 10;
      for (let i = 1; i < verticalLines; i++) {
        const gx = (width / verticalLines) * i;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      // Horizontal grid lines
      const horizontalLines = 6;
      for (let i = 1; i < horizontalLines; i++) {
        const gy = (height / horizontalLines) * i;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Draw horizontal speed particles (star field) zooming left/down @ 60fps
      const flightSpeedFactor = currentGameState === 'FLYING' ? Math.min(3, smoothMultiplier) : 0.2;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Move particle left-down
        p.x -= p.speed * flightSpeedFactor;
        p.y += p.speed * 0.3 * flightSpeedFactor;

        // Wrap around canvas dimensions
        if (p.x < 0) {
          p.x = width;
          p.y = Math.random() * height;
        }
        if (p.y > height) {
          p.y = 0;
          p.x = Math.random() * width;
        }
      });

      // 4. Generate dynamic, ultra-smooth mathematical flight path curve points.
      const curvePoints: { x: number; y: number }[] = [];
      const steps = 80;
      const activeMultiplier = (currentGameState === 'FLYING' || currentGameState === 'CRASHED') ? smoothMultiplier : 1.0;

      // Logarithmic progress value that scales from 0 up to 0.85 (reaches near peak around 2.5x multiplier)
      const progress = Math.min(0.85, Math.log1p(activeMultiplier - 1.0) * 0.92);

      // Fine-grained continuous sinusoidal wave floating
      let waveY = 0;
      let waveX = 0;
      if (currentGameState === 'FLYING') {
        // Slow development curve bobbing right from takeoff
        const amplitudeY = 12;
        const amplitudeX = 3;
        waveY = Math.sin(timeMs * 0.0012) * amplitudeY;
        waveX = Math.cos(timeMs * 0.0014) * amplitudeX;
      }

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const localProgress = t * progress;
        let px = startX + localProgress * (endXRange - startX);
        // Pure exponential-style curvature with no jagged angles or segment lines
        let py = startY - Math.pow(localProgress, 1.45) * (startY - 60);

        // Scale bobbing with t^2 to smoothly merge the trail from the static origin
        if (waveX !== 0 || waveY !== 0) {
          const factor = t * t;
          px += waveX * factor;
          py += waveY * factor;
        }

        curvePoints.push({ x: px, y: py });
      }

      // Always maintain the official default tilt angle with no trajectory rotation
      const tiltAngle = -12 * (Math.PI / 180);

      const planeX = curvePoints[curvePoints.length - 1].x;
      const planeY = curvePoints[curvePoints.length - 1].y;

      if (currentGameState === 'FLYING') {
        lastFlyingPlaneX = planeX;
        lastFlyingPlaneY = planeY;
        lastFlyingTiltAngle = tiltAngle;
        crashedAt = null;

        // Draw the translucent red fill polygon beneath the curve
        ctx.save();
        const trailGrad = ctx.createLinearGradient(0, height - 150, 0, height);
        trailGrad.addColorStop(0, 'rgba(229, 5, 57, 0.35)'); // Glowing crimson top
        trailGrad.addColorStop(1, 'rgba(229, 5, 57, 0.00)'); // Transparent fade-out to bottom

        ctx.fillStyle = trailGrad;
        ctx.beginPath();
        ctx.moveTo(startX, height);
        ctx.lineTo(startX, startY);
        curvePoints.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.lineTo(planeX, height); // Extend flush down to the ground baseline
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Draw the glowing curved trail boundary red stroke line
        ctx.save();
        ctx.strokeStyle = '#ff003c'; // Brilliantly vibrant neon crimson red
        ctx.lineWidth = 3.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ff003c';
        ctx.beginPath();
        curvePoints.forEach((point, idx) => {
          if (idx === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.restore();

        // Draw the red propeller airplane at (planeX, planeY) matching current dynamic slope tangent
        drawAirplane(ctx, planeX, planeY, tiltAngle);

      } else if (currentGameState === 'WAITING') {
        // Red propeller plane sitting ready on bottom-left, bobbing slowly and smoothly
        const vibrY = startY + Math.sin(timeMs * 0.002) * 4.5;
        const vibrX = startX + Math.sin(timeMs * 0.0015) * 1.5;
        
        drawAirplane(ctx, vibrX, vibrY, -12 * (Math.PI / 180));

      } else if (currentGameState === 'CRASHED') {
        // Cut the line and trail immediately, but let the airplane play a beautiful high-speed exit animation once and disappear
        if (!crashedAt) {
          crashedAt = timeMs;
        }
        const elapsed = timeMs - crashedAt;
        const animationDuration = 520; // plays exactly once for ~500ms
        if (elapsed < animationDuration) {
          const t = elapsed / animationDuration;
          // Exponential ease starting fast and accelerating up-and-right
          const easeProgress = t * t * 2.4;
          const escapeSpeed = 1200; // fast velocity
          const distance = escapeSpeed * easeProgress;

          const currentX = lastFlyingPlaneX + distance * Math.cos(lastFlyingTiltAngle);
          const currentY = lastFlyingPlaneY + distance * Math.sin(lastFlyingTiltAngle);
          
          // Keep the nose at standard default angle with no custom tilt during flight escape
          const blastAngle = lastFlyingTiltAngle;

          ctx.save();
          // Smoothly fade out the plane as it accelerates off the canvas boundaries
          ctx.globalAlpha = Math.max(0, 1 - t * t);
          drawAirplane(ctx, currentX, currentY, blastAngle);
          ctx.restore();
        }
      }

      localAnimationFrame = requestAnimationFrame(render);
    };

    localAnimationFrame = requestAnimationFrame(render);
    animationFrameRef.current = localAnimationFrame;

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, isPlaneLoaded]);

  // SVG-equivalent precise plane rendering on canvas
  const drawAirplane = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number
  ) => {
    ctx.save();
    // 1. Move to the desired flight coordinate
    ctx.translate(x, y);

    // 2. Adjust scale so it looks perfectly integrated and prominent (made smaller on mobile)
    const isMobile = dimensions.width < 640;
    const baseScale = isMobile ? 0.65 : 1.05;
    ctx.scale(baseScale, baseScale);

    // 3. Apply rotation
    ctx.rotate(angle);

    // 4. Authentic glowing crimson shadow/halo matching high speed flight
    ctx.shadowBlur = gameState === 'WAITING' ? 6 : 16;
    ctx.shadowColor = '#e50539';

    // 5. Paint standard Aviator SVG image vector
    if (planeImageRef.current && isPlaneLoaded) {
      // Offset so that the very bottom-rear tail/keel aligns perfectly with the end of the curve tip!
      ctx.drawImage(planeImageRef.current, -24.5, -72, 150, 74);
    } else {
      ctx.translate(-24.5, -72);
      // Clean high precision vectorized fallback representation
      ctx.fillStyle = '#e50539';
      ctx.beginPath();
      ctx.moveTo(150, 72); // Nose
      ctx.lineTo(24.5, 25);   // Top tail
      ctx.lineTo(41.5, 48);  // Middle tail
      ctx.lineTo(24.5, 72);   // Bottom tail
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 min-h-[180px] w-full bg-[#1c1d1e] rounded-sm relative select-none flex flex-col overflow-hidden border border-[#242526]"
    >
      {/* 1. Yellow/amber indicator header bar reading "FUN MODE" */}
      <div className="w-full bg-gradient-to-r from-[#e18d00] to-[#ca7f00] text-white font-extrabold text-[12px] py-1 text-center uppercase tracking-[0.08em] shadow-sm select-none shrink-0 border-b border-[#ca7f00]/40 font-sans z-10">
        FUN MODE
      </div>

      {/* 2. Interactive canvas covering rest of body */}
      <div className="relative flex-1 w-full bg-[#1c1d1e]">
        <canvas 
          ref={canvasRef}
          className="block absolute top-0 left-0 w-full h-full cursor-default"
        />

        {/* 3. Central Flying Multiplier Display */}
        {gameState === 'FLYING' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10">
            <span className="text-[64px] sm:text-[76px] font-black font-sans text-[#f8fafc] leading-none tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] filter">
              {multiplier.toFixed(2)}x
            </span>
          </div>
        )}

        {/* 3.5. Central Flew Away / Crashed Display */}
        {gameState === 'CRASHED' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10 gap-2 sm:gap-3">
            <span className="text-[18px] sm:text-[24px] font-extrabold font-sans text-[#ffffff] uppercase tracking-[0.16em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              FLEW AWAY!
            </span>
            <span className="text-[64px] sm:text-[84px] font-black font-sans text-[#e50539] leading-none tracking-tight drop-shadow-[0_4px_16px_rgba(229,5,57,0.55)] filter">
              {multiplier.toFixed(2)}x
            </span>
          </div>
        )}

        {/* 4. UFC Official Partners logo watermark layered behind multiplier when sitting idle or countdown */}
        {gameState === 'WAITING' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none px-4 z-10">
            {/* Logo cluster */}
            <div className="flex flex-col items-center justify-center">
              {/* UFC Official Partners header */}
              <div className="flex items-center gap-4 border-b border-[#ef4444]/40 pb-2 mb-2">
                {/* UFC Red visual logo */}
                <span className="text-red-600 text-3xl font-black tracking-tighter uppercase italic leading-none font-sans drop-shadow-md">
                  UFC
                </span>
                <span className="h-6 w-[1.5px] bg-[#3a3b3c]" />
                <svg 
                  viewBox="0 0 108 28" 
                  className="h-[22px] md:h-[26px] w-auto flex-shrink-0 select-none"
                >
                  <g fill="#E50539" fillRule="evenodd">
                    <path d="m35.8316 8.4608-3.1805 12.6395c-.265 1.0105-.8613 1.8802-1.7931 2.605-.9319.7247-1.9174 1.0891-2.9489 1.0891l4.1167-16.3336H26.936l-.526 2.4765-4.0792 16.3336h4.9489c2.4145 0 4.7089-.8945 6.8872-2.6793 2.1783-1.7848 3.5616-3.8848 4.1579-6.2993l1.8387-7.355.621-2.4765h-4.9529Z"/>
                    <path d="M49.5521.7413c-.4142-.4928-.965-.7412-1.6526-.7412-.6913 0-1.321.2484-1.8966.7412-.5715.4929-.9151 1.0851-1.0272 1.7725-.1201.7166.0291 1.317.4433 1.8098.41.4929.9607.7415 1.6483.7415.6916 0 1.3251-.253 1.901-.7579.5714-.5055.9194-1.1018 1.031-1.7934.112-.6874-.0373-1.2796-.4472-1.7725m-4.6426 22.206c.0086-.0495.025-.1118.0498-.1864.0248-.0746.0415-.12.0455-.1492l3.5408-14.151h-8.204l-.6253 2.4765h3.284l-2.9484 11.6745c-.0415.1037-.0746.2486-.1077.4474-.2115 1.2798.1158 2.2944.977 3.0482.8617.7496 2.1412 1.1263 3.8436 1.1263h.737l.6293-2.4764c-.9854-.145-1.3956-.7496-1.2216-1.8099M58.5553 21.9866c-.1987.762-.6377 1.4164-1.3167 1.9588-.6792.5427-1.404.8118-2.1662.8118-1.4288 0-2.0291-.6876-1.8056-2.0709.0043-.0205.0208-.0827.0499-.182.0288-.0994.0455-.174.0536-.2236l2.373-9.4965c.3232-1.2297 1.0022-1.847 2.0377-1.847h3.5492l-2.7749 11.0494Zm4.6093 1.404c.0083-.0498.025-.0994.0458-.1492a.6234.6234 0 0 0 .0412-.145l3.6569-14.6357h-8.5352c-1.7768 0-3.429.5013-4.9575 1.4994-1.5322.9978-2.4805 2.2486-2.8492 3.748l-2.0623 8.2785c-.0455.1242-.0826.2814-.112.4805-.2276 1.379.174 2.518 1.2093 3.4164 1.0353.8987 2.3897 1.3501 4.067 1.3501h.7747c1.4532 0 2.8034-.505 4.0541-1.5158.6254 1.0108 1.7975 1.5158 3.5204 1.5158h1.739l.6257-2.4764c-.9526-.0499-1.3585-.5053-1.218-1.3666ZM87.1847 13.3021l-.0663.4059-2.0582 8.2785c-.2195.8864-.5799 1.5697-1.0768 2.0502-.4969.4802-1.0145.7204-1.557.7204-.4928 0-.8699-.2195-1.1306-.6669-.261-.443-.3312-1.0062-.2197-1.6978.0083-.0498.025-.116.054-.2028.0249-.0873.0416-.1532.0496-.203l2.0582-8.2786c.2072-.8118.5508-1.4703 1.0273-1.9755.4761-.505 1.0102-.758 1.6024-.758.493 0 .8657.2031.1183.609.2526.41.3232.9815.1988 1.7186m3.7686-3.4913c-1.0229-.8985-2.3687-1.3501-4.046-1.3501h-.7746c-1.826 0-3.491.5055-4.9985 1.516-1.5077 1.0105-2.4433 2.257-2.8077 3.7313l-2.1 8.2785a2.7992 2.7992 0 0 0-.1117.4805c-.2319 1.4037.1697 2.547 1.2093 3.4374 1.0355.8861 2.4061 1.3294 4.104 1.3294h.7374c1.8015 0 3.4581-.5136 4.982-1.5324 1.5241-1.023 2.464-2.2613 2.8285-3.7149l2.0956-8.2785.0786-.4762c.2238-1.3833-.174-2.522-1.1969-3.421M106.1978 8.4608c-1.996 0-3.7232.53-5.1767 1.5904l.3727-1.5904h-4.9281L91.736 27.2337h4.9532l2.5718-10.2705c.3273-1.2591.969-2.4353 1.9257-3.5285.9567-1.0975 2.0334-1.8553 3.2387-2.2736l-.5882 2.4393h2.7002l1.321-5.1396h-1.6606ZM12.6644 13.9475l.008-.0557 2.2713-8.8628c.1675-.7412.5182-1.355 1.052-1.8333.5343-.4778 1.1398-.7172 1.8012-.7172.622 0 1.076.2074 1.379.6297.295.4145.3983.9483.295 1.5863l-.0558.3345-2.2715 8.8628-.016.0557h-4.4632Zm10.337-12.545C21.8697.4701 20.3474.0002 18.4266.0002c-2.0959 0-3.937.526-5.539 1.5701-1.6019 1.044-2.6143 2.4307-3.0447 4.16l-2.0563 8.1615c-1.7374 0-3.3474.0078-4.5987.0078C1.4189 13.8996 0 15.3424 0 17.1118h6.9737L4.4313 27.2334H9.341l2.5505-10.1216h4.4711l-1.586 6.2802c-.0477.1196-.0798.279-.1116.4783-.1753 1.06.0318 1.8885.6295 2.4786.5898.5896 1.4904.8845 2.6938.8845h1.961l.6294-2.4786c-.7095-.0477-1.0044-.4304-.8845-1.1398l4.487-17.8846c.0078-.0555.024-.1514.0638-.295.0399-.1513.0557-.2472.0636-.3027.255-1.5462-.1835-2.7897-1.307-3.7302ZM76.0941 8.4608l1.1223-4.3566h-4.9532l-1.0848 4.3566h-2.431l-.6297 2.4765h2.4353l-2.957 11.712c-.0083.0497-.0288.1367-.0622.2609-.0331.1242-.0495.2071-.0579.2607-.207 1.2548.0372 2.2448.7288 2.9736.696.7248 1.7436 1.0892 3.1474 1.0892h1.7396l.6334-2.5139c-1.0186-.095-1.4412-.675-1.2669-1.735.008-.0498.0245-.112.0493-.1864.021-.0748.0377-.1204.0417-.1492l2.9527-11.712h2.108l.6297-2.4764H76.094Z"/>
                  </g>
                </svg>
              </div>
              <span className="text-[10px] font-extrabold text-[#f1f5f9] uppercase tracking-[0.22em] font-sans drop-shadow">
                OFFICIAL PARTNERS
              </span>

              {/* Progress Bar (takedown loading) */}
              <div className="w-[140px] h-1.5 bg-[#2d2e2f] rounded-full overflow-hidden mt-3 mb-4.5 relative border border-white/[0.04] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
                <div 
                  style={{ width: `${Math.min(100, Math.max(0, (countdown / (totalCountdown || 5)) * 100))}%` }}
                  className="h-full bg-gradient-to-r from-[#e50539] to-[#ff2b58] rounded-full transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(229,5,57,0.7)]"
                />
              </div>

              {/* SPRIBE verified capsule */}
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#101c10]/90 border border-[#22c55e]/35 rounded-md shadow-lg scale-95 duration-150">
                <span className="text-[#22c55e] text-[15px] font-bold">🛡️</span>
                <div className="flex flex-col text-left leading-none font-sans">
                  <span className="text-[#a3e635] font-black text-[9px] uppercase tracking-wider leading-none">SPRIBE</span>
                  <span className="text-[#ffffff] font-extrabold text-[8.5px] uppercase flex items-center gap-0.5 mt-0.5 leading-none">
                    Official Game <span className="text-[#22c55e] font-bold">✔</span>
                  </span>
                  <span className="text-[#8e8f90] text-[7.5px] mt-0.5 leading-none">Since 2019</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Observer Count overlay bottom-right */}
        <div className="absolute bottom-3 right-3 flex items-center bg-[#000000]/65 border border-[#242526] px-2 py-0.5 rounded-sm gap-1 text-[11px] font-sans select-none z-10 text-[#ffffff]/90">
          <div className="flex -space-x-1 hover:space-x-1 duration-150">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] border border-[#1c1d1e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] border border-[#1c1d1e]" />
          </div>
          <span className="font-bold text-[#ffffff] font-sans text-[10px] pl-[1.5px]">
            {activePlayersCount}
          </span>
        </div>
      </div>
    </div>
  );
}
