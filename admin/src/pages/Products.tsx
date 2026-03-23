import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  productId: string;
  sku: string;
  name: string;
  nameEn: string;
  category: string;
  price: number;
  status: string;
  createdAt: string;
}

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  images: string[];
  specs: Record<string, string>;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    description: '',
    price: 0,
    images: [],
    specs: {}
  });

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/products', {
        params: {
          page,
          limit: 10,
          search: searchTerm,
          category: selectedCategory
        }
      });
      setProducts(response.data.data);
      setTotalPages(response.data.pagination.pages);
      setCurrentPage(response.data.pagination.page);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('获取商品列表失败');
      // 暂时使用模拟数据
      setProducts([
        {
          _id: '1',
          productId: 'prod-123',
          sku: 'STD-PBM-001',
          name: '行星球磨机',
          nameEn: 'Planetary Ball Mill',
          category: 'grinding-series',
          price: 9999,
          status: 'active',
          createdAt: '2026-03-01T00:00:00Z'
        },
        {
          _id: '2',
          productId: 'prod-124',
          sku: 'STD-CR-001',
          name: '齿辊破碎机',
          nameEn: 'Teeth Roll Crusher',
          category: 'broken-series',
          price: 5999,
          status: 'active',
          createdAt: '2026-03-02T00:00:00Z'
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const handleAddProduct = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      price: 0,
      images: [],
      specs: {}
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: '',
      price: product.price,
      images: [],
      specs: {}
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('确定要删除这个商品吗？')) {
      try {
        await axios.delete(`/api/products/${productId}`);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('删除商品失败');
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentProduct) {
        await axios.put(`/api/products/${currentProduct._id}`, formData);
      } else {
        await axios.post('/api/products', formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setError('保存商品失败');
    }
  };

  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">商品管理</h1>
      
      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">商品列表</h2>
          <button className="btn btn-primary" onClick={handleAddProduct}>
            添加商品
          </button>
        </div>
        
        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索商品..."
              className="form-input w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <select
              className="form-input w-full"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">全部分类</option>
              <option value="grinding-series">研磨系列</option>
              <option value="broken-series">破碎系列</option>
              <option value="screening-series">筛分系列</option>
            </select>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>商品名称</th>
              <th>英文名称</th>
              <th>分类</th>
              <th>价格</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.nameEn}</td>
                <td>{product.category}</td>
                <td>¥{product.price.toFixed(2)}</td>
                <td>
                  <span className={`px-2 py-1 rounded ${product.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {product.status === 'active' ? '活跃' : '非活跃'}
                  </span>
                </td>
                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-outline" onClick={() => handleEditProduct(product)}>
                      编辑
                    </button>
                    <button className="btn btn-outline" onClick={() => handleDeleteProduct(product._id)}>
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button 
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button 
            className="pagination-btn" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{isEditing ? '编辑商品' : '添加商品'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">商品名称</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">分类</label>
                <select
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">请选择分类</option>
                  <option value="grinding-series">研磨系列</option>
                  <option value="broken-series">破碎系列</option>
                  <option value="screening-series">筛分系列</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">描述</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">价格</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? '更新' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;