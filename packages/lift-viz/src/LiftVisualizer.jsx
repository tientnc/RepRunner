import { calculatePlateLoad, LIFTS } from '@reprunner/fitness-core';
import './LiftVisualizer.css';

const plateColors = {
  45: '#293241',
  25: '#ee6c4d',
  10: '#98c1d9',
  5: '#e0fbfc',
  2.5: '#f2cc8f',
};

const plateLabels = {
  45: '45',
  25: '25',
  10: '10',
  5: '5',
  2.5: '2.5',
};

export function LiftVisualizer({ lift = 'bench', targetWeight = 225 }) {
  const plateLoad = calculatePlateLoad(targetWeight);
  const liftInfo = LIFTS[lift] ?? LIFTS.bench;
  const plates = plateLoad.platesPerSide;

  return (
    <figure className={`lift-visualizer lift-${lift}`} aria-label={`${liftInfo.name} visualization`}>
      <svg viewBox="0 0 760 480" role="img">
        <title>{`${liftInfo.name} at ${targetWeight} pounds`}</title>

        <defs>
          <linearGradient id="floorGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f8efe0" />
            <stop offset="100%" stopColor="#dbe5ec" />
          </linearGradient>
          <linearGradient id="skinGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffd7b1" />
            <stop offset="100%" stopColor="#f2a36d" />
          </linearGradient>
          <linearGradient id="shirtGradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#456d9d" />
            <stop offset="100%" stopColor="#243b61" />
          </linearGradient>
        </defs>

        <rect x="24" y="24" width="712" height="432" rx="34" fill="url(#floorGradient)" />
        <path className="viz-grid" d="M90 385 H670 M120 330 H640 M155 275 H605" />

        {lift === 'bench' && <BenchScene plates={plates} />}
        {lift === 'deadlift' && <DeadliftScene plates={plates} />}
        {lift === 'squat' && <SquatScene plates={plates} />}
      </svg>

      <figcaption>
        <strong>{liftInfo.name}</strong>
        <span>
          {plateLoad.isLoadable
            ? `${targetWeight} lb: ${plates.length ? plates.join(' / ') : 'empty bar'} per side`
            : plateLoad.message}
        </span>
      </figcaption>
    </figure>
  );
}

function BenchScene({ plates }) {
  return (
    <>
      <Rack xLeft={116} xRight={626} top={128} bottom={372} hookY={198} />

      <rect className="bench-pad bench-pad-top" x="303" y="240" width="154" height="146" rx="46" />
      <rect className="bench-leg" x="334" y="370" width="16" height="34" rx="8" />
      <rect className="bench-leg" x="410" y="370" width="16" height="34" rx="8" />

      <g className="bench-athlete">
        <ellipse className="body-shadow" cx="380" cy="314" rx="80" ry="58" />
        <path className="bench-torso" d="M318 315 C326 264 354 236 380 236 C406 236 434 264 442 315 C423 343 337 343 318 315 Z" />
        <path className="bench-shoulders" d="M314 286 C345 254 415 254 446 286" />
        <ellipse className="back-head" cx="380" cy="246" rx="30" ry="26" />
        <path className="top-hair" d="M350 244 C354 220 373 212 397 220 C412 226 417 239 410 254 C392 242 371 241 350 244 Z" />
      </g>

      <Barbell x1={184} x2={576} y={210} plates={plates} lift="bench">
        <g className="bench-forearms">
          <path d="M338 262 C336 244 334 226 332 210" />
          <path d="M422 262 C424 244 426 226 428 210" />
        </g>
        <GripHands points={[332, 428]} y={210} />
      </Barbell>
    </>
  );
}

function DeadliftScene({ plates }) {
  return (
    <>
      <ellipse className="platform-shadow" cx="380" cy="382" rx="250" ry="20" />

      <g className="deadlift-athlete">
        <ellipse className="shoe" cx="333" cy="383" rx="32" ry="11" />
        <ellipse className="shoe" cx="427" cy="383" rx="32" ry="11" />
        <path className="leg" d="M356 294 C348 322 340 352 333 378" />
        <path className="leg" d="M404 294 C412 322 420 352 427 378" />
        <path className="shorts" d="M336 284 C354 266 406 266 424 284 L410 314 C392 324 368 324 350 314 Z" />
        <path className="torso deadlift-torso" d="M318 276 C344 218 386 190 428 198 C438 228 425 270 400 294 C369 302 342 294 318 276 Z" />
        <circle className="head deadlift-head" cx="426" cy="174" r="25" />
        <path className="hair-front" d="M401 172 C406 150 427 141 450 152 C462 159 466 172 460 184 C441 174 422 171 401 172 Z" />
        <path className="deadlift-arm" d="M343 250 C335 278 335 308 340 336" />
        <path className="deadlift-arm" d="M413 250 C425 278 425 308 420 336" />
      </g>

      <Barbell x1={184} x2={576} y={336} plates={plates} lift="deadlift">
        <GripHands points={[340, 420]} y={336} />
      </Barbell>
    </>
  );
}

function SquatScene({ plates }) {
  return (
    <>
      <Rack xLeft={150} xRight={592} top={118} bottom={380} hookY={206} />

      <Barbell x1={190} x2={570} y={206} plates={plates} lift="squat" />

      <g className="squat-athlete">
        <ellipse className="shoe" cx="332" cy="386" rx="34" ry="12" />
        <ellipse className="shoe" cx="428" cy="386" rx="34" ry="12" />
        <path className="leg" d="M356 282 C348 322 340 354 332 382" />
        <path className="leg" d="M404 282 C412 322 420 354 428 382" />
        <path className="shorts" d="M338 262 C358 248 402 248 422 262 L408 306 C392 316 368 316 352 306 Z" />
        <path className="torso" d="M334 264 C338 218 352 190 380 184 C408 190 422 218 426 264 C407 286 353 286 334 264 Z" />
        <circle className="head" cx="380" cy="154" r="27" />
        <path className="hair-front" d="M354 150 C359 126 380 116 404 128 C418 135 423 150 415 163 C394 153 374 150 354 150 Z" />
      </g>

      <g className="squat-grip-overlay">
        <path className="squat-arm" d="M336 232 C318 224 305 214 292 206" />
        <path className="squat-arm" d="M424 232 C442 224 455 214 468 206" />
        <GripHands points={[292, 468]} y={206} />
      </g>
    </>
  );
}

function Rack({ xLeft, xRight, top, bottom, hookY }) {
  const height = bottom - top;

  return (
    <g className="rack-system">
      <rect className="rack" x={xLeft} y={top} width="18" height={height} rx="9" />
      <rect className="rack" x={xRight} y={top} width="18" height={height} rx="9" />
      <rect className="rack-foot" x={xLeft - 30} y={bottom - 6} width="78" height="14" rx="7" />
      <rect className="rack-foot" x={xRight - 30} y={bottom - 6} width="78" height="14" rx="7" />
      <rect className="rack-hook" x={xLeft} y={hookY} width="50" height="12" rx="6" />
      <rect className="rack-hook" x={xRight - 32} y={hookY} width="50" height="12" rx="6" />
    </g>
  );
}

function Barbell({ x1, x2, y, plates, lift, children }) {
  const gripLeft = Number(x1);
  const gripRight = Number(x2);
  const barY = Number(y);
  const plateLayouts = plates.map((plate) => ({
    plate,
    width: plate >= 45 ? 20 : plate >= 25 ? 16 : plate >= 10 ? 12 : 9,
    height: 78 + plate * 0.82,
  }));
  const stackWidth = plateLayouts.reduce((total, layout) => total + layout.width + 4, 0);
  const collarWidth = 11;
  const sleevePadding = 20;
  const leftSleeveEnd = gripLeft - collarWidth - stackWidth - sleevePadding;
  const rightSleeveEnd = gripRight + collarWidth + stackWidth + sleevePadding;

  return (
    <g className={`barbell barbell-${lift}`}>
      <line className="bar-sleeve" x1={leftSleeveEnd} x2={gripLeft} y1={barY} y2={barY} />
      <line className="bar-sleeve" x1={gripRight} x2={rightSleeveEnd} y1={barY} y2={barY} />
      <line className="bar-shaft" x1={gripLeft} x2={gripRight} y1={barY} y2={barY} />
      {children}
      <rect className="bar-collar" x={gripLeft - collarWidth} y={barY - 24} width={collarWidth} height="48" rx="3" />
      <rect className="bar-collar" x={gripRight} y={barY - 24} width={collarWidth} height="48" rx="3" />

      {plateLayouts.map(({ plate, width, height }, index) => {
        const previousWidth = plateLayouts
          .slice(0, index)
          .reduce((total, layout) => total + layout.width + 4, 0);
        const leftPlateX = gripLeft - collarWidth - previousWidth - width;
        const rightPlateX = gripRight + collarWidth + previousWidth;
        const labelY = barY + 4;

        return (
          <g key={`plate-pair-${plate}-${index}`}>
            <g
              className="plate plate-left plate-load"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <rect
                x={leftPlateX}
                y={barY - height / 2}
                width={width}
                height={height}
                rx="5"
                fill={plateColors[plate]}
              />
              <text x={leftPlateX + width / 2} y={labelY} textAnchor="middle">
                {plateLabels[plate]}
              </text>
            </g>
            <g
              className="plate plate-right plate-load"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <rect
                x={rightPlateX}
                y={barY - height / 2}
                width={width}
                height={height}
                rx="5"
                fill={plateColors[plate]}
              />
              <text x={rightPlateX + width / 2} y={labelY} textAnchor="middle">
                {plateLabels[plate]}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}

function GripHands({ points, y }) {
  const barY = Number(y);

  return (
    <g className="grip-hands">
      {points.map((x) => (
        <ellipse key={x} cx={x} cy={barY} rx="16" ry="9" />
      ))}
    </g>
  );
}
