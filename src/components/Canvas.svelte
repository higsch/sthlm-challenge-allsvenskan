<script>
  import { onDestroy, setContext } from 'svelte';
  import { setupCanvas } from '../utils/canvas';
  
  export let width = 0;
  export let height = 0;
  export let pixelRatio = window.devicePixelRatio || 1;
  export let compositeType = '';
  export let canvas;

  const drawFunctions = [];
  const backgroundColor = '#FFFFFF';

  let ctx;
  let frameId;
  let pendingInvalidation = false;

  setContext('canvas', {
    register(fn) {
      drawFunctions.push(fn);
    },
    deregister(fn) {
      drawFunctions.splice(drawFunctions.indexOf(fn), 1);
    },
    invalidate() {
			if (pendingInvalidation) return;
			pendingInvalidation = true;
			frameId = requestAnimationFrame(update);
		}
  });

  function update() {
    if (!ctx) return;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawFunctions.forEach((fn) => {
      ctx.save();
      fn(ctx);
      ctx.restore();
    });
    pendingInvalidation = false;
  }

  onDestroy(() => {
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
  });

  $: ctx = setupCanvas(canvas, width, height, pixelRatio, compositeType, backgroundColor);
</script>

<canvas bind:this={canvas} />
<slot />
