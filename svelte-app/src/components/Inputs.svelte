<script>
  import { colorCategories } from '../inputs/colorCategories';
  import { textInput, colorInput } from '../stores/inputs';

  function handleColorClick(id) {
    colorInput.set(id);
  }
</script>

<div class="inputs">
  <div class="text-input">
    <label for="user-text"><span class="bullet-number">1</span>Type a URL or any other text here</label>
    <input
      id="user-text"
      type="text"
      placeholder="Your text"
      bind:value={$textInput}
    />
  </div>
  <div class="color-input">
    <label for="user-color"><span class="bullet-number">2</span>Select a color scheme</label>
    <ul class="color-categories">
      {#each colorCategories as cat (cat.id)}
        <li
          class:selected={$colorInput && $colorInput === cat.id}
          on:click={() => handleColorClick(cat.id)}
        >
          {cat.name}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .inputs {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 1rem 0;
    font-family: var(--font2);
  }

  .inputs > * {
    margin: 0.7rem 0;
  }

  .text-input, .color-input {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  label {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }

  .bullet-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.4rem;
    color: var(--white);
    text-align: center;
    background-color: var(--blue);
    border: none;
    border-radius: 50%;
  }

  .text-input input {
    max-width: 300px;
    height: 1.5rem;
    padding: 0.2rem 0.5rem;
    color: var(--blue);
    font-family: var(--font2);
    font-size: 1.2rem;
    outline: none;
    border: 2px solid var(--blue);
    border-radius: 3px;
    transition: border-color 0.2s;
  }

  .text-input input:active, .text-input input:focus {
    border-color: var(--red);
  }

  ul.color-categories {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    list-style: none;
  }

  @media (min-width: 600px) {
    ul.color-categories {
      flex-direction: row;
    }
  }

  ul.color-categories li {
    margin: 0.2rem 0.7rem;
    padding: 0.1rem 0.3rem;
    font-size: 1rem;
    border: 2px solid var(--blue);
    border-radius: 3px;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  ul.color-categories li:not(.selected):hover {
    border-color: var(--red);
  }

  ul.color-categories li.selected {
    color: var(--white);
    background-color: var(--blue);
  }
</style>
