# @tientnc/lift-viz

Animated React barbell lift visualizations from RepRunner. Plate layouts are calculated from the target weight.

## Install

```bash
npm install @tientnc/lift-viz
```

React 19 is required as a peer dependency.

## Use

```jsx
import { LiftVisualizer } from '@tientnc/lift-viz';

<LiftVisualizer lift="bench" targetWeight={225} />
```

Supported `lift` values are `bench`, `squat`, and `deadlift`. `targetWeight` is the total barbell weight in pounds.
