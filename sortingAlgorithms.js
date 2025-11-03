    let array = [];
    let sorting = false;
    let comparisons = 0;
    let swaps = 0;
    let startTime = 0;

    const algorithmComplexity = {
      bubble: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
      selection: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
      insertion: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
      merge: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
      quick: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
      heap: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' }
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function generateArray() {
      const size = parseInt(document.getElementById('arraySize').value);
      array = Array.from({ length: size }, () => Math.floor(Math.random() * 300) + 20);
      renderArray();
      resetStats();
    }

    function renderArray() {
      const container = document.getElementById('barContainer');
      container.innerHTML = '';
      array.forEach((value, idx) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value}px`;
        bar.id = `bar-${idx}`;
        container.appendChild(bar);
      });
    }

    function resetStats() {
      comparisons = 0;
      swaps = 0;
      document.getElementById('comparisons').textContent = '0';
      document.getElementById('swaps').textContent = '0';
      document.getElementById('timeElapsed').textContent = '0ms';
    }

    function updateStats() {
      document.getElementById('comparisons').textContent = comparisons;
      document.getElementById('swaps').textContent = swaps;
      const elapsed = Date.now() - startTime;
      document.getElementById('timeElapsed').textContent = `${elapsed}ms`;
    }

    async function highlightBars(indices, className) {
      indices.forEach(i => {
        const bar = document.getElementById(`bar-${i}`);
        if (bar) bar.classList.add(className);
      });
      await sleep(300);
      indices.forEach(i => {
        const bar = document.getElementById(`bar-${i}`);
        if (bar) bar.classList.remove(className);
      });
    }

    async function swap(i, j) {
      [array[i], array[j]] = [array[j], array[i]];
      swaps++;
      updateStats();
      await highlightBars([i, j], 'swapping');
      renderArray();
    }

    async function bubbleSort() {
      const n = array.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          comparisons++;
          updateStats();
          await highlightBars([j, j + 1], 'comparing');
          if (array[j] > array[j + 1]) {
            await swap(j, j + 1);
          }
        }
      }
    }

    async function selectionSort() {
      const n = array.length;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          comparisons++;
          updateStats();
          await highlightBars([j, minIdx], 'comparing');
          if (array[j] < array[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          await swap(i, minIdx);
        }
      }
    }

    async function insertionSort() {
      const n = array.length;
      for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
          comparisons++;
          updateStats();
          await highlightBars([j, j + 1], 'comparing');
          array[j + 1] = array[j];
          swaps++;
          updateStats();
          renderArray();
          j--;
          await sleep(300);
        }
        array[j + 1] = key;
        renderArray();
      }
    }

    async function mergeSort(start = 0, end = array.length - 1) {
      if (start >= end) return;
      
      const mid = Math.floor((start + end) / 2);
      await mergeSort(start, mid);
      await mergeSort(mid + 1, end);
      await merge(start, mid, end);
    }

    async function merge(start, mid, end) {
      const left = array.slice(start, mid + 1);
      const right = array.slice(mid + 1, end + 1);
      let i = 0, j = 0, k = start;

      while (i < left.length && j < right.length) {
        comparisons++;
        updateStats();
        await highlightBars([k], 'comparing');
        if (left[i] <= right[j]) {
          array[k] = left[i];
          i++;
        } else {
          array[k] = right[j];
          j++;
        }
        swaps++;
        updateStats();
        renderArray();
        await sleep(100);
        k++;
      }

      while (i < left.length) {
        array[k] = left[i];
        i++;
        k++;
        renderArray();
        await sleep(100);
      }

      while (j < right.length) {
        array[k] = right[j];
        j++;
        k++;
        renderArray();
        await sleep(100);
      }
    }

    async function quickSort(low = 0, high = array.length - 1) {
      if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
      }
    }

    async function partition(low, high) {
      const pivot = array[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisons++;
        updateStats();
        await highlightBars([j, high], 'comparing');
        if (array[j] < pivot) {
          i++;
          if (i !== j) {
            await swap(i, j);
          }
        }
      }
      if (i + 1 !== high) {
        await swap(i + 1, high);
      }
      return i + 1;
    }

    async function heapSort() {
      const n = array.length;

      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
      }

      for (let i = n - 1; i > 0; i--) {
        await swap(0, i);
        await heapify(i, 0);
      }
    }

    async function heapify(n, i) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n) {
        comparisons++;
        updateStats();
        await highlightBars([left, largest], 'comparing');
        if (array[left] > array[largest]) {
          largest = left;
        }
      }

      if (right < n) {
        comparisons++;
        updateStats();
        await highlightBars([right, largest], 'comparing');
        if (array[right] > array[largest]) {
          largest = right;
        }
      }

      if (largest !== i) {
        await swap(i, largest);
        await heapify(n, largest);
      }
    }

    async function startSorting() {
      if (sorting) return;
      sorting = true;
      startTime = Date.now();
      
      document.getElementById('sortBtn').disabled = true;
      document.getElementById('generateBtn').disabled = true;

      const algorithm = document.getElementById('algorithmSelect').value;

      switch (algorithm) {
        case 'bubble': await bubbleSort(); break;
        case 'selection': await selectionSort(); break;
        case 'insertion': await insertionSort(); break;
        case 'merge': await mergeSort(); break;
        case 'quick': await quickSort(); break;
        case 'heap': await heapSort(); break;
      }

      // Mark all as sorted
      document.querySelectorAll('.bar').forEach(bar => bar.classList.add('sorted'));
      
      updateStats();
      sorting = false;
      document.getElementById('sortBtn').disabled = false;
      document.getElementById('generateBtn').disabled = false;
    }

    function updateComplexityInfo() {
      const algorithm = document.getElementById('algorithmSelect').value;
      const info = algorithmComplexity[algorithm];
      document.getElementById('bestCase').textContent = info.best;
      document.getElementById('avgCase').textContent = info.avg;
      document.getElementById('worstCase').textContent = info.worst;
      document.getElementById('spaceComplexity').textContent = info.space;
    }

    document.getElementById('generateBtn').addEventListener('click', generateArray);
    document.getElementById('sortBtn').addEventListener('click', startSorting);
    document.getElementById('algorithmSelect').addEventListener('change', updateComplexityInfo);

    // Initialize
    generateArray();
    updateComplexityInfo();

export {
  SortingAlgorithms
}
