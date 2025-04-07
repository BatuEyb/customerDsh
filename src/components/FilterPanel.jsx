import React, { useEffect, useState } from 'react';

const FilterPanel = ({ filter, setFilter, categories, stocks }) => {
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [allBrands, setAllBrands] = useState([]);

    useEffect(() => {
        const brandCategoryMap = stocks.map((s) => ({
            name: s.brand,
            category_id: s.category_id,
        }));

        setAllBrands(brandCategoryMap);

        // Kategori seçildiğinde sadece o kategoriye ait markalar filtrelenecek
        if (filter.category_id) {
            const filtered = brandCategoryMap.filter(
                (b) => b.category_id === filter.category_id
            );
            setFilteredBrands([...new Set(filtered.map((b) => b.name))]);
        } else {
            setFilteredBrands([...new Set(brandCategoryMap.map((b) => b.name))]);
        }

        // Marka seçildiğinde sadece o markaya ait kategoriler filtrelenecek
        if (filter.brand) {
            const relatedCategories = stocks
                .filter((s) => s.brand === filter.brand)
                .map((s) => s.category_id);
            const uniqueCatIds = [...new Set(relatedCategories)];
            const cats = categories.filter((cat) => uniqueCatIds.includes(cat.id));
            setFilteredCategories(cats);
        } else {
            setFilteredCategories(categories);
        }
    }, [filter.category_id, filter.brand, categories, stocks]);

    const resetFilters = () => {
        setFilter({
            search: '',
            quantity_operator: '>=',
            quantity: '',
            category_id: '',
            brand: '',
            sort_by: ''
        });
    };

    return (
        <div className="card mb-4">
            <div className="card-header bg-light">
                <strong>Filtreleme Seçenekleri</strong>
            </div>
            <div className="card-body">
                <div className="mb-3 row g-2 align-items-end">
                    <div className="col-md-4">
                        <label>Ürün Adı / Stok Kodu</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ara..."
                            value={filter.search || ''}
                            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                        />
                    </div>
                    <div className="col-md-1">
                        <label>Stok Operatörü</label>
                        <select
                            className="form-select"
                            value={filter.quantity_operator || '>='}
                            onChange={(e) => setFilter({ ...filter, quantity_operator: e.target.value })}
                        >
                            <option value=">=">≥</option>
                            <option value="<=">≤</option>
                            <option value="=">=</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label>Stok Miktarı</label>
                        <input
                            type="number"
                            className="form-control"
                            value={filter.quantity || ''}
                            onChange={(e) => setFilter({ ...filter, quantity: e.target.value })}
                        />
                    </div>
                    <div className="col-md-2">
                        <label>Kategori</label>
                        <select
                            className="form-select"
                            value={filter.category_id || ''}
                            onChange={(e) =>
                                setFilter({
                                    ...filter,
                                    category_id: e.target.value || '',
                                })
                            }
                        >
                            <option value="">Tümü</option>
                            {filteredCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label>Marka</label>
                        <select
                            className="form-select"
                            value={filter.brand || ''}
                            onChange={(e) =>
                                setFilter({
                                    ...filter,
                                    brand: e.target.value || '',
                                })
                            }
                        >
                            <option value="">Tümü</option>
                            {filteredBrands.map((brand, index) => (
                                <option key={index} value={brand}>
                                    {brand}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-12 text-end mt-3">
                        <a href="#" onClick={resetFilters} className="btn btn-link text-decoration-none">
                            Filtreleri Sıfırla
                        </a>
                    </div>
                </div>
            </div>    
        </div>
    );
};

export default FilterPanel;
