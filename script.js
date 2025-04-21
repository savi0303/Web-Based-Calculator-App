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
        let expression = resultDisplay.value.replace('^', '**');
        let result = eval(expression); // Note: eval is used for simplicity; consider a safer parser for production
        if (isNaN(result) || !isFinite(result)) {
            resultDisplay.value = 'Error';
            return;
        }
        resultDisplay.value = result;
        addToHistory(`${expression} = ${result}`);
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