import { useMemo, useState } from 'react';
import { LiftVisualizer } from '@tientnc/lift-viz';
import { LIFTS, calculatePlateLoad } from '@tientnc/fitness-core';
import './App.css';

const liftOptions = [
  { id: 'bench', label: 'Bench Press', defaultWeight: 225 },
  { id: 'deadlift', label: 'Deadlift', defaultWeight: 315 },
  { id: 'squat', label: 'Back Squat', defaultWeight: 275 },
];

function App() {
  const [activeLift, setActiveLift] = useState('bench');
  const [targetWeight, setTargetWeight] = useState(225);

  const plateLoad = useMemo(
    () => calculatePlateLoad(Number(targetWeight) || 0),
    [targetWeight],
  );

  const liftCopy = LIFTS[activeLift];

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">RepRunner</p>
        <h1>Log the lift. Chase the route.</h1>
        <p>
          A fitness side quest for playful lifting visuals, workout tracking,
          running routes, and plans that eventually learn your rhythm.
        </p>
      </section>

      <section className="quest-card" aria-labelledby="lift-lab-title">
        <div className="quest-copy">
          <p className="eyebrow">Side Quest 001</p>
          <h2 id="lift-lab-title">Barbell visualizer</h2>
          <p>
            Pick a lift, enter a target weight, and RepRunner calculates the
            plates per side. The animation layer is intentionally reusable so
            your portfolio can import this later without carrying the whole app.
          </p>

          <div className="lift-tabs" role="tablist" aria-label="Lift type">
            {liftOptions.map((lift) => (
              <button
                key={lift.id}
                type="button"
                role="tab"
                aria-selected={activeLift === lift.id}
                className={activeLift === lift.id ? 'active' : ''}
                onClick={() => {
                  setActiveLift(lift.id);
                  setTargetWeight(lift.defaultWeight);
                }}
              >
                {lift.label}
              </button>
            ))}
          </div>

          <label className="weight-input">
            Target weight
            <span>
              <input
                type="number"
                min="45"
                step="5"
                value={targetWeight}
                onChange={(event) => setTargetWeight(event.target.value)}
              />
              lb
            </span>
          </label>

          <div className="plate-summary">
            <strong>{plateLoad.totalWeight} lb</strong>
            <span>
              {plateLoad.isLoadable
                ? `${plateLoad.platesPerSide.length ? plateLoad.platesPerSide.join(' / ') : 'empty bar'} per side`
                : plateLoad.message}
            </span>
          </div>
        </div>

        <LiftVisualizer lift={activeLift} targetWeight={Number(targetWeight) || 0} />
      </section>

      <section className="roadmap">
        <h2>Where this grows</h2>
        <div className="roadmap-grid">
          <article>
            <h3>Training log</h3>
            <p>Exercises, sets, reps, weights, notes, and PR history by date.</p>
          </article>
          <article>
            <h3>Running routes</h3>
            <p>Distance goals, route ideas, pace notes, and map-backed runs.</p>
          </article>
          <article>
            <h3>Plans</h3>
            <p>Weekly lift/run structure that adapts as your goals change.</p>
          </article>
        </div>
      </section>

      <footer>
        <span>{liftCopy.name}</span>
        <span>{liftCopy.cue}</span>
      </footer>
    </main>
  );
}

export default App;
