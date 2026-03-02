const fs = require('fs');
const path = require('path');

// Categories to update
const categoriesToUpdate = [
  'travel', 'jewelry', 'food', 'art', 'pets', 'tools', 
  'kitchen', 'tv', 'audio', 'office', 'gifts'
];

// Category configurations
const categoryConfigs = {
  travel: {
    color: 'sky',
    placeholder: 'Search for luggage, travel gear, or accessories...',
    suggestions: ['suitcase', 'backpack', 'travel pillow', 'luggage set', 'passport holder'],
    quickFilters: [
      { label: 'All', value: 'travel', color: 'bg-gray-100 text-gray-700' },
      { label: 'Luggage', value: 'Luggage', color: 'bg-sky-100 text-sky-700' },
      { label: 'Backpacks', value: 'Backpacks', color: 'bg-blue-100 text-blue-700' },
      { label: 'Travel Accessories', value: 'Travel Accessories', color: 'bg-green-100 text-green-700' },
      { label: 'Travel Gear', value: 'Travel Gear', color: 'bg-purple-100 text-purple-700' }
    ]
  },
  jewelry: {
    color: 'amber',
    placeholder: 'Search for jewelry, watches, or accessories...',
    suggestions: ['diamond ring', 'gold necklace', 'luxury watch', 'silver earrings', 'bracelet'],
    quickFilters: [
      { label: 'All', value: 'jewelry', color: 'bg-gray-100 text-gray-700' },
      { label: 'Fine Jewelry', value: 'Fine Jewelry', color: 'bg-amber-100 text-amber-700' },
      { label: 'Fashion Jewelry', value: 'Fashion Jewelry', color: 'bg-yellow-100 text-yellow-700' },
      { label: 'Watches', value: 'Watches', color: 'bg-orange-100 text-orange-700' },
      { label: 'Accessories', value: 'Accessories', color: 'bg-pink-100 text-pink-700' }
    ]
  },
  food: {
    color: 'lime',
    placeholder: 'Search for food, beverages, or grocery items...',
    suggestions: ['organic coffee', 'chocolate', 'green tea', 'honey', 'olive oil'],
    quickFilters: [
      { label: 'All', value: 'food', color: 'bg-gray-100 text-gray-700' },
      { label: 'Groceries', value: 'Groceries', color: 'bg-lime-100 text-lime-700' },
      { label: 'Snacks', value: 'Snacks', color: 'bg-green-100 text-green-700' },
      { label: 'Beverages', value: 'Beverages', color: 'bg-blue-100 text-blue-700' },
      { label: 'Organic Food', value: 'Organic Food', color: 'bg-emerald-100 text-emerald-700' }
    ]
  },
  art: {
    color: 'fuchsia',
    placeholder: 'Search for art supplies, craft materials, or DIY kits...',
    suggestions: ['acrylic paint', 'paint brushes', 'canvas', 'sketchbook', 'color pencils'],
    quickFilters: [
      { label: 'All', value: 'art', color: 'bg-gray-100 text-gray-700' },
      { label: 'Art Supplies', value: 'Art Supplies', color: 'bg-fuchsia-100 text-fuchsia-700' },
      { label: 'Craft Materials', value: 'Craft Materials', color: 'bg-pink-100 text-pink-700' },
      { label: 'DIY Kits', value: 'DIY Kits', color: 'bg-purple-100 text-purple-700' },
      { label: 'Painting', value: 'Painting', color: 'bg-blue-100 text-blue-700' }
    ]
  },
  pets: {
    color: 'emerald',
    placeholder: 'Search for pet supplies, food, or accessories...',
    suggestions: ['dog food', 'cat toys', 'pet bed', 'aquarium filter', 'bird cage'],
    quickFilters: [
      { label: 'All', value: 'pets', color: 'bg-gray-100 text-gray-700' },
      { label: 'Dog Supplies', value: 'Dog Supplies', color: 'bg-emerald-100 text-emerald-700' },
      { label: 'Cat Supplies', value: 'Cat Supplies', color: 'bg-blue-100 text-blue-700' },
      { label: 'Bird Supplies', value: 'Bird Supplies', color: 'bg-sky-100 text-sky-700' },
      { label: 'Pet Food', value: 'Pet Food', color: 'bg-green-100 text-green-700' }
    ]
  },
  tools: {
    color: 'stone',
    placeholder: 'Search for tools, hardware, or equipment...',
    suggestions: ['power drill', 'socket set', 'screwdriver', 'tool box', 'hammer'],
    quickFilters: [
      { label: 'All', value: 'tools', color: 'bg-gray-100 text-gray-700' },
      { label: 'Power Tools', value: 'Power Tools', color: 'bg-stone-100 text-stone-700' },
      { label: 'Hand Tools', value: 'Hand Tools', color: 'bg-gray-100 text-gray-700' },
      { label: 'Hardware', value: 'Hardware', color: 'bg-slate-100 text-slate-700' },
      { label: 'Garden Tools', value: 'Garden Tools', color: 'bg-green-100 text-green-700' }
    ]
  },
  kitchen: {
    color: 'orange',
    placeholder: 'Search for cookware, appliances, or dining items...',
    suggestions: ['non-stick pan', 'coffee maker', 'knife set', 'mixing bowl', 'dinner plates'],
    quickFilters: [
      { label: 'All', value: 'kitchen', color: 'bg-gray-100 text-gray-700' },
      { label: 'Cookware', value: 'Cookware', color: 'bg-orange-100 text-orange-700' },
      { label: 'Small Appliances', value: 'Small Appliances', color: 'bg-red-100 text-red-700' },
      { label: 'Dining', value: 'Dining', color: 'bg-yellow-100 text-yellow-700' },
      { label: 'Bakery', value: 'Bakery', color: 'bg-amber-100 text-amber-700' }
    ]
  },
  tv: {
    color: 'blue',
    placeholder: 'Search for TVs, sound systems, or streaming devices...',
    suggestions: ['4K TV', 'soundbar', 'streaming stick', 'home theater', 'TV mount'],
    quickFilters: [
      { label: 'All', value: 'tv', color: 'bg-gray-100 text-gray-700' },
      { label: 'TVs', value: 'TVs', color: 'bg-blue-100 text-blue-700' },
      { label: 'Sound Systems', value: 'Sound Systems', color: 'bg-purple-100 text-purple-700' },
      { label: 'Streaming Devices', value: 'Streaming Devices', color: 'bg-green-100 text-green-700' },
      { label: 'Cables', value: 'Cables', color: 'bg-gray-100 text-gray-700' }
    ]
  },
  audio: {
    color: 'purple',
    placeholder: 'Search for headphones, speakers, or audio equipment...',
    suggestions: ['wireless headphones', 'bluetooth speaker', 'studio microphone', 'audio cable', 'turntable'],
    quickFilters: [
      { label: 'All', value: 'audio', color: 'bg-gray-100 text-gray-700' },
      { label: 'Headphones', value: 'Headphones', color: 'bg-purple-100 text-purple-700' },
      { label: 'Speakers', value: 'Speakers', color: 'bg-blue-100 text-blue-700' },
      { label: 'Audio Accessories', value: 'Audio Accessories', color: 'bg-green-100 text-green-700' },
      { label: 'Pro Audio', value: 'Pro Audio', color: 'bg-red-100 text-red-700' }
    ]
  },
  office: {
    color: 'gray',
    placeholder: 'Search for office supplies, furniture, or equipment...',
    suggestions: ['office chair', 'desk lamp', 'notebook', 'pen set', 'filing cabinet'],
    quickFilters: [
      { label: 'All', value: 'office', color: 'bg-gray-100 text-gray-700' },
      { label: 'Stationery', value: 'Stationery', color: 'bg-blue-100 text-blue-700' },
      { label: 'Office Furniture', value: 'Office Furniture', color: 'bg-slate-100 text-slate-700' },
      { label: 'Storage', value: 'Storage', color: 'bg-green-100 text-green-700' },
      { label: 'Technology', value: 'Technology', color: 'bg-purple-100 text-purple-700' }
    ]
  },
  gifts: {
    color: 'pink',
    placeholder: 'Search for gifts, party supplies, or special items...',
    suggestions: ['gift basket', 'birthday gift', 'party decorations', 'gift card', 'seasonal gifts'],
    quickFilters: [
      { label: 'All', value: 'gifts', color: 'bg-gray-100 text-gray-700' },
      { label: 'Gift Ideas', value: 'Gift Ideas', color: 'bg-pink-100 text-pink-700' },
      { label: 'Party Supplies', value: 'Party Supplies', color: 'bg-purple-100 text-purple-700' },
      { label: 'Gift Cards', value: 'Gift Cards', color: 'bg-blue-100 text-blue-700' },
      { label: 'Seasonal', value: 'Seasonal', color: 'bg-green-100 text-green-700' }
    ]
  }
};

// Function to update a category page
function updateCategoryPage(categoryName, config) {
  const filePath = path.join(__dirname, 'app', 'categories', categoryName, 'page.tsx');
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Add CategorySearch import
  if (!content.includes('import CategorySearch')) {
    content = content.replace(
      "import Pagination from '@/components/Pagination';",
      "import Pagination from '@/components/Pagination';\nimport CategorySearch from '@/components/CategorySearch';"
    );
  }

  // Add handleQuickFilter function
  if (!content.includes('handleQuickFilter')) {
    content = content.replace(
      "const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })",
      `const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Quick filter handler
  const handleQuickFilter = (filterValue: string) => {
    setSelectedCategory([filterValue])
    setSearchTerm('')
    setSelectedRatings([])
    setSelectedSizes([])
    setPriceRange({ min: 0, max: 1000 })
  }`
    );
  }

  // Add search section before subcategories
  const subcategoriesPattern = /{\/\* Subcategories \*\/}/;
  if (subcategoriesPattern.test(content)) {
    const searchSection = `{/* Search Section */}
        <CategorySearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onQuickFilter={handleQuickFilter}
          quickFilters={${JSON.stringify(config.quickFilters, null, 2)}}
          searchSuggestions={${JSON.stringify(config.suggestions, null, 2)}}
          placeholder='${config.placeholder}'
          categoryColor='${config.color}'
          resultCount={filteredAndSortedProducts.length}
        />

        {/* Subcategories */}`;
    
    content = content.replace(subcategoriesPattern, searchSection);
  }

  // Enhanced search functionality
  const searchLogicPattern = /const matchesSearch = product\.name\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\) \|\|[\s\S]*?product\.category\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\))/;
  const newSearchLogic = `const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.badge?.toLowerCase().includes(searchTerm.toLowerCase())`;

  content = content.replace(searchLogicPattern, newSearchLogic);

  // Enhanced sort options
  const sortOptionsPattern = /<option value='featured'>Featured<\/option>[\s\S]*?<option value='rating'>Highest Rated<\/option>/;
  const newSortOptions = `<option value='featured'>Featured</option>
                  <option value='newest'>Newest First</option>
                  <option value='popular'>Most Popular</option>
                  <option value='discount'>Best Discount</option>
                  <option value='price-low'>Price: Low to High</option>
                  <option value='price-high'>Price: High to Low</option>
                  <option value='name-asc'>Name: A to Z</option>
                  <option value='name-desc'>Name: Z to A</option>
                  <option value='rating'>Highest Rated</option>`;

  content = content.replace(sortOptionsPattern, newSortOptions);

  // Enhanced sort logic
  const sortLogicPattern = /switch \(sortBy\) {[\s\S]*?default:[\s\S]*?return filtered[\s\S]*?}/;
  const newSortLogic = `switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price)
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price)
      case 'name-asc':
        return filtered.sort((a, b) => a.name.localeCompare(b.name))
      case 'name-desc':
        return filtered.sort((a, b) => b.name.localeCompare(a.name))
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating)
      case 'newest':
        return filtered.sort((a, b) => b.id - a.id)
      case 'popular':
        return filtered.sort((a, b) => b.reviews - a.reviews)
      case 'discount':
        return filtered.sort((a, b) => {
          const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0
          const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0
          return discountB - discountA
        })
      default:
        return filtered
    }`;

  content = content.replace(sortLogicPattern, newSortLogic);

  // Update useMemo dependencies
  const depsPattern = /\}, \[searchTerm, sortBy, selectedRatings, selectedSizes, priceRange]\)/;
  content = content.replace(depsPattern, `}, [searchTerm, sortBy, selectedRatings, selectedSizes, priceRange, selectedCategory])`);

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${categoryName} category page`);
}

// Update all category pages
categoriesToUpdate.forEach(categoryName => {
  updateCategoryPage(categoryName, categoryConfigs[categoryName]);
});

console.log('All remaining category pages have been updated with enhanced search functionality!');
