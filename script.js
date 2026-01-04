window.addEventListener('load', () => {
    initChecklistPersistence();
    initFishAnimation();
});

/* --- 1. Persistent Checklist Logic --- */
function initChecklistPersistence() {
    const checkboxes = document.querySelectorAll('.save-state');
    
    // Load saved states
    checkboxes.forEach(chk => {
        const savedState = localStorage.getItem(chk.id);
        if (savedState === 'true') {
            chk.checked = true;
        }
    });

    // Save on change
    checkboxes.forEach(chk => {
        chk.addEventListener('change', (e) => {
            localStorage.setItem(e.target.id, e.target.checked);
        });
    });

    // Reset button (for testing)
    const resetBtn = document.getElementById('reset-btn');
    if(resetBtn) {
        resetBtn.addEventListener('click', () => {
            localStorage.clear();
            checkboxes.forEach(chk => chk.checked = false);
            alert('체크리스트가 초기화되었습니다.');
        });
    }
}

/* --- 2. Fish Animation Logic (Top-Down) --- */
function initFishAnimation() {
    const canvas = document.getElementById('fish-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const fishImage = new Image();
    fishImage.src = 'assets/fish_topdown.png';

    let canvasWidth, canvasHeight;
    const fishArray = [];
    const numberOfFish = 12; // More fish for top-down view

    class Fish {
        constructor() {
            this.reset();
            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * canvasHeight;
        }

        reset() {
            this.scale = Math.random() * 0.3 + 0.2; // Smallish
            this.width = 100 * this.scale;  
            this.height = 100 * this.scale; // Assuming roughly square/oval asset
            
            // Random movement vector
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1 + 0.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            
            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * canvasHeight;
            
            // Start off-screen logic to prevent popping
            if (Math.random() > 0.5) {
                this.x = Math.random() > 0.5 ? -this.width : canvasWidth + this.width;
            } else {
                this.y = Math.random() > 0.5 ? -this.height : canvasHeight + this.height;
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around screen
            if (this.x < -this.width * 2) this.x = canvasWidth + this.width;
            if (this.x > canvasWidth + this.width) this.x = -this.width;
            if (this.y < -this.height * 2) this.y = canvasHeight + this.height;
            if (this.y > canvasHeight + this.height) this.y = -this.height;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            
            // Rotate to face movement direction
            // Since the source image is typically vertical (head up) or horizontal
            // We need to know the asset orientation. 
            // Assuming asset is "Head Up" (Vertical).
            const rotation = Math.atan2(this.vy, this.vx);
            ctx.rotate(rotation + Math.PI / 2); // Adjust +90deg if asset is head-up
            
            ctx.drawImage(fishImage, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }

    function resizeCanvas() {
        if (!canvas) return;
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }

    fishImage.onload = function() {
        resizeCanvas();
        for (let i = 0; i < numberOfFish; i++) {
            fishArray.push(new Fish());
        }
        animate();
    };

    window.addEventListener('resize', resizeCanvas);

    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        fishArray.forEach(fish => {
            fish.update();
            fish.draw();
        });
        requestAnimationFrame(animate);
    }
}
