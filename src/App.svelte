<script>
  import { onMount } from 'svelte';
  import { loadData } from './utils/load';
  import { css } from './actions/css';
  import styles from './inputs/styles';

  import Title from './components/Title.svelte';
  import Inputs from './components/Inputs.svelte';
  import QRCode from './components/QRCode.svelte';
  import Legend from './components/Legend.svelte';
  import Footer from './components/Footer.svelte';

  const dataPath = 'data/Allsvenskan_All_time_stats.csv';

  let data;

  onMount(async () => {
    data = await loadData(dataPath);
  });
</script>

<div
  class="app-wrapper"
  use:css={styles}
>
  <Title />
  <Inputs />
  <QRCode data={data} />
  <Legend data={data} />
  <Footer />
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
