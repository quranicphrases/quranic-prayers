## Plan: Adaptive Filter Section & Control Panel Redesign

This plan implements a responsive, industry-standard UI that adapts gracefully from 344px (Galaxy Z Fold 5) to ultra-wide curved screens. The design follows Material Design patterns (bottom sheets, FABs) and responsive web design best practices (multi-column layouts, collapsible sections).

**TL;DR:** Create three distinct layout modes: (1) **Wide** (≥1200px): persistent left sidebar with filters, multi-column prayer grid; (2) **Standard** (600px-1199px): current inline layout with refinements; (3) **Compact** (<600px): minimal sticky bar with FAB-triggered bottom sheet for all controls.

---

## Design Overview

### Layout Strategy by Screen Size

| Breakpoint                | Layout                 | Filter Section             | Control Panel                       |
| ------------------------- | ---------------------- | -------------------------- | ----------------------------------- |
| **≥1200px** (Wide)        | 2-3 column prayer grid | Persistent left sidebar    | Top sticky bar (minimal)            |
| **600-1199px** (Standard) | Single column prayers  | Collapsible section at top | Sticky floating bar                 |
| **<600px** (Compact)      | Full-width prayers     | Hidden in bottom sheet     | Hidden in bottom sheet, FAB trigger |

### Always-Visible Elements

- **Back to Top** button (always sticky, visible on all screens)
- **Filter count indicator** (shows "3 filters" badge when active)

### Progressive Disclosure Pattern

- On compact screens, a **FAB (Floating Action Button)** with settings icon opens a **bottom sheet**
- The bottom sheet contains two tabs: **Filters** and **Reading Options**
- This pattern is used by Google, Apple, and most modern mobile apps

---

## Detailed Steps

### Step 1: Create Reusable Component Structure

**New components to create:**

- `src/components/BottomSheet.tsx` - Reusable sheet that slides up from bottom
- `src/components/BottomSheet.css` - Sheet styles with backdrop, transitions
- `src/components/FloatingControls.tsx` - Compact FAB + always-on buttons
- `src/components/FloatingControls.css` - FAB styles, positioning
- `src/components/Sidebar.tsx` - Wide screen sidebar container
- `src/components/Sidebar.css` - Sidebar styles

### Step 2: Update App.tsx Layout Structure

Restructure [App.tsx](src/App.tsx) to support three layout modes:

```jsx
<div className="app-container">
  {/* Wide screens: Sidebar */}
  <aside className="sidebar desktop-only">
    <FilterSection ... />
    <ControlPanel ... />
  </aside>

  <main className="main-content">
    {/* Standard screens: Inline controls */}
    <div className="inline-controls tablet-only">
      <FilterSection ... />
      <ControlPanel ... />
    </div>

    {/* All screens: Prayer list (grid on wide, single-column otherwise) */}
    <div className="prayers-grid">
      {prayers.map(...)}
    </div>
  </main>

  {/* Compact screens: Floating controls + Bottom sheet */}
  <FloatingControls className="mobile-only">
    <BackToTopButton />
    <FilterBadge count={selectedTags.size} />
    <FAB onClick={openBottomSheet} />
  </FloatingControls>

  <BottomSheet isOpen={sheetOpen} onClose={closeSheet}>
    <TabPanel tabs={['Filters', 'Reading']}>
      <FilterSection ... />
      <ReadingControls ... />
    </TabPanel>
  </BottomSheet>
</div>
```

### Step 3: Create BottomSheet Component

Create [src/components/BottomSheet.tsx](src/components/BottomSheet.tsx):

- Accept `isOpen`, `onClose`, `title`, `children` props
- Render a modal overlay + sliding panel from bottom
- Include drag handle for swipe-to-close (optional enhancement)
- Trap focus for accessibility
- Close on backdrop click or Escape key

**CSS features:**

- `position: fixed`, `bottom: 0`, `left: 0`, `right: 0`
- `transform: translateY(100%)` when closed, `translateY(0)` when open
- `transition: transform 0.3s ease-out`
- `max-height: 85vh` with `overflow-y: auto`
- Backdrop: `background: rgba(0, 0, 0, 0.5)`

### Step 4: Create FloatingControls Component

Create [src/components/FloatingControls.tsx](src/components/FloatingControls.tsx):

**Structure:**

```jsx
<div className="floating-controls">
  {/* Always visible: Back to Top */}
  <button className="floating-btn back-to-top">↑ Top</button>

  {/* Always visible: Active filter badge (when filters active) */}
  {activeFilters > 0 && (
    <button className="floating-btn filter-badge" onClick={openSheet}>
      {activeFilters} filter{activeFilters > 1 ? "s" : ""}
    </button>
  )}

  {/* FAB: Opens bottom sheet */}
  <button className="fab" aria-label="Settings" onClick={openSheet}>
    <SettingsIcon />
  </button>
</div>
```

