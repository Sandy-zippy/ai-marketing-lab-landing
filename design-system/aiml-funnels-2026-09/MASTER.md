# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** AIML Funnels 2026-09
**Generated:** 2026-09-16 16:27:25
**Category:** Service Landing Page

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#0EA5E9` | `--color-primary` |
| Secondary | `#38BDF8` | `--color-secondary` |
| CTA/Accent | `#F97316` | `--color-cta` |
| Background | `#F0F9FF` | `--color-background` |
| Text | `#0C4A6E` | `--color-text` |

### Typography

- **Heading Font:** Space Mono
- **Body Font:** Space Mono

### Style Guidelines

**Style:** Exaggerated Minimalism
**Key Effects:** font-size: clamp(3rem 10vw 12rem), font-weight: 900, letter-spacing: -0.05em, massive whitespace

### Page Pattern

**Pattern Name:** Webinar Registration
- **Section Order:** 1. Hero (Topic + Timer + Form), 2. What you'll learn, 3. Speaker Bio, 4. Urgency/Bonuses, 5. Form (again)

## Anti-Patterns (Do NOT Use)

- Complex navigation
- Hidden contact info

## Pre-Delivery Checklist

- [ ] No emojis used as icons (use SVG instead)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
