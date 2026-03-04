class ImageProcessingManager {
    constructor() {
        this.apiBaseUrl = '/api';
    }
    
    async processProductImage(imagePath, productInfo) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/image/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image_path: imagePath,
                    product_info: productInfo
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error processing image:', error);
            return { success: false, error: error.message };
        }
    }
    
    async batchProcessImages(imageDir, productData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/image/batch-process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image_dir: imageDir,
                    product_data: productData
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error batch processing images:', error);
            return { success: false, error: error.message };
        }
    }
    
    async get3DModel(productId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/model/${productId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const modelData = await response.json();
            return modelData;
        } catch (error) {
            console.error('Error getting 3D model:', error);
            return { error: error.message };
        }
    }
}

class ModelViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.controls = null;
        this.currentViewpoint = 0;
        this.viewpoints = [];
    }
    
    async init(productId) {
        try {
            // 获取3D模型数据
            const imageManager = new ImageProcessingManager();
            const modelData = await imageManager.get3DModel(productId);
            
            if (modelData.error) {
                this.showError(modelData.error);
                return;
            }
            
            this.viewpoints = modelData.viewpoints;
            
            // 初始化Three.js场景
            this.setupScene();
            this.createModel(modelData);
            this.setupControls();
            this.setupLighting();
            this.animate();
            
            // 响应窗口大小变化
            window.addEventListener('resize', () => this.onWindowResize());
            
            return true;
        } catch (error) {
            console.error('Error initializing model viewer:', error);
            this.showError('Failed to initialize 3D viewer');
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
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);
    }
    
    createModel(modelData) {
        // 创建几何体
        const geometry = new THREE.BoxGeometry(
            modelData.dimensions.width / 10, // 缩小尺寸以适应场景
            modelData.dimensions.height / 10,
            modelData.dimensions.depth / 10
        );
        
        // 创建材质
        const material = new THREE.MeshPhongMaterial({
            color: 0x13c8ec,
            specular: 0xffffff,
            shininess: 30
        });
        
        // 创建网格
        this.model = new THREE.Mesh(geometry, material);
        this.scene.add(this.model);
        
        // 添加线框
        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 })
        );
        this.model.add(wireframe);
    }
    
    setupControls() {
        // 简单的鼠标控制
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        this.container.addEventListener('mousedown', (e) => {
            isDragging = true;
        });
        
        this.container.addEventListener('mouseup', (e) => {
            isDragging = false;
        });
        
        this.container.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };
            
            this.model.rotation.y += deltaMove.x * 0.01;
            this.model.rotation.x += deltaMove.y * 0.01;
            
            previousMousePosition = {
                x: e.offsetX,
                y: e.offsetY
            };
        });
    }
    
    setupLighting() {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        // 方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // 点光源
        const pointLight = new THREE.PointLight(0x13c8ec, 1, 100);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 自动旋转
        if (this.model) {
            this.model.rotation.y += 0.005;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    setViewpoint(index) {
        if (!this.viewpoints || !this.viewpoints[index]) return;
        
        const viewpoint = this.viewpoints[index];
        this.currentViewpoint = index;
        
        // 设置相机位置和旋转
        if (this.camera) {
            this.camera.position.set(...viewpoint.position);
            this.camera.rotation.set(
                viewpoint.rotation[0] * Math.PI / 180,
                viewpoint.rotation[1] * Math.PI / 180,
                viewpoint.rotation[2] * Math.PI / 180
            );
            this.camera.lookAt(0, 0, 0);
        }
    }
    
    showError(message) {
        this.container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center p-4">
                <span class="material-icons text-red-400 text-4xl mb-4">error_outline</span>
                <p class="text-slate-400">${message}</p>
                <p class="text-slate-500 text-sm mt-2">3D model visualization is not available</p>
            </div>
        `;
    }
    
    destroy() {
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
window.ImageProcessingManager = ImageProcessingManager;
window.ModelViewer = ModelViewer;

// 初始化函数
window.initImageProcessing = function() {
    console.log('Image processing module initialized');
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    if (typeof THREE !== 'undefined') {
        window.initImageProcessing();
    } else {
        console.warn('Three.js library not loaded');
    }
});
