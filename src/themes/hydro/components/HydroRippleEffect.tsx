import React, { useState, useEffect, useMemo } from "react";
import { throttle } from "lodash";
import PropTypes from "prop-types";

interface RippleProps {
  color?: string;
  duration?: number;
  maxRipples?: number;
  scale?: number;
  overflow?: "hidden" | "visible";
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

const HydroRippleEffect: React.FC<RippleProps> = ({
  color = "rgba(0, 0, 255, 0.3)",
  duration = 2500,
  maxRipples = 5,
  scale = 10,
  overflow = "hidden",
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  if (duration < 0 || maxRipples < 1 || scale < 1) {
    console.warn("HydroRippleEffect: Invalid prop values provided");
    return null;
  }

  useEffect(() => {
    let mounted = true;
    const cleanupInterval = setInterval(() => {
      if (mounted) {
        setRipples((prevRipples) =>
          prevRipples.filter((ripple) => Date.now() - ripple.id < duration),
        );
      }
    }, duration / 2);

    return () => {
      mounted = false;
      clearInterval(cleanupInterval);
    };
  }, [duration]);

  const rippleStyles = useMemo(
    () =>
      ({
        "--ripple-color": color,
        "--ripple-duration": `${duration}ms`,
        "--ripple-scale": scale,
      }) as React.CSSProperties,
    [color, duration, scale],
  );

  const createRipple = useMemo(
    () =>
      throttle((e: React.MouseEvent | React.KeyboardEvent) => {
        const target = e.currentTarget as HTMLDivElement;
        let x, y;

        if ("clientX" in e) {
          const rect = target.getBoundingClientRect();
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        } else {
          const rect = target.getBoundingClientRect();
          x = rect.width / 2;
          y = rect.height / 2;
        }

        setRipples((prevRipples) => {
          const newRipples = [...prevRipples, { x, y, id: Date.now() }];
          return newRipples.slice(-maxRipples);
        });
      }, 50),
    [maxRipples],
  );

  useEffect(() => {
    return () => {
      createRipple.cancel();
    };
  }, [createRipple]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      createRipple(e);
    }
  };

  return (
    <>
      <style>
        {`
          .hydro-ripple {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%) scale(0);
            background: var(--ripple-color);
            border: 1px solid var(--ripple-color);
            box-shadow: 
              0 0 0 2px var(--ripple-color),
              0 0 0 4px var(--ripple-color),
              0 0 0 6px var(--ripple-color);
            width: 100px;
            height: 100px;
          }

          .hydro-ripple-1 {
            animation: hydro-ripple-1 var(--ripple-duration) cubic-bezier(0.1, 0.7, 0.3, 1);
          }

          .hydro-ripple-2 {
            animation: hydro-ripple-2 calc(var(--ripple-duration) * 0.8) cubic-bezier(0.1, 0.7, 0.3, 1);
          }

          .hydro-ripple-3 {
            animation: hydro-ripple-3 calc(var(--ripple-duration) * 0.6) cubic-bezier(0.1, 0.7, 0.3, 1);
          }

          @keyframes hydro-ripple-1 {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 0.3;
              box-shadow: 
                0 0 0 2px var(--ripple-color),
                0 0 0 4px var(--ripple-color),
                0 0 0 6px var(--ripple-color);
            }
            30% {
              opacity: 0.2;
              transform: translate(-50%, -50%) scale(calc(var(--ripple-scale) * 0.5));
            }
            100% {
              transform: translate(-50%, -50%) scale(var(--ripple-scale));
              opacity: 0;
              box-shadow: 
                0 0 0 4px var(--ripple-color),
                0 0 0 8px var(--ripple-color),
                0 0 0 12px var(--ripple-color);
            }
          }

          @keyframes hydro-ripple-2 {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 0.2;
              box-shadow: 
                0 0 0 2px var(--ripple-color),
                0 0 0 4px var(--ripple-color),
                0 0 0 6px var(--ripple-color);
            }
            30% {
              opacity: 0.1;
              transform: translate(-50%, -50%) scale(calc(var(--ripple-scale) * 0.4));
            }
            100% {
              transform: translate(-50%, -50%) scale(calc(var(--ripple-scale) * 0.8));
              opacity: 0;
              box-shadow: 
                0 0 0 3px var(--ripple-color),
                0 0 0 6px var(--ripple-color),
                0 0 0 9px var(--ripple-color);
            }
          }

          @keyframes hydro-ripple-3 {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 0.1;
              box-shadow: 
                0 0 0 2px var(--ripple-color),
                0 0 0 4px var(--ripple-color),
                0 0 0 6px var(--ripple-color);
            }
            30% { 
              opacity: 0.05;
              transform: translate(-50%, -50%) scale(calc(var(--ripple-scale) * 0.3));
            }
            100% {
              transform: translate(-50%, -50%) scale(calc(var(--ripple-scale) * 0.6));
              opacity: 0;
              box-shadow: 
                0 0 0 2px var(--ripple-color),
                0 0 0 4px var(--ripple-color),
                0 0 0 6px var(--ripple-color);
            }
          }
        `}
      </style>
      <div
        onClick={createRipple}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Interactive ripple effect"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow,
          zIndex: 1,
          outline: "none",
          ...rippleStyles,
        }}
      >
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            style={{ position: "absolute", left: ripple.x, top: ripple.y }}
          >
            <div className="hydro-ripple hydro-ripple-1" />
            <div className="hydro-ripple hydro-ripple-2" />
            <div className="hydro-ripple hydro-ripple-3" />
          </div>
        ))}
      </div>
    </>
  );
};

// Runtime prop validation
HydroRippleEffect.propTypes = {
  color: PropTypes.string,
  duration: PropTypes.number,
  maxRipples: PropTypes.number,
  scale: PropTypes.number,
  overflow: PropTypes.oneOf(["hidden", "visible"]),
};

export default HydroRippleEffect;
