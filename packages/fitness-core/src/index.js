export const STANDARD_BAR_WEIGHT = 45;

export const PLATE_OPTIONS = [45, 25, 10, 5, 2.5];

export const LIFTS = {
  bench: {
    name: 'Bench Press',
    cue: 'Shoulder blades tucked. Feet planted. Smooth press.',
  },
  deadlift: {
    name: 'Deadlift',
    cue: 'Brace, wedge, push the floor away.',
  },
  squat: {
    name: 'Back Squat',
    cue: 'Big breath, knees track, stand tall.',
  },
};

export function calculatePlateLoad(totalWeight, barWeight = STANDARD_BAR_WEIGHT) {
  const normalizedWeight = Number(totalWeight);

  if (!Number.isFinite(normalizedWeight)) {
    return invalidResult(totalWeight, 'Enter a numeric weight.');
  }

  if (normalizedWeight < barWeight) {
    return invalidResult(normalizedWeight, `Minimum load is the ${barWeight} lb bar.`);
  }

  const loadAcrossBothSides = normalizedWeight - barWeight;
  const sideLoad = loadAcrossBothSides / 2;
  const isPossibleWithSmallestPlates = isWholePlateIncrement(sideLoad);

  if (!isPossibleWithSmallestPlates) {
    return {
      barWeight,
      totalWeight: normalizedWeight,
      platesPerSide: [],
      isLoadable: false,
      remainderPerSide: roundToNearestHalf(sideLoad % 2.5),
      message: `With 2.5 lb plates, each side must be a multiple of 2.5 lb.`,
    };
  }

  let remainingPerSide = (normalizedWeight - barWeight) / 2;
  const platesPerSide = [];

  for (const plate of PLATE_OPTIONS) {
    while (remainingPerSide + 0.001 >= plate) {
      platesPerSide.push(plate);
      remainingPerSide = roundToNearestHalf(remainingPerSide - plate);
    }
  }

  const isLoadable = Math.abs(remainingPerSide) < 0.001;

  return {
    barWeight,
    totalWeight: normalizedWeight,
    platesPerSide,
    isLoadable,
    remainderPerSide: roundToNearestHalf(remainingPerSide),
    message: isLoadable
      ? 'Loadable with standard plates.'
      : `Needs ${roundToNearestHalf(remainingPerSide)} lb more per side.`,
  };
}

function invalidResult(totalWeight, message) {
  return {
    barWeight: STANDARD_BAR_WEIGHT,
    totalWeight,
    platesPerSide: [],
    isLoadable: false,
    remainderPerSide: 0,
    message,
  };
}

function roundToNearestHalf(value) {
  return Math.round(value * 2) / 2;
}

function isWholePlateIncrement(sideLoad) {
  return Math.abs(sideLoad / 2.5 - Math.round(sideLoad / 2.5)) < 0.001;
}
