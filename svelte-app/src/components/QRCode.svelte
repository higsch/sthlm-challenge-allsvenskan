<script>
  import { textInput, colorInput } from '../stores/inputs';
  import { css } from '../actions/css';
  import { generateQR } from '../utils/qr';
  import { shuffle } from '../utils/math';

  import Canvas from './Canvas.svelte';
  import Dot from './Dot.svelte';

  export let data;

  const fixedSize = 345;
  const canvasMargin = 10;
  const dotsPerRow = 3;

  let width = 0;
  let qr = null;
  let dots = [];
  let darken = false;
  let randomize = false;

  $: canvasSize = Math.min(width - canvasMargin, fixedSize);

  $: {
    qr = generateQR($textInput);

    if (qr) {
      const { size: qrSize = 0, data: qrData } = qr || {};
      const rowSize = canvasSize / qrSize;
      const dotRadius = rowSize / dotsPerRow / 2;

      const rawDots = [];
      let dotCount = 0;

      for (let j = 0; j < qrSize; j++) {
        for (let i = 0; i < qrSize; i++) {
          if (qrData[i * qrSize + j]) {
            for (let k = 0; k < dotsPerRow; k++) {
              for (let l = 0; l < dotsPerRow; l++) {
                rawDots.push({
                  index: dotCount,
                  x: i * rowSize + dotRadius + dotRadius * k * 2,
                  y: j * rowSize + dotRadius + dotRadius * l * 2,
                  r: Math.ceil(dotRadius),
                  colors: ['#000000']
                });
                dotCount++;
              }
            }
          }
        }
      }

      if ($colorInput && data) {
        const totalValue = data.reduce((acc, cur) => acc + cur[$colorInput], 0);
        let previousNumDots = 0;
        const dotCountedData = data.map(d => {
          const numDotsStart = previousNumDots;
          const numDotsEnd = numDotsStart + Math.floor(dotCount * d[$colorInput] / totalValue) - 1;
          previousNumDots = numDotsEnd + 1;
          return {
            ...d,
            numDotsStart,
            numDotsEnd
          };
        });

        if (randomize) shuffle(rawDots);

        dots = rawDots.map((d, i) => {
          const club = dotCountedData.find(c => c.numDotsStart <= i && c.numDotsEnd >= i) || {colors: ['#AAAAAA']};
          return {
            ...d,
            ...club
          };
        });
      } else {
        dots = rawDots;
      }
    } else {
      dots = [];
    }
  }
</script>

<div class="qr-code-with-controls">
  <div
    class="qr-code-wrapper"
    bind:clientWidth={width}
    use:css={{width: `${Math.min(width, fixedSize + canvasMargin)}px`}}
  >
    <div class="qr-code">
      <Canvas
        width={canvasSize}
        height={canvasSize}
      >
        {#each dots as {index, x, y, r, colors} (index)}
          <Dot
            x={x}
            y={y}
            r={r}
            colors={colors}
            darken={darken}
          />
        {/each}
      </Canvas>
    </div>
  </div>
  <div class="qr-code-controls">
    <div class="darken">
      <input id="darken-input" type="checkbox" bind:checked={darken} />
      <label for="darken-input">Darken colors</label>
    </div>
    <div class="randomize">
      <input id="randomize-input" type="checkbox" bind:checked={randomize} />
      <label for="randomize-input">Shuffle squares</label>
    </div>
  </div>
</div>

<style>
  .qr-code-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .qr-code {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--width);
    border: 2px solid var(--blue);
    border-radius: 3px;
  }

  .qr-code-controls {
    display: flex;
    justify-content: center;
    font-family: var(--font2);
    font-size: 0.8rem;
  }

  .qr-code-controls > * {
    margin: 0 0.3rem;
  }
</style>
