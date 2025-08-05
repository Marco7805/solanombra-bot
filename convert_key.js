const bs58 = require('bs58');

const key = '3bKQNUtuAbS7WiWAiW3njTbVsx8jEwJvPr2zppWdGf6BjCwhp9u4v7U5Xk65Afi5vZ4vLAcuKLfgGkr6qZrkEDvf';

try {
    const decoded = bs58.decode(key);
    const keyArray = Array.from(decoded);
    console.log(JSON.stringify(keyArray));
} catch (error) {
    console.error('Errore nella decodifica:', error.message);
} 