import React from "react";

const ProductFilter = ({
  filters,
  onFilterChange,
  allCategories,
  allBrands,
  filteredCategories,
  filteredBrands,
  onCategoryChange,
  onBrandChange,
  onResetFilters
}) => {
  const [searchInput, setSearchInput] = React.useState(filters.searchInput);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange({ searchInput, kategori: filters.kategori, marka: filters.marka });
    }, 300); 

    return () => clearTimeout(timeout);
  }, [searchInput, filters, onFilterChange]);

  return (
    <div className="mb-2">
      <div className="row">
        
        {/* Category Filter */}
        <div className="col-md-2">
          <select
            className="form-control"
            value={filters.kategori}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Kategori Seç</option>
            {filteredCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div className="col-md-2">
          <select
            className="form-control"
            value={filters.marka}
            onChange={(e) => onBrandChange(e.target.value)}
          >
            <option value="">Marka Seç</option>
            {filteredBrands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="col-md-7">
          <input
            type="text"
            className="form-control"
            placeholder="Ürün adı veya stok numarası ara"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="col-md-1">
            <button className="btn btn-secondary mt-2" onClick={onResetFilters}>
                
            </button>
        </div>
      </div>
      
    </div>
  );
};

export default ProductFilter;
