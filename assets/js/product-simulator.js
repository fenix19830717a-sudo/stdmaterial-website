class ProductSimulator {
    constructor(containerId, productData) {
        this.container = document.getElementById(containerId);
        this.productData = productData;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.controls = null;
        this.lights = [];
        this.isAutoRotate = true;
        this.rotationSpeed = 0.005;
        this.zoomLevel = 1;
        this.currentFeature = 0;
        this.features = [
            { name: '旋转演示', description: '展示产品的360°旋转效果' },
            { name: '尺寸测量', description: '显示产品的详细尺寸' },
            { name: '材质展示', description: '展示产品的材质特性' },
            { name: '功能演示', description: '演示产品的核心功能' },
            { name: '环境模拟', description: '模拟不同环境下的产品状态' }
        ];
        this.parameters = {
            rotationSpeed: 0.5,
            zoom: 1.0,
            lighting: 1.0,
            material: 1,
            animationSpeed: 1.0
        };
        this.animationFrameId = null;
        this.loadingStartTime = Date.now();
    }
    
    async init() {
        try {
            this.setupScene();
            this.setupControls();
            this.setupLighting();
            await this.loadModel();
            this.setupUI();
            this.animate();
            
            const loadTime = Date.now() - this.loadingStartTime;
            console.log(`Simulator loaded in ${loadTime}ms`);
            
            return true;
        } catch (error) {
            console.error('Error initializing product simulator:', error);
            this.showError('Failed to initialize product simulator');
            return false;
        }
    }
    
    setupScene() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x16282c);
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.container.clientWidth / this.container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 5;
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // 清空容器并添加渲染器
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);
        
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        
        // 添加方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);
        
        // 添加点光源
        const pointLight = new THREE.PointLight(0x13c8ec, 0.5);
        pointLight.position.set(-5, 5, 5);
        this.scene.add(pointLight);
        this.lights.push(pointLight);
        
        // 添加半球光
        const hemisphereLight = new THREE.HemisphereLight(0x13c8ec, 0x222222, 0.3);
        this.scene.add(hemisphereLight);
        this.lights.push(hemisphereLight);
        
        // 添加网格辅助线
        const gridHelper = new THREE.GridHelper(10, 10);
        gridHelper.material.opacity = 0.1;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
        
        // 添加环境雾
        this.scene.fog = new THREE.Fog(0x16282c, 10, 20);
    }
    
    async loadModel() {
        // 根据产品参数生成3D模型
        const productType = this.productData.category?.toLowerCase() || '';
        const productMaterial = this.productData.material?.toLowerCase() || '';
        const specifications = this.productData.specifications || {};
        
        // 根据产品类型生成不同的几何体
        let geometry;
        let size = 2;
        
        // 根据产品类型设置几何体
        if (productType.includes('jar')) {
            // 研磨罐
            const diameter = specifications['Outer Diameter'] ? this.extractNumber(specifications['Outer Diameter']) : 100;
            const height = specifications['Height'] ? this.extractNumber(specifications['Height']) : 120;
            size = Math.max(diameter, height) / 100;
            geometry = new THREE.CylinderGeometry(size, size, size * 1.5, 64);
        } else if (productType.includes('media')) {
            // 研磨介质
            const diameter = specifications['Diameter'] ? this.extractNumber(specifications['Diameter']) : 10;
            size = diameter / 50;
            geometry = new THREE.SphereGeometry(size, 64, 64);
        } else if (productType.includes('equipment')) {
            // 设备
            geometry = new THREE.BoxGeometry(3, 2, 2);
        } else {
            // 默认几何体
            geometry = new THREE.BoxGeometry(2, 2, 1);
        }
        
        // 根据产品材质设置颜色
        const materialColor = this.getMaterialColor(productMaterial);
        
        // 创建材质
        const materials = [
            new THREE.MeshStandardMaterial({ 
                color: 0x13c8ec, 
                metalness: 0.8, 
                roughness: 0.2,
                reflectivity: 1.0,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1
            }),
            new THREE.MeshStandardMaterial({ 
                color: 0xf97316, 
                metalness: 0.3, 
                roughness: 0.4,
                reflectivity: 0.8
            }),
            new THREE.MeshStandardMaterial({ 
                color: 0x22c55e, 
                metalness: 0.1, 
                roughness: 0.6,
                reflectivity: 0.5
            })
        ];
        
        this.model = new THREE.Mesh(geometry, materials[this.parameters.material]);
        this.model.castShadow = true;
        this.model.receiveShadow = true;
        this.scene.add(this.model);
        
        // 添加线框
        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 })
        );
        wireframe.material.transparent = true;
        wireframe.material.opacity = 0.3;
        this.model.add(wireframe);
        
        // 添加环境贴图
        this.addEnvironmentMap();
    }
    
    addEnvironmentMap() {
        // 创建简单的环境贴图
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
        cubeRenderTarget.texture.type = THREE.HalfFloatType;
        
        const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
        this.scene.add(cubeCamera);
        
        // 创建环境光
        const environmentLight = new THREE.PointLight(0xffffff, 0.5);
        environmentLight.position.set(0, 10, 0);
        this.scene.add(environmentLight);
        
        // 更新材质的环境贴图
        if (this.model && this.model.material) {
            if (Array.isArray(this.model.material)) {
                this.model.material.forEach(material => {
                    material.envMap = cubeRenderTarget.texture;
                    material.needsUpdate = true;
                });
            } else {
                this.model.material.envMap = cubeRenderTarget.texture;
                this.model.material.needsUpdate = true;
            }
        }
    }
    
    extractNumber(text) {
        // 从文本中提取数字
        const match = text.match(/\d+\.?\d*/);
        return match ? parseFloat(match[0]) : 0;
    }
    
    getMaterialColor(material) {
        // 根据材质返回对应的颜色
        if (material.includes('alumina') || material.includes('陶瓷')) {
            return 0xf97316; // 陶瓷色
        } else if (material.includes('stainless') || material.includes('金属')) {
            return 0x13c8ec; // 金属色
        } else if (material.includes('plastic') || material.includes('塑料')) {
            return 0x22c55e; // 塑料色
        } else if (material.includes('zirconia') || material.includes('氧化锆')) {
            return 0x9333ea; // 氧化锆色
        } else {
            return 0x13c8ec; // 默认颜色
        }
    }
    
    setupControls() {
        // 鼠标控制
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let isZooming = false;
        let previousDistance = 0;
        
        // 鼠标按下事件
        this.container.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = {
                x: e.offsetX,
                y: e.offsetY
            };
        });
        
        // 鼠标释放事件
        this.container.addEventListener('mouseup', (e) => {
            isDragging = false;
        });
        
        // 鼠标离开事件
        this.container.addEventListener('mouseleave', (e) => {
            isDragging = false;
        });
        
        // 鼠标移动事件
        this.container.addEventListener('mousemove', (e) => {
            if (isDragging && this.model) {
                const deltaMove = {
                    x: e.offsetX - previousMousePosition.x,
                    y: e.offsetY - previousMousePosition.y
                };
                
                // 旋转步长≤5°，添加平滑效果
                this.model.rotation.y += deltaMove.x * 0.01;
                this.model.rotation.x += deltaMove.y * 0.01;
                
                // 限制X轴旋转范围，防止过度旋转
                this.model.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.model.rotation.x));
                
                previousMousePosition = {
                    x: e.offsetX,
                    y: e.offsetY
                };
            }
        });
        
        // 滚轮缩放
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05;
            this.zoomLevel *= zoomFactor;
            this.zoomLevel = Math.max(0.1, Math.min(10, this.zoomLevel));
            
            // 平滑缩放效果
            const targetZ = this.camera.position.z / zoomFactor;
            this.camera.position.z += (targetZ - this.camera.position.z) * 0.1;
        });
        
        // 触摸控制（移动设备）
        this.container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                previousMousePosition = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
            } else if (e.touches.length === 2) {
                isZooming = true;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                previousDistance = Math.sqrt(dx * dx + dy * dy);
            }
        });
        
        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1 && isDragging && this.model) {
                const deltaMove = {
                    x: e.touches[0].clientX - previousMousePosition.x,
                    y: e.touches[0].clientY - previousMousePosition.y
                };
                
                this.model.rotation.y += deltaMove.x * 0.01;
                this.model.rotation.x += deltaMove.y * 0.01;
                
                this.model.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.model.rotation.x));
                
                previousMousePosition = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
            } else if (e.touches.length === 2 && isZooming) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const currentDistance = Math.sqrt(dx * dx + dy * dy);
                
                const zoomFactor = currentDistance / previousDistance;
                this.zoomLevel *= zoomFactor;
                this.zoomLevel = Math.max(0.1, Math.min(10, this.zoomLevel));
                
                this.camera.position.z /= zoomFactor;
                previousDistance = currentDistance;
            }
        });
        
        this.container.addEventListener('touchend', (e) => {
            isDragging = false;
            isZooming = false;
        });
        
        // 窗口大小调整
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLighting() {
        // 灯光已在setupScene中设置
    }
    
    setupUI() {
        // 创建控制面板
        const controlPanel = document.createElement('div');
        controlPanel.className = 'absolute top-4 right-4 bg-background-dark/80 border border-primary/30 rounded-lg p-4 text-white';
        controlPanel.style.zIndex = '10';
        
        // 功能选择
        controlPanel.innerHTML = `
            <div class="mb-4">
                <h3 class="text-sm font-bold mb-2 text-primary">核心功能演示</h3>
                <div class="space-y-2">
                    ${this.features.map((feature, index) => `
                        <button class="feature-btn w-full text-left px-4 py-3 text-sm bg-background-dark rounded hover:bg-primary/10 hover:text-primary transition-colors ${index === 0 ? 'bg-primary/10 text-primary' : ''}" data-index="${index}">
                            ${feature.name}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div class="mb-4">
                <h3 class="text-sm font-bold mb-2 text-primary">参数调整</h3>
                
                <div class="mb-4">
                    <label class="block text-sm text-slate-400 mb-2">旋转速度</label>
                    <input type="range" id="rotation-speed" min="0" max="1" step="0.1" value="${this.parameters.rotationSpeed}" class="w-full h-2 bg-background-dark rounded-lg appearance-none cursor-pointer">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm text-slate-400 mb-2">缩放级别</label>
                    <input type="range" id="zoom-level" min="0.1" max="3" step="0.1" value="${this.parameters.zoom}" class="w-full h-2 bg-background-dark rounded-lg appearance-none cursor-pointer">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm text-slate-400 mb-2">光照强度</label>
                    <input type="range" id="lighting-level" min="0.1" max="2" step="0.1" value="${this.parameters.lighting}" class="w-full h-2 bg-background-dark rounded-lg appearance-none cursor-pointer">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm text-slate-400 mb-2">材质类型</label>
                    <select id="material-type" class="w-full bg-background-dark border border-slate-700 rounded px-3 py-2 text-sm text-white">
                        <option value="0">金属</option>
                        <option value="1" selected>陶瓷</option>
                        <option value="2">塑料</option>
                    </select>
                </div>
            </div>
            
            <div class="flex gap-3">
                <button id="toggle-rotate" class="flex-1 py-3 text-sm bg-primary/10 text-primary rounded hover:bg-primary hover:text-background-dark transition-colors">
                    ${this.isAutoRotate ? '停止旋转' : '开始旋转'}
                </button>
                <button id="reset-view" class="flex-1 py-3 text-sm bg-background-dark border border-slate-700 text-white rounded hover:border-primary/50 transition-colors">
                    重置视图
                </button>
            </div>
        `;
        
        this.container.appendChild(controlPanel);
        
        // 绑定事件
        document.querySelectorAll('.feature-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.switchFeature(index);
                
                // 更新按钮状态
                document.querySelectorAll('.feature-btn').forEach(b => {
                    b.classList.remove('bg-primary/10', 'text-primary');
                });
                e.target.classList.add('bg-primary/10', 'text-primary');
            });
        });
        
        // 参数控制
        document.getElementById('rotation-speed').addEventListener('input', (e) => {
            this.parameters.rotationSpeed = parseFloat(e.target.value);
            this.rotationSpeed = this.parameters.rotationSpeed * 0.01;
        });
        
        document.getElementById('zoom-level').addEventListener('input', (e) => {
            this.parameters.zoom = parseFloat(e.target.value);
            this.zoomLevel = this.parameters.zoom;
            this.camera.position.z = 5 / this.zoomLevel;
        });
        
        document.getElementById('lighting-level').addEventListener('input', (e) => {
            this.parameters.lighting = parseFloat(e.target.value);
            this.lights.forEach(light => {
                if (light.intensity !== undefined) {
                    light.intensity = this.parameters.lighting;
                }
            });
        });
        
        document.getElementById('material-type').addEventListener('change', (e) => {
            this.parameters.material = parseInt(e.target.value);
            this.updateMaterial();
        });
        
        // 控制按钮
        document.getElementById('toggle-rotate').addEventListener('click', (e) => {
            this.isAutoRotate = !this.isAutoRotate;
            e.target.textContent = this.isAutoRotate ? '停止旋转' : '开始旋转';
        });
        
        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetView();
        });
    }
    
    switchFeature(index) {
        this.currentFeature = index;
        console.log(`Switched to feature: ${this.features[index].name}`);
        
        // 根据功能执行不同的演示
        switch (index) {
            case 0: // 旋转演示
                this.startRotationDemo();
                break;
            case 1: // 尺寸测量
                this.showDimensions();
                break;
            case 2: // 材质展示
                this.showMaterialProperties();
                break;
            case 3: // 功能演示
                this.showFunctionality();
                break;
            case 4: // 环境模拟
                this.simulateEnvironment();
                break;
        }
    }
    
    startRotationDemo() {
        // 自动旋转演示
        this.isAutoRotate = true;
    }
    
    showDimensions() {
        // 显示产品尺寸
        console.log('Showing dimensions:', this.productData.specifications);
    }
    
    showMaterialProperties() {
        // 展示材质特性
        console.log('Showing material properties:', this.productData.material);
    }
    
    showFunctionality() {
        // 演示产品功能
        console.log('Showing functionality');
    }
    
    simulateEnvironment() {
        // 模拟不同环境
        console.log('Simulating environment');
    }
    
    updateMaterial() {
        if (!this.model) return;
        
        const materials = [
            new THREE.MeshStandardMaterial({ 
                color: 0x13c8ec, 
                metalness: 0.8, 
                roughness: 0.2,
                reflectivity: 1.0,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1
            }),
            new THREE.MeshStandardMaterial({ 
                color: 0xf97316, 
                metalness: 0.3, 
                roughness: 0.4,
                reflectivity: 0.8
            }),
            new THREE.MeshStandardMaterial({ 
                color: 0x22c55e, 
                metalness: 0.1, 
                roughness: 0.6,
                reflectivity: 0.5
            })
        ];
        
        this.model.material = materials[this.parameters.material];
        // 确保材质更新后重新计算
        this.model.material.needsUpdate = true;
    }
    
    resetView() {
        if (!this.model || !this.camera) return;
        
        // 重置模型位置和旋转
        this.model.position.set(0, 0, 0);
        this.model.rotation.set(0, 0, 0);
        
        // 重置相机位置
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);
        
        // 重置参数
        this.zoomLevel = 1;
        this.parameters.zoom = 1;
        this.parameters.rotationSpeed = 0.5;
        this.rotationSpeed = 0.005;
        
        // 更新UI
        document.getElementById('zoom-level').value = this.parameters.zoom;
        document.getElementById('rotation-speed').value = this.parameters.rotationSpeed;
    }
    
    animate() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        
        // 自动旋转
        if (this.isAutoRotate && this.model) {
            this.model.rotation.y += this.rotationSpeed;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    showError(message) {
        this.container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center p-4">
                <span class="material-icons text-red-400 text-4xl mb-4">error_outline</span>
                <p class="text-slate-400">${message}</p>
                <p class="text-slate-500 text-sm mt-2">Product simulator is not available</p>
            </div>
        `;
    }
    
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.model) {
            this.scene.remove(this.model);
        }
        
        window.removeEventListener('resize', () => this.onWindowResize());
    }
}

// 全局实例
window.ProductSimulator = ProductSimulator;

// 初始化函数
window.initProductSimulator = function(containerId, productData) {
    const simulator = new ProductSimulator(containerId, productData);
    return simulator.init();
};
