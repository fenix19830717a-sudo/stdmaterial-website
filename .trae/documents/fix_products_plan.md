# Fix Products - Implementation Plan

## [ ] Task 1: Analyze and fix product translations in data/products.json
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - Review all products in `data/products.json` that have `nameEn` fields containing "(EN)" suffix
  - Fix product translations by either:
    - Using existing English translations from other data sources, or
    - Properly translating the product names
  - Also fix corresponding `descriptionEn` fields that still contain Chinese text
- **Success Criteria**:
  - All products have proper English names without "(EN)" suffixes
  - All product descriptions are in proper English
- **Test Requirements**:
  - `programmatic` TR-1.1: No products with "(EN)" in nameEn field
  - `human-judgement` TR-1.2: Product names and descriptions make sense in English
- **Notes**: Check both data/products.json and assets/data/products.json if both are used

## [ ] Task 2: Fix product image indexing and path handling logic
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - Review how product images are referenced in the data files
  - Ensure consistent image path handling
  - Fix any broken image references
  - Review the JavaScript code that loads and displays product images
- **Success Criteria**:
  - All product images display correctly on the website
  - No broken image placeholders
- **Test Requirements**:
  - `human-judgement` TR-2.1: All product images visible on product catalog page
  - `programmatic` TR-2.2: No 404 errors for image requests
- **Notes**: Check for inconsistent path formats (absolute vs relative, leading slashes, etc.)

## [ ] Task 3: Verify all changes and test the implementation
- **Priority**: P1
- **Depends On**: [Task 1, Task 2]
- **Description**: 
  - Test the product catalog page to ensure translations work correctly
  - Verify all images are loading properly
  - Check product detail pages for consistency
- **Success Criteria**:
  - Website functions correctly with proper English translations and working images
- **Test Requirements**:
  - `human-judgement` TR-3.1: Complete end-to-end test of product catalog
  - `programmatic` TR-3.2: No JavaScript console errors
