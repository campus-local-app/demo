import { useState, useEffect, useRef, useCallback } from 'react';
import { franchiseEvents } from '../../data/mock';

export function FranchiseEventBanner() {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const total = franchiseEvents.length;

  const startAutoSlide = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % total);
    }, 4000);
  }, [total]);

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(timerRef.current);
  }, [startAutoSlide]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setTranslateX(0);
    clearInterval(timerRef.current);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setTranslateX(e.clientX - startX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (translateX < -40) setCurrent((p) => (p + 1) % total);
    else if (translateX > 40) setCurrent((p) => (p - 1 + total) % total);
    setTranslateX(0);
    startAutoSlide();
  };

  const ev = franchiseEvents[current];

  return (
    <section className="px-4">
      <div
        className="relative rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-4 overflow-hidden select-none touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: isDragging ? `translateX(${translateX}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.25s ease',
        }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{ev.emoji}</span>
            <span className="font-bold text-gray-900 text-[15px]">{ev.brand}</span>
          </div>
          <span className="text-xs text-gray-400">
            {ev.branch} · {ev.distance}
          </span>
        </div>

        {/* Title & description */}
        <h3 className="font-semibold text-gray-800 text-[15px] leading-snug">{ev.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{ev.description}</p>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold">
            {ev.badge}
          </span>
          <span className="text-[11px] text-gray-400">~{ev.validUntil}</span>
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-1.5 mt-2.5">
        {franchiseEvents.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(i);
              startAutoSlide();
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === current ? 'bg-orange-500 w-3' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
