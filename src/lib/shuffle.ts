/**
 * Implements the Fisher-Yates (aka Knuth) Shuffle algorithm.
 *
 * This function performs an in-place shuffle of the provided array elements.
 * Commonly used to randomize the order of the alternative answers displayed
 * so the correct answer isn't always at the same index.
 *
 * @param array The array to shuffle. Warning: the original array is mutated.
 * @returns The mutated, shuffled array.
 */
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}