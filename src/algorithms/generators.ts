import type { AlgorithmId, ArrayElement, PresetType, SortStep } from '../types/sorting';

export function createArrayFromValues(values: number[]): ArrayElement[] {
  return values.map((value, idx) => ({
    id: `el-${idx}-${value}-${Math.random().toString(36).slice(2, 6)}`,
    value,
  }));
}

export function generatePresetValues(preset: PresetType, size: number): number[] {
  const clamped = Math.max(5, Math.min(28, size));
  if (preset === 'reversed') {
    return Array.from({ length: clamped }, (_, i) =>
      Math.round(12 + ((clamped - 1 - i) / Math.max(1, clamped - 1)) * 84)
    );
  }
  if (preset === 'nearly-sorted') {
    const arr = Array.from({ length: clamped }, (_, i) =>
      Math.round(12 + (i / Math.max(1, clamped - 1)) * 84)
    );
    const swaps = Math.max(1, Math.floor(clamped / 5));
    for (let s = 0; s < swaps; s++) {
      const a = Math.floor(Math.random() * (clamped - 1));
      const b = a + 1;
      [arr[a], arr[b]] = [arr[b], arr[a]];
    }
    return arr;
  }
  if (preset === 'few-unique') {
    const pool = [18, 36, 54, 72, 90];
    return Array.from({ length: clamped }, () => pool[Math.floor(Math.random() * pool.length)]);
  }
  // random
  return Array.from({ length: clamped }, () => Math.floor(Math.random() * 85) + 12);
}

const cloneArr = (arr: ArrayElement[]): ArrayElement[] => arr.map((item) => ({ ...item }));

export function generateSortSteps(algo: AlgorithmId, initial: ArrayElement[]): SortStep[] {
  switch (algo) {
    case 'bubble':
      return bubbleSteps(initial);
    case 'selection':
      return selectionSteps(initial);
    case 'insertion':
      return insertionSteps(initial);
    case 'shell':
      return shellSteps(initial);
    case 'merge':
      return mergeSteps(initial);
    case 'quick':
      return quickSteps(initial);
    case 'heap':
      return heapSteps(initial);
  }
}

function bubbleSteps(initial: ArrayElement[]): SortStep[] {
  const arr = cloneArr(initial);
  const n = arr.length;
  const steps: SortStep[] = [];
  const sorted: number[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: [],
    pointers: {},
    narration: 'Siap memulai Bubble Sort! Kita akan membandingkan pasangan bersebelahan dari kiri ke kanan.',
    codeLine: 1,
    comparisons,
    swaps,
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      steps.push({
        array: cloneArr(arr),
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        pointers: { j, 'j+1': j + 1 },
        narration: `Membandingkan ${arr[j].value} dan ${arr[j + 1].value}. Apakah ${arr[j].value} > ${arr[j + 1].value}?`,
        codeLine: 4,
        comparisons,
        swaps,
      });

      if (arr[j].value > arr[j + 1].value) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        swapped = true;
        steps.push({
          array: cloneArr(arr),
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          pointers: { j, 'j+1': j + 1 },
          narration: `Ya! ${arr[j + 1].value} lebih besar dari ${arr[j].value}, tukar posisi keduanya.`,
          codeLine: 5,
          comparisons,
          swaps,
        });
      }
    }
    sorted.push(n - 1 - i);
    if (!swapped) {
      for (let k = 0; k < n; k++) {
        if (!sorted.includes(k)) sorted.push(k);
      }
      steps.push({
        array: cloneArr(arr),
        comparing: [],
        swapping: [],
        sorted: [...sorted],
        pointers: {},
        narration: 'Tidak ada pertukaran di putaran ini! Artinya seluruh array sudah terurut sempurna.',
        codeLine: 7,
        comparisons,
        swaps,
        isDone: true,
      });
      return steps;
    }
  }

  const allSorted = Array.from({ length: n }, (_, idx) => idx);
  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: allSorted,
    pointers: {},
    narration: 'Selesai! Semua gelembung terbesar sudah mengapung ke posisi yang tepat.',
    codeLine: 7,
    comparisons,
    swaps,
    isDone: true,
  });
  return steps;
}

function selectionSteps(initial: ArrayElement[]): SortStep[] {
  const arr = cloneArr(initial);
  const n = arr.length;
  const steps: SortStep[] = [];
  const sorted: number[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: [],
    pointers: {},
    narration: 'Siap memulai Selection Sort! Kita akan mencari angka terkecil untuk setiap posisi.',
    codeLine: 1,
    comparisons,
    swaps,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({
      array: cloneArr(arr),
      comparing: [i],
      swapping: [],
      sorted: [...sorted],
      pointers: { i, min: minIdx },
      narration: `Putaran ${i + 1}: Anggap ${arr[minIdx].value} (indeks ${i}) sebagai nilai terkecil sementara.`,
      codeLine: 2,
      comparisons,
      swaps,
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      steps.push({
        array: cloneArr(arr),
        comparing: [minIdx, j],
        swapping: [],
        sorted: [...sorted],
        pointers: { i, min: minIdx, j },
        narration: `Bandingkan kandidat terkecil (${arr[minIdx].value}) dengan ${arr[j].value}.`,
        codeLine: 4,
        comparisons,
        swaps,
      });

      if (arr[j].value < arr[minIdx].value) {
        minIdx = j;
        steps.push({
          array: cloneArr(arr),
          comparing: [minIdx],
          swapping: [],
          sorted: [...sorted],
          pointers: { i, min: minIdx, j },
          narration: `Ketemu yang lebih kecil! Sekarang ${arr[minIdx].value} menjadi kandidat terkecil baru.`,
          codeLine: 5,
          comparisons,
          swaps,
        });
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
      steps.push({
        array: cloneArr(arr),
        comparing: [],
        swapping: [i, minIdx],
        sorted: [...sorted],
        pointers: { i, min: minIdx },
        narration: `Tukar nilai terkecil (${arr[i].value}) ke posisi depan indeks ${i}.`,
        codeLine: 7,
        comparisons,
        swaps,
      });
    }
    sorted.push(i);
  }

  const allSorted = Array.from({ length: n }, (_, idx) => idx);
  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: allSorted,
    pointers: {},
    narration: 'Selesai! Setiap elemen terkecil telah dipilih dan ditempatkan secara berurutan.',
    codeLine: 7,
    comparisons,
    swaps,
    isDone: true,
  });
  return steps;
}

function insertionSteps(initial: ArrayElement[]): SortStep[] {
  const arr = cloneArr(initial);
  const n = arr.length;
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: [0],
    pointers: { i: 0 },
    narration: 'Elemen pertama dianggap sudah terurut. Sekarang kita sisipkan elemen berikutnya satu per satu!',
    codeLine: 1,
    comparisons,
    swaps,
  });

  for (let i = 1; i < n; i++) {
    const keyVal = arr[i].value;
    let j = i;
    const sortedSoFar = Array.from({ length: i }, (_, idx) => idx);

    steps.push({
      array: cloneArr(arr),
      comparing: [i],
      swapping: [],
      sorted: sortedSoFar,
      pivot: i,
      pointers: { key: i },
      narration: `Ambil kartu baru: ${keyVal}. Mari cari posisi yang pas di sebelah kiri!`,
      codeLine: 2,
      comparisons,
      swaps,
    });

    while (j > 0) {
      comparisons++;
      steps.push({
        array: cloneArr(arr),
        comparing: [j - 1, j],
        swapping: [],
        sorted: sortedSoFar.filter((idx) => idx !== j && idx !== j - 1),
        pivot: j,
        pointers: { 'j-1': j - 1, key: j },
        narration: `Bandingkan ${arr[j - 1].value} dengan kartu ${arr[j].value}.`,
        codeLine: 4,
        comparisons,
        swaps,
      });

      if (arr[j - 1].value > arr[j].value) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        swaps++;
        j--;
        steps.push({
          array: cloneArr(arr),
          comparing: [],
          swapping: [j, j + 1],
          sorted: sortedSoFar.filter((idx) => idx !== j && idx !== j + 1),
          pivot: j,
          pointers: { key: j },
          narration: `${arr[j + 1].value} lebih besar, geser ke kanan untuk memberi ruang bagi ${arr[j].value}.`,
          codeLine: 5,
          comparisons,
          swaps,
        });
      } else {
        break;
      }
    }

    steps.push({
      array: cloneArr(arr),
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
      pointers: {},
      narration: `Kartu ${arr[j].value} berhasil disisipkan di posisi indeks ${j}!`,
      codeLine: 7,
      comparisons,
      swaps,
    });
  }

  const allSorted = Array.from({ length: n }, (_, idx) => idx);
  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: allSorted,
    pointers: {},
    narration: 'Selesai! Semua kartu telah tersusun rapi di tangan.',
    codeLine: 7,
    comparisons,
    swaps,
    isDone: true,
  });
  return steps;
}

function mergeSteps(initial: ArrayElement[]): SortStep[] {
  const arr = cloneArr(initial);
  const n = arr.length;
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: [],
    pointers: {},
    narration: 'Siap memulai Merge Sort! Array akan dipecah menjadi dua bagian berulang kali, lalu digabung terurut.',
    codeLine: 1,
    comparisons,
    swaps,
  });

  function mergeSort(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);

    steps.push({
      array: cloneArr(arr),
      comparing: [],
      swapping: [],
      sorted: [],
      range: [left, right],
      mergeSplit: { left, mid, right, phase: 'divide' },
      pointers: { L: left, M: mid, R: right },
      narration: `Memecah rentang [${left}..${right}] menjadi bagian kiri [${left}..${mid}] dan kanan [${mid + 1}..${right}].`,
      codeLine: 3,
      comparisons,
      swaps,
    });

    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  }

  function merge(left: number, mid: number, right: number) {
    const leftPart = arr.slice(left, mid + 1).map((x) => ({ ...x }));
    const rightPart = arr.slice(mid + 1, right + 1).map((x) => ({ ...x }));
    let i = 0;
    let j = 0;
    let k = left;

    // Pindahkan elemen terpilih ke indeks k sambil menjaga keunikan id di seluruh array
    const placeAt = (chosen: ArrayElement, targetIdx: number) => {
      const srcIdx = arr.findIndex((item, idx) => idx >= targetIdx && item.id === chosen.id);
      if (srcIdx > targetIdx) {
        const [moved] = arr.splice(srcIdx, 1);
        arr.splice(targetIdx, 0, moved);
      }
    };

    while (i < leftPart.length && j < rightPart.length) {
      comparisons++;
      const leftVal = leftPart[i].value;
      const rightVal = rightPart[j].value;
      const leftPos = arr.findIndex((item, idx) => idx >= k && item.id === leftPart[i].id);
      const rightPos = arr.findIndex((item, idx) => idx >= k && item.id === rightPart[j].id);
      steps.push({
        array: cloneArr(arr),
        comparing: [leftPos, rightPos].filter((idx) => idx >= 0 && idx <= right),
        swapping: [],
        sorted: [],
        range: [left, right],
        mergeSplit: { left, mid, right, phase: 'merge' },
        pointers: { L: left, k, R: right },
        narration: `Menggabungkan [${left}..${mid}] & [${mid + 1}..${right}]: membandingkan ${leftVal} (kiri) dan ${rightVal} (kanan).`,
        codeLine: 6,
        comparisons,
        swaps,
      });

      if (leftVal <= rightVal) {
        placeAt(leftPart[i], k);
        i++;
      } else {
        placeAt(rightPart[j], k);
        j++;
      }
      swaps++;
      steps.push({
        array: cloneArr(arr),
        comparing: [],
        swapping: [k],
        sorted: [],
        range: [left, right],
        mergeSplit: { left, mid, right, phase: 'merge' },
        pointers: { L: left, k, R: right },
        narration: `Memindahkan nilai lebih kecil (${arr[k].value}) ke posisi indeks ${k}.`,
        codeLine: 7,
        comparisons,
        swaps,
      });
      k++;
    }

    while (i < leftPart.length) {
      placeAt(leftPart[i], k);
      swaps++;
      steps.push({
        array: cloneArr(arr),
        comparing: [],
        swapping: [k],
        sorted: [],
        range: [left, right],
        mergeSplit: { left, mid, right, phase: 'merge' },
        pointers: { k },
        narration: `Menyalin sisa bagian kiri (${arr[k].value}) ke posisi indeks ${k}.`,
        codeLine: 7,
        comparisons,
        swaps,
      });
      i++;
      k++;
    }

    while (j < rightPart.length) {
      placeAt(rightPart[j], k);
      swaps++;
      steps.push({
        array: cloneArr(arr),
        comparing: [],
        swapping: [k],
        sorted: [],
        range: [left, right],
        mergeSplit: { left, mid, right, phase: 'merge' },
        pointers: { k },
        narration: `Menyalin sisa bagian kanan (${arr[k].value}) ke posisi indeks ${k}.`,
        codeLine: 7,
        comparisons,
        swaps,
      });
      j++;
      k++;
    }

    steps.push({
      array: cloneArr(arr),
      comparing: [],
      swapping: [],
      sorted: [],
      range: [left, right],
      mergeSplit: { left, mid, right, phase: 'merged' },
      pointers: { L: left, R: right },
      narration: `Bagian [${left}..${right}] selesai digabungkan menjadi satu kelompok terurut!`,
      codeLine: 7,
      comparisons,
      swaps,
    });
  }

  mergeSort(0, n - 1);

  const allSorted = Array.from({ length: n }, (_, idx) => idx);
  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: allSorted,
    pointers: {},
    narration: 'Selesai! Semua bagian kecil telah digabungkan kembali menjadi barisan terurut.',
    codeLine: 7,
    comparisons,
    swaps,
    isDone: true,
  });
  return steps;
}

function quickSteps(initial: ArrayElement[]): SortStep[] {
  const arr = cloneArr(initial);
  const n = arr.length;
  const steps: SortStep[] = [];
  const sortedSet = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: [],
    pointers: {},
    narration: 'Siap memulai Quick Sort! Kita akan memilih elemen pivot lalu mempartisi elemen lain di sekitarnya.',
    codeLine: 1,
    comparisons,
    swaps,
  });

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sortedSet.add(pi);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    } else if (low === high && low >= 0 && low < n) {
      sortedSet.add(low);
    }
  }

  function partition(low: number, high: number): number {
    const pivotVal = arr[high].value;
    let i = low - 1;

    steps.push({
      array: cloneArr(arr),
      comparing: [],
      swapping: [],
      sorted: Array.from(sortedSet),
      pivot: high,
      range: [low, high],
      pointers: { low, pivot: high },
      narration: `Memilih ${pivotVal} (indeks ${high}) sebagai Pivot untuk rentang [${low}..${high}].`,
      codeLine: 3,
      comparisons,
      swaps,
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push({
        array: cloneArr(arr),
        comparing: [j, high],
        swapping: [],
        sorted: Array.from(sortedSet),
        pivot: high,
        range: [low, high],
        pointers: { ...(i >= low ? { i } : {}), j, pivot: high },
        narration: `Bandingkan ${arr[j].value} dengan Pivot (${pivotVal}).`,
        codeLine: 7,
        comparisons,
        swaps,
      });

      if (arr[j].value < pivotVal) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps++;
          steps.push({
            array: cloneArr(arr),
            comparing: [],
            swapping: [i, j],
            sorted: Array.from(sortedSet),
            pivot: high,
            range: [low, high],
            pointers: { i, j, pivot: high },
            narration: `${arr[i].value} < ${pivotVal}, tukar ke sisi kiri partisi (indeks ${i}).`,
            codeLine: 7,
            comparisons,
            swaps,
          });
        }
      }
    }

    if (i + 1 !== high) {
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      swaps++;
    }
    const pivotFinal = i + 1;
    sortedSet.add(pivotFinal);

    steps.push({
      array: cloneArr(arr),
      comparing: [],
      swapping: [pivotFinal],
      sorted: Array.from(sortedSet),
      pivot: pivotFinal,
      range: [low, high],
      pointers: { pivot: pivotFinal },
      narration: `Pivot ${arr[pivotFinal].value} ditempatkan di posisi final indeks ${pivotFinal}!`,
      codeLine: 3,
      comparisons,
      swaps,
    });

    return pivotFinal;
  }

  quickSort(0, n - 1);

  const allSorted = Array.from({ length: n }, (_, idx) => idx);
  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: allSorted,
    pointers: {},
    narration: 'Selesai! Semua pivot dan partisi telah menempatkan setiap angka di posisi tepatnya.',
    codeLine: 5,
    comparisons,
    swaps,
    isDone: true,
  });
  return steps;
}

function heapSteps(initial: ArrayElement[]): SortStep[] {
  const arr = cloneArr(initial);
  const n = arr.length;
  const steps: SortStep[] = [];
  const sorted: number[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: [],
    pointers: {},
    narration: 'Tahap 1: Membangun Max-Heap agar angka terbesar naik ke puncak pohon (indeks 0).',
    codeLine: 1,
    comparisons,
    swaps,
  });

  function heapify(heapSize: number, root: number) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < heapSize) {
      comparisons++;
      steps.push({
        array: cloneArr(arr),
        comparing: [largest, left],
        swapping: [],
        sorted: [...sorted],
        pointers: { parent: root, left },
        narration: `Membandingkan induk ${arr[largest].value} dengan anak kiri ${arr[left].value}.`,
        codeLine: 5,
        comparisons,
        swaps,
      });
      if (arr[left].value > arr[largest].value) {
        largest = left;
      }
    }

    if (right < heapSize) {
      comparisons++;
      steps.push({
        array: cloneArr(arr),
        comparing: [largest, right],
        swapping: [],
        sorted: [...sorted],
        pointers: { parent: root, right },
        narration: `Membandingkan kandidat terbesar ${arr[largest].value} dengan anak kanan ${arr[right].value}.`,
        codeLine: 5,
        comparisons,
        swaps,
      });
      if (arr[right].value > arr[largest].value) {
        largest = right;
      }
    }

    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      swaps++;
      steps.push({
        array: cloneArr(arr),
        comparing: [],
        swapping: [root, largest],
        sorted: [...sorted],
        pointers: { root, largest },
        narration: `Naikkan ${arr[root].value} ke posisi induk (indeks ${root}) agar sifat Max-Heap terjaga.`,
        codeLine: 6,
        comparisons,
        swaps,
      });
      heapify(heapSize, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    swaps++;
    sorted.push(i);
    steps.push({
      array: cloneArr(arr),
      comparing: [],
      swapping: [0, i],
      sorted: [...sorted],
      pointers: { puncak: 0, akhir: i },
      narration: `Panen juara ${arr[i].value} dari puncak (0) ke posisi akhir indeks ${i}!`,
      codeLine: 3,
      comparisons,
      swaps,
    });
    heapify(i, 0);
  }

  const allSorted = Array.from({ length: n }, (_, idx) => idx);
  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: allSorted,
    pointers: {},
    narration: 'Selesai! Seluruh turnamen Max-Heap selesai dan array terurut sempurna.',
    codeLine: 7,
    comparisons,
    swaps,
    isDone: true,
  });
  return steps;
}

function shellSteps(initial: ArrayElement[]): SortStep[] {
  const arr = cloneArr(initial);
  const n = arr.length;
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: [],
    pointers: {},
    narration: 'Siap memulai Shell Sort! Kita akan mengurutkan elemen yang terpisah jarak (gap) besar, lalu memperkecil gap hingga 1.',
    codeLine: 1,
    comparisons,
    swaps,
  });

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({
      array: cloneArr(arr),
      comparing: [],
      swapping: [],
      sorted: [],
      pointers: { gap },
      narration: `Memulai putaran baru dengan jarak lompatan gap = ${gap}.`,
      codeLine: 2,
      comparisons,
      swaps,
    });

    for (let i = gap; i < n; i++) {
      let j = i;
      while (j >= gap) {
        comparisons++;
        steps.push({
          array: cloneArr(arr),
          comparing: [j - gap, j],
          swapping: [],
          sorted: [],
          pivot: j,
          pointers: { [`j-${gap}`]: j - gap, j },
          narration: `Gap ${gap}: Bandingkan ${arr[j - gap].value} (indeks ${j - gap}) dengan ${arr[j].value} (indeks ${j}).`,
          codeLine: 5,
          comparisons,
          swaps,
        });

        if (arr[j - gap].value > arr[j].value) {
          [arr[j - gap], arr[j]] = [arr[j], arr[j - gap]];
          swaps++;
          steps.push({
            array: cloneArr(arr),
            comparing: [],
            swapping: [j - gap, j],
            sorted: [],
            pivot: j - gap,
            pointers: { [`j-${gap}`]: j - gap, j },
            narration: `${arr[j].value} > ${arr[j - gap].value}, tukar posisi melompati jarak gap = ${gap}!`,
            codeLine: 6,
            comparisons,
            swaps,
          });
          j -= gap;
        } else {
          break;
        }
      }
    }
  }

  const allSorted = Array.from({ length: n }, (_, idx) => idx);
  steps.push({
    array: cloneArr(arr),
    comparing: [],
    swapping: [],
    sorted: allSorted,
    pointers: {},
    narration: 'Selesai! Setelah gap mencapai 1, seluruh elemen telah terurut sempurna.',
    codeLine: 7,
    comparisons,
    swaps,
    isDone: true,
  });
  return steps;
}
