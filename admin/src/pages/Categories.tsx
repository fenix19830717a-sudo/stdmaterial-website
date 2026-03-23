import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Category {
  _id: string;
  categoryId: string;
  name: string;
  nameEn: string;
  slug: string;
  parentId: string | null;
  level: number;
  order: number;
  status: string;
  createdAt: string;
}

interface CategoryFormData {
  name: string;
  parentId: string | null;
  order: number;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    parentId: null,
    order: 0
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/categories');
      setCategories(response.data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('获取分类列表失败');
      // 暂时使用模拟数据
      setCategories([
        {
          _id: '1',
          categoryId: 'cat-123',
          name: '研磨系列',
          nameEn: 'Grinding Series',
          slug: 'grinding-series',
          parentId: null,
          level: 1,
          order: 1,
          status: 'active',
          createdAt: '2026-03-01T00:00:00Z'
        },
        {
          _id: '2',
          categoryId: 'cat-124',
          name: '破碎系列',
          nameEn: 'Broken Series',
          slug: 'broken-series',
          parentId: null,
          level: 1,
          order: 2,
          status: 'active',
          createdAt: '2026-03-02T00:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setIsEditing(false);
    setCurrentCategory(null);
    setFormData({
      name: '',
      parentId: null,
      order: 0
    });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      parentId: category.parentId,
      order: category.order
    });
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('确定要删除这个分类吗？')) {
      try {
        await axios.delete(`/api/categories/${categoryId}`);
        fetchCategories();
      } catch (err) {
        console.error('Error deleting category:', err);
        setError('删除分类失败');
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentCategory) {
        await axios.put(`/api/categories/${currentCategory._id}`, formData);
      } else {
        await axios.post('/api/categories', formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setError('保存分类失败');
    }
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
      <h1 className="text-3xl font-bold mb-6">分类管理</h1>
      
      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">分类列表</h2>
          <button className="btn btn-primary" onClick={handleAddCategory}>
            添加分类
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>名称</th>
              <th>英文名称</th>
              <th>Slug</th>
              <th>父分类</th>
              <th>层级</th>
              <th>排序</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.nameEn}</td>
                <td>{category.slug}</td>
                <td>{category.parentId || '无'}</td>
                <td>{category.level}</td>
                <td>{category.order}</td>
                <td>
                  <span className={`px-2 py-1 rounded ${category.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {category.status === 'active' ? '活跃' : '非活跃'}
                  </span>
                </td>
                <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-outline" onClick={() => handleEditCategory(category)}>
                      编辑
                    </button>
                    <button className="btn btn-outline" onClick={() => handleDeleteCategory(category._id)}>
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">{isEditing ? '编辑分类' : '添加分类'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">分类名称</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">父分类</label>
                <select
                  className="form-input"
                  value={formData.parentId || ''}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                >
                  <option value="">无父分类</option>
                  {categories.filter(c => c.level === 1).map((category) => (
                    <option key={category._id} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">排序</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min="0"
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

export default Categories;