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

const liftMotion = {
  duration: '1.8s',
  keyTimes: '0;0.45;0.65;1',
  keySplines: '0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1',
};

const liftTransforms = {
  bench: ['0 16', '0 -26'],
  deadlift: ['0 0', '0 -88'],
  squat: ['0 46', '0 0'],
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

      <BenchPressArms />

      <Barbell x1={184} x2={576} y={210} plates={plates} lift="bench">
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
        <DeadliftBody />
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
        <SquatBody />
      </g>

      <g className="squat-grip-overlay">
        <LiftTransform lift="squat" />
        <path className="squat-arm" d="M336 232 C318 224 305 214 292 206" />
        <path className="squat-arm" d="M424 232 C442 224 455 214 468 206" />
        <GripHands points={[292, 468]} y={206} />
      </g>
    </>
  );
}

function MotionPath({ className, poses }) {
  return (
    <path className={className} d={poses[0]}>
      <animate
        className="lift-motion"
        attributeName="d"
        dur={liftMotion.duration}
        repeatCount="indefinite"
        keyTimes={liftMotion.keyTimes}
        values={`${poses[0]};${poses[1]};${poses[1]};${poses[0]}`}
        calcMode="spline"
        keySplines={liftMotion.keySplines}
      />
    </path>
  );
}

function LiftTransform({ lift }) {
  const [bottom, top] = liftTransforms[lift] ?? liftTransforms.bench;

  return (
    <animateTransform
      className="lift-motion"
      attributeName="transform"
      type="translate"
      dur={liftMotion.duration}
      repeatCount="indefinite"
      keyTimes={liftMotion.keyTimes}
      values={`${bottom};${top};${top};${bottom}`}
      calcMode="spline"
      keySplines={liftMotion.keySplines}
    />
  );
}

function BenchPressArms() {
  return (
    <g className="bench-arm-rig">
      <MotionPath
        className="upper-arm"
        poses={[
          'M326 286 C316 277 308 262 300 247',
          'M326 286 C326 268 327 244 329 224',
        ]}
      />
      <MotionPath
        className="forearm"
        poses={[
          'M300 247 C312 239 323 232 332 226',
          'M329 224 C330 210 331 196 332 184',
        ]}
      />
      <MotionPath
        className="upper-arm"
        poses={[
          'M434 286 C444 277 452 262 460 247',
          'M434 286 C434 268 433 244 431 224',
        ]}
      />
      <MotionPath
        className="forearm"
        poses={[
          'M460 247 C448 239 437 232 428 226',
          'M431 224 C430 210 429 196 428 184',
        ]}
      />
      <MotionPath
        className="elbow-joint"
        poses={[
          'M300 247 C300 247 300 247 300 247',
          'M329 224 C329 224 329 224 329 224',
        ]}
      />
      <MotionPath
        className="elbow-joint"
        poses={[
          'M460 247 C460 247 460 247 460 247',
          'M431 224 C431 224 431 224 431 224',
        ]}
      />
    </g>
  );
}

function DeadliftBody() {
  return (
    <>
      <MotionPath
        className="leg shin"
        poses={[
          'M348 314 C342 336 337 358 333 378',
          'M350 276 C343 308 337 348 333 378',
        ]}
      />
      <MotionPath
        className="leg thigh"
        poses={[
          'M374 294 C364 300 355 307 348 314',
          'M372 252 C363 260 355 268 350 276',
        ]}
      />
      <MotionPath
        className="leg shin"
        poses={[
          'M412 314 C418 336 423 358 427 378',
          'M410 276 C417 308 423 348 427 378',
        ]}
      />
      <MotionPath
        className="leg thigh"
        poses={[
          'M386 294 C396 300 405 307 412 314',
          'M388 252 C397 260 405 268 410 276',
        ]}
      />
      <MotionPath
        className="shorts"
        poses={[
          'M336 284 C354 266 406 266 424 284 L410 314 C392 324 368 324 350 314 Z',
          'M342 242 C360 228 400 228 418 242 L405 278 C390 286 370 286 355 278 Z',
        ]}
      />
      <MotionPath
        className="torso deadlift-torso"
        poses={[
          'M318 276 C344 218 386 190 428 198 C438 228 425 270 400 294 C369 302 342 294 318 276 Z',
          'M344 240 C348 188 368 154 398 150 C426 164 434 204 418 242 C394 254 366 252 344 240 Z',
        ]}
      />
      <MotionPath
        className="deadlift-arm upper-arm"
        poses={[
          'M340 250 C340 266 340 282 340 298',
          'M340 196 C340 210 340 224 340 238',
        ]}
      />
      <MotionPath
        className="deadlift-arm forearm"
        poses={[
          'M340 298 C340 312 340 325 340 336',
          'M340 238 C340 242 340 246 340 248',
        ]}
      />
      <MotionPath
        className="deadlift-arm upper-arm"
        poses={[
          'M420 250 C420 266 420 282 420 298',
          'M420 196 C420 210 420 224 420 238',
        ]}
      />
      <MotionPath
        className="deadlift-arm forearm"
        poses={[
          'M420 298 C420 312 420 325 420 336',
          'M420 238 C420 242 420 246 420 248',
        ]}
      />
      <circle className="head deadlift-head" cx="426" cy="174" r="25">
        <animate
          className="lift-motion"
          attributeName="cx"
          dur={liftMotion.duration}
          repeatCount="indefinite"
          keyTimes={liftMotion.keyTimes}
          values="426;398;398;426"
          calcMode="spline"
          keySplines={liftMotion.keySplines}
        />
        <animate
          className="lift-motion"
          attributeName="cy"
          dur={liftMotion.duration}
          repeatCount="indefinite"
          keyTimes={liftMotion.keyTimes}
          values="174;124;124;174"
          calcMode="spline"
          keySplines={liftMotion.keySplines}
        />
      </circle>
      <MotionPath
        className="hair-front"
        poses={[
          'M401 172 C406 150 427 141 450 152 C462 159 466 172 460 184 C441 174 422 171 401 172 Z',
          'M373 122 C378 100 399 91 422 102 C434 109 438 122 432 134 C413 124 394 121 373 122 Z',
        ]}
      />
    </>
  );
}

function SquatBody() {
  return (
    <>
      <MotionPath
        className="leg shin"
        poses={[
          'M324 338 C328 354 330 369 332 382',
          'M350 294 C343 324 337 354 332 382',
        ]}
      />
      <MotionPath
        className="leg thigh"
        poses={[
          'M358 316 C346 322 334 330 324 338',
          'M360 264 C356 274 353 284 350 294',
        ]}
      />
      <MotionPath
        className="leg shin"
        poses={[
          'M436 338 C432 354 430 369 428 382',
          'M410 294 C417 324 423 354 428 382',
        ]}
      />
      <MotionPath
        className="leg thigh"
        poses={[
          'M402 316 C414 322 426 330 436 338',
          'M400 264 C404 274 407 284 410 294',
        ]}
      />
      <MotionPath
        className="shorts"
        poses={[
          'M338 306 C358 292 402 292 422 306 L408 336 C392 346 368 346 352 336 Z',
          'M338 262 C358 248 402 248 422 262 L408 306 C392 316 368 316 352 306 Z',
        ]}
      />
      <MotionPath
        className="torso squat-torso"
        poses={[
          'M332 306 C340 260 358 230 390 226 C418 238 432 270 428 312 C407 332 352 330 332 306 Z',
          'M334 264 C338 218 352 190 380 184 C408 190 422 218 426 264 C407 286 353 286 334 264 Z',
        ]}
      />
      <circle className="head" cx="390" cy="196" r="27">
        <animate
          className="lift-motion"
          attributeName="cx"
          dur={liftMotion.duration}
          repeatCount="indefinite"
          keyTimes={liftMotion.keyTimes}
          values="390;380;380;390"
          calcMode="spline"
          keySplines={liftMotion.keySplines}
        />
        <animate
          className="lift-motion"
          attributeName="cy"
          dur={liftMotion.duration}
          repeatCount="indefinite"
          keyTimes={liftMotion.keyTimes}
          values="196;154;154;196"
          calcMode="spline"
          keySplines={liftMotion.keySplines}
        />
      </circle>
      <MotionPath
        className="hair-front"
        poses={[
          'M364 192 C369 168 390 158 414 170 C428 177 433 192 425 205 C404 195 384 192 364 192 Z',
          'M354 150 C359 126 380 116 404 128 C418 135 423 150 415 163 C394 153 374 150 354 150 Z',
        ]}
      />
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
      <LiftTransform lift={lift} />
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
