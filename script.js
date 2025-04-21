const resultDisplay = document.getElementById('result');
const historyPanel = document.getElementById('history');
let calculationHistory = [];

function appendToDisplay(value) {
    const lastChar = resultDisplay.value.slice(-1);
    const operators = ['+', '-', '*', '/', '^'];

    // Prevent multiple decimal points
    if (value === '.' && resultDisplay.value.includes('.')) {
        const lastNumber = resultDisplay.value.split(/[\+\-\*\/\^]/).pop();
        if (lastNumber.includes('.')) return;
    }

    // Prevent double operators
    if (operators.includes(value) && operators.includes(lastChar)) {
        resultDisplay.value = resultDisplay.value.slice(0, -1) + value;
        return;
    }

    // Prevent starting with operator (except minus)
    if (resultDisplay.value === '' && operators.includes(value) && value !== '-') {
        return;
    }

    resultDisplay.value += value;
}

function clearDisplay() {
    resultDisplay.value = '';
}

function calculate() {
    try {
        let expression = resultDisplay.value.replace(/\^/g, '**');
        let result = eval(expression); // Note: eval is used for simplicity; consider a safer parser for production
        if (isNaN(result) || !isFinite(result)) {
            resultDisplay.value = 'Error';
            return;
        }
        resultDisplay.value = result;
        addToHistory(`${resultDisplay.value.replace(/\*\*/g, '^')} = ${result}`);
    } catch (error) {
        resultDisplay.value = 'Error';
    }
}

function calculateSquareRoot() {
    try {
        const value = parseFloat(resultDisplay.value);
        if (value < 0) {
            resultDisplay.value = 'Error';
            return;
        }
        const result = Math.sqrt(value);
        resultDisplay.value = result;
        addToHistory(`√(${value}) = ${result}`);
    } catch (error) {
        resultDisplay.value = 'Error';
    }
}

function addToHistory(entry) {
    calculationHistory.push(entry);
    if (calculationHistory.length > 5) {
        calculationHistory.shift();
    }
    historyPanel.innerHTML = calculationHistory.map(item => `<div>${item}</div>`).join('');
    historyPanel.scrollTop = historyPanel.scrollHeight;
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    const numbers = '0123456789';
    const operators = '+-*/';
    if (numbers.includes(key)) {
        appendToDisplay(key);
    } else if (operators.includes(key)) {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '(' || key === ')') {
        appendToDisplay(key);
    }
});

// Create floating symbols
function createFloatingSymbols() {
    const symbols = ['+', '-', '×', '÷', '%', '=', '^', '√', '/'];
    const symbolsContainer = document.getElementById('floating-symbols');
    const numSymbols = 30;

    for (let i = 0; i < numSymbols; i++) {
        const symbol = document.createElement('div');
        symbol.className = 'symbol';
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Random starting position
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        symbol.style.left = `${startX}%`;
        symbol.style.top = `${startY}%`;
        
        // Random movement
        const translateX = (Math.random() - 0.5) * 100;
        const translateY = (Math.random() - 0.5) * 100;
        const rotation = (Math.random() - 0.5) * 360;
        
        symbol.style.setProperty('--translate-x', `${translateX}vw`);
        symbol.style.setProperty('--translate-y', `${translateY}vh`);
        symbol.style.setProperty('--rotation', `${rotation}deg`);
        
        // Random size and opacity
        symbol.style.fontSize = `${Math.random() * 24 + 16}px`;
        
        // Random animation duration
        const duration = Math.random() * 15 + 10;
        symbol.style.animationDuration = `${duration}s`;
        
        // Random delay
        const delay = Math.random() * 10;
        symbol.style.animationDelay = `${delay}s`;
        
        symbolsContainer.appendChild(symbol);
    }
}

// Initialize floating symbols
createFloatingSymbols();

// Regenerate symbols occasionally for variety
setInterval(() => {
    const symbolsContainer = document.getElementById('floating-symbols');
    symbolsContainer.innerHTML = '';
    createFloatingSymbols();
}, 30000); // Regenerate every 30 seconds