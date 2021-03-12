<script>
  import { onMount } from 'svelte';
  import { loadData } from './utils/load';
  import { css } from './actions/css';
  import styles from './inputs/styles';

  import Title from './components/Title.svelte';
  import Inputs from './components/Inputs.svelte';
  import QRCode from './components/QRCode.svelte';

  const dataPath = 'data/Allsvenskan_All_time_stats.csv';

  let data;

  onMount(async () => {
    data = await loadData(dataPath);
    console.log(data)
  });
</script>

<div
  class="app-wrapper"
  use:css={styles}
>
  <Title />
  <Inputs />
  <QRCode data={data} />
</div>

<style>
  .app-wrapper {
    width: 100%;
    min-height: 100%;
    padding: 1rem 0;
    background: linear-gradient(to bottom, var(--white), var(--tint));
    overflow: hidden;
  } 
</style>
