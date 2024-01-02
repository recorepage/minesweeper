const arena = document.getElementById('arena')
const style = document.getElementById('style')
const cell = document.querySelectorAll('.cell')
let width = 16
let height = 16
let prob = 0.14
let bombCount = Math.round(width * height * prob)
let win = false
let content = {}
const loadGrid = (a, b) => {
    let size
    let border
    let borderOpen
    let font
    arena.style.aspectRatio = `${a} / ${b}`
    if (window.innerHeight/b > window.innerWidth/a){
        arena.style.width = '90vw'
        size = 'calc(90vw/'+a+')'
        border = `calc(90vw/${a*7})`
        borderOpen = `calc(90vw/${a*21})`
        font = `calc(90vw/${a*7/5})`

    } else {
        arena.style.height = '90vh'
        size = 'calc(90vh/'+b+')'
        border = `calc(90vh/${b*7})`
        borderOpen = `calc(90vh/${b*21})`
        font = `calc(90vh/${b*7/4})`
    }
    style.innerHTML += `.cell{width:${size};height:${size};
    border-width:${border};font-size:${font};}
    .cell-reveal{
        border-width: ${borderOpen};
    }`
    for (let i = 0; i < b; i++) {
        for (let j = 0; j < a; j++) {
            arena.innerHTML += `<button class="cell" id="${j}i${i}j" onclick="reveal(${j},${i})" ondblclick="handleDoubleClick(${j},${i})"></button>`
            content[`${j}i${i}j`] = ''
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    loadGrid(width, height)
    putBombs(bombArr(bombCount))
    fillCell(width, height)
})
const bombArr = (n) => {
    let arr = []
    for (let i = 0; i < n; i++) {
        let x = Math.floor(Math.random() * width)
        let y = Math.floor(Math.random() * height)
        if (arr.includes(`${x}i${y}j`)) {
            i--
            continue
        } else {
            arr.push(`${x}i${y}j`)
        }
    }
    return arr
}
const putBombs = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        content[arr[i]] = '💣'
    }
}
const checkNeighbors = (x, y) => {
    let num = 0
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (document.getElementById(`${x+i}i${y+j}j`) !== null && content[`${x+i}i${y+j}j`] === '💣') {
                num++
            }
        }
    }
    return num
}
const fillCell = (x, y) => {
    for (let i = 0; i < y; i++) {
        for (let j = 0; j < x; j++) {
            if (content[`${j}i${i}j`] === '💣') {
                continue
            }
            if (checkNeighbors(j, i) === 0) {
                continue
            }
            content[`${j}i${i}j`] = checkNeighbors(j, i)
        }
    }
}
const printGrid = () => {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            document.getElementById(`${j}i${i}j`).innerHTML = content[`${j}i${i}j`]
        }
    }
}
const reveal = (x, y) => {
    if (content[`${x}i${y}j`] === '💣') {
        win = true
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (content[`${j}i${i}j`] === '💣') {
                    document.getElementById(`${j}i${i}j`).innerHTML = '💣'
                    document.getElementById(`${j}i${i}j`).classList.add('cell-reveal');
                }
            }
        }
    } else {
        document.getElementById(`${x}i${y}j`).innerHTML = content[`${x}i${y}j`]
        document.getElementById(`${x}i${y}j`).classList.add('cell-reveal');
        if (content[`${x}i${y}j`] === '') {
            const directions = [[0, 1], [0, -1], [-1, 0], [1, 0]];
    
            for (const [dx, dy] of directions) {
                const newX = x + dx;
                const newY = y + dy;
    
                // Check if the neighboring cell is within the grid boundaries
                if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                    // Only reveal if the cell is not already revealed
                    const neighborCell = document.getElementById(`${newX}i${newY}j`);
                    if (!neighborCell.classList.contains('cell-reveal')) {
                        reveal(newX, newY);
                    }
                }
            }
        }
    }
}
const handleDoubleClick = (x, y) => {
    const cellId = `${x}i${y}j`;
    const cell = document.getElementById(cellId);

    // Check if the cell is already revealed
    if (cell.classList.contains('cell-reveal')) {
        // Count the flagged cells around the current cell
        const flaggedNeighbors = countFlaggedNeighbors(x, y);

        // Check if the number of flagged neighbors matches the number on the cell
        if (flaggedNeighbors === parseInt(content[cellId], 10)) {
            // Double-click logic here (reveal neighbors)
            revealNeighbors(x, y);
        }
    }
};

const countFlaggedNeighbors = (x, y) => {
    const directions = [[0, 1], [0, -1], [-1, 0], [1, 0]];

    let count = 0;
    for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;

        // Check if the neighboring cell is within the grid boundaries
        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
            const neighborCell = document.getElementById(`${newX}i${newY}j`);
            // Check if the neighboring cell is flagged
            if (neighborCell.classList.contains('flagged')) {
                count++;
            }
        }
    }

    return count;
};

const revealNeighbors = (x, y) => {
    const directions = [[0, 1], [0, -1], [-1, 0], [1, 0]];

    for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;

        // Check if the neighboring cell is within the grid boundaries
        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
            const neighborCell = document.getElementById(`${newX}i${newY}j`);
            // Only reveal if the cell is not already revealed
            if (!neighborCell.classList.contains('cell-reveal')) {
                reveal(newX, newY);
            }
        }
    }
};