**CSS features:**

- `position: fixed`, `bottom: 1rem`, `right: 1rem`
- `display: flex`, `flex-direction: column`, `gap: 0.5rem`
- FAB: `width: 56px`, `height: 56px`, `border-radius: 50%`
- `z-index: 1000`

### Step 5: Create Sidebar Component for Wide Screens

Create [src/components/Sidebar.tsx](src/components/Sidebar.tsx):

**Features:**

- Sticky position, anchored to left side
- Contains FilterSection and condensed ControlPanel
- `width: 280px` fixed
- Visible only at `≥1200px`

### Step 6: Implement Multi-Column Prayer Grid

Update [App.css](src/App.css) to add `.prayers-grid`:

```css
.prayers-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1200px) {
  .prayers-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1600px) {
  .prayers-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Step 7: Update App Container Layout for Wide Screens

Add layout rules to [App.css](src/App.css):

```css
@media (min-width: 1200px) {
  .app-container {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    max-width: none; /* Utilize full width */
  }

  .sidebar {
    position: sticky;
    top: 1rem;
    height: fit-content;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
  }
}
```

### Step 8: Add Visibility Utility Classes

Add to [App.css](src/App.css):

```css
/* Visibility utilities */
.desktop-only {
  display: none;
}
.tablet-only {
  display: block;
}
.mobile-only {
  display: none;
}

@media (min-width: 1200px) {
  .desktop-only {
    display: block;
  }
  .tablet-only {
    display: none;
  }
  .mobile-only {
    display: none;
  }
}

@media (max-width: 599px) {
  .desktop-only {
    display: none;
  }
  .tablet-only {
    display: none;
  }
  .mobile-only {
    display: flex;
  }
}
```

### Step 9: Add State Management for Bottom Sheet

Update [App.tsx](src/App.tsx):

- Add `const [isSheetOpen, setSheetOpen] = useState(false)`
- Add `const [activeTab, setActiveTab] = useState<'filters' | 'reading'>('filters')`
- Pass handlers to FloatingControls and BottomSheet

### Step 10: Refine Small Screen Breakpoints

Update breakpoints in [App.css](src/App.css):

- Replace `375px` breakpoint with `344px` for Galaxy Z Fold 5 support
- Ensure "Top" text remains visible at all sizes (remove `.back-to-top-text { display: none }`)
- Adjust floating controls for edge-to-edge screens

### Step 11: Add Reduced Motion Support

Ensure all new animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  .bottom-sheet,
  .bottom-sheet-backdrop {
    transition: none;
  }
}
```

### Step 12: Add Keyboard Navigation

Ensure accessibility:

- BottomSheet traps focus when open
- FAB is focusable with clear focus ring
- Escape key closes bottom sheet
- Tab order is logical

---

## Component File Structure

```
src/components/
├── BottomSheet/
│   ├── BottomSheet.tsx
│   └── BottomSheet.css
├── FloatingControls/
│   ├── FloatingControls.tsx
│   └── FloatingControls.css
├── Sidebar/
│   ├── Sidebar.tsx
│   └── Sidebar.css
├── FilterSection.tsx (update)
├── PrayerCard.tsx (unchanged)
└── ...
```

---

## Verification

1. **344px (Galaxy Z Fold 5)**: FAB visible, bottom sheet opens smoothly, "↑ Top" always visible
2. **375px (iPhone SE)**: Same as above, touch targets ≥44px
3. **768px (iPad)**: Inline filter section + control panel, single column prayers
4. **1200px (Desktop)**: Left sidebar with filters, 2-column prayer grid
5. **1920px+ (Ultra-wide)**: 3-column prayer grid, sidebar with ample whitespace
6. **Keyboard navigation**: Tab through all controls, Escape closes sheet
7. **Reduced motion**: Animations disabled when preference set

---

## Decisions

| Decision                              | Rationale                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Bottom sheet over modal**           | Native-feeling on mobile, doesn't block context, industry standard (Material Design)             |
| **FAB for settings**                  | Thumb-reachable on mobile, consistent with Android/iOS patterns                                  |
| **Left sidebar on wide screens**      | Eye-tracking research shows users scan left-to-right; filters on left is common (Amazon, Airbnb) |
| **Multi-column grid on wide screens** | Utilizes horizontal space, reduces vertical scrolling                                            |
| **"Top" text always visible**         | Per user requirement; uses compact styling at small sizes                                        |
| **600px mobile breakpoint**           | More practical than 480px for modern phones; aligns with common framework defaults               |
| **Tabs in bottom sheet**              | Groups related controls, reduces cognitive load                                                  |
