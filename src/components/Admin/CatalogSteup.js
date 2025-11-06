import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { getSellerCategory, getVariationList } from '../../services/customerServices';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 14px;
`;

const TabsContainer = styled.div`
  display: flex;
  background: white;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button`
  flex: 1;
  padding: 16px 24px;
  border: none;
  background: ${(props) => (props.active ? "#2563eb" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#666")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:first-child {
    border-radius: 8px 0 0 8px;
  }

  &:last-child {
    border-radius: 0 8px 8px 0;
  }

  &:hover {
    background: ${(props) => (props.active ? "#2563eb" : "#f8fafc")};
  }
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const FormSection = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const Textarea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  ${(props) => {
    if (props.variant === 'primary') {
      return `
        background: #2563eb;
        color: white;
        &:hover { background: #1d4ed8; }
      `;
    } else if (props.variant === 'success') {
      return `
        background: #10b981;
        color: white;
        &:hover { background: #059669; }
      `;
    } else if (props.variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        &:hover { background: #dc2626; }
      `;
    } else {
      return `
        background: #6b7280;
        color: white;
        &:hover { background: #4b5563; }
      `;
    }
  }}
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8fafc;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  font-size: 14px;
`;

const TableCell = styled.td`
  padding: 12px 16px;
  color: #6b7280;
  font-size: 14px;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${(props) => (props.active ? "#dcfce7" : "#fee2e2")};
  color: ${(props) => (props.active ? "#166534" : "#991b1b")};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  padding: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => {
    if (props.variant === 'edit') {
      return `
        background: #dbeafe;
        color: #1e40af;
        &:hover { background: #bfdbfe; }
      `;
    } else if (props.variant === 'delete') {
      return `
        background: #fee2e2;
        color: #991b1b;
        &:hover { background: #fecaca; }
      `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  font-size: 14px;
`;

const VariationValuesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const VariationValueTag = styled.span`
  padding: 4px 12px;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RemoveValueButton = styled.button`
  background: none;
  border: none;
  color: #3730a3;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 14px;
  
  &:hover {
    color: #1e1b4b;
  }
`;

const AddValueButton = styled.button`
  padding: 6px 12px;
  background: #e0e7ff;
  color: #3730a3;
  border: none;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background: #c7d2fe;
  }
`;
const ValueInputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  margin-bottom: 8px;
`;

const CatalogSteup = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [variations, setVariations] = useState([]);

 const [categoryForm, setCategoryForm] = useState({ name: '', description: '', status: true });
  const [variationForm, setVariationForm] = useState({ name: '', description: '', image: '', v_list: [] });
  const [newValue, setNewValue] = useState({ key: '', label: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingVariation, setEditingVariation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await getSellerCategory();
        // console.log(response);
        setCategories(response)
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchVariations = async () => {
      try {
        setLoading(true);
      const response = await getVariationList();
        setVariations(response)
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCategoryData();
    fetchVariations();
  }, [])


  const handleSaveCategory = () => {
    if (!categoryForm.name) return;

    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? { ...categoryForm, id: cat.id } : cat
      ));
      setEditingCategory(null);
    } else {
      setCategories([...categories, { ...categoryForm, id: Date.now() }]);
    }
    setCategoryForm({ name: '', description: '', status: true });
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description, status: category.status });
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleSaveVariation = () => {
    if (!variationForm.name || variationForm.v_list.length === 0) return;

    if (editingVariation) {
      setVariations(variations.map(v => 
        v.id === editingVariation.id ? { ...variationForm, id: v.id } : v
      ));
      setEditingVariation(null);
    } else {
      setVariations([...variations, { ...variationForm, id: Date.now() }]);
    }
    setVariationForm({ name: '', description: '', image: '', v_list: [] });
  };

  const handleEditVariation = (variation) => {
    setEditingVariation(variation);
    setVariationForm({ 
      name: variation.name, 
      description: variation.description || '',
      image: variation.image || '',
      v_list: [...variation.v_list]
    });
  };

  const handleDeleteVariation = (id) => {
    setVariations(variations.filter(v => v.id !== id));
  };

  const handleAddValue = () => {
    if (newValue.key.trim() || newValue.label.trim()) {
      setVariationForm({ 
        ...variationForm, 
        v_list: [...variationForm.v_list, [newValue.key.trim(), newValue.label.trim()]] 
      });
      setNewValue({ key: '', label: '' });
    }
  };

  const handleRemoveValue = (index) => {
    setVariationForm({
      ...variationForm,
      v_list: variationForm.v_list.filter((_, i) => i !== index)
    });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditingVariation(null);
    setCategoryForm({ name: '', description: '', status: true });
    setVariationForm({ name: '', description: '', image: '', v_list: [] });
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Product Management</Title>
        <Subtitle>Manage product categories and variations</Subtitle>
      </Header>

      <TabsContainer>
        <Tab active={activeTab === 'categories'} onClick={() => setActiveTab('categories')}>
          Categories
        </Tab>
        <Tab active={activeTab === 'variations'} onClick={() => setActiveTab('variations')}>
          Variations
        </Tab>
      </TabsContainer>

      {activeTab === 'categories' && (
        <>
          <ContentCard>
            <FormSection>
              <SectionTitle>
                <Plus size={20} />
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>Category Name *</Label>
                  <Input
                    type="text"
                    placeholder="Enter category name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Status</Label>
                  <Select
                    value={categoryForm.status}
                    onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value === 'true' })}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Select>
                </FormGroup>
              </FormGrid>
              <FormGroup>
                <Label>Description</Label>
                <Textarea
                  placeholder="Enter category description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </FormGroup>
              <ButtonGroup>
                {editingCategory && (
                  <Button onClick={handleCancelEdit}>
                    <X size={16} />
                    Cancel
                  </Button>
                )}
                <Button variant="success" onClick={handleSaveCategory}>
                  <Save size={16} />
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </Button>
              </ButtonGroup>
            </FormSection>
          </ContentCard>

          <ContentCard>
            <SectionTitle>Category List</SectionTitle>
            {categories.length === 0 ? (
              <EmptyState>No categories found. Add your first category above.</EmptyState>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Name</TableHeaderCell>
                    {/* <TableHeaderCell>Description</TableHeaderCell> */}
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell style={{ fontWeight: 600, color: '#374151' }}>{category.name}</TableCell>
                      {/* <TableCell>{category.description}</TableCell> */}
                      <TableCell>
                        <StatusBadge active={category.is_active}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <ActionButtons>
                          <IconButton variant="edit" onClick={() => handleEditCategory(category)}>
                            <Edit2 size={16} />
                          </IconButton>
                          <IconButton variant="delete" onClick={() => handleDeleteCategory(category.id)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}
          </ContentCard>
        </>
      )}

      {activeTab === 'variations' && (
        <>
          <ContentCard>
            <FormSection>
              <SectionTitle>
                <Plus size={20} />
                {editingVariation ? 'Edit Variation' : 'Add New Variation'}
              </SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>Variation Name *</Label>
                  <Input
                    type="text"
                    placeholder="e.g., Size, Color, Material"
                    value={variationForm.name}
                    onChange={(e) => setVariationForm({ ...variationForm, name: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Image URL</Label>
                  <Input
                    type="text"
                    placeholder="Enter image URL"
                    value={variationForm.image}
                    onChange={(e) => setVariationForm({ ...variationForm, image: e.target.value })}
                  />
                </FormGroup>
              </FormGrid>
              <FormGroup>
                <Label>Description</Label>
                <Textarea
                  placeholder="Enter variation description"
                  value={variationForm.description}
                  onChange={(e) => setVariationForm({ ...variationForm, description: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Variation Values *</Label>
                <ValueInputRow>
                  <Input
                    type="text"
                    placeholder="Value Key (e.g., S, M, L)"
                    value={newValue.key}
                    onChange={(e) => setNewValue({ ...newValue, key: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
                  />
                  <Input
                    type="text"
                    placeholder="Display Label (e.g., Small, Medium)"
                    value={newValue.label}
                    onChange={(e) => setNewValue({ ...newValue, label: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddValue()}
                  />
                  <Button variant="primary" onClick={handleAddValue}>
                    <Plus size={16} />
                    Add
                  </Button>
                </ValueInputRow>
                <VariationValuesContainer>
                  {variationForm.v_list.map((value, index) => (
                    value[0] || value[1] ? (
                      <VariationValueTag key={index}>
                        {value[1] || value[0]}
                        <RemoveValueButton onClick={() => handleRemoveValue(index)}>
                          <X size={14} />
                        </RemoveValueButton>
                      </VariationValueTag>
                    ) : null
                  ))}
                </VariationValuesContainer>
              </FormGroup>
              <ButtonGroup>
                {editingVariation && (
                  <Button onClick={handleCancelEdit}>
                    <X size={16} />
                    Cancel
                  </Button>
                )}
                <Button variant="success" onClick={handleSaveVariation}>
                  <Save size={16} />
                  {editingVariation ? 'Update Variation' : 'Save Variation'}
                </Button>
              </ButtonGroup>
            </FormSection>
          </ContentCard>

          <ContentCard>
            <SectionTitle>Variation List</SectionTitle>
            {variations.length === 0 ? (
              <EmptyState>No variations found. Add your first variation above.</EmptyState>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Image</TableHeaderCell>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Description</TableHeaderCell>
                    <TableHeaderCell>Values</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {variations.map((variation) => (
                    <TableRow key={variation.id}>
                      <TableCell>
                        {variation.image && (
                          <img 
                            src={variation.image} 
                            alt={variation.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e5e7eb' }}
                          />
                        )}
                      </TableCell>
                      <TableCell style={{ fontWeight: 600, color: '#374151' }}>{variation.name}</TableCell>
                      <TableCell>{variation.description}</TableCell>
                      <TableCell>
                        <VariationValuesContainer>
                          {variation.v_list
                            .filter(([key, label]) => key || label)
                            .map(([key, label], index) => (
                              <VariationValueTag key={index}>
                                {label || key}
                              </VariationValueTag>
                            ))}
                        </VariationValuesContainer>
                      </TableCell>
                      <TableCell>
                        <ActionButtons>
                          <IconButton variant="edit" onClick={() => handleEditVariation(variation)}>
                            <Edit2 size={16} />
                          </IconButton>
                          <IconButton variant="delete" onClick={() => handleDeleteVariation(variation.id)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}
          </ContentCard>
        </>
      )}
    </DashboardContainer>
  );
};

export default CatalogSteup;