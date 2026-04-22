# Design Brief: HCP Interaction CRM

## Tone & Aesthetic
Professional medical/pharma CRM for field rep productivity. Minimalist, clinical, trustworthy. Data-first design with no decorative embellishment. Efficiency via clear hierarchy and card-based composition.

## Palette (Light Mode)
| Token | OKLCH | Purpose |
|-------|-------|---------|
| Primary | `0.60 0.15 225` | Teal blue — clinical authority, CTAs, active states |
| Secondary | `0.90 0.02 240` | Slate gray — supporting actions, secondary buttons |
| Muted | `0.93 0.01 240` | Light gray — disabled states, subtle backgrounds |
| Border | `0.92 0.01 240` | Neutral border color for cards and form elements |
| Success | `0.65 0.12 130` | Green — positive sentiment indicator |
| Warning | `0.73 0.15 80` | Amber — neutral sentiment indicator |
| Destructive | `0.55 0.22 25` | Red — negative sentiment, alerts, delete actions |

## Palette (Dark Mode)
| Token | OKLCH | Purpose |
|-------|-------|---------|
| Primary | `0.70 0.12 225` | Teal lifted for dark backgrounds |
| Secondary | `0.28 0.01 240` | Dark slate for secondary actions |
| Card | `0.16 0.01 240` | Deep navy for card surfaces |
| Border | `0.24 0.01 240` | Subtle divider in dark mode |

## Typography
- **Display & Body**: Google Inter, sans-serif. Single family for consistency and professional tone.
- **Font Loading**: `@font-face` with woff2 format, `font-display: swap` for performance.
- **Scale**: Tailwind defaults (text-sm through text-2xl).

## Structural Zones
| Zone | Background | Border | Purpose |
|------|-----------|--------|---------|
| Header | `bg-card` | `border-b border-border` | Navigation and title area with subtle depth |
| Main Container | `bg-background` | None | Split-screen form + chat layout |
| Form Cards | `bg-card` | `border border-border` | Grouped input sections with elevation |
| Chat Bubbles (User) | `bg-primary` | None | Right-aligned, primary-colored messages |
| Chat Bubbles (AI) | `bg-card` | `border border-border` | Left-aligned, card-styled responses |
| Sentiment Badge | Variable | None | Inline color badges (success/warning/destructive) |

## Layout & Spacing
- **Grid**: 45% left form panel, 55% right chat panel (responsive: stack on mobile).
- **Card Gutter**: 1rem between sections, 0.75rem padding inside form inputs.
- **Border Radius**: Soft `rounded-lg` (0.625rem) on all cards and inputs.
- **Shadows**: Minimal: `shadow-card` for elevated cards, `shadow-elevated` for modals/overlays.

## Component Patterns
- **Form Inputs**: Light background (`bg-input`), border on focus, no floating labels.
- **Buttons**: Primary (solid teal), secondary (outline slate), destructive (solid red).
- **Chat Interface**: Messages stacked with left/right alignment, typing indicator with pulse animation.
- **Sentiment Indicators**: Inline badges with predefined colors (`.sentiment-positive`, `.sentiment-neutral`, `.sentiment-negative`).
- **Loading State**: Animated spinner with `animate-pulse` or custom spinner.

## Motion & Interaction
- **Transitions**: Smooth 0.3s cubic-bezier (`.transition-smooth` utility).
- **Entrance**: Messages fade in and slide up (`animate-fade-in`, `animate-slide-up`) on appearance.
- **Hover**: Buttons and cards have subtle color shift, no scale transforms (maintains precision UI).
- **Focus**: Primary color ring on input focus via `focus:ring-2 focus:ring-primary`.

## Differentiation
Split-screen layout with real-time AI-powered form assistance. Clean teal palette chosen for healthcare/medical association. No distracting gradients or animations — focus remains on form data and conversational flow.

## Constraints
- No purple gradients, no generic tech aesthetic.
- Single font family (Inter) — no font mixing.
- Palette locked to 7 semantic colors + grays.
- Shadows minimal and subtle — support depth without drama.
- Dark mode maintains clinical professionalism (deep navy backgrounds, lifted primary).

