import type { SearchAlgorithmId, SearchStep } from '../types/searching';

export function generateSearchArray(size: number, sorted: boolean): number[] {
  const clamped = Math.max(6, Math.min(20, size));
  const set = new Set<number>();
  while (set.size < clamped) {
    set.add(Math.floor(Math.random() * 88) + 10);
  }
  const arr = Array.from(set);
  return sorted ? arr.sort((a, b) => a - b) : arr;
}

export function generateSearchSteps(
  algo: SearchAlgorithmId,
  rawArray: number[],
  target: number
): SearchStep[] {
  switch (algo) {
    case 'linear':
      return linearSearchSteps(rawArray, target);
    case 'binary':
      return binarySearchSteps(rawArray, target);
    case 'jump':
      return jumpSearchSteps(rawArray, target);
    case 'interpolation':
      return interpolationSearchSteps(rawArray, target);
  }
}

function linearSearchSteps(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const eliminated: number[] = [];
  let checks = 0;

  steps.push({
    array: [...arr],
    target,
    checking: [],
    eliminated: [],
    foundIndex: null,
    windowRange: [0, arr.length - 1],
    pointers: {},
    narration: `Siap mencari ${target} dengan Linear Search! Kita akan cek satu per satu dari indeks 0.`,
    codeLine: 1,
    checks,
  });

  for (let i = 0; i < arr.length; i++) {
    checks++;
    steps.push({
      array: [...arr],
      target,
      checking: [i],
      eliminated: [...eliminated],
      foundIndex: null,
      windowRange: [i, arr.length - 1],
      pointers: { i },
      narration: `Memeriksa indeks ${i} (nilai ${arr[i]}). Apakah ${arr[i]} == ${target}?`,
      codeLine: 2,
      checks,
    });

    if (arr[i] === target) {
      steps.push({
        array: [...arr],
        target,
        checking: [],
        eliminated: [...eliminated],
        foundIndex: i,
        pointers: { ketemu: i },
        narration: `Ketemu! Angka ${target} ditemukan di indeks ${i} dalam ${checks} langkah pengecekan.`,
        codeLine: 3,
        checks,
        isDone: true,
      });
      return steps;
    }

    eliminated.push(i);
  }

  steps.push({
    array: [...arr],
    target,
    checking: [],
    eliminated: [...eliminated],
    foundIndex: null,
    pointers: {},
    narration: `Sudah sampai ujung array, angka ${target} tidak ditemukan (${checks} kali cek).`,
    codeLine: 5,
    checks,
    isDone: true,
  });
  return steps;
}

function binarySearchSteps(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const n = arr.length;
  const eliminatedSet = new Set<number>();
  let low = 0;
  let high = n - 1;
  let checks = 0;

  steps.push({
    array: [...arr],
    target,
    checking: [],
    eliminated: [],
    foundIndex: null,
    windowRange: [low, high],
    pointers: { low, high },
    narration: `Siap mencari ${target} dengan Binary Search! Rentang aktif [${low}..${high}].`,
    codeLine: 1,
    checks,
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    checks++;

    steps.push({
      array: [...arr],
      target,
      checking: [mid],
      eliminated: Array.from(eliminatedSet),
      foundIndex: null,
      windowRange: [low, high],
      pointers: { low, mid, high },
      narration: `Cek titik tengah indeks ${mid} (nilai ${arr[mid]}). Bandingkan dengan target ${target}.`,
      codeLine: 4,
      checks,
    });

    if (arr[mid] === target) {
      steps.push({
        array: [...arr],
        target,
        checking: [],
        eliminated: Array.from(eliminatedSet),
        foundIndex: mid,
        pointers: { ketemu: mid },
        narration: `Ketemu! ${target} ada di indeks ${mid} hanya dengan ${checks} kali pengecekan!`,
        codeLine: 4,
        checks,
        isDone: true,
      });
      return steps;
    }

    if (arr[mid] < target) {
      for (let k = low; k <= mid; k++) eliminatedSet.add(k);
      low = mid + 1;
      steps.push({
        array: [...arr],
        target,
        checking: [],
        eliminated: Array.from(eliminatedSet),
        foundIndex: null,
        windowRange: low <= high ? [low, high] : undefined,
        pointers: low <= high ? { low, high } : {},
        narration: `${arr[mid]} < ${target}, buang seluruh sisi kiri! Fokus ke [${low}..${high}].`,
        codeLine: 5,
        checks,
      });
    } else {
      for (let k = mid; k <= high; k++) eliminatedSet.add(k);
      high = mid - 1;
      steps.push({
        array: [...arr],
        target,
        checking: [],
        eliminated: Array.from(eliminatedSet),
        foundIndex: null,
        windowRange: low <= high ? [low, high] : undefined,
        pointers: low <= high ? { low, high } : {},
        narration: `${arr[mid]} > ${target}, buang seluruh sisi kanan! Fokus ke [${low}..${high}].`,
        codeLine: 6,
        checks,
      });
    }
  }

  steps.push({
    array: [...arr],
    target,
    checking: [],
    eliminated: Array.from({ length: n }, (_, i) => i),
    foundIndex: null,
    pointers: {},
    narration: `Rentang pencarian habis. Angka ${target} tidak ada di dalam array.`,
    codeLine: 7,
    checks,
    isDone: true,
  });
  return steps;
}

function jumpSearchSteps(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const n = arr.length;
  const blockSize = Math.max(1, Math.floor(Math.sqrt(n)));
  const eliminatedSet = new Set<number>();
  let step = blockSize;
  let prev = 0;
  let checks = 0;

  steps.push({
    array: [...arr],
    target,
    checking: [],
    eliminated: [],
    foundIndex: null,
    windowRange: [0, n - 1],
    pointers: { prev: 0 },
    narration: `Jump Search dimulai dengan ukuran lompatan √${n} ≈ ${blockSize} elemen per blok.`,
    codeLine: 1,
    checks,
  });

  while (prev < n) {
    const checkIdx = Math.min(step, n) - 1;
    checks++;
    steps.push({
      array: [...arr],
      target,
      checking: [checkIdx],
      eliminated: Array.from(eliminatedSet),
      foundIndex: null,
      windowRange: [prev, checkIdx],
      pointers: { prev, batas: checkIdx },
      narration: `Lompat ke batas blok indeks ${checkIdx} (nilai ${arr[checkIdx]}). Apakah < ${target}?`,
      codeLine: 2,
      checks,
    });

    if (arr[checkIdx] < target) {
      for (let k = prev; k <= checkIdx; k++) eliminatedSet.add(k);
      prev = step;
      step += blockSize;
      if (prev >= n) {
        steps.push({
          array: [...arr],
          target,
          checking: [],
          eliminated: Array.from({ length: n }, (_, i) => i),
          foundIndex: null,
          pointers: {},
          narration: `Sudah melewati ujung array. Angka ${target} tidak ditemukan.`,
          codeLine: 4,
          checks,
          isDone: true,
        });
        return steps;
      }
    } else {
      break;
    }
  }

  const endBlock = Math.min(step, n) - 1;
  for (let k = endBlock + 1; k < n; k++) eliminatedSet.add(k);

  steps.push({
    array: [...arr],
    target,
    checking: [],
    eliminated: Array.from(eliminatedSet),
    foundIndex: null,
    windowRange: [prev, endBlock],
    pointers: { prev, akhir: endBlock },
    narration: `Target berada di rentang blok [${prev}..${endBlock}]. Periksa satu per satu di blok ini!`,
    codeLine: 5,
    checks,
  });

  for (let i = prev; i <= endBlock; i++) {
    checks++;
    steps.push({
      array: [...arr],
      target,
      checking: [i],
      eliminated: Array.from(eliminatedSet),
      foundIndex: null,
      windowRange: [prev, endBlock],
      pointers: { i },
      narration: `Memeriksa indeks ${i} (nilai ${arr[i]}) di dalam blok.`,
      codeLine: 6,
      checks,
    });

    if (arr[i] === target) {
      steps.push({
        array: [...arr],
        target,
        checking: [],
        eliminated: Array.from(eliminatedSet),
        foundIndex: i,
        pointers: { ketemu: i },
        narration: `Ketemu! ${target} ditemukan di indeks ${i} dengan ${checks} kali cek.`,
        codeLine: 6,
        checks,
        isDone: true,
      });
      return steps;
    }
    eliminatedSet.add(i);
  }

  steps.push({
    array: [...arr],
    target,
    checking: [],
    eliminated: Array.from({ length: n }, (_, i) => i),
    foundIndex: null,
    pointers: {},
    narration: `Blok sudah diperiksa seluruhnya, angka ${target} tidak ditemukan.`,
    codeLine: 7,
    checks,
    isDone: true,
  });
  return steps;
}

function interpolationSearchSteps(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const n = arr.length;
  const eliminatedSet = new Set<number>();
  let low = 0;
  let high = n - 1;
  let checks = 0;

  steps.push({
    array: [...arr],
    target,
    checking: [],
    eliminated: [],
    foundIndex: null,
    windowRange: [low, high],
    pointers: { low, high },
    narration: `Interpolation Search siap! Kita akan memperkirakan posisi ${target} berdasarkan proporsi nilai.`,
    codeLine: 1,
    checks,
  });

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      checks++;
      steps.push({
        array: [...arr],
        target,
        checking: [low],
        eliminated: Array.from(eliminatedSet),
        foundIndex: null,
        windowRange: [low, high],
        pointers: { pos: low },
        narration: `Tersisa 1 elemen di indeks ${low} (${arr[low]}).`,
        codeLine: 4,
        checks,
      });
      if (arr[low] === target) {
        steps.push({
          array: [...arr],
          target,
          checking: [],
          eliminated: Array.from(eliminatedSet),
          foundIndex: low,
          pointers: { ketemu: low },
          narration: `Ketemu! ${target} ada di indeks ${low}.`,
          codeLine: 4,
          checks,
          isDone: true,
        });
        return steps;
      }
      break;
    }

    const pos =
      arr[high] === arr[low]
        ? low
        : low +
          Math.floor(
            ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
          );
    const clampedPos = Math.max(low, Math.min(high, pos));
    checks++;

    steps.push({
      array: [...arr],
      target,
      checking: [clampedPos],
      eliminated: Array.from(eliminatedSet),
      foundIndex: null,
      windowRange: [low, high],
      pointers: { low, pos: clampedPos, high },
      narration: `Rumus proporsi menebak indeks ${clampedPos} (nilai ${arr[clampedPos]}).`,
      codeLine: 2,
      checks,
    });

    if (arr[clampedPos] === target) {
      steps.push({
        array: [...arr],
        target,
        checking: [],
        eliminated: Array.from(eliminatedSet),
        foundIndex: clampedPos,
        pointers: { ketemu: clampedPos },
        narration: `Tebakan tepat! ${target} ditemukan di indeks ${clampedPos} dalam ${checks} langkah!`,
        codeLine: 4,
        checks,
        isDone: true,
      });
      return steps;
    }

    if (arr[clampedPos] < target) {
      for (let k = low; k <= clampedPos; k++) eliminatedSet.add(k);
      low = clampedPos + 1;
      steps.push({
        array: [...arr],
        target,
        checking: [],
        eliminated: Array.from(eliminatedSet),
        foundIndex: null,
        windowRange: low <= high ? [low, high] : undefined,
        pointers: low <= high ? { low, high } : {},
        narration: `${arr[clampedPos]} < ${target}, geser batas kiri ke ${low}.`,
        codeLine: 5,
        checks,
      });
    } else {
      for (let k = clampedPos; k <= high; k++) eliminatedSet.add(k);
      high = clampedPos - 1;
      steps.push({
        array: [...arr],
        target,
        checking: [],
        eliminated: Array.from(eliminatedSet),
        foundIndex: null,
        windowRange: low <= high ? [low, high] : undefined,
        pointers: low <= high ? { low, high } : {},
        narration: `${arr[clampedPos]} > ${target}, geser batas kanan ke ${high}.`,
        codeLine: 6,
        checks,
      });
    }
  }

  steps.push({
    array: [...arr],
    target,
    checking: [],
    eliminated: Array.from({ length: n }, (_, i) => i),
    foundIndex: null,
    pointers: {},
    narration: `Target ${target} berada di luar rentang atau tidak ditemukan di dalam array.`,
    codeLine: 7,
    checks,
    isDone: true,
  });
  return steps;
}
