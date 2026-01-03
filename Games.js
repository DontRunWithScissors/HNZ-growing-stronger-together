// Game switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all menu buttons and game containers
    const menuButtons = document.querySelectorAll('.menu-btn');
    const gameContainers = document.querySelectorAll('.game-container');
    
    // Function to switch games
    function switchGame(gameId) {
        // Hide all game containers
        gameContainers.forEach(container => {
            container.classList.remove('active');
        });
        
        // Remove active class from all buttons
        menuButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected game
        const selectedGame = document.getElementById(gameId);
        if (selectedGame) {
            selectedGame.classList.add('active');
        }
        
        // Add active class to clicked button
        const activeButton = document.querySelector(`[data-game="${gameId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Log game switch for debugging
        console.log(`Switched to ${gameId}`);
    }
    
    // Add click event listeners to all menu buttons
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game');
            switchGame(gameId);
        });
    });
    
    // Initialize - make sure first game is active
    switchGame('game1');
});

// ============================================
// GAME LOGIC SECTION
// ============================================

// Game 1: Color the Cars - Coloring Game
let selectedColor = '#FF1744'; // Default color

function initGame1() {
    console.log('Game 1: Coloring Game initialized');
    
    // Get all color buttons
    const colorButtons = document.querySelectorAll('.color-btn');
    const cars = document.querySelectorAll('.colorable-car');
    const resetBtn = document.querySelector('.reset-btn');
    
    // Store original car colors
    const originalColors = new Map();
    
    // Wait for images to load, then convert to inline SVG
    cars.forEach(car => {
        const carId = car.getAttribute('data-car');
        const imgSrc = car.getAttribute('src');
        
        // Fetch the SVG content
        fetch(imgSrc)
            .then(response => response.text())
            .then(svgText => {
                // Parse the SVG
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                const svgElement = svgDoc.querySelector('svg');
                
                if (svgElement) {
                    // Get original SVG dimensions
                    const originalWidth = svgElement.getAttribute('width');
                    const originalHeight = svgElement.getAttribute('height');
                    
                    // Set viewBox if not present
                    if (!svgElement.getAttribute('viewBox')) {
                        svgElement.setAttribute('viewBox', `0 0 ${originalWidth} ${originalHeight}`);
                    }
                    
                    // Set SVG attributes
                    svgElement.classList.add('car', 'colorable-car');
                    svgElement.setAttribute('data-car', carId);
                    svgElement.id = car.id;
                    
                    // Remove fixed width/height to allow CSS to control size
                    svgElement.removeAttribute('width');
                    svgElement.removeAttribute('height');
                    
                    // Apply inline styles for positioning
                    svgElement.style.position = 'absolute';
                    svgElement.style.width = '80px';
                    svgElement.style.height = 'auto';
                    svgElement.style.cursor = 'pointer';
                    svgElement.style.filter = 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))';
                    svgElement.style.transition = 'all 0.3s ease';
                    svgElement.style.pointerEvents = 'auto';
                    
                    // Position the SVG
                    if (carId === '1') {
                        svgElement.style.top = '15%';
                        svgElement.style.left = '55%';
                        svgElement.style.transform = 'translateX(-50%)';
                    } else if (carId === '2') {
                        svgElement.style.top = '65%';
                        svgElement.style.left = '30%';
                        svgElement.style.transform = 'translateX(-50%)';
                    }
                    
                    // Store original fills
                    const paths = svgElement.querySelectorAll('path');
                    const fills = Array.from(paths).map(path => path.getAttribute('fill'));
                    originalColors.set(carId, fills);
                    
                    // Create a clipPath definition
                    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
                    clipPath.setAttribute('id', `car-clip-${carId}`);
                    
                    // Add all paths to the clipPath
                    paths.forEach(path => {
                        const clipPathElement = path.cloneNode(true);
                        clipPath.appendChild(clipPathElement);
                    });
                    
                    defs.appendChild(clipPath);
                    svgElement.insertBefore(defs, svgElement.firstChild);
                    
                    // Create a colored background rectangle (will be clipped to car shape)
                    const colorRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    colorRect.setAttribute('x', '0');
                    colorRect.setAttribute('y', '0');
                    colorRect.setAttribute('width', '100%');
                    colorRect.setAttribute('height', '100%');
                    colorRect.setAttribute('fill', 'transparent');
                    colorRect.setAttribute('clip-path', `url(#car-clip-${carId})`);
                    colorRect.setAttribute('class', 'car-color-layer');
                    
                    // Insert color rectangle after defs (bottom layer)
                    svgElement.insertBefore(colorRect, paths[0]);
                    
                    // Create a group for stroke outlines (will go on top)
                    const outlineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    outlineGroup.setAttribute('class', 'outline-layer');
                    
                    // Clone all paths for the outline layer - use STROKE instead of FILL
                    paths.forEach(path => {
                        const outlinePath = path.cloneNode(true);
                        outlinePath.setAttribute('fill', 'none');
                        outlinePath.setAttribute('stroke', 'black');
                        outlinePath.setAttribute('stroke-width', '2');
                        outlinePath.setAttribute('class', 'outline-path');
                        outlineGroup.appendChild(outlinePath);
                    });
                    
                    // Hide original paths (keep them but make invisible)
                    paths.forEach(path => {
                        path.setAttribute('fill', 'none');
                        path.setAttribute('stroke', 'none');
                    });
                    
                    // Add outline group at the end (so it's on top)
                    svgElement.appendChild(outlineGroup);
                    
                    // Position the SVG
                    if (carId === '1') {
                        svgElement.style.top = '15%';
                        svgElement.style.left = '55%';
                        svgElement.style.transform = 'translateX(-50%)';
                    } else if (carId === '2') {
                        svgElement.style.top = '65%';
                        svgElement.style.left = '30%';
                        svgElement.style.transform = 'translateX(-50%)';
                    }
                    
                    // Replace img with inline SVG
                    car.parentNode.replaceChild(svgElement, car);
                    
                    console.log(`Car ${carId} loaded successfully`);
                    
                    // Add click handler to SVG
                    svgElement.addEventListener('click', function() {
                        // Color the background rectangle (clipped to car shape)
                        colorRect.setAttribute('fill', selectedColor);
                        
                        // Animation feedback
                        const baseTransform = this.style.transform;
                        this.style.transform = baseTransform + ' scale(1.15)';
                        setTimeout(() => {
                            this.style.transform = baseTransform;
                        }, 200);
                        
                        console.log(`Car ${carId} colored with ${selectedColor}`);
                    });
                    
                    // Hover effect
                    svgElement.addEventListener('mouseenter', function() {
                        this.style.filter = 'drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4))';
                    });
                    
                    svgElement.addEventListener('mouseleave', function() {
                        this.style.filter = 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))';
                    });
                    
                    // Hover effect
                    svgElement.addEventListener('mouseenter', function() {
                        this.style.filter = 'drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4))';
                    });
                    
                    svgElement.addEventListener('mouseleave', function() {
                        this.style.filter = 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))';
                    });
                }
            })
            .catch(err => {
                console.error('Error loading SVG:', err);
                // Keep the original img if fetch fails
            });
    });
    
    // Color button click handler
    colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            colorButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedColor = this.getAttribute('data-color');
            console.log('Selected color:', selectedColor);
        });
    });
    
    // Reset button handler
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            const colorLayers = document.querySelectorAll('.car-color-layer');
            colorLayers.forEach(layer => {
                layer.setAttribute('fill', 'transparent');
            });
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
            
            console.log('Colors reset');
        });
    }
}

// Initialize Game 1 when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initGame1();
});

// Game 2: Shape Finder
function initGame2() {
    console.log('Game 2 initialized');
    // Add your Game 2 logic here
}

// Game 3: Number Fun
function initGame3() {
    console.log('Game 3 initialized');
    // Add your Game 3 logic here
}

// Utility function to clear game state
function clearGameState() {
    // Add any cleanup logic needed when switching games
    console.log('Clearing game state');
}