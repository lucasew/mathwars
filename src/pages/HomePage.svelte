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
        height: 10px;
        width: 100%;
        border: 1px solid white;
    }
</style>

<main>
    <section>
        <img src="/mathwars.png">
        <p>master of numbers</p>
        <center>
            <Spinner />
        </center>
        <div class="progress-bar-container">
            <ProgressBar progress="10" />
        </div>
    </section>
</main>
