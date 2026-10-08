/**
 * Arrow Maze — Labirin Panah Satu Arah
 * Interactive Web Game
 */

// Sound Synthesizer (Web Audio API)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playMove() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.09);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      // Audio fallback silent
    }
  }

  playReject() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(110, now + 0.06);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }

  playUndo() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  playWin() {
    if (!this.enabled || !this.ctx) return;
    try {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
      notes.forEach((freq, idx) => {
        const start = this.ctx.currentTime + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (e) {}
  }
}

// Handcrafted Levels with Verified Solvability
const BUILT_IN_LEVELS = [
  // Level 1: 5x5
  {
    name: 'Level 1 (Mudah)',
    rows: 5,
    cols: 5,
    start: { r: 0, c: 0 },
    goal: { r: 4, c: 4 },
    // Edges format: [r1, c1, r2, c2] means arrow points from (r1,c1) -> (r2,c2)
    edges: [
      // Solution path: (0,0)->(0,1)->(1,1)->(1,2)->(2,2)->(2,3)->(3,3)->(3,4)->(4,4)
      [0,0, 0,1], [0,1, 1,1], [1,1, 1,2], [1,2, 2,2], [2,2, 2,3], [2,3, 3,3], [3,3, 3,4], [3,4, 4,4],
      // Alternative paths & traps (dead ends / loops)
      [0,0, 1,0], [1,0, 2,0], [2,0, 2,1], [2,1, 1,1], [0,1, 0,2], [0,2, 0,3], [0,3, 1,3], [1,3, 1,2],
      [1,0, 1,1], [2,0, 3,0], [3,0, 4,0], [4,0, 4,1], [4,1, 3,1], [3,1, 2,1],
      [2,1, 2,2], [2,2, 3,2], [3,2, 3,3], [3,2, 4,2], [4,2, 4,3], [4,3, 3,3], [4,3, 4,4],
      [0,3, 0,4], [0,4, 1,4], [1,4, 2,4], [2,4, 2,3], [2,4, 3,4],
      [3,1, 3,2], [4,1, 4,2]
    ]
  },
  // Level 2: 6x6
  {
    name: 'Level 2 (Sedang)',
    rows: 6,
    cols: 6,
    start: { r: 0, c: 0 },
    goal: { r: 5, c: 5 },
    edges: [
      // Solution path
      [0,0, 1,0], [1,0, 1,1], [1,1, 2,1], [2,1, 2,2], [2,2, 1,2], [1,2, 1,3], [1,3, 2,3],
      [2,3, 3,3], [3,3, 3,4], [3,4, 4,4], [4,4, 4,5], [4,5, 5,5],
      // Divergent routes & dead ends
      [0,0, 0,1], [0,1, 0,2], [0,2, 1,2], [0,2, 0,3], [0,3, 0,4], [0,4, 1,4], [1,4, 1,3],
      [1,0, 2,0], [2,0, 3,0], [3,0, 3,1], [3,1, 2,1], [3,0, 4,0], [4,0, 5,0], [5,0, 5,1], [5,1, 4,1],
      [4,1, 4,2], [4,2, 3,2], [3,2, 2,2], [2,2, 2,3], [3,2, 3,3],
      [0,4, 0,5], [0,5, 1,5], [1,5, 2,5], [2,5, 3,5], [3,5, 3,4], [2,5, 2,4], [2,4, 1,4],
      [3,3, 4,3], [4,3, 4,2], [4,3, 5,3], [5,3, 5,2], [5,2, 4,2], [5,3, 5,4], [5,4, 4,4], [5,4, 5,5]
    ]
  },
  // Level 3: 7x7 (Expert)
  {
    name: 'Level 3 (Sulit)',
    rows: 7,
    cols: 7,
    start: { r: 0, c: 0 },
    goal: { r: 6, c: 6 },
    edges: [
      // Solution path with twists
      [0,0, 0,1], [0,1, 1,1], [1,1, 2,1], [2,1, 2,0], [2,0, 3,0], [3,0, 4,0], [4,0, 4,1],
      [4,1, 3,1], [3,1, 3,2], [3,2, 2,2], [2,2, 1,2], [1,2, 1,3], [1,3, 2,3], [2,3, 2,4],
      [2,4, 3,4], [3,4, 3,5], [3,5, 4,5], [4,5, 5,5], [5,5, 5,6], [5,6, 6,6],
      // Decoys, traps & loops
      [0,0, 1,0], [1,0, 2,0], [0,1, 0,2], [0,2, 0,3], [0,3, 0,4], [0,4, 0,5], [0,5, 0,6], [0,6, 1,6],
      [1,6, 2,6], [2,6, 2,5], [2,5, 1,5], [1,5, 1,4], [1,4, 0,4],
      [2,2, 2,3], [3,2, 4,2], [4,2, 5,2], [5,2, 5,1], [5,1, 6,1], [6,1, 6,2], [6,2, 6,3], [6,3, 5,3],
      [5,3, 4,3], [4,3, 3,3], [3,3, 3,4],
      [4,1, 5,1], [4,0, 5,0], [5,0, 6,0], [6,0, 6,1],
      [3,5, 2,5], [4,4, 4,5], [4,4, 3,4], [4,3, 4,4], [5,3, 5,4], [5,4, 4,4],
      [5,4, 6,4], [6,4, 6,5], [6,5, 5,5], [6,5, 6,6], [4,5, 4,6], [4,6, 5,6], [3,6, 4,6], [2,6, 3,6]
    ]
  }
];

// Procedural Level Generator with Guaranteed Solvability
function generateRandomSolvableLevel(size = 5) {
  const rows = size;
  const cols = size;
  const start = { r: 0, c: 0 };
  const goal = { r: rows - 1, c: cols - 1 };

  // Step 1: Create a random self-avoiding walk from start to goal
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const mainPath = [start];
  visited[start.r][start.c] = true;

  let current = { ...start };
  const maxAttempts = 150;
  let attempts = 0;

  while ((current.r !== goal.r || current.c !== goal.c) && attempts < maxAttempts) {
    attempts++;
    const neighbors = [];
    const dirs = [
      { r: -1, c: 0 }, { r: 1, c: 0 },
      { r: 0, c: -1 }, { r: 0, c: 1 }
    ];

    for (const d of dirs) {
      const nr = current.r + d.r;
      const nc = current.c + d.c;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
        // Favor moving toward goal
        const dist = Math.abs(goal.r - nr) + Math.abs(goal.c - nc);
        neighbors.push({ r: nr, c: nc, dist });
      }
    }

    if (neighbors.length === 0) {
      // Backtrack
      if (mainPath.length > 1) {
        mainPath.pop();
        current = mainPath[mainPath.length - 1];
        continue;
      } else {
        break;
      }
    }

    // Weighted random towards goal
    neighbors.sort((a, b) => a.dist - b.dist);
    const chosen = Math.random() < 0.65 ? neighbors[0] : neighbors[Math.floor(Math.random() * neighbors.length)];
    visited[chosen.r][chosen.c] = true;
    mainPath.push(chosen);
    current = chosen;
  }

  // Fallback simple Manhattan path if random walk got stuck
  const guaranteedPath = [];
  if (current.r !== goal.r || current.c !== goal.c) {
    let cr = 0, cc = 0;
    while (cr < goal.r || cc < goal.c) {
      guaranteedPath.push({ r: cr, c: cc });
      if (cr < goal.r && (cc === goal.c || Math.random() < 0.5)) {
        cr++;
      } else {
        cc++;
      }
    }
    guaranteedPath.push(goal);
  } else {
    guaranteedPath.push(...mainPath);
  }

  // Set of all directed edges
  const edgeSet = new Set();
  const addEdge = (r1, c1, r2, c2) => {
    edgeSet.add(`${r1},${c1}->${r2},${c2}`);
  };

  // Add the guaranteed path
  for (let i = 0; i < guaranteedPath.length - 1; i++) {
    const p1 = guaranteedPath[i];
    const p2 = guaranteedPath[i + 1];
    addEdge(p1.r, p1.c, p2.r, p2.c);
  }

  // Add random filler edges for maze branches & dead ends
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Horizontal edge
      if (c + 1 < cols && Math.random() < 0.72) {
        if (!edgeSet.has(`${r},${c}->${r},${c + 1}`) && !edgeSet.has(`${r},${c + 1}->${r},${c}`)) {
          if (Math.random() < 0.5) {
            addEdge(r, c, r, c + 1);
          } else {
            addEdge(r, c + 1, r, c);
          }
        }
      }
      // Vertical edge
      if (r + 1 < rows && Math.random() < 0.72) {
        if (!edgeSet.has(`${r},${c}->${r + 1},${c}`) && !edgeSet.has(`${r + 1},${c}->${r},${c}`)) {
          if (Math.random() < 0.5) {
            addEdge(r, c, r + 1, c);
          } else {
            addEdge(r + 1, c, r, c);
          }
        }
      }
    }
  }

  // Convert to array
  const edgesArray = [];
  edgeSet.forEach(str => {
    const [from, to] = str.split('->');
    const [r1, c1] = from.split(',').map(Number);
    const [r2, c2] = to.split(',').map(Number);
    edgesArray.push([r1, c1, r2, c2]);
  });

  return {
    name: `Level Acak (${rows}x${cols})`,
    rows,
    cols,
    start,
    goal,
    edges: edgesArray
  };
}

