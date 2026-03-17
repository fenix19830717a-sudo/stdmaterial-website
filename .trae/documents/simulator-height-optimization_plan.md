# Simulator Height Optimization Plan

## Overview
This plan aims to address the issue of incomplete content display in the grinding simulator page. The goal is to increase the page height by 3 times and ensure all content is fully visible without any frame limitations.

## Tasks

### [x] Task 1: Remove Frame Limitations
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - Remove any `overflow-hidden` or similar constraints that limit visible area
  - Ensure the main container allows content to flow freely
- **Success Criteria**:
  - No visible content is cut off or hidden
  - All elements can be seen without scrolling within containers
- **Test Requirements**:
  - `human-judgement` TR-1.1: All UI elements are fully visible
  - `programmatic` TR-1.2: No `overflow-hidden` classes in main containers

### [x] Task 2: Increase Overall Page Height
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - Increase the main glass panel height to 3 times its current size
  - Adjust related containers to accommodate the new height
- **Success Criteria**:
  - Page height is approximately 3 times larger than before
  - All content fits within the expanded space
- **Test Requirements**:
  - `programmatic` TR-2.1: Main container height is significantly increased
  - `human-judgement` TR-2.2: All content is visible without scrolling

### [x] Task 3: Optimize Left Panel Layout
- **Priority**: P1
- **Depends On**: Task 2
- **Description**:
  - Adjust left parameter panel to utilize the increased height
  - Ensure all parameter options are fully visible
- **Success Criteria**:
  - Left panel content is fully displayed
  - No content is cut off or requires scrolling
- **Test Requirements**:
  - `human-judgement` TR-3.1: All parameter options are visible
  - `human-judgement` TR-3.2: Left panel layout is balanced

### [x] Task 4: Optimize Right Panel Layout
- **Priority**: P1
- **Depends On**: Task 2
- **Description**:
  - Adjust right simulation control and visualization areas
  - Ensure simulation animation, equipment images, and monitoring data are fully visible
- **Success Criteria**:
  - Right panel content is fully displayed
  - Simulation visualization area is appropriately sized
- **Test Requirements**:
  - `human-judgement` TR-4.1: All right panel elements are visible
  - `human-judgement` TR-4.2: Simulation visualization is clear and complete

### [x] Task 5: Test and Verify
- **Priority**: P2
- **Depends On**: Tasks 3 and 4
- **Description**:
  - Test the optimized layout across different screen sizes
  - Verify all content is fully visible and properly aligned
- **Success Criteria**:
  - All content is visible without scrolling
  - Layout is balanced and aesthetically pleasing
- **Test Requirements**:
  - `human-judgement` TR-5.1: All content is fully visible
  - `human-judgement` TR-5.2: Layout is balanced and professional
