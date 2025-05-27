
const levels = [
    { size: 8, lockedCells: [], linesGoal: 5 },
    { size: 8, lockedCells: [[2, 2], [2, 3], [3, 2], [3, 3]], linesGoal: 7 },
    { size: 8, lockedCells: [[1, 1], [1, 6], [6, 1], [6, 6]], linesGoal: 8 },
    { size: 7, lockedCells: [[2, 2], [4, 4]], linesGoal: 6 },
    { size: 7, lockedCells: [[1, 3], [3, 1], [5, 3]], linesGoal: 7 },
    { size: 7, lockedCells: [[0, 0], [0, 6], [6, 0], [6, 6]], linesGoal: 8 },
    { size: 6, lockedCells: [[2, 2]], linesGoal: 5 },
    { size: 6, lockedCells: [[1, 1], [1, 4], [4, 1], [4, 4]], linesGoal: 6 },
    { size: 6, lockedCells: [[2, 2], [3, 3], [2, 3], [3, 2]], linesGoal: 7 },
    { size: 6, lockedCells: [[0, 2], [2, 0], [4, 2], [2, 4]], linesGoal: 8 },
    { size: 5, lockedCells: [[2, 2]], linesGoal: 5 },
    { size: 5, lockedCells: [[1, 1], [1, 3], [3, 1], [3, 3]], linesGoal: 6 },
    { size: 5, lockedCells: [[0, 0], [0, 4], [4, 0], [4, 4]], linesGoal: 7 },
    { size: 5, lockedCells: [[2, 1], [2, 3], [1, 2], [3, 2]], linesGoal: 8 },
    { size: 5, lockedCells: [[1, 1], [1, 3], [3, 1], [3, 3], [2, 2]], linesGoal: 9 },
    { size: 4, lockedCells: [[1, 1]], linesGoal: 5 },
    { size: 4, lockedCells: [[1, 2], [2, 1]], linesGoal: 6 },
    { size: 4, lockedCells: [[0, 0], [0, 3], [3, 0]], linesGoal: 7 },
    { size: 4, lockedCells: [[1, 1], [1, 2], [2, 1], [2, 2]], linesGoal: 8 },
    { size: 4, lockedCells: [[0, 1], [1, 0], [2, 3], [3, 2]], linesGoal: 9 },
    { size: 4, lockedCells: [[1, 1], [1, 2], [2, 1], [2, 2], [0, 0]], linesGoal: 10 },
    { size: 3, lockedCells: [], linesGoal: 5 },
    { size: 3, lockedCells: [[1, 1]], linesGoal: 6 },
    { size: 3, lockedCells: [[0, 0], [0, 2]], linesGoal: 7 },
    { size: 3, lockedCells: [[1, 0], [1, 2]], linesGoal: 8 },
    { size: 3, lockedCells: [[0, 1], [2, 1]], linesGoal: 9 },
    { size: 3, lockedCells: [[0, 0], [0, 2], [2, 0]], linesGoal: 10 },
    { size: 3, lockedCells: [[1, 0], [1, 2], [0, 1]], linesGoal: 11 },
    { size: 3, lockedCells: [[0, 0], [0, 2], [2, 0], [2, 2]], linesGoal: 12 },
    { size: 3, lockedCells: [[0, 0], [0, 2], [2, 0], [2, 2], [1, 1]], linesGoal: 13 } // Removed trailing comma
];

const blockShapes = [
    { name: 'square', cells: [[0, 0], [0, 1], [1, 0], [1, 1]] }, // مربع 2x2
    { name: 'L', cells: [[0, 0], [1, 0], [2, 0], [2, 1]] }, // شكل L
    { name: 'T', cells: [[0, 0], [0, 1], [0, 2], [1, 1]] }, // شكل T
    { name: 'I-short', cells: [[0,0], [1,0], [2,0]]}, // خط 3x1
    { name: 'I-long', cells: [[0,0], [1,0], [2,0], [3,0]]}, // خط 4x1 (renamed from 'line' for clarity)
    { name: 'dot', cells: [[0,0]]}, // نقطة 1x1
    { name: 'L-small', cells: [[0,0], [1,0], [1,1]] } // L صغير // Removed trailing comma
];


let board: number[][];
let score: number;
let linesCleared: number;
let boardSize: number;
let linesGoal: number;
let currentLevelIndex: number;

const gameBoardElement = document.getElementById('game-board') as HTMLElement;
const scoreDisplay = document.getElementById('score') as HTMLElement;
const messageDisplay = document.getElementById('message') as HTMLElement;
const blockArea = document.getElementById('block-area') as HTMLElement;
const levelTitle = document.getElementById('level-title') as HTMLElement;
const levelSelection = document.getElementById('level-selection') as HTMLElement;
const gameArea = document.getElementById('game-area') as HTMLElement;

function initializeGame(levelIndex: number) {
    currentLevelIndex = levelIndex;
    const level = levels[levelIndex];
    boardSize = level.size;
    linesGoal = level.linesGoal;
    
    board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(0));
    score = 0;
    linesCleared = 0;

    levelTitle.textContent = `المستوى ${levelIndex + 1} (الهدف: ${linesGoal} خطوط)`;
    gameBoardElement.style.gridTemplateColumns = `repeat(${boardSize}, 40px)`;
    gameBoardElement.style.gridTemplateRows = `repeat(${boardSize}, 40px)`; // Ensure rows are also set

    level.lockedCells.forEach(([row, col]) => {
        if (row < boardSize && col < boardSize) {
            board[row][col] = 2; // 2 for locked
        }
    });

    gameBoardElement.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i.toString();
            cell.dataset.col = j.toString();
            if (board[i][j] === 2) {
                cell.classList.add('locked');
            }
            cell.addEventListener('dragover', handleDragOver);
            cell.addEventListener('drop', handleDrop);
            gameBoardElement.appendChild(cell);
        }
    }

    blockArea.innerHTML = '';
    for (let i = 0; i < 2; i++) { // Start with 2 blocks
        addNewBlock();
    }
    updateScoreDisplay();
    messageDisplay.textContent = '';
    messageDisplay.classList.remove('error');
}

function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
}

function handleDrop(e: DragEvent | CustomEvent) {
    e.preventDefault();
    
    let blockId: string | null = null;
    let shapeName: string | null = null;
    let targetElement: HTMLElement | null = e.target as HTMLElement;

    if (e instanceof DragEvent && e.dataTransfer) {
        blockId = e.dataTransfer.getData('text/plain');
        shapeName = e.dataTransfer.getData('shape');
    } else if (e instanceof CustomEvent && e.detail) {
        blockId = e.detail.id;
        shapeName = e.detail.shape;
        // For touch, e.target might not be the cell, so we use the element from detail
        targetElement = e.detail.targetCell || e.target as HTMLElement;
    }
    
    if (!blockId || !shapeName || !targetElement || !targetElement.classList.contains('cell')) return;

    const shape = blockShapes.find(s => s.name === shapeName);
    if (!shape) return;

    const row = parseInt(targetElement.dataset.row!);
    const col = parseInt(targetElement.dataset.col!);

    if (canPlaceBlock(row, col, shape.cells)) {
        shape.cells.forEach(([r, c]) => {
            if (row + r < boardSize && col + c < boardSize) {
                board[row + r][col + c] = 1; // 1 for filled
                const cell = gameBoardElement.querySelector(`[data-row="${row + r}"][data-col="${col + c}"]`) as HTMLElement;
                if (cell) cell.classList.add('filled');
            }
        });
        const blockElement = document.getElementById(blockId);
        if (blockElement) blockElement.remove();
        
        score += 10 * shape.cells.length; // Score for placing block
        checkLines(); // This will also update score display
        
        if (linesCleared < linesGoal) {
            addNewBlock();
        }
        messageDisplay.textContent = '';
        messageDisplay.classList.remove('error');

        if (linesCleared >= linesGoal) {
             // checkLines handles win condition message
        } else if (blockArea.children.length === 0 && !canAnyBlockBePlaced()) {
            messageDisplay.textContent = 'لا توجد حركات ممكنة. انتهت اللعبة!';
            messageDisplay.classList.add('error');
            // Optionally disable further actions or show a restart button for the level
        }

    } else {
        messageDisplay.textContent = 'لا يمكن وضع الكتلة هنا!';
        messageDisplay.classList.add('error');
    }
}

function canPlaceBlock(row: number, col: number, shapeCells: number[][]): boolean {
    for (const [r, c] of shapeCells) {
        const nextRow = row + r;
        const nextCol = col + c;
        if (nextRow >= boardSize || nextCol >= boardSize || nextRow < 0 || nextCol < 0 || board[nextRow][nextCol] !== 0) {
            return false;
        }
    }
    return true;
}

