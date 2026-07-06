import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import sharp from 'sharp';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const lift = process.argv[2] ?? 'bench';
const targetWeight = Number(process.argv[3] ?? 225);

const server = await createServer({
  root: repoRoot,
  configFile: false,
  logLevel: 'silent',
  plugins: [react()],
  server: { middlewareMode: true },
});

try {
  const { LiftVisualizer } = await server.ssrLoadModule(
    '/packages/lift-viz/src/LiftVisualizer.jsx',
  );
  const markup = renderToStaticMarkup(
    React.createElement(LiftVisualizer, { lift, targetWeight }),
  );
  const css = await readFile(
    path.join(repoRoot, 'packages/lift-viz/src/LiftVisualizer.css'),
    'utf8',
  );
  const svgMatch = markup.match(/<svg[\s\S]*<\/svg>/);

  if (!svgMatch) {
    throw new Error('Could not find rendered SVG in LiftVisualizer markup.');
  }

  const svg = svgMatch[0].replace('>', `><style>${css}</style>`);
  const svgOutputPath = path.join(repoRoot, 'snapshots', `${lift}-${targetWeight}.svg`);
  const pngOutputPath = path.join(repoRoot, 'snapshots', `${lift}-${targetWeight}.png`);
  await writeFile(svgOutputPath, svg, 'utf8');
  await sharp(Buffer.from(svg)).resize(1200).png().toFile(pngOutputPath);
  console.log(pngOutputPath);
} finally {
  await server.close();
}
