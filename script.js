document.addEventListener('DOMContentLoaded', () => {
    const actionButton = document.getElementById('actionButton');
    const container = document.getElementById('container');
    const secondaryMessage = document.getElementById('secondary-message');
    
    const word = 'CHAMADA';
    let currentIndex = 0;
    const lettersOnScreen = [];

    const buttonTexts = [
        "clica aqui",    // Estado inicial
        "só o começo...",
        "continue...",
        "tá curioso(a)?",
        "falta pouco...",
        "mais um toque...",
        "o último."      // Texto antes do último clique
    ];

    const letterPositions = [
        { top: '15%', left: '20%' }, // C
        { top: '70%', left: '80%' }, // H
        { top: '20%', left: '75%' }, // A
        { top: '80%', left: '10%' }, // M
        { top: '40%', left: '10%' }, // A
        { top: '10%', left: '50%' }, // D
        { top: '65%', left: '45%' }  // A
    ];

    // Define o texto inicial do botão
    actionButton.textContent = buttonTexts[0];

    actionButton.addEventListener('click', handleButtonClick);

    function handleButtonClick() {
        if (currentIndex < word.length) {
            createLetter(word[currentIndex], currentIndex);
            currentIndex++;

            // Atualiza o texto do botão para o próximo clique de forma segura
            if (currentIndex < word.length) {
                actionButton.textContent = buttonTexts[currentIndex];
            }
        }

        if (currentIndex === word.length) {
            actionButton.style.opacity = '0';
            actionButton.style.pointerEvents = 'none';
            setTimeout(gatherLetters, 1200);
        }
    }

    function createLetter(char, index) {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'letter';
        letterSpan.textContent = char;
        container.appendChild(letterSpan);
        lettersOnScreen.push(letterSpan);

        // Acessa a posição pelo índice, sem modificar o array original
        const pos = letterPositions[index];
        letterSpan.style.top = pos.top;
        letterSpan.style.left = pos.left;
    }

    function gatherLetters() {
        const letterRect = lettersOnScreen[0].getBoundingClientRect();
        const letterWidth = letterRect.width;
        const totalWordWidth = letterWidth * word.length;
        const startLeft = (window.innerWidth - totalWordWidth) / 2;

        lettersOnScreen.forEach((letter, index) => {
            const targetLeft = startLeft + (index * letterWidth);
            letter.style.top = '50%';
            letter.style.left = `${targetLeft}px`;
            // Garante que a letra termine reta e centralizada verticalmente
            letter.style.transform = 'translateY(-50%) rotateY(0deg)';
        });
        
        setTimeout(() => {
            secondaryMessage.textContent = 'agora?';
            secondaryMessage.style.opacity = '1';
        }, 2000); 
    }
});