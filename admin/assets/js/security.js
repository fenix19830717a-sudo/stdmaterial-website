class Security {
    // 输入验证
    static validateInput(input, type = 'string') {
        if (input === null || input === undefined) {
            return '';
        }
        
        const trimmedInput = String(input).trim();
        
        switch (type) {
            case 'email':
                return this.validateEmail(trimmedInput);
            case 'password':
                return this.validatePassword(trimmedInput);
            case 'number':
                return this.validateNumber(trimmedInput);
            case 'string':
            default:
                return this.sanitizeString(trimmedInput);
        }
    }
    
    // 验证邮箱
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) ? email : '';
    }
    
    // 验证密码强度
    static validatePassword(password) {
        // 至少8个字符，包含字母和数字
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password) ? password : '';
    }
    
    // 验证数字
    static validateNumber(number) {
        const num = parseFloat(number);
        return isNaN(num) ? 0 : num;
    }
    
    // 清理字符串，防止XSS
    static sanitizeString(input) {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // 输出转义，防止XSS
    static escapeHTML(input) {
        return this.sanitizeString(input);
    }
    
    // 生成随机CSRF令牌
    static generateCSRFToken() {
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('csrfToken', token);
        return token;
    }
    
    // 验证CSRF令牌
    static validateCSRFToken(token) {
        const storedToken = sessionStorage.getItem('csrfToken');
        return token === storedToken;
    }
    
    // 加密敏感信息（简单加密，实际应用中应使用更复杂的加密算法）
    static encrypt(data) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        return btoa(unescape(encodeURIComponent(data)));
    }
    
    // 解密敏感信息
    static decrypt(encryptedData) {
        try {
            return decodeURIComponent(escape(atob(encryptedData)));
        } catch (e) {
            return '';
        }
    }
    
    // 生成安全的随机字符串
    static generateRandomString(length = 16) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    
    // 检查用户权限
    static checkPermission(requiredRole) {
        const userRole = sessionStorage.getItem('userRole') || 'guest';
        const roleHierarchy = {
            admin: 3,
            manager: 2,
            user: 1,
            guest: 0
        };
        
        return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
    }
    
    // 安全地存储用户信息
    static storeUserInfo(userInfo) {
        const encryptedInfo = this.encrypt(userInfo);
        sessionStorage.setItem('userInfo', encryptedInfo);
    }
    
    // 安全地获取用户信息
    static getUserInfo() {
        const storedInfo = sessionStorage.getItem('userInfo');
        if (!storedInfo) return null;
        
        try {
            // 首先尝试解析未加密的用户信息（JSON 格式）
            if (storedInfo.startsWith('{') || storedInfo.startsWith('[')) {
                return JSON.parse(storedInfo);
            }
            
            // 如果不是 JSON 格式，尝试解密
            const decryptedInfo = this.decrypt(storedInfo);
            if (decryptedInfo) {
                return JSON.parse(decryptedInfo);
            }
            
            return null;
        } catch (e) {
            console.error('获取用户信息失败:', e);
            return null;
        }
    }
    
    // 清除用户信息
    static clearUserInfo() {
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('csrfToken');
        sessionStorage.removeItem('userRole');
    }
}