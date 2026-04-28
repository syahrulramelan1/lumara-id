---
name: Modest Luxury Framework
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce3f2'
  on-surface: '#151c27'
  on-surface-variant: '#4a4455'
  inverse-surface: '#2a313c'
  inverse-on-surface: '#ebf1ff'
  outline: '#7b7487'
  outline-variant: '#ccc3d8'
  surface-tint: '#732ee4'
  primary: '#4800a0'
  on-primary: '#ffffff'
  primary-container: '#630ed4'
  on-primary-container: '#cdb4ff'
  inverse-primary: '#d2bbff'
  secondary: '#824790'
  on-secondary: '#ffffff'
  secondary-container: '#f3aeff'
  on-secondary-container: '#753b83'
  tertiary: '#4a3400'
  on-tertiary: '#ffffff'
  tertiary-container: '#674a00'
  on-tertiary-container: '#f3b72c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#fcd7ff'
  secondary-fixed-dim: '#f3aeff'
  on-secondary-fixed: '#340042'
  on-secondary-fixed-variant: '#682f76'
  tertiary-fixed: '#ffdea4'
  tertiary-fixed-dim: '#fabd32'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4200'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce3f2'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style

The design system is anchored in the concept of "Modest Luxury." It moves away from the aggressive layouts of traditional e-commerce, opting instead for a serene, editorial-inspired experience that respects the user's focus. The brand personality is graceful and feminine, utilizing generous whitespace and a sophisticated cool-toned palette to evoke a sense of calm and premium quality.

The visual style is **Minimalist-Modern** with a focus on high-end tactile quality. It avoids heavy gradients or complex textures, relying instead on clean lines, subtle violet-tinted shadows, and a systematic use of surface tiers to create depth. The interface feels light and airy, allowing the photography of the modest fashion pieces to remain the focal point.

## Colors

The color palette of this design system is built around a signature "Brand Anchor" violet. This primary color provides a regal, premium foundation, while the secondary fuchsia adds a softer, feminine touch. 

To maintain the "serene" philosophy, the surface colors are not pure white but are subtly tinted with violet and blue hues (`#F9F9FF`). This reduces eye strain and reinforces the premium aesthetic. Text colors prioritize legibility with a high-contrast primary navy-slate (`#151C27`), while secondary and muted tones allow for a clear visual hierarchy in metadata and descriptions. Semantic colors like "Rating Gold" are used sparingly to highlight quality without disrupting the cool-toned harmony.

## Typography

This design system exclusively utilizes **Plus Jakarta Sans** to maintain a modern, friendly, and approachable character. The typography is scaled to provide an editorial rhythm. 

- **Display & Headlines:** Use tighter letter-spacing and heavier weights (600-700) to command attention for product titles and hero sections.
- **Body Text:** Set with a generous line height (1.6) to ensure maximum readability for product descriptions and editorial content.
- **Labels:** Used for navigation, chips, and small UI actions, employing semi-bold weights to ensure they remain distinct even at smaller sizes.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop to maintain a boutique, curated feel, transitioning to a flexible fluid grid for mobile devices. 

A strict 8px spacing rhythm (with a 4px sub-grid) ensures consistency across all components. Generous outer margins (32px+) and wide gutters (24px) are used to prevent the interface from feeling cluttered. Content blocks should be separated by larger spacing tiers (`lg` or `xl`) to create distinct "chapters" in the shopping experience, reflecting the minimalist and serene brand philosophy.

## Elevation & Depth

Visual hierarchy in this design system is achieved through **Tonal Layers** and **Ambient Shadows**. Instead of traditional black-tinted drop shadows, we use "Violet-Tinted Shadows" (`rgba(99,14,212,0.12)`) to maintain color harmony and a premium feel.

- **Level 0 (Base):** Background color (`#F9F9FF`).
- **Level 1 (Cards/Surface):** White surfaces (`#FFFFFF`) with a subtle 1px border (`#EDE9FE`).
- **Level 2 (Interaction):** Elements like active buttons or hovered cards use the ambient violet shadow to appear slightly lifted without breaking the minimalist aesthetic.
- **Overlays:** Modals and menus use a backdrop blur (Glassmorphism) with high-transparency violet tints to maintain a sense of space and context.

## Shapes

The shape language is "Softly Rounded," striking a balance between organic femininity and structured modernism. 

- **Cards:** Use a 14px radius to create a soft container for product images.
- **Buttons:** A slightly sharper 12px radius provides a clear "call-to-action" feel that is distinct from content containers.
- **Chips & Tags:** Fully rounded (999px) "pill" shapes are used for categories and filters to provide a friendlier, approachable touch.
- **Inputs:** Follow the button radius (12px) for consistency in interactive forms.

## Components

### Buttons
Primary buttons use the brand anchor violet (`#630ED4`) with white text. Hover states shift to a brighter violet (`#7C3AED`). All buttons feature a 12px corner radius. Secondary buttons should use the "Secondary Container" fuchsia with a lower contrast text to denote secondary actions.

### Cards
Product cards are pure white (`#FFFFFF`) with a 14px radius and a soft border (`#EDE9FE`). They do not have shadows by default; the ambient violet shadow is only applied on hover to signal interactivity.

### Input Fields
Inputs use the `Surface Container Low` (`#F0F3FF`) as a background with a 1px `Outline Variant` border. This creates a soft, inset look that feels premium and integrated into the background.

### Chips
Chips are pill-shaped (999px) and utilize the `Secondary Container` fuchsia for a subtle pop of color against the cool background.

### Navigation & Menus
Navigation bars should be high-contrast and minimalist, using `Text Primary` for links and high-quality iconography with thin strokes. Active states are indicated by a small violet dot or a subtle underline rather than heavy blocks.