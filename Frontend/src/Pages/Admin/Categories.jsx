import React, { useEffect, useState } from "react";
import { Plus, X, Edit } from "lucide-react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/adminApi";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (e) {
        // silently fail
      }
    }
    loadCategories();
  }, []);

  const addCategory = async () => {
    if (!newCategory.name) return;
    try {
      const payload = {
        name: newCategory.name,
        description: newCategory.description,
      };
      const created = await createCategory(payload);
      setCategories((prev) => [...prev, created]);
      setNewCategory({ name: "", description: "" });
      setShowNewCategory(false);
    } catch (e) {
      // silently fail
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category._id || category.id);
    setEditForm({
      name: category.name,
      description: category.description,
    });
  };

  const saveEdit = async () => {
    try {
      await updateCategory(editingCategory, editForm);
      setCategories((prev) =>
        prev.map((c) =>
          (c._id || c.id) === editingCategory ? { ...c, ...editForm } : c,
        ),
      );
      setEditingCategory(null);
    } catch (e) {
      console.error("Failed to update category", e);
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
  };

  const removeCategory = async (category) => {
    if (!confirm(`Are you sure you want to remove ${category.name}?`)) return;
    try {
      await deleteCategory(category._id || category.id);
      setCategories((prev) =>
        prev.filter((c) => (c._id || c.id) !== (category._id || category.id)),
      );
      alert(`${category.name} has been removed successfully.`);
    } catch (error) {
      console.log(error);
      alert("Failed to remove category");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white border-2 border-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setShowNewCategory(true)}
            className="px-4 py-2 bg-white border-2 border-gray-800 rounded hover:bg-gray-50 flex items-center gap-2"
          >
            <Plus size={16} /> New Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="text-left p-2 font-semibold">Name</th>
                <th className="text-left p-2 font-semibold">Description</th>
                <th className="text-left p-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category._id || category.id}
                  className="border-b border-gray-300"
                >
                  <td className="p-2">
                    {editingCategory === (category._id || category.id) ? (
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td className="p-2">
                    {editingCategory === (category._id || category.id) ? (
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                      />
                    ) : (
                      category.description
                    )}
                  </td>
                  <td className="p-2 flex gap-2">
                    {editingCategory === (category._id || category.id) ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(category)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center gap-1"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => removeCategory(category)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm flex items-center gap-1"
                        >
                          <X size={16} /> Remove
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {showNewCategory && (
                <tr
                  key="new-category"
                  className="border-b border-gray-300 bg-gray-50"
                >
                  <td className="p-2">
                    <input
                      type="text"
                      placeholder="Name"
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      placeholder="Description"
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                      value={newCategory.description}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={addCategory}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowNewCategory(false)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;