// Game State & Engine
class ArrowMazeGame {
  constructor() {
    this.canvas = document.getElementById('maze-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvasFrame = document.getElementById('canvas-frame');
    this.rejectionFeedback = document.getElementById('rejection-feedback');

    // UI elements
    this.moveCounterEl = document.getElementById('move-counter');
    this.timerDisplayEl = document.getElementById('timer-display');
    this.levelSelectEl = document.getElementById('level-select');
    this.currentLevelTextEl = document.getElementById('current-level-text');

    // Modals
    this.victoryModal = document.getElementById('victory-modal');
    this.helpModal = document.getElementById('help-modal');
    this.winMovesEl = document.getElementById('win-moves');
    this.winTimeEl = document.getElementById('win-time');

    // Audio
    this.sound = new SoundFX();
    this.soundBtn = document.getElementById('btn-sound');
    this.soundIconOn = document.getElementById('sound-icon-on');
    this.soundIconOff = document.getElementById('sound-icon-off');

    // State
    this.currentLevelIndex = 0;
    this.levelData = null;
    this.player = { r: 0, c: 0 };
    this.visualPos = { x: 0, y: 0 };
    this.history = []; // For Undo
    this.visitedEdges = new Set(); // For breadcrumb trail
    this.moves = 0;
    this.seconds = 0;
    this.timerInterval = null;
    this.isGameActive = false;
    this.isCompleted = false;

    // Confetti particles
    this.confetti = [];

    // Colors
    this.colors = {
      bg: '#D3E7DE',
      path: '#3A4D59',
      pathVisited: '#10B981',
      player: '#FF5722',
      playerRing: 'rgba(255, 87, 34, 0.35)',
      start: '#2563EB',
      goal: '#F59E0B'
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadLevel(0);
    this.startRenderingLoop();
  }

  loadLevel(indexOrKey) {
    if (indexOrKey === 'random') {
      this.levelData = generateRandomSolvableLevel(6);
      this.currentLevelTextEl.textContent = 'Acak';
    } else {
      const idx = parseInt(indexOrKey, 10);
      this.currentLevelIndex = idx;
      this.levelData = BUILT_IN_LEVELS[idx];
      this.currentLevelTextEl.textContent = `${idx + 1}`;
    }

    // Build directed adjacency map for O(1) query
    // Key: `${r},${c}` -> Map of { up, down, left, right }
    this.adjMap = new Map();
    for (let r = 0; r < this.levelData.rows; r++) {
      for (let c = 0; c < this.levelData.cols; c++) {
        this.adjMap.set(`${r},${c}`, {
          up: false,
          down: false,
          left: false,
          right: false
        });
      }
    }

    this.levelData.edges.forEach(([r1, c1, r2, c2]) => {
      const fromNode = this.adjMap.get(`${r1},${c1}`);
      if (!fromNode) return;
      if (r2 === r1 - 1 && c2 === c1) fromNode.up = true;
      if (r2 === r1 + 1 && c2 === c1) fromNode.down = true;
      if (r2 === r1 && c2 === c1 - 1) fromNode.left = true;
      if (r2 === r1 && c2 === c1 + 1) fromNode.right = true;
    });

    this.resetState();
  }

  resetState() {
    this.player = { ...this.levelData.start };
    this.history = [];
    this.visitedEdges.clear();
    this.moves = 0;
    this.seconds = 0;
    this.isCompleted = false;
    this.isGameActive = true;
    this.confetti = [];

    this.updateStatsUI();
    this.restartTimer();
    this.resizeCanvas();
    this.syncVisualPosImmediate();
  }

  restartTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.isGameActive && !this.isCompleted) {
        this.seconds++;
        const mins = String(Math.floor(this.seconds / 60)).padStart(2, '0');
        const secs = String(this.seconds % 60).padStart(2, '0');
        this.timerDisplayEl.textContent = `${mins}:${secs}`;
      }
    }, 1000);
    this.timerDisplayEl.textContent = '00:00';
  }

  syncVisualPosImmediate() {
    const coords = this.getCanvasCoords(this.player.r, this.player.c);
    this.visualPos.x = coords.x;
    this.visualPos.y = coords.y;
  }

  updateStatsUI() {
    this.moveCounterEl.textContent = this.moves;
  }

  tryMove(dir) {
    if (!this.isGameActive || this.isCompleted) return;

    this.sound.init(); // Ensure WebAudio is resumed

    const currKey = `${this.player.r},${this.player.c}`;
    const nodeDirections = this.adjMap.get(currKey);

    let targetR = this.player.r;
    let targetC = this.player.c;

    if (dir === 'up') targetR -= 1;
    if (dir === 'down') targetR += 1;
    if (dir === 'left') targetC -= 1;
    if (dir === 'right') targetC += 1;

    // Validate boundaries
    if (targetR < 0 || targetR >= this.levelData.rows || targetC < 0 || targetC >= this.levelData.cols) {
      this.rejectMove();
      return;
    }

    // Check if the edge exists and points in this direction!
    const isAllowed = nodeDirections && nodeDirections[dir];

    if (isAllowed) {
      // Valid move!
      const edgeKey = `${this.player.r},${this.player.c}->${targetR},${targetC}`;
      this.visitedEdges.add(edgeKey);

      // Save for Undo
      this.history.push({
        r: this.player.r,
        c: this.player.c,
        edgeKey
      });

      this.player.r = targetR;
      this.player.c = targetC;
      this.moves++;
      this.updateStatsUI();
      this.sound.playMove();

      // Check Victory
      if (this.player.r === this.levelData.goal.r && this.player.c === this.levelData.goal.c) {
        this.onVictory();
      }
    } else {
      // Rejected! One-way arrow violated
      this.rejectMove();
    }
  }

  rejectMove() {
    this.sound.playReject();

    // Trigger visual shake
    this.canvasFrame.classList.remove('shake');
    void this.canvasFrame.offsetWidth; // Force reflow
    this.canvasFrame.classList.add('shake');

    // Show temporary rejection message
    this.rejectionFeedback.classList.remove('hidden');
    clearTimeout(this.rejectionTimeout);
    this.rejectionTimeout = setTimeout(() => {
      this.rejectionFeedback.classList.add('hidden');
    }, 1100);
  }

  undo() {
    if (this.history.length === 0 || this.isCompleted) return;

    const last = this.history.pop();
    this.visitedEdges.delete(last.edgeKey);
    this.player.r = last.r;
    this.player.c = last.c;
    this.moves++;
    this.updateStatsUI();
    this.sound.playUndo();
  }

  onVictory() {
    this.isCompleted = true;
    this.isGameActive = false;
    clearInterval(this.timerInterval);
    this.sound.playWin();

    // Spawn Confetti
    this.spawnConfetti();

    // Populate modal
    const mins = String(Math.floor(this.seconds / 60)).padStart(2, '0');
    const secs = String(this.seconds % 60).padStart(2, '0');
    this.winMovesEl.textContent = this.moves;
    this.winTimeEl.textContent = `${mins}:${secs}`;

    setTimeout(() => {
      this.victoryModal.classList.remove('hidden');
    }, 600);
  }

  spawnConfetti() {
    this.confetti = [];
    const colors = ['#FF5722', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];
    for (let i = 0; i < 90; i++) {
      this.confetti.push({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }
  }

  // Canvas Geometry & Rendering
  resizeCanvas() {
    const rect = this.canvasFrame.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
    this.cssWidth = rect.width;
    this.cssHeight = rect.height;
  }

  getCanvasCoords(r, c) {
    const padding = 42;
    const availableW = this.cssWidth - padding * 2;
    const availableH = this.cssHeight - padding * 2;

    const stepX = availableW / (this.levelData.cols - 1);
    const stepY = availableH / (this.levelData.rows - 1);

    return {
      x: padding + c * stepX,
      y: padding + r * stepY
    };
  }

  draw() {
    if (!this.levelData) return;

    this.ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);

    // 1. Draw Edges and Directional Arrows
    this.levelData.edges.forEach(([r1, c1, r2, c2]) => {
      const from = this.getCanvasCoords(r1, c1);
      const to = this.getCanvasCoords(r2, c2);
      const edgeKey = `${r1},${c1}->${r2},${c2}`;
      const isVisited = this.visitedEdges.has(edgeKey);

      this.drawArrowSegment(from.x, from.y, to.x, to.y, isVisited);
    });

    // 2. Draw Grid Nodes (Intersections)
    for (let r = 0; r < this.levelData.rows; r++) {
      for (let c = 0; c < this.levelData.cols; c++) {
        const coords = this.getCanvasCoords(r, c);
        const isStart = r === this.levelData.start.r && c === this.levelData.start.c;
        const isGoal = r === this.levelData.goal.r && c === this.levelData.goal.c;

        if (isStart) {
          // Start Node (Blue with pulse)
          this.ctx.beginPath();
          this.ctx.arc(coords.x, coords.y, 11, 0, Math.PI * 2);
          this.ctx.fillStyle = this.colors.start;
          this.ctx.fill();

          this.ctx.beginPath();
          this.ctx.arc(coords.x, coords.y, 6, 0, Math.PI * 2);
          this.ctx.fillStyle = '#FFFFFF';
          this.ctx.fill();
        } else if (isGoal) {
          // Goal Node (Golden Trophy/Star circle)
          this.ctx.beginPath();
          this.ctx.arc(coords.x, coords.y, 13, 0, Math.PI * 2);
          this.ctx.fillStyle = this.colors.goal;
          this.ctx.fill();

          // Star shape
          this.drawStar(coords.x, coords.y, 5, 8, 4, '#FFFFFF');
        } else {
          // Regular intersection dot
          this.ctx.beginPath();
          this.ctx.arc(coords.x, coords.y, 4, 0, Math.PI * 2);
          this.ctx.fillStyle = this.colors.path;
          this.ctx.fill();
        }
      }
    }

    // 3. Smooth Visual Position Interpolation for Player
    const targetCoords = this.getCanvasCoords(this.player.r, this.player.c);
    this.visualPos.x += (targetCoords.x - this.visualPos.x) * 0.32;
    this.visualPos.y += (targetCoords.y - this.visualPos.y) * 0.32;

    // Draw Player Breathing Ring
    const pulse = Math.sin(Date.now() / 200) * 2;
    this.ctx.beginPath();
    this.ctx.arc(this.visualPos.x, this.visualPos.y, 16 + pulse, 0, Math.PI * 2);
    this.ctx.fillStyle = this.colors.playerRing;
    this.ctx.fill();

    // Draw Player Dot
    this.ctx.beginPath();
    this.ctx.arc(this.visualPos.x, this.visualPos.y, 10, 0, Math.PI * 2);
    this.ctx.fillStyle = this.colors.player;
    this.ctx.fill();
    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.stroke();

    // 4. Render Confetti if Won
    if (this.confetti.length > 0) {
      this.updateAndDrawConfetti();
    }
  }

  drawArrowSegment(x1, y1, x2, y2, isVisited) {
    const strokeColor = isVisited ? this.colors.pathVisited : this.colors.path;
    const lineWidth = isVisited ? 4.5 : 3.5;

    // Draw line
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.stroke();

    // Draw Arrowhead at midpoint
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowLen = 10;
    const arrowWidth = 7;

    this.ctx.save();
    this.ctx.translate(midX, midY);
    this.ctx.rotate(angle);

    this.ctx.beginPath();
    this.ctx.moveTo(arrowLen / 2, 0);
    this.ctx.lineTo(-arrowLen / 2, -arrowWidth);
    this.ctx.lineTo(-arrowLen / 4, 0);
    this.ctx.lineTo(-arrowLen / 2, arrowWidth);
    this.ctx.closePath();

    this.ctx.fillStyle = strokeColor;
    this.ctx.fill();
    this.ctx.restore();
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  updateAndDrawConfetti() {
    this.confetti.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.vr;
      p.alpha -= 0.007;

      if (p.alpha <= 0) {
        this.confetti.splice(idx, 1);
        return;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
      this.ctx.restore();
    });
  }

  startRenderingLoop() {
    const loop = () => {
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  setupEventListeners() {
    // Window Resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.syncVisualPosImmediate();
    });

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'w'].includes(key)) {
        e.preventDefault();
        this.tryMove('up');
      } else if (['arrowdown', 's'].includes(key)) {
        e.preventDefault();
        this.tryMove('down');
      } else if (['arrowleft', 'a'].includes(key)) {
        e.preventDefault();
        this.tryMove('left');
      } else if (['arrowright', 'd'].includes(key)) {
        e.preventDefault();
        this.tryMove('right');
      } else if (key === 'z') {
        this.undo();
      } else if (key === 'r') {
        this.resetState();
      }
    });

    // Mobile Virtual D-Pad
    const setupDpadBtn = (id, dir) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      const handlePress = (e) => {
        e.preventDefault();
        btn.classList.add('active');
        this.tryMove(dir);
      };
      const handleRelease = () => btn.classList.remove('active');

      btn.addEventListener('pointerdown', handlePress);
      btn.addEventListener('pointerup', handleRelease);
      btn.addEventListener('pointerleave', handleRelease);
    };

    setupDpadBtn('dpad-up', 'up');
    setupDpadBtn('dpad-down', 'down');
    setupDpadBtn('dpad-left', 'left');
    setupDpadBtn('dpad-right', 'right');

    // Canvas Swipe Gestures
    let touchStartX = 0;
    let touchStartY = 0;
    this.canvasFrame.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.canvasFrame.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const threshold = 28;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > threshold) {
          this.tryMove(dx > 0 ? 'right' : 'left');
        }
      } else {
        if (Math.abs(dy) > threshold) {
          this.tryMove(dy > 0 ? 'down' : 'up');
        }
      }
    }, { passive: true });

    // Toolbar buttons
    document.getElementById('btn-undo').addEventListener('click', () => this.undo());
    document.getElementById('btn-reset').addEventListener('click', () => this.resetState());

    // Level Selector
    this.levelSelectEl.addEventListener('change', (e) => {
      this.loadLevel(e.target.value);
    });

    // Sound toggle
    this.soundBtn.addEventListener('click', () => {
      this.sound.enabled = !this.sound.enabled;
      if (this.sound.enabled) {
        this.sound.init();
        this.soundIconOn.classList.remove('hidden');
        this.soundIconOff.classList.add('hidden');
      } else {
        this.soundIconOn.classList.add('hidden');
        this.soundIconOff.classList.remove('hidden');
      }
    });

    // Help Modal
    document.getElementById('btn-help').addEventListener('click', () => {
      this.helpModal.classList.remove('hidden');
    });
    document.getElementById('btn-close-help').addEventListener('click', () => {
      this.helpModal.classList.add('hidden');
    });
    document.getElementById('btn-understood').addEventListener('click', () => {
      this.helpModal.classList.add('hidden');
    });

    // Victory Modal Buttons
    document.getElementById('btn-next-level').addEventListener('click', () => {
      this.victoryModal.classList.add('hidden');
      if (this.currentLevelIndex < BUILT_IN_LEVELS.length - 1) {
        this.levelSelectEl.value = this.currentLevelIndex + 1;
        this.loadLevel(this.currentLevelIndex + 1);
      } else {
        this.levelSelectEl.value = 'random';
        this.loadLevel('random');
      }
    });

    document.getElementById('btn-replay').addEventListener('click', () => {
      this.victoryModal.classList.add('hidden');
      this.resetState();
    });
  }
}

// Start game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new ArrowMazeGame();
});
