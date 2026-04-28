---
name: Lumara
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#4a4455'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#7b7487'
  outline-variant: '#ccc3d8'
  surface-tint: '#732ee4'
  primary: '#630ed4'
  on-primary: '#ffffff'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#d2bbff'
  secondary: '#824790'
  on-secondary: '#ffffff'
  secondary-container: '#f3aeff'
  on-secondary-container: '#753b83'
  tertiary: '#4f4d5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#676577'
  on-tertiary-container: '#e7e4f8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#fcd6ff'
  secondary-fixed-dim: '#f3aeff'
  on-secondary-fixed: '#340042'
  on-secondary-fixed-variant: '#682f76'
  tertiary-fixed: '#e4e0f5'
  tertiary-fixed-dim: '#c7c4d8'
  on-tertiary-fixed: '#1b1a29'
  on-tertiary-fixed-variant: '#464555'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
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
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

The visual identity of this design system is rooted in "Modest Luxury"—a philosophy that prioritizes grace, clarity, and a premium tactile feel. The target audience seeks sophistication and high-quality craftsmanship, which the UI reflects through generous whitespace and a refined color palette.

The chosen design style is **Minimalism with Tonal Layering**. It avoids heavy shadows in favor of subtle surface shifts and delicate borders to create depth. This approach ensures that the product imagery—the focal point of any fashion e-commerce site—remains the hero, while the UI provides a serene, feminine framework that guides the user toward a purchase without friction.

## Colors

The palette is centered on **Violet-600**, a color that evokes both royalty and spiritual depth, paired with the softness of **Fuchsia-300**. 

In light mode, the system uses a high-key approach with `#FAF5FF` surfaces to provide a subtle "lavender-tinted" warmth that feels more premium than pure gray. Dark mode transitions into a deep, "Midnight Amethyst" atmosphere, utilizing `#0F0A1E` to maintain color harmony while reducing eye strain during late-night browsing. Semantic colors for success, warning, and error should be desaturated to fit the soft, elegant aesthetic of the brand.

## Typography

**Plus Jakarta Sans** was selected for its modern, geometric clarity and friendly curves. It provides a welcoming and optimistic feel that perfectly complements the "clean and feminine" brand requirement.

Headlines use tighter letter spacing and bold weights to establish a strong hierarchy. Body text is set with a generous 1.6 line height to ensure readability, especially when describing garment details or fabric types. Label styles use a slight tracking (letter spacing) increase and uppercase styling for small UI elements like "New Arrival" tags or category labels to add a touch of editorial sophistication.

## Layout & Spacing

This design system utilizes a **Fixed Grid** philosophy for desktop (12 columns) to maintain a curated, boutique-like feel. For mobile and tablet, it shifts to a **Fluid Grid** to accommodate various screen sizes while maintaining a minimum 16px side margin.

The spacing rhythm is built on an 8px base unit. Generous padding within cards and sections is encouraged to maintain the "Minimalist" aesthetic. In fashion e-commerce, white space is not "empty"—it is a luxury signal that prevents the interface from feeling cluttered or "discount-oriented."

## Elevation & Depth

The primary method for conveying hierarchy is through **Low-contrast outlines** and **Tonal Layers**. Instead of heavy drop shadows, this design system uses the specific border colors provided (#EDE9FE for light, #3B2F6B for dark) to define card boundaries.

Where depth is required (such as for floating action buttons or active modal windows), use "Ambient Shadows"—diffused, low-opacity shadows tinted with the primary violet hue rather than neutral gray. This ensures that even the shadows feel integrated into the feminine color story. Surface tiers (Surface vs. Card) provide the necessary contrast to distinguish the background from interactive content areas.

## Shapes

The shape language is consistently soft, using custom radii to differentiate element types. **Cards** use a 14px radius to feel substantial and architectural, while **Buttons** and **Inputs** use a slightly sharper 12px radius to imply interactivity and precision. 

Chips and badges (e.g., "Sale" or "In Stock") should use a **Pill-shaped** (fully rounded) radius to contrast against the more structured product cards. This combination of radii creates a UI that feels modern and approachable without being overly "bubbly."

## Components

### Buttons
Primary buttons utilize the **Violet-600** background with white text and a 12px radius. Secondary buttons should use the **Fuchsia-300** background with the primary violet text to maintain high contrast and feminine appeal. Ghost buttons should utilize the primary violet for borders and text.

### Cards
Product cards must use the 14px radius with a 1px border (#EDE9FE). In the light mode, the card background is pure white (#FFFFFF) sitting on a slightly darker surface (#FAF5FF), creating a crisp, clean lift without the need for shadows.

### Input Fields
Text inputs use a 12px radius and a light background (#FAF5FF in light mode). The focus state should be indicated by a 2px Violet-600 border.

### Chips & Tags
Used for sizes (S, M, L, XL) and categories. These should be pill-shaped. Active states should use a light violet fill with the primary violet text.

### Image Containers
Given the premium fashion context, image containers should have a subtle 1px inner border to ensure that white garments do not bleed into the white card background.

### Navigation
The navigation bar should be clean with high-quality icons. Use the primary violet for active navigation states and the neutral gray for inactive states.