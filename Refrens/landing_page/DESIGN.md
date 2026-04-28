---
name: Modest Luxury System
colors:
  surface: '#fef7ff'
  surface-dim: '#e5d3fc'
  surface-bright: '#fef7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf0ff'
  surface-container: '#f5eaff'
  surface-container-high: '#f1e3ff'
  surface-container-highest: '#ecdcff'
  on-surface: '#211534'
  on-surface-variant: '#4a4455'
  inverse-surface: '#372a4a'
  inverse-on-surface: '#f7edff'
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
  tertiary: '#36383d'
  on-tertiary: '#ffffff'
  tertiary-container: '#4d4f54'
  on-tertiary-container: '#c0c1c6'
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
  tertiary-fixed: '#e2e2e8'
  tertiary-fixed-dim: '#c5c6cc'
  on-tertiary-fixed: '#191c20'
  on-tertiary-fixed-variant: '#45474b'
  background: '#fef7ff'
  on-background: '#211534'
  surface-variant: '#ecdcff'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
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
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  gutter: 1.5rem
  margin: 2rem
---

## Brand & Style

This design system is built upon the concept of "Modest Luxury," specifically tailored for the premium Indonesian fashion market. The visual identity balances high-fashion sophistication with the serene, graceful values of modest wear. 

The style is defined by a **Minimalist** and **Feminine** aesthetic. It avoids visual clutter, favoring generous whitespace and a restricted, high-quality color palette to create an atmosphere of calm and exclusivity. By combining deep violets with soft lavender tints, the system evokes a sense of spiritual peace and premium craftsmanship. Every element is designed to feel light, intentional, and high-end.

## Colors

The color palette is anchored by a deep, authoritative Primary Violet, which serves as the core brand identifier for luxury and wisdom. A Secondary Fuchsia is utilized for accents and decorative elements, providing a softer, more traditionally feminine touch that complements the primary hue.

The background uses a specific Lavender-tinted White rather than a clinical pure white, ensuring the interface feels warm and integrated with the brand colors. For text and neutral elements, a very dark, desaturated violet is used instead of pure black to maintain color harmony and avoid harshness.

## Typography

The typography strategy utilizes **Plus Jakarta Sans** across all levels to maintain a contemporary, approachable, yet professional appearance. 

Headlines are set in **Bold** to create a clear hierarchy and project confidence. Body text is prioritized for readability with a generous **1.6 line-height**, essential for the serene and airy feel of the brand. Captions and labels utilize slightly increased letter spacing and medium weights to ensure clarity at smaller sizes while maintaining the system's elegant character.

## Layout & Spacing

This design system employs a **Fixed Grid** model for desktop experiences to maintain the "boutique" feel of a high-end catalog, while transitioning to a fluid model for mobile devices. 

The spacing rhythm is built on a 4px base unit, but emphasizes larger increments (LG and XL) to facilitate the "Minimalist" brand pillar. Use wide margins and significant vertical padding between sections to allow the product photography and premium typography to "breathe." Gutters are kept consistent at 24px (1.5rem) to ensure a structured but comfortable flow of information.

## Elevation & Depth

To maintain the "Serene" and "Modern" qualities of the brand, this design system rejects heavy, grey, or muddy shadows. Instead, it uses **Ambient Violet Shadows**.

Depth is created by using low-opacity versions of the primary violet color (#630ED4) in the shadow's blur. These shadows should be highly diffused with a large blur radius and minimal vertical offset, making elements appear as if they are gently floating over the lavender background. Layering is further achieved through subtle tonal shifts, where the surface-container might be pure white (#FFFFFF) against the lavender-tinted background (#F9F9FF).

## Shapes

The shape language is characterized by soft, approachable geometry that reflects the fluidity of modest fashion fabrics. 

As specified, the system uses a **14px radius for cards** and container elements, creating a distinct, high-end look that is softer than standard corporate UI but more structured than "playful" apps. **Buttons are set to a 12px radius**, providing a sophisticated "squircle" feel. **Badges and tags are fully pill-shaped**, creating a clear visual distinction between interactive containers and informative labels.

## Components

### Buttons
Primary buttons use the Primary Violet background with white text and 12px corner radii. Secondary buttons should use a ghost style with a 1px violet border or the Secondary Fuchsia for promotional "Call to Actions."

### Cards
Cards must feature the 14px radius and the signature ambient violet shadow. Backgrounds for cards should be pure white to provide a subtle lift against the #F9F9FF page background. Padding within cards should be generous (minimum 24px).

### Pill Badges
Used for categories (e.g., "New Arrival," "Premium Silk"), these are fully rounded (pill-shaped) with a light fuchsia background and dark fuchsia text to ensure they stand out without appearing aggressive.

### Input Fields
Inputs should use a 12px radius to match buttons. The border should be a very light tint of the primary color, shifting to a 2px Primary Violet border upon focus.

### Additional Components
*   **Product Tiles:** Should emphasize high-quality imagery with minimal text overlays.
*   **Navigation Bar:** A clean, fixed top bar with high transparency/backdrop-blur and the brand's primary violet used for the active state.