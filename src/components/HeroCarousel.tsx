import { useEffect, useState } from "react";

const SLIDES = [
  "https://brgrill.com/wp-content/uploads/2015/07/blueridgegrill-30.jpg",
  "https://brgrill.com/wp-content/uploads/2015/07/blueridgegrill-51_revised.jpg",
  "https://brgrill.com/wp-content/uploads/2015/07/blueridgegrill-20.jpg",
  "https://brgrill.com/wp-content/uploads/2015/07/blueridgegrill-7_revised.jpg",
  "https://brgrill.com/wp-content/uploads/2015/07/blueridgegrill-14.jpg",
  "https://brgrill.com/wp-content/uploads/2015/07/blueridgegrill-5.jpg",
  "https://brgrill.com/wp-content/uploads/2015/07/blueridgegrill-17.jpg",
  "https://brgrill.com/wp-content/uploads/2015/07/blueridgegrill-38.jpg",
  "https://brgrill.com/wp-content/uploads/2015/07/blueridgegrill-74.jpg",
];

type Props = { className?: string };

export function HeroCarousel({ className }: Props) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className={`relative h-full w-full overflow-hidden ${className ?? ""}`}>
      {SLIDES.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt=""
          loading={idx === 0 ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: idx === i ? 1 : 0 }}
        />
      ))}
      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: idx === i ? 20 : 8,
              backgroundColor: idx === i ? "white" : "rgba(255,255,255,0.55)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
