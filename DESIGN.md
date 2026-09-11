---
name: Modern SaaS Precision
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464554'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777586'
  outline-variant: '#c7c4d7'
  surface-tint: '#5148d7'
  primary: '#2a14b4'
  on-primary: '#ffffff'
  primary-container: '#4338ca'
  on-primary-container: '#c1beff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#5c2f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#7d4200'
  on-tertiary-container: '#ffb477'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100069'
  on-primary-fixed-variant: '#372abf'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
  data-tabular:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-compact: 0.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system embodies a modern, high-density desktop SaaS experience engineered for streamlined inventory and product administration. It projects operational rigor, clarity, and rapid execution, eliminating visual clutter in favor of data legibility and effortless navigation. The aesthetic blends contemporary enterprise minimalism with refined visual structure—utilizing crisp borders, deliberate contrast, and tactile state feedback. 

Users—ranging from warehouse managers to e-commerce administrators—must feel completely in control, confident in bulk modifications, and assured that critical inventory actions (e.g., stock depletion, pricing modifications, catalog additions) are unambiguous and safe.

## Colors

The palette establishes a deliberate functional hierarchy centered around deep indigo for structural primary interactions and emerald green for affirmative monetary or positive inventory states.

- **Primary (`#4338CA` - Indigo 700):** Governs primary workflows, focal interactive elements, and key system anchors such as "Novo Produto" or "Salvar Alterações".
- **Secondary (`#059669` - Emerald 600):** Represents success states, active inventory ("Em Estoque"), positive cashflow, and verified catalog syncs.
- **Tertiary (`#D97706` - Amber 600):** Communicates cautionary attention, such as "Estoque Baixo" warnings or pending batch validations.
- **Neutral (`#0F172A` - Slate 900):** The primary text and high-contrast boundary base, supported by neutral slate surfaces (`#F8FAFC`, `#F1F5F9`, `#E2E8F0`) to create high-legibility workspaces.
- **Destructive / Error (`#DC2626` - Red 600):** Reserved strictly for terminal actions, such as "Excluir Produto", or critical blockers like "Sem Estoque".

## Typography

Typography prioritizes tabular scanability and functional clarity. 

- **Display & Interface:** Inter is used across all UI headings, form inputs, tooltips, and informational body copy due to its neutral proportions and extensive hinting for dense desktop viewports.
- **Data & Numerical Values:** JetBrains Mono is assigned to all SKU codes, monetary figures (BRL `R$`), stock counts, dates, and status tags. This enforces strict monospace tabular alignment, preventing visual jitter across rapid sorting, row updates, and vertical numeric scans.

## Layout & Spacing

The layout is built on a rigid desktop-first 12-column grid system designed for expansive 1280px+ viewports with fixed structural navigation.

- **Workspace Anatomy:** Left-aligned persistent sidebar (240px wide, non-collapsible on standard screens), flanked by a fluid content container constrained to a maximum width of 1600px with `2rem` (`32px`) margins.
- **Data Densities:**
  - *Standard View:* Table rows have 12px vertical padding (`space-sm` + `space-xs`), accommodating multi-line metadata.
  - *Compact / Bulk View:* Table rows scale down to 8px vertical padding (`space-sm`) using `gutter-compact` (`8px`) for high-volume inventory reconciliation.
- **Rhythm:** Modular components adhere to a strict 4px base step, scaling through `space-xs` (4px) to `space-2xl` (48px) for consistent hierarchy between field labels, inputs, and section boundaries.

## Elevation & Depth

This system avoids heavy, atmospheric shadows to maintain structural crispness and low cognitive load. Visual layering is communicated through subtle border stratification and light-reactive resting states:

- **Base Layer (Canvas):** `#F8FAFC` (Slate 50), providing soft contrast beneath pure white cards.
- **Surface Layer (Cards, Modals, Tables):** `#FFFFFF` with a crisp 1px border (`#E2E8F0`).
- **Level 1 (Hover & Focus Tiers):** `0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)`. Applied to active row hovering, dropdown buttons, and search inputs.
- **Level 2 (Popovers, Flyouts, Filter Panels):** `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (CRUD Modals & Confirmations):** `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`, grounded by a semi-opaque backdrop scrim (`rgba(15, 23, 42, 0.4)`).

## Shapes

The geometric framework follows **Soft (Level 1)** contours:

- Standard inputs, buttons, and badges utilize `0.25rem` (4px) corner radii.
- Content cards, data table wrappers, and flyout containers adopt `rounded-lg` (`0.5rem` / 8px).
- Modal viewports and critical overlays peak at `rounded-xl` (`0.75rem` / 12px).
- Badges and status pills remain slightly boxy (4px) rather than fully rounded, maintaining the structured, technical utility aesthetic of product logistics software.

## Components

### Buttons
- **Primary ("Criar Produto", "Salvar"):** Solid `#4338CA`, text `#FFFFFF`, hover `#3730A3`, focus ring 2px `#4338CA` with 2px offset.
- **Secondary ("Editar", "Exportar"):** Border 1px `#CBD5E1`, background `#FFFFFF`, text `#334155`, hover background `#F8FAFC`.
- **Destructive ("Excluir", "Remover"):** Background `#FEE2E2`, border 1px `#FECACA`, text `#DC2626`, hover background `#DC2626`, hover text `#FFFFFF`.
- **Icon Actions (CRUD Table Inline):** 32x32px square buttons with centered SVGs, 4px radius, subtle hover highlight (`#F1F5F9`).

### Input Fields & Controls
- **Text & Currency Inputs:** Surface `#FFFFFF`, border 1px `#CBD5E1`, text `#0F172A`, placeholder `#94A3B8`. Dynamic prefix for currency (`R$`) rendered in JetBrains Mono with `#64748B` neutral tone.
- **Focus State:** 1px `#4338CA` with an ambient glow (`box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.15)`).
- **Checkboxes:** Custom 16x16px control, border 1px `#94A3B8`, filled with `#4338CA` when checked, featuring an unambiguous white checkmark.

### Status Badges (Inventory States)
- **Em Estoque:** Background `#ECFDF5`, border 1px `#A7F3D0`, text `#065F46`, prefix dot 6px `#059669`.
- **Estoque Baixo:** Background `#FFFBEB`, border 1px `#FDE68A`, text `#92400E`, prefix dot 6px `#D97706`.
- **Esgotado:** Background `#FEF2F2`, border 1px `#FECACA`, text `#991B1B`, prefix dot 6px `#DC2626`.
- **Inativo / Rascunho:** Background `#F1F5F9`, border 1px `#E2E8F0`, text `#475569`, prefix dot 6px `#94A3B8`.

### Data Tables
- **Header:** Sticky `#F8FAFC`, bottom border 1px `#E2E8F0`, uppercase text in Inter 11px semi-bold (`#64748B`), with sorting indicators.
- **Rows:** White background alternating with clean divider lines (`#F1F5F9`). Row hover transitions cleanly to `#F8FAFC`. Selected rows highlight via `#EEF2FF` with a 2px left border in `#4338CA`.
- **Cells:** Vertical alignment centered, numbers and SKUs formatted strictly in JetBrains Mono.

### Action Confirmation Modals (Dialogs)
- Modals for "Excluir Produto" require a distinct destructive header icon, concise impact warning (e.g., "Esta ação não pode ser desfeita"), and secondary cancellation ("Cancelar") aligned alongside the definitive red confirmation ("Sim, Excluir").