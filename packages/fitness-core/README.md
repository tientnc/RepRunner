# @tientnc/fitness-core

Shared fitness calculations and lift metadata used by RepRunner.

## Install

```bash
npm install @tientnc/fitness-core
```

## Use

```js
import { calculatePlateLoad, LIFTS } from '@tientnc/fitness-core';

const load = calculatePlateLoad(225);
// load.platesPerSide is [45, 25, 10]
```

`calculatePlateLoad` assumes a 45 lb standard bar and 45, 25, 10, 5, and 2.5 lb plates.
