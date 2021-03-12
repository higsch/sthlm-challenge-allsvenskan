<script>
  import { fade } from 'svelte/transition';
  import { textInput, colorInput } from '../stores/inputs';
  import { css } from '../actions/css';
  import { generateQR } from '../utils/qr';
  import { shuffle } from '../utils/math';
  import { descending } from 'd3';

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
  let canvas = null;

  function handleDownloadClick() {
    if (!canvas) return;
    
    const lnk = document.createElement('a');

    lnk.download = 'qr_code.png';
    lnk.href = canvas.toDataURL("image/png;base64");

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

      lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
      lnk.fireEvent('onclick');
    }
  }

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
        const dotCountedData = data.sort((a, b) => descending(a[$colorInput], b[$colorInput])).map(d => {
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
        pixelRatio="2"
        bind:canvas={canvas}
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
  {#if (qr && $colorInput)}
    <div
      class="qr-code-controls"
      transition:fade={{duration: 200}}
    >
      <div class="darken">
        <input id="darken-input" type="checkbox" bind:checked={darken} />
        <label for="darken-input">Darken colors</label>
      </div>
      <div class="randomize">
        <input id="randomize-input" type="checkbox" bind:checked={randomize} />
        <label for="randomize-input">Shuffle squares</label>
      </div>
    </div>
  {/if}
  <div class="qr-code-download">
    <p>
      <span class="bullet-number">3</span>
      <a
        href="/"
        download="qr_code.png"
        on:click|preventDefault={handleDownloadClick}>
          Download
      </a>
      your QR code.
    </p>
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

  .qr-code-download {
    display: flex;
    justify-content: center;
    margin: 0.7rem 0;
    font-family: var(--font2);
    font-size: 1.2rem;
  }

  .qr-code-download p {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