function checkLines() {
    let clearedSomething = false;
    let linesClearedThisTurn = 0;

    // Check rows
    for (let i = 0; i < boardSize; i++) {
        if (board[i].every(cell => cell === 1 || cell === 2)) { // Filled or locked
            linesClearedThisTurn++;
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === 1) board[i][j] = 0; // Clear only filled, not locked
            }
            clearedSomething = true;
        }
    }

    // Check columns
    for (let j = 0; j < boardSize; j++) {
        let columnFull = true;
        for (let i = 0; i < boardSize; i++) {
            if (board[i][j] === 0) { // Empty cell
                columnFull = false;
                break;
            }
        }
        if (columnFull) {
            linesClearedThisTurn++;
            for (let i = 0; i < boardSize; i++) {
                if (board[i][j] === 1) board[i][j] = 0; // Clear only filled, not locked
            }
            clearedSomething = true;
        }
    }

    if (clearedSomething) {
        linesCleared += linesClearedThisTurn;
        score += 100 * linesClearedThisTurn * linesClearedThisTurn; // Bonus for multiple lines
        updateBoardGraphics();
        messageDisplay.textContent = `تم مسح ${linesClearedThisTurn} خط!`;
        messageDisplay.classList.remove('error');
    }
    
    updateScoreDisplay();

    if (linesCleared >= linesGoal) {
        messageDisplay.textContent = 'مبروك! لقد أكملت المستوى!';
        messageDisplay.classList.remove('error');
        blockArea.innerHTML = ''; // Clear remaining blocks

        // Unlock next level
        if (currentLevelIndex + 1 < levels.length) {
            localStorage.setItem(`level_${currentLevelIndex + 1}_unlocked`, 'true');
            updateLevelButtons();
        }

        setTimeout(() => {
            if (currentLevelIndex + 1 < levels.length) {
                // showLevelSelection(); // Or automatically start next level
                 messageDisplay.textContent = `انقر على "العودة إلى القائمة" ثم اختر المستوى ${currentLevelIndex + 2}!`;
            } else {
                messageDisplay.textContent = 'مبروك! لقد أكملت جميع المستويات!';
            }
        }, 2000);
    }
}

function updateBoardGraphics() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = gameBoardElement.querySelector(`[data-row="${i}"][data-col="${j}"]`) as HTMLElement;
            if (cell) {
                cell.classList.toggle('filled', board[i][j] === 1);
                // 'locked' class is set at initialization and doesn't change
            }
        }
    }
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `النقاط: ${score} | الخطوط: ${linesCleared}/${linesGoal}`;
}

function addNewBlock() {
    if (linesCleared >= linesGoal || blockArea.children.length >= 3) return; // Max 3 blocks

    const shapeData = blockShapes[Math.floor(Math.random() * blockShapes.length)];
    const newBlockElement = document.createElement('div');
    newBlockElement.classList.add('block');
    newBlockElement.id = `block_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    newBlockElement.dataset.shape = shapeData.name;
    newBlockElement.draggable = true;

    // Determine bounds of the shape to center it in the 4x4 preview
    let minR = 0, maxR = 0, minC = 0, maxC = 0;
    if (shapeData.cells.length > 0) {
        minR = Math.min(...shapeData.cells.map(c => c[0]));
        maxR = Math.max(...shapeData.cells.map(c => c[0]));
        minC = Math.min(...shapeData.cells.map(c => c[1]));
        maxC = Math.max(...shapeData.cells.map(c => c[1]));
    }
    
    const shapeHeight = maxR - minR + 1;
    const shapeWidth = maxC - minC + 1;

    const rowOffset = Math.floor((4 - shapeHeight) / 2);
    const colOffset = Math.floor((4 - shapeWidth) / 2);

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const blockCell = document.createElement('div');
            blockCell.classList.add('block-cell');
            if (shapeData.cells.some(([r, c]) => (r - minR + rowOffset) === i && (c - minC + colOffset) === j)) {
                blockCell.classList.add('filled');
            }
            newBlockElement.appendChild(blockCell);
        }
    }

    newBlockElement.addEventListener('dragstart', (e: DragEvent) => {
        if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', newBlockElement.id);
            e.dataTransfer.setData('shape', newBlockElement.dataset.shape!);
            e.dataTransfer.effectAllowed = 'move';
        }
        setTimeout(() => newBlockElement.style.opacity = '0.5', 0); // Visual feedback
    });

    newBlockElement.addEventListener('dragend', () => {
         newBlockElement.style.opacity = '1'; // Reset opacity
    });
    
    // Basic Touch Support
    let touchStartX = 0;
    let touchStartY = 0;
    let dragImage: HTMLElement | null = null; // Element to show while dragging

    newBlockElement.addEventListener('touchstart', (e: TouchEvent) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;

            // Create a visual clone for dragging
            dragImage = newBlockElement.cloneNode(true) as HTMLElement;
            dragImage.style.position = 'absolute';
            dragImage.style.zIndex = '1000';
            dragImage.style.opacity = '0.7';
            dragImage.style.pointerEvents = 'none'; // Don't let it interfere with drop targets
            document.body.appendChild(dragImage);
            updateDragImagePosition(touch.clientX, touch.clientY);
            
            newBlockElement.style.opacity = '0.5'; // Make original semi-transparent
        }
        e.preventDefault(); // Prevent scrolling
    }, { passive: false });

    newBlockElement.addEventListener('touchmove', (e: TouchEvent) => {
        if (e.touches.length === 1 && dragImage) {
            const touch = e.touches[0];
            updateDragImagePosition(touch.clientX, touch.clientY);
        }
        e.preventDefault();
    }, { passive: false });

    newBlockElement.addEventListener('touchend', (e: TouchEvent) => {
        if (dragImage) {
            const touch = e.changedTouches[0];
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
            
            if (dropTarget && dropTarget.classList.contains('cell')) {
                 const dropEvent = new CustomEvent('drop', {
                    bubbles: true,
                    detail: {
                        id: newBlockElement.id,
                        shape: newBlockElement.dataset.shape,
                        targetCell: dropTarget // Pass the actual cell under touch
                    }
                });
                dropTarget.dispatchEvent(dropEvent);
            }
            document.body.removeChild(dragImage);
            dragImage = null;
        }
        newBlockElement.style.opacity = '1'; // Reset opacity
        e.preventDefault();
    }, { passive: false });
    
    function updateDragImagePosition(x: number, y: number) {
        if (dragImage) {
            // Center the drag image on the touch point
            dragImage.style.left = `${x - dragImage.offsetWidth / 2}px`;
            dragImage.style.top = `${y - dragImage.offsetHeight / 2}px`;
        }
    }

    blockArea.appendChild(newBlockElement);
}

function canAnyBlockBePlaced(): boolean {
    const availableBlocks = Array.from(blockArea.children) as HTMLElement[];
    for (const blockElement of availableBlocks) {
        const shapeName = blockElement.dataset.shape;
        if (!shapeName) continue;
        const shape = blockShapes.find(s => s.name === shapeName);
        if (!shape) continue;

        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                if (canPlaceBlock(r, c, shape.cells)) {
                    return true; // Found a place for at least one block
                }
            }
        }
    }
    return false; // No block can be placed anywhere
}


function showLevelSelection() {
    gameArea.style.display = 'none';
    levelSelection.style.display = 'block';
    document.getElementById('message')!.textContent = '';
    updateLevelButtons();
}

function updateLevelButtons() {
    const levelButtonsContainer = document.getElementById('level-buttons')!;
    levelButtonsContainer.innerHTML = ''; // Clear existing buttons

    levels.forEach((_, index) => {
        const button = document.createElement('button');
        button.classList.add('level-button');
        const isUnlocked = index === 0 || localStorage.getItem(`level_${index}_unlocked`) === 'true';
        
        if (isUnlocked) {
            button.textContent = `المستوى ${index + 1}`;
            button.addEventListener('click', () => {
                levelSelection.style.display = 'none';
                gameArea.style.display = 'block';
                initializeGame(index);
            });
        } else {
            button.textContent = `المستوى ${index + 1} (مغلق)`;
            button.disabled = true;
            button.style.opacity = '0.5';
        }
        levelButtonsContainer.appendChild(button);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('back-button') as HTMLButtonElement;
    const backgroundUpload = document.getElementById('background-upload') as HTMLInputElement;

    updateLevelButtons(); // Initial population of level buttons

    backButton.addEventListener('click', () => {
        showLevelSelection();
    });

    backgroundUpload.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                localStorage.setItem('customBackground', result);
                document.body.style.backgroundImage = `url(${result})`;
                document.body.style.backgroundSize = 'cover'; // Ensure this is reapplied
                document.body.style.backgroundPosition = 'center';
                messageDisplay.textContent = 'تم تغيير الخلفية!';
                messageDisplay.classList.remove('error');
            };
            reader.readAsDataURL(file);
        } else {
            messageDisplay.textContent = 'يرجى اختيار صورة صالحة!';
            messageDisplay.classList.add('error');
        }
    });

    const savedBackground = localStorage.getItem('customBackground');
    if (savedBackground) {
        document.body.style.backgroundImage = `url(${savedBackground})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }

    // Show level selection by default
    showLevelSelection();
});

// Ensure process is defined for environments that might expect it (like dev servers)
// but avoid issues if it's not (e.g. strict browser environments)
if (typeof process === 'undefined') {
  (window as any).process = { env: {} };
}
