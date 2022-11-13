<script lang="typescript">
    import Spinner from '../lib/Spinner.svelte'
    import ProgressBar from '../lib/ProgressBar.svelte'
</script>

<style>
    main {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }
    p {
        color: white;
        text-align: center;
        font: Cursive;
    }
    .progress-bar-container {
        height: 1rem;
        width: 100%;
        border: 1px solid white;
        box-sizing: border-box;
    }
    .mathwars-logo {
        max-width: 80vw;
    }
    .mathwars-button {
        background-color: white;
        width: 100%;
        border: 0;
        padding: 0.5rem 0;
        margin: 0.2rem 0;
        text-align: center;
        color: inherit;
        text-decoration: none;
        font-size: 1rem;
        vertical-align: middle;
        line-height: normal;
    }
    .mathwars-page-section {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>

<main>
    <section class="mathwars-page-section">
        <img class="mathwars-logo" src="/mathwars.png">
        <p>master of numbers</p>
        <button class="mathwars-button">Iniciar</button>
        <a href="/eoq" class="mathwars-button">Teste</a>
        <div class="progress-bar-container">
            <ProgressBar progress="10" />
        </div>
    </section>
</main>
