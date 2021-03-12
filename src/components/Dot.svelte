<script>
  import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { interpolate } from 'd3';
  import { cubicOut } from 'svelte/easing';
  import chroma from 'chroma-js';

  export let x;
  export let y;
  export let r;
  export let colors = ['#000000'];
  export let darken = false;

  const { register, deregister, invalidate } = getContext('canvas');
  const duration = 400;

  const colorsTw = tweened(null, {
    duration,
    easing: cubicOut,
    interpolate
  });
  
  function draw(ctx) {
    const numColors = $colorsTw.length;
    const startY = x - r;
    const width = 2 * r;

    for (let i = 0; i < numColors; i++) {
      ctx.beginPath();
      ctx.rect(startY + i * width / numColors, y - r, width / numColors, width);
      ctx.fillStyle = $colorsTw[i];
      ctx.fill();
    }
  }

  onMount(() => {
    invalidate();
    register(draw);

    return () => {
      deregister(draw);
    };
  });

	afterUpdate(invalidate);

	onDestroy(invalidate);

  $: colorsTw.set(darken ? colors.map(c => chroma(c).darken().hex()) : colors);
</script>
