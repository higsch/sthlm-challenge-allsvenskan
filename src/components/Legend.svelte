<script>
  import { fade } from 'svelte/transition';
  import { colorInput } from '../stores/inputs';
  import { css } from '../actions/css';
  import { descending, format } from 'd3';

  export let data = [];

  const f = format(',');
</script>

{#if ($colorInput)}
  <div
    class="legend"
    transition:fade={{duration: 200}}
  >
    <div class="legend-content">
      <ul>
        {#each data.sort((a, b) => descending(a[$colorInput], b[$colorInput])) as d (d.rank)}
          <li>
            <span class="square">
              {#each d.colors as col}
                <span class="color" use:css={{color: col}}></span>
              {/each}
            </span>
            <span class="number">{f(d[$colorInput])}</span>
            <span class="club">{d.club}</span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if}

<style>
  .legend {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 1rem 0;
    padding: 1rem;
  }

  .legend-content {
    width: 100%;
    max-width: 345px;
  }

  ul {
    display: flex;
    flex-direction: column;
    max-height: 200px;
    font-family: var(--font2);
    font-size: 0.9rem;
    font-weight: 200;
    list-style: none;
    overflow-y: scroll;
  }

  li {
    display: flex;
    align-items: center;
    margin: 0.2rem 0;
  }

  li > * {
    margin: 0 0.25rem;
  }

  .square {
    display: flex;
    width: 1rem;
    min-width: 1rem;
    height: 1rem;
    max-height: 1rem;
    border: none;
  }
  
  .square .color {
    flex: 1;
    background-color: var(--color);
    border: none;
  }

  .square .color:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  
  .square .color:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  .number {
    display: inline-block;
    font-weight: 600;
    min-width: 2.5rem;
  }
</style>
