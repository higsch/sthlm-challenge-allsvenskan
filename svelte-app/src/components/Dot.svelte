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

  const color = tweened(null, {
    duration,
    easing: cubicOut,
    interpolate
  });
  
  function draw(ctx) {
    // ctx.beginPath();
    // ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    // ctx.fillStyle = $color;
    // ctx.fill();

    ctx.beginPath();
    ctx.rect(x - r, y - r, 2 * r, 2 * r);
    ctx.fillStyle = $color;
    ctx.fill();
    // ctx.strokeStyle = 'black';
    // ctx.lineWidth = 2;
    // ctx.stroke();
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

  $: color.set(darken ? chroma(colors[0]).darken().hex() : colors[0]);
</script>
