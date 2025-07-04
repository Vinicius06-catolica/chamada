document.addEventListener('DOMContentLoaded', () => {
    const stage = document.getElementById('particle-stage');
    const actionButton = document.getElementById('actionButton');
    const finalMessage = document.getElementById('final-message');

    const word = 'CHAMADA';
    let currentIndex = 0;
    const particlesByLetter = []; // Armazena os grupos de partículas de cada letra

    const buttonTexts = [
        "clica aqui", "de novo...", "continue...", "mais uma...", "tá quase...", "só falta uma...", "o último passo..."
    ];

    const letterPositions = [
        { top: '20%', left: '15%' }, { top: '25%', left: '80%' }, { top: '70%', left: '10%' },
        { top: '50%', left: '50%' }, { top: '80%', left: '85%' }, { top: '15%', left: '45%' }, { top: '75%', left: '60%' }
    ];

    // --- FUNÇÕES DO MOTOR DE PARTÍCULAS ---

    function getTextCoordinates(text, fontSize) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = fontSize * text.length;
        canvas.height = fontSize * 1.5;
        ctx.font = `900 ${fontSize}px 'Orbitron'`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const coordinates = [];
        for (let y = 0; y < imageData.height; y += 4) { // Pula 4 pixels para otimizar
            for (let x = 0; x < imageData.width; x += 4) {
                if (imageData.data[(y * imageData.width + x) * 4 + 3] > 128) {
                    coordinates.push({ x: x, y: y });
                }
            }
        }
        return coordinates;
    }

    function createLetterFromParticles(letter, position) {
        const letterCoords = getTextCoordinates(letter, 120);
        const newParticles = [];
        
        const viewportX = window.innerWidth * (parseInt(position.left) / 100);
        const viewportY = window.innerHeight * (parseInt(position.top) / 100);

        letterCoords.forEach(coord => {
            const p = document.createElement('div');
            p.classList.add('particle');
            
            // Posição inicial: espalhada ao redor do local de formação
            const initialX = viewportX + (Math.random() - 0.5) * 300;
            const initialY = viewportY + (Math.random() - 0.5) * 300;
            
            p.style.transform = `translate(${initialX}px, ${initialY}px)`;
            stage.appendChild(p);
            newParticles.push({ element: p, target: coord });

            // Anima para a posição final da letra
            setTimeout(() => {
                p.style.transform = `translate(${viewportX + coord.x}px, ${viewportY + coord.y}px)`;
            }, 50);
        });
        particlesByLetter.push(newParticles);
    }
    
    // --- FUNÇÕES DE ORQUESTRAÇÃO ---

    function gatherAllParticles() {
        actionButton.style.display = 'none';
        const finalWordCoords = getTextCoordinates(word, 100);
        const allParticles = particlesByLetter.flat();
        
        // Embaralha para um reagrupamento mais caótico e bonito
        allParticles.sort(() => Math.random() - 0.5);

        const centerX = window.innerWidth / 2 - (finalWordCoords.reduce((max, p) => Math.max(max, p.x), 0) / 2);
        const centerY = window.innerHeight / 2 - (finalWordCoords.reduce((max, p) => Math.max(max, p.y), 0) / 2);

        allParticles.forEach((particleData, i) => {
            if (i < finalWordCoords.length) {
                const target = finalWordCoords[i];
                particleData.element.style.transform = `translate(${centerX + target.x}px, ${centerY + target.y}px)`;
            } else {
                // Esconde partículas excedentes
                particleData.element.style.opacity = '0';
            }
        });

        setTimeout(() => {
            finalMessage.style.opacity = '1';
            finalMessage.style.transform = 'translateY(0)';
        }, 1500); // Mostra a mensagem final
    }

    function handleButtonClick() {
        if (currentIndex < word.length) {
            actionButton.textContent = buttonTexts[currentIndex];
            createLetterFromParticles(word[currentIndex], letterPositions[currentIndex]);
            currentIndex++;

            if (currentIndex === word.length) {
                actionButton.textContent = "Revelar";
            }
        } else {
            gatherAllParticles();
        }
    }

    actionButton.addEventListener('click', handleButtonClick);
});