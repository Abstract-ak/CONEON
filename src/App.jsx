import React, { useState, useRef } from "react";
import "./App.css"; // for optional styling

const App = () => {
  const [position, setPosition] = useState(0); // Start at index 0
  const ballRef = useRef();
  const prevPosition = useRef(position);

  const SEMICIRCLE_RADIUS = 120; // px
  const NUM_POINTS = 3;
  const CENTER_X = 150; // half of SVG width
  const CENTER_Y = 140; // bottom of SVG

  // Calculate positions along a semicircle
  const getPointCoords = (idx) => {
    const angle = Math.PI * (idx / (NUM_POINTS - 1)); // 0 to PI
    return {
      x: CENTER_X + SEMICIRCLE_RADIUS * Math.cos(angle - Math.PI),
      y: CENTER_Y + SEMICIRCLE_RADIUS * Math.sin(angle - Math.PI),
    };
  };

  // Animate the ball along the arc
  React.useEffect(() => {
    if (prevPosition.current === position) return;
    const steps = 20;
    let step = 0;

    const animate = () => {
      step++;
      const t = step / steps;
      // Interpolate angle
      const fromAngle = Math.PI * (prevPosition.current / (NUM_POINTS - 1));
      const toAngle = Math.PI * (position / (NUM_POINTS - 1));
      const angle = fromAngle + (toAngle - fromAngle) * t;
      const x = CENTER_X + SEMICIRCLE_RADIUS * Math.cos(angle - Math.PI);
      const y = CENTER_Y + SEMICIRCLE_RADIUS * Math.sin(angle - Math.PI) + 8;
      if (ballRef.current) {
        ballRef.current.setAttribute("x", x);
        ballRef.current.setAttribute("y", y);
      }
      if (step < steps) {
        requestAnimationFrame(animate);
      } else {
        prevPosition.current = position;
      }
    };
    animate();
  }, [position]);

  return (
    <div className="container">
      <h2>Semi-Circle Ball Movement</h2>

      <svg
        width={CENTER_X * 2 + 60} // wider SVG
        height={CENTER_Y + 80} // taller SVG
        style={{ display: "block", margin: "0 auto" }}
      >
        {/* Draw vertical line at 0th index */}
        {(() => {
          const { x, y } = getPointCoords(0);
          return (
            <>
              {/* Wall to the left of the vertical line */}
              <rect
                x={x - 38}
                y={y - 100}
                width={20}
                height={200}
                fill="#bdbdbd"
                stroke="#888"
                strokeWidth="2"
                rx={6}
                opacity={0.7}
              />
              {/* Vertical line closer to 0th index */}
              <line
                x1={x - 18}
                y1={y - 100}
                x2={x - 18}
                y2={y + 100}
                stroke="#1976d2"
                strokeWidth="4"
                strokeDasharray="10,6"
              />
              {/* Horizontal line from 0th index */}
              <line
                x1={x - 18}
                y1={y}
                x2={x + 18}
                y2={y}
                stroke="#1976d2"
                strokeWidth="4"
                strokeDasharray="10,6"
              />
            </>
          );
        })()}
        {/* Draw semicircle */}
        <path
          d={`M${getPointCoords(0).x},${
            getPointCoords(0).y
          } A${SEMICIRCLE_RADIUS},${SEMICIRCLE_RADIUS} 0 0,1 ${
            getPointCoords(NUM_POINTS - 1).x
          },${getPointCoords(NUM_POINTS - 1).y}`}
          fill="none"
          stroke="#888"
          strokeWidth="4"
        />
        {/* Draw points */}
        {[...Array(NUM_POINTS)].map((_, idx) => {
          const { x, y } = getPointCoords(idx);
          return (
            <g
              key={idx}
              onClick={() => setPosition(idx)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={x}
                cy={y}
                r={18}
                fill="#ddd"
                stroke="#444"
                strokeWidth="2"
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontSize="13"
                fontWeight="bold"
              >
                {idx}
              </text>
            </g>
          );
        })}
        {/* Draw ball */}
        {(() => {
          const { x, y } = getPointCoords(prevPosition.current);
          return (
            <text
              ref={ballRef}
              x={x}
              y={y + 8} // visually center emoji
              fontSize="32"
              textAnchor="middle"
              alignmentBaseline="middle"
              style={{ pointerEvents: "none" }}
            >
              ⚽
            </text>
          );
        })()}
      </svg>

      <button
        style={{
          // marginBottom: 20,
          padding: "8px 20px",
          fontSize: "1rem",
          cursor: "pointer",
          borderRadius: 6,
          border: "1px solid #1976d2",
          background: "#e3f2fd",
          color: "#1976d2",
          fontWeight: 600,
        }}
        onClick={() => setPosition(0)}
      >
        Reset
      </button>
    </div>
  );
};

export default App;
