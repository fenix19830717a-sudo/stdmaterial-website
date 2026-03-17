class GrindingSimulator {
    constructor() {
        this.state = {
            selectedMaterial: 'Battery Material',
            targetFineness: 0.5,
            capacity: 'production',
            operationMode: 'continuous',
            cooling: 'water',
            isSimulating: false,
            simulationProgress: 0,
            rotationSpeed: 800,
            coolingIntensity: 50
        };
        
        this.canvas = null;
        this.ctx = null;
        this.animationFrameId = null;
        this.particles = [];
        this.balls = [];
        this.chart = null;
        this.chartData = {
            labels: [],
            fineness: [],
            temperature: [],
            energy: []
        };
        
        // Animation optimization
        this.lastTime = 0;
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
        this.collisionEffects = [];
        this.grindingChamber = {
            centerX: 0,
            centerY: 0,
            radius: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeCanvas();
        this.initializeChart();
        this.updateRecommendations();
    }
    
    setupEventListeners() {
        document.getElementById('start-simulation')?.addEventListener('click', () => this.startSimulation());
        document.getElementById('reconfigure-btn')?.addEventListener('click', () => this.reconfigure());
        document.getElementById('pause-simulation')?.addEventListener('click', () => this.pauseSimulation());
        document.getElementById('reset-simulation')?.addEventListener('click', () => this.resetSimulation());
        
        document.querySelectorAll('.material-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectMaterial(e.currentTarget);
                this.updateRecommendations();
                this.updateSimulationStatus();
            });
        });
        
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectFinenessPreset(e.currentTarget);
                this.updateRecommendations();
                this.updateSimulationStatus();
            });
        });
        
        document.querySelectorAll('.capacity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectCapacity(e.currentTarget);
                this.updateRecommendations();
                this.updateSimulationStatus();
            });
        });
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectOperationMode(e.currentTarget);
                this.updateSimulationStatus();
            });
        });
        
        document.querySelectorAll('.cooling-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectCooling(e.currentTarget);
                this.updateSimulationStatus();
            });
        });
        
        const finenessSlider = document.getElementById('fineness-slider');
        if (finenessSlider) {
            finenessSlider.addEventListener('input', (e) => {
                this.updateFineness(e.target.value);
                this.updateRecommendations();
                this.updateSimulationStatus();
            });
        }
        
        const materialSearch = document.getElementById('material-search');
        if (materialSearch) {
            materialSearch.addEventListener('input', (e) => {
                this.searchMaterials(e.target.value);
            });
        }
        
        // Speed adjustment slider
        const speedSlider = document.getElementById('speed-slider');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                const speed = parseInt(e.target.value);
                this.state.rotationSpeed = speed;
                const speedValueEl = document.getElementById('speed-value');
                if (speedValueEl) {
                    speedValueEl.textContent = speed;
                }
                // Update animation speed
                this.updateBallSpeed();
            });
        }
        
        // Cooling intensity adjustment slider
        const coolingSlider = document.getElementById('cooling-slider');
        if (coolingSlider) {
            coolingSlider.addEventListener('input', (e) => {
                const cooling = parseInt(e.target.value);
                this.state.coolingIntensity = cooling;
                const coolingValueEl = document.getElementById('cooling-value');
                if (coolingValueEl) {
                    coolingValueEl.textContent = `${cooling}%`;
                }
            });
        }
    }
    
    searchMaterials(query) {
        const materialCards = document.querySelectorAll('.material-card');
        query = query.toLowerCase();
        
        materialCards.forEach(card => {
            const materialName = card.dataset.material.toLowerCase();
            const materialFeature = card.dataset.feature.toLowerCase();
            
            if (materialName.includes(query) || materialFeature.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    updateSimulationStatus() {
        const statusElement = document.getElementById('simulation-status');
        const modelElement = document.getElementById('selected-model-display');
        const timeElement = document.getElementById('estimated-time');
        
        if (statusElement) {
            statusElement.textContent = 'Ready';
            statusElement.className = 'text-success font-bold';
        }
        
        if (modelElement) {
            modelElement.textContent = document.getElementById('recommended-model')?.textContent || 'STD-Nano 800';
        }
        
        if (timeElement) {
            // Calculate estimated time based on selected parameters
            let estimatedTime = 45; // Default
            if (this.state.targetFineness < 0.1) {
                estimatedTime = 60; // Nano-scale takes longer
            } else if (this.state.targetFineness < 1) {
                estimatedTime = 45; // Sub-micron
            } else if (this.state.targetFineness < 10) {
                estimatedTime = 30; // Fine
            } else {
                estimatedTime = 20; // Coarse
            }
            
            timeElement.textContent = `${estimatedTime} minutes`;
        }
    }
    
    pauseSimulation() {
        if (!this.state.isSimulating) return;
        
        this.state.isSimulating = false;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Update status
        const statusElement = document.getElementById('simulation-status');
        if (statusElement) {
            statusElement.textContent = 'Paused';
            statusElement.className = 'text-warning font-bold';
        }
        
        console.log('Simulation paused');
    }
    
    resetSimulation() {
        if (this.state.isSimulating || this.state.simulationProgress > 0) {
            if (!confirm('Are you sure you want to reset the simulation? All progress will be lost.')) {
                return;
            }
        }
        
        this.state.isSimulating = false;
        this.state.simulationProgress = 0;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Reset canvas
        this.initializeParticles();
        
        // Reset chart data
        this.chartData = { labels: [], fineness: [], temperature: [], energy: [] };
        if (this.chart) {
            this.chart.data.labels = this.chartData.labels;
            this.chart.data.datasets[0].data = this.chartData.fineness;
            this.chart.data.datasets[1].data = this.chartData.temperature;
            this.chart.data.datasets[2].data = this.chartData.energy;
            this.chart.update();
        }
        
        // Reset real-time data
        this.updateRealTimeData(500, 25, 0, 800);
        
        // Reset status
        const statusElement = document.getElementById('simulation-status');
        if (statusElement) {
            statusElement.textContent = 'Ready';
            statusElement.className = 'text-success font-bold';
        }
        
        console.log('Simulation reset');
    }
    
    reconfigure() {
        document.querySelectorAll('#simulation-interface, #simulation-complete').forEach(el => {
            el.classList.add('hidden');
        });
    }
    
    selectMaterial(card) {
        document.querySelectorAll('.material-card').forEach(c => {
            c.classList.remove('border-primary', 'bg-primary/5');
            c.classList.add('border-white/10');
        });
        card.classList.remove('border-white/10');
        card.classList.add('border-primary', 'bg-primary/5');
        
        this.state.selectedMaterial = card.dataset.material;
        const selectedMaterialEl = document.getElementById('selected-material');
        if (selectedMaterialEl) {
            selectedMaterialEl.textContent = this.state.selectedMaterial;
        }
    }
    
    selectFinenessPreset(btn) {
        document.querySelectorAll('.preset-btn').forEach(b => {
            b.classList.remove('bg-primary/10', 'border-primary/30', 'text-primary');
            b.classList.add('bg-surface', 'border-white/10', 'text-text-primary');
        });
        btn.classList.remove('bg-surface', 'border-white/10', 'text-text-primary');
        btn.classList.add('bg-primary/10', 'border-primary/30', 'text-primary');
        
        this.updateFineness(btn.dataset.value);
        const slider = document.getElementById('fineness-slider');
        if (slider) {
            slider.value = btn.dataset.value;
        }
    }
    
    updateFineness(value) {
        this.state.targetFineness = parseFloat(value);
        const currentFinenessEl = document.getElementById('current-fineness');
        if (currentFinenessEl) {
            let displayValue = this.state.targetFineness;
            let unit = 'μm';
            let classification = '';
            
            if (displayValue < 0.1) {
                displayValue = displayValue * 1000;
                unit = 'nm';
                classification = ' (Nanoscale)';
            } else if (displayValue < 1) {
                classification = ' (Sub-micron)';
            } else if (displayValue < 10) {
                classification = ' (Ultrafine)';
            } else if (displayValue < 100) {
                classification = ' (Fine)';
            } else {
                classification = ' (Coarse)';
            }
            
            currentFinenessEl.textContent = `${displayValue}${unit}${classification}`;
        }
    }
    
    selectCapacity(btn) {
        document.querySelectorAll('.capacity-btn').forEach(b => {
            b.classList.remove('bg-primary/10', 'border-primary/30', 'text-primary');
            b.classList.add('bg-surface', 'border-white/10', 'text-text-primary');
        });
        btn.classList.remove('bg-surface', 'border-white/10', 'text-text-primary');
        btn.classList.add('bg-primary/10', 'border-primary/30', 'text-primary');
        
        this.state.capacity = btn.dataset.value;
    }
    
    selectOperationMode(btn) {
        document.querySelectorAll('.mode-btn').forEach(b => {
            b.classList.remove('bg-primary/10', 'border-primary/30', 'text-primary');
            b.classList.add('bg-surface', 'border-white/10', 'text-text-primary');
        });
        btn.classList.remove('bg-surface', 'border-white/10', 'text-text-primary');
        btn.classList.add('bg-primary/10', 'border-primary/30', 'text-primary');
        
        this.state.operationMode = btn.dataset.value;
    }
    
    selectCooling(btn) {
        document.querySelectorAll('.cooling-btn').forEach(b => {
            b.classList.remove('bg-primary/10', 'border-primary/30', 'text-primary');
            b.classList.add('bg-surface', 'border-white/10', 'text-text-primary');
        });
        btn.classList.remove('bg-surface', 'border-white/10', 'text-text-primary');
        btn.classList.add('bg-primary/10', 'border-primary/30', 'text-primary');
        
        this.state.cooling = btn.dataset.value;
    }
    
    updateRecommendations() {
        const { selectedMaterial, targetFineness, capacity, operationMode, cooling } = this.state;
        
        let model, jar, balls, estimatedCapacity, recommendations, modelExplanation;
        
        // Intelligent model matching based on multiple parameters
        if (targetFineness < 0.1) {
            // Nanoscale grinding
            if (capacity === 'production') {
                model = 'STD-Nano 1200';
                modelExplanation = 'High-capacity nano-grinding model for production scale';
            } else if (capacity === 'pilot') {
                model = 'STD-Nano 800';
                modelExplanation = 'Medium-capacity nano-grinding model for pilot scale';
            } else {
                model = 'STD-Nano 400';
                modelExplanation = 'Small-capacity nano-grinding model for laboratory use';
            }
            jar = 'Zirconia (Anti-contamination)';
            balls = 'Zirconia Balls Ø3mm';
        } else if (targetFineness < 1) {
            // Sub-micron grinding
            if (capacity === 'production') {
                model = 'STD-900';
                modelExplanation = 'High-capacity sub-micron grinding model';
            } else if (capacity === 'pilot') {
                model = 'STD-600';
                modelExplanation = 'Medium-capacity sub-micron grinding model';
            } else {
                model = 'STD-300';
                modelExplanation = 'Small-capacity sub-micron grinding model';
            }
            jar = 'Zirconia or Alumina';
            balls = 'Zirconia Balls Ø5mm';
        } else if (targetFineness < 10) {
            // Fine grinding
            if (capacity === 'production') {
                model = 'STD-800';
                modelExplanation = 'High-capacity fine grinding model';
            } else if (capacity === 'pilot') {
                model = 'STD-500';
                modelExplanation = 'Medium-capacity fine grinding model';
            } else {
                model = 'STD-200';
                modelExplanation = 'Small-capacity fine grinding model';
            }
            jar = 'Alumina';
            balls = 'Zirconia Balls Ø8mm';
        } else {
            // Coarse grinding
            if (capacity === 'production') {
                model = 'STD-700';
                modelExplanation = 'High-capacity coarse grinding model';
            } else if (capacity === 'pilot') {
                model = 'STD-400';
                modelExplanation = 'Medium-capacity coarse grinding model';
            } else {
                model = 'STD-100';
                modelExplanation = 'Small-capacity coarse grinding model';
            }
            jar = 'Alumina';
            balls = 'Steel Balls Ø10mm';
        }
        
        // Capacity-based recommendations
        switch(capacity) {
            case 'lab':
                estimatedCapacity = '0.5kg (0.125kg per jar × 4 jars)';
                break;
            case 'pilot':
                estimatedCapacity = '5kg (1.25kg per jar × 4 jars)';
                break;
            case 'production':
                estimatedCapacity = '15kg (3.75kg per jar × 4 jars)';
                break;
            default:
                estimatedCapacity = '15kg (3.75kg per jar × 4 jars)';
        }
        
        // Material-specific recommendations
        recommendations = [];
        if (selectedMaterial === 'Battery Material') {
            recommendations.push('Recommended water cooling to prevent heat damage');
            recommendations.push('Recommended intermittent operation mode, 15 min run / 5 min pause');
            recommendations.push('Optimal rotation speed: 800-1000 RPM');
            recommendations.push('Ball-to-powder ratio: 10:1');
        } else if (selectedMaterial === 'Ore') {
            recommendations.push('Recommended continuous operation mode');
            recommendations.push('Optimal rotation speed: 700-900 RPM');
            recommendations.push('Ball-to-powder ratio: 8:1');
            recommendations.push('Regular maintenance to prevent wear');
        } else if (selectedMaterial === 'Ceramic') {
            recommendations.push('Recommended intermittent operation mode to prevent overheating');
            recommendations.push('Optimal rotation speed: 600-800 RPM');
            recommendations.push('Ball-to-powder ratio: 12:1');
            recommendations.push('Use high-quality grinding media to prevent contamination');
        } else if (selectedMaterial === 'Chemical') {
            recommendations.push('Recommended corrosion-resistant materials');
            recommendations.push('Optimal rotation speed: 600-800 RPM');
            recommendations.push('Ball-to-powder ratio: 10:1');
            recommendations.push('Proper ventilation required');
        } else if (selectedMaterial === 'Pharmaceutical') {
            recommendations.push('Recommended clean room conditions');
            recommendations.push('Optimal rotation speed: 500-700 RPM');
            recommendations.push('Ball-to-powder ratio: 12:1');
            recommendations.push('Use FDA-approved materials');
        } else {
            recommendations.push('Recommended continuous operation mode');
            recommendations.push('Optimal rotation speed: 700-900 RPM');
            recommendations.push('Ball-to-powder ratio: 10:1');
        }
        
        // Operation mode and cooling recommendations
        if (operationMode === 'intermittent') {
            recommendations.push('Intermittent operation helps prevent overheating');
        }
        if (cooling === 'water') {
            recommendations.push('Water cooling improves grinding efficiency and extends equipment life');
        }
        
        // Update UI elements
        const recommendedModelEl = document.getElementById('recommended-model');
        if (recommendedModelEl) recommendedModelEl.textContent = model;
        
        const recommendedJarEl = document.getElementById('recommended-jar');
        if (recommendedJarEl) recommendedJarEl.textContent = jar;
        
        const recommendedBallsEl = document.getElementById('recommended-balls');
        if (recommendedBallsEl) recommendedBallsEl.textContent = balls;
        
        const estimatedCapacityEl = document.getElementById('estimated-capacity');
        if (estimatedCapacityEl) estimatedCapacityEl.textContent = estimatedCapacity;
        
        const recommendationsList = document.getElementById('additional-recommendations');
        if (recommendationsList) {
            recommendationsList.innerHTML = recommendations.map(item => `<li>${item}</li>`).join('');
        }
        
        // Update model explanation
        const modelDisplayEl = document.getElementById('selected-model-display');
        if (modelDisplayEl) {
            modelDisplayEl.textContent = model;
        }
    }
    
    initializeCanvas() {
        this.canvas = document.getElementById('grinding-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.initializeParticles();
    }
    
    resizeCanvas() {
        if (!this.canvas) return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Update grinding chamber parameters
        this.grindingChamber.centerX = this.canvas.width / 2;
        this.grindingChamber.centerY = this.canvas.height / 2;
        this.grindingChamber.radius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
        
        // Reinitialize particles and balls
        if (this.particles.length > 0 || this.balls.length > 0) {
            this.initializeParticles();
        }
    }
    
    initializeParticles() {
        this.particles = [];
        this.balls = [];
        this.collisionEffects = [];
        
        // Calculate particle count based on grinding chamber size
        const particleCount = Math.floor(this.grindingChamber.radius / 3);
        const ballCount = Math.floor(this.grindingChamber.radius / 15);
        
        for (let i = 0; i < particleCount; i++) {
            // Generate particles within grinding chamber
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.grindingChamber.radius * 0.8;
            this.particles.push({
                x: this.grindingChamber.centerX + Math.cos(angle) * distance,
                y: this.grindingChamber.centerY + Math.sin(angle) * distance,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 3 + 1,
                color: `hsl(${45 + Math.random() * 20}, 100%, 60%)`,
                originalRadius: Math.random() * 3 + 1,
                sizeReduction: 0
            });
        }
        
        for (let i = 0; i < ballCount; i++) {
            // Generate grinding balls within grinding chamber
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.grindingChamber.radius * 0.6;
            this.balls.push({
                x: this.grindingChamber.centerX + Math.cos(angle) * distance,
                y: this.grindingChamber.centerY + Math.sin(angle) * distance,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                radius: Math.random() * 10 + 15,
                color: '#06b6d4'
            });
        }
        
        // Initial ball speed update
        this.updateBallSpeed();
    }
    
    updateBallSpeed() {
        // Update ball speed based on rotation speed
        const speedFactor = this.state.rotationSpeed / 800; // Base speed at 800RPM
        this.balls.forEach(ball => {
            // Keep direction, only change speed magnitude
            const currentSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
            const newSpeed = currentSpeed * speedFactor;
            const angle = Math.atan2(ball.vy, ball.vx);
            ball.vx = Math.cos(angle) * newSpeed;
            ball.vy = Math.sin(angle) * newSpeed;
        });
    }
    
    initializeChart() {
        const chartCanvas = document.getElementById('simulation-chart');
        if (!chartCanvas || typeof Chart === 'undefined') return;
        
        const ctx = chartCanvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.chartData.labels,
                datasets: [
                    {
                        label: 'Fineness (μm)',
                        data: this.chartData.fineness,
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Temperature (°C)',
                        data: this.chartData.temperature,
                        borderColor: '#f97316',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Energy (kWh)',
                        data: this.chartData.energy,
                        borderColor: '#22c55e',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#f8fafc'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }
    
    startSimulation() {
        if (this.state.isSimulating) {
            if (!confirm('A simulation is already running. Do you want to start a new one?')) {
                return;
            }
            // If user confirms, reset the simulation
            this.state.simulationProgress = 0;
            this.chartData = { labels: [], fineness: [], temperature: [], energy: [] };
            if (this.chart) {
                this.chart.data.labels = this.chartData.labels;
                this.chart.data.datasets[0].data = this.chartData.fineness;
                this.chart.data.datasets[1].data = this.chartData.temperature;
                this.chart.data.datasets[2].data = this.chartData.energy;
                this.chart.update();
            }
            this.initializeParticles();
        }
        
        document.getElementById('simulation-interface').classList.remove('hidden');
        
        this.state.isSimulating = true;
        this.animate();
        this.runSimulation();
    }
    
    animate(timestamp = 0) {
        if (!this.ctx || !this.canvas) return;
        
        // Control frame rate
        if (timestamp - this.lastTime < this.frameInterval) {
            if (this.state.isSimulating) {
                this.animationFrameId = requestAnimationFrame((time) => this.animate(time));
            }
            return;
        }
        
        this.lastTime = timestamp;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        const gradient = this.ctx.createRadialGradient(
            this.grindingChamber.centerX, 
            this.grindingChamber.centerY, 
            0, 
            this.grindingChamber.centerX, 
            this.grindingChamber.centerY, 
            this.grindingChamber.radius * 1.5
        );
        gradient.addColorStop(0, 'rgba(30, 41, 59, 0.5)');
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grinding chamber
        this.ctx.beginPath();
        this.ctx.arc(
            this.grindingChamber.centerX, 
            this.grindingChamber.centerY, 
            this.grindingChamber.radius, 
            0, 
            Math.PI * 2
        );
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw grinding chamber internal texture
        this.ctx.beginPath();
        this.ctx.arc(
            this.grindingChamber.centerX, 
            this.grindingChamber.centerY, 
            this.grindingChamber.radius * 0.95, 
            0, 
            Math.PI * 2
        );
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Update and draw particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Collision detection within grinding chamber
            const dx = p.x - this.grindingChamber.centerX;
            const dy = p.y - this.grindingChamber.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > this.grindingChamber.radius - p.radius) {
                // Collision with grinding chamber wall
                const angle = Math.atan2(dy, dx);
                p.x = this.grindingChamber.centerX + Math.cos(angle) * (this.grindingChamber.radius - p.radius);
                p.y = this.grindingChamber.centerY + Math.sin(angle) * (this.grindingChamber.radius - p.radius);
                p.vx = -Math.cos(angle) * 2;
                p.vy = -Math.sin(angle) * 2;
            }
            
            // Collision with grinding balls
            this.balls.forEach(b => {
                const dx = p.x - b.x;
                const dy = p.y - b.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < p.radius + b.radius) {
                    // Collision detected
                    const angle = Math.atan2(dy, dx);
                    p.vx = Math.cos(angle) * 3;
                    p.vy = Math.sin(angle) * 3;
                    
                    // Reduce particle size on collision (simulating grinding effect)
                    if (this.state.isSimulating && p.radius > 0.3) {
                        p.radius *= 0.99;
                        p.sizeReduction += 0.01;
                    }
                    
                    // Add collision effect
                    this.addCollisionEffect(p.x, p.y);
                }
            });
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            
            // Draw particle glow effect
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius + 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 215, 0, 0.2)`;
            this.ctx.fill();
        });
        
        // Update and draw grinding balls
        this.balls.forEach(b => {
            b.x += b.vx;
            b.y += b.vy;
            
            // Collision detection within grinding chamber
            const dx = b.x - this.grindingChamber.centerX;
            const dy = b.y - this.grindingChamber.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > this.grindingChamber.radius - b.radius) {
                // Collision with grinding chamber wall
                const angle = Math.atan2(dy, dx);
                b.x = this.grindingChamber.centerX + Math.cos(angle) * (this.grindingChamber.radius - b.radius);
                b.y = this.grindingChamber.centerY + Math.sin(angle) * (this.grindingChamber.radius - b.radius);
                b.vx = -Math.cos(angle) * 4;
                b.vy = -Math.sin(angle) * 4;
            }
            
            // Collision between grinding balls
            this.balls.forEach(otherBall => {
                if (b !== otherBall) {
                    const dx = b.x - otherBall.x;
                    const dy = b.y - otherBall.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < b.radius + otherBall.radius) {
                        // Collision handling
                        const angle = Math.atan2(dy, dx);
                        b.vx = Math.cos(angle) * 4;
                        b.vy = Math.sin(angle) * 4;
                    }
                }
            });
            
            // Draw grinding ball
            this.ctx.beginPath();
            this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = b.color;
            this.ctx.fill();
            
            // Grinding ball glow effect
            this.ctx.beginPath();
            this.ctx.arc(b.x, b.y, b.radius + 3, 0, Math.PI * 2);
            this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Grinding ball highlight effect
            this.ctx.beginPath();
            this.ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.2, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.fill();
        });
        
        // Draw collision effects
        this.drawCollisionEffects();
        
        // Draw energy field effect
        this.drawEnergyField();
        
        if (this.state.isSimulating) {
            this.animationFrameId = requestAnimationFrame((time) => this.animate(time));
        }
    }
    
    addCollisionEffect(x, y) {
        this.collisionEffects.push({
            x, y,
            radius: 5,
            alpha: 1,
            decay: 0.05,
            color: `hsl(${Math.random() * 60 + 20}, 100%, 70%)`
        });
    }
    
    drawCollisionEffects() {
        this.collisionEffects = this.collisionEffects.filter(effect => {
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 69, 0, ${effect.alpha})`;
            this.ctx.fill();
            
            // Collision effect outer ring
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, effect.radius + 2, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(255, 140, 0, ${effect.alpha * 0.5})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            effect.radius += 0.8;
            effect.alpha -= effect.decay;
            
            return effect.alpha > 0;
        });
    }
    
    drawEnergyField() {
        if (!this.state.isSimulating) return;
        
        // Draw energy field effect
        this.ctx.beginPath();
        this.ctx.arc(
            this.grindingChamber.centerX, 
            this.grindingChamber.centerY, 
            this.grindingChamber.radius * 0.8,
            0, 
            Math.PI * 2
        );
        const gradient = this.ctx.createRadialGradient(
            this.grindingChamber.centerX, 
            this.grindingChamber.centerY, 
            0, 
            this.grindingChamber.centerX, 
            this.grindingChamber.centerY, 
            this.grindingChamber.radius * 0.8
        );
        gradient.addColorStop(0, 'rgba(255, 69, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Energy wave effect
        const time = Date.now() * 0.001;
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.arc(
                this.grindingChamber.centerX, 
                this.grindingChamber.centerY, 
                this.grindingChamber.radius * 0.8 * (0.8 + 0.2 * Math.sin(time * 2 + i)),
                0, 
                Math.PI * 2
            );
            this.ctx.strokeStyle = `rgba(255, 69, 0, ${0.3 * Math.sin(time * 3 + i)})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }
    
    runSimulation() {
        let time = this.state.simulationProgress * 42;
        const interval = setInterval(() => {
            if (!this.state.isSimulating) {
                clearInterval(interval);
                return;
            }
            
            time++;
            this.state.simulationProgress = Math.min(time / 42, 1);
            
            // Calculate current grinding parameters
            // Rotation speed affects grinding efficiency and temperature
            const speedFactor = this.state.rotationSpeed / 800;
            const coolingFactor = this.state.coolingIntensity / 50;
            
            const currentFineness = 500 * Math.exp(-time / (15 / speedFactor)) + this.state.targetFineness * 0.9;
            const baseTemperature = 25 + 20 * (1 - Math.exp(-time / 20)) * speedFactor;
            const temperature = baseTemperature / coolingFactor;
            const energy = 0.3 * time * speedFactor;
            const speed = this.state.rotationSpeed;
            
            // Update chart data
            if (time % 2 === 0) { // Update chart every 2 seconds to reduce computation load
                this.chartData.labels.push(`${time}min`);
                this.chartData.fineness.push(Math.max(currentFineness, this.state.targetFineness * 0.95));
                this.chartData.temperature.push(temperature);
                this.chartData.energy.push(energy);
                
                if (this.chart) {
                    this.chart.update();
                }
            }
            
            // Update real-time monitoring data
            this.updateRealTimeData(currentFineness, temperature, energy, speed);
            
            // Update particle size, simulating grinding effect
            this.updateParticleSizes(this.state.simulationProgress, speedFactor);
            
            if (time >= 42) {
                clearInterval(interval);
                this.completeSimulation();
            }
        }, 200);
    }
    
    updateParticleSizes(progress, speedFactor = 1) {
        // Update particle size based on grinding progress and rotation speed
        this.particles.forEach(p => {
            if (this.state.isSimulating) {
                const targetReduction = 0.7; // Target size reduction 70%
                const currentReduction = targetReduction * progress * speedFactor;
                p.radius = p.originalRadius * (1 - Math.min(currentReduction, 0.95));
                p.sizeReduction = Math.min(currentReduction, 0.95);
            }
        });
    }
    
    updateRealTimeData(fineness, temperature, energy, speed) {
        // Update speed display
        const speedElement = document.querySelector('.text-slate-300 + .text-white');
        if (speedElement && speedElement.textContent.includes('RPM')) {
            speedElement.textContent = `${Math.round(speed)} RPM`;
        }
        
        // Update temperature display
        const tempElement = document.querySelectorAll('.text-slate-300 + .text-white')[1];
        if (tempElement && tempElement.textContent.includes('°C')) {
            tempElement.textContent = `${Math.round(temperature)}°C`;
        }
        
        // Update fineness display
        const finenessElement = document.querySelectorAll('.text-slate-300 + .text-white')[2];
        if (finenessElement && finenessElement.textContent.includes('μm')) {
            finenessElement.textContent = `${fineness.toFixed(2)}μm`;
        }
        
        // Update energy display
        const energyElement = document.querySelectorAll('.text-slate-300 + .text-white')[3];
        if (energyElement && energyElement.textContent.includes('kWh')) {
            energyElement.textContent = `${energy.toFixed(1)} kWh`;
        }
        
        // Update status
        const statusElement = document.getElementById('simulation-status');
        if (statusElement) {
            statusElement.textContent = 'Running';
            statusElement.className = 'text-primary font-bold';
        }
    }
    
    completeSimulation() {
        this.state.isSimulating = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        document.getElementById('simulation-interface').classList.add('hidden');
        document.getElementById('simulation-complete').classList.remove('hidden');
        
        // Add event listeners for buttons
        document.querySelector('.btn-warm-secondary')?.addEventListener('click', () => this.reconfigure());
        document.querySelector('.btn-primary:has(.material-symbols-outlined:contains(download))')?.addEventListener('click', () => this.showExportOptions());
    }
    
    showExportOptions() {
        const options = [
            { value: 'csv', label: 'Export as CSV' },
            { value: 'pdf', label: 'Export as PDF' }
        ];
        
        const option = prompt('Select export format:\n1. CSV\n2. PDF', '1');
        
        if (option === '1') {
            this.exportToCSV();
        } else if (option === '2') {
            this.exportToPDF();
        }
    }
    
    exportToCSV() {
        // Prepare CSV data
        const headers = ['Parameter', 'Value'];
        const data = [
            ['Material', this.state.selectedMaterial],
            ['Target Fineness', `${this.state.targetFineness} μm`],
            ['Capacity', this.state.capacity],
            ['Operation Mode', this.state.operationMode],
            ['Cooling', this.state.cooling],
            ['Rotation Speed', `${this.state.rotationSpeed} RPM`],
            ['Cooling Intensity', `${this.state.coolingIntensity}%`],
            ['Final Fineness', `${this.chartData.fineness[this.chartData.fineness.length - 1].toFixed(2)} μm`],
            ['Total Energy', `${this.chartData.energy[this.chartData.energy.length - 1].toFixed(1)} kWh`],
            ['Total Time', '42 minutes']
        ];
        
        // Add chart data
        data.push(['', '']);
        data.push(['Time (min)', 'Fineness (μm)', 'Temperature (°C)', 'Energy (kWh)']);
        
        for (let i = 0; i < this.chartData.labels.length; i++) {
            const time = this.chartData.labels[i].replace('min', '');
            const fineness = this.chartData.fineness[i].toFixed(2);
            const temperature = this.chartData.temperature[i].toFixed(1);
            const energy = this.chartData.energy[i].toFixed(1);
            data.push([time, fineness, temperature, energy]);
        }
        
        // Generate CSV content
        let csvContent = headers.join(',') + '\n';
        data.forEach(row => {
            csvContent += row.join(',') + '\n';
        });
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `grinding-simulation-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    exportToPDF() {
        // Create a simple PDF using window.print() as a fallback
        const printWindow = window.open('', '_blank');
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Grinding Simulation Report</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    h1, h2, h3 {
                        color: #333;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .section {
                        margin: 20px 0;
                        padding: 15px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <h1>Grinding Simulation Report</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                
                <div class="section">
                    <h2>Simulation Parameters</h2>
                    <table>
                        <tr><th>Parameter</th><th>Value</th></tr>
                        <tr><td>Material</td><td>${this.state.selectedMaterial}</td></tr>
                        <tr><td>Target Fineness</td><td>${this.state.targetFineness} μm</td></tr>
                        <tr><td>Capacity</td><td>${this.state.capacity}</td></tr>
                        <tr><td>Operation Mode</td><td>${this.state.operationMode}</td></tr>
                        <tr><td>Cooling</td><td>${this.state.cooling}</td></tr>
                        <tr><td>Rotation Speed</td><td>${this.state.rotationSpeed} RPM</td></tr>
                        <tr><td>Cooling Intensity</td><td>${this.state.coolingIntensity}%</td></tr>
                    </table>
                </div>
                
                <div class="section">
                    <h2>Simulation Results</h2>
                    <table>
                        <tr><th>Parameter</th><th>Value</th></tr>
                        <tr><td>Final Fineness</td><td>${this.chartData.fineness[this.chartData.fineness.length - 1].toFixed(2)} μm</td></tr>
                        <tr><td>Total Energy</td><td>${this.chartData.energy[this.chartData.energy.length - 1].toFixed(1)} kWh</td></tr>
                        <tr><td>Total Time</td><td>42 minutes</td></tr>
                    </table>
                </div>
                
                <div class="section">
                    <h2>Process Data</h2>
                    <table>
                        <tr><th>Time (min)</th><th>Fineness (μm)</th><th>Temperature (°C)</th><th>Energy (kWh)</th></tr>
                        ${this.chartData.labels.map((label, index) => `
                            <tr>
                                <td>${label.replace('min', '')}</td>
                                <td>${this.chartData.fineness[index].toFixed(2)}</td>
                                <td>${this.chartData.temperature[index].toFixed(1)}</td>
                                <td>${this.chartData.energy[index].toFixed(1)}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                
                <div class="section">
                    <h2>Process Recommendations</h2>
                    <ul>
                        <li>Use water cooling system, maintain temperature below 45°C</li>
                        <li>Use zirconia grinding jars and balls to prevent material contamination</li>
                        <li>Recommend intermittent operation mode, 15 minutes run / 5 minutes pause</li>
                        <li>Optimize speed curve: first 10 minutes 800RPM, middle 20 minutes 1000RPM, last 12 minutes 900RPM</li>
                    </ul>
                </div>
            </body>
            </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }
}

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.grindingSimulator = new GrindingSimulator();
    });
}
