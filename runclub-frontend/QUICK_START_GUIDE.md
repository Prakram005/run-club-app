# Quick Start Guide - Cinematic Motion Components

## 📦 Installation & Setup

Everything is already set up! The design system, animation library, and premium components are ready to use.

## 🚀 Basic Usage

### 1. Import Components

```jsx
import {
  CinematicHeroSection,
  MotionPageTransition,
  ScrollRevealSection,
  RunTrackingVisualization,
  PremiumCard,
  NeonButton,
  GlowingText,
  StatDisplay,
  AnimatedCounter,
  PulsingDot,
  FloatingParticles,
  GradientBorder,
} from "../components/motionUIIndex";
```

### 2. Hero Section (Landing Page)

```jsx
<CinematicHeroSection
  title="Run. Connect. Inspire."
  subtitle="Join the world's most immersive running community"
  cta="Get Started"
  onCtaClick={() => navigate("/dashboard")}
/>
```

**Props:**
- `title` - Main headline
- `subtitle` - Secondary text
- `cta` - Call-to-action button text
- `onCtaClick` - Click handler
- `backgroundImage` - Optional background image URL
- `gradient` - Show gradient overlay (default: true)
- `animated` - Enable animations (default: true)

### 3. Page Transitions

Wrap pages for smooth transitions:

```jsx
import { MotionPageTransition } from "../components/motionUIIndex";

export default function MyPage() {
  return (
    <MotionPageTransition transitionType="slideUp">
      <div className="min-h-screen">
        {/* Page content */}
      </div>
    </MotionPageTransition>
  );
}
```

**Transition Types:**
- `fadeIn` - Fade in with blur
- `slideUp` - Slide up from bottom
- `scaleIn` - Scale from center
- `radialReveal` - Circle reveal from center
- `slideRight` - Slide from right

### 4. Scroll Animations

Reveal content on scroll:

```jsx
import { ScrollRevealContainer, ScrollRevealItem } from "../components/motionUIIndex";

<ScrollRevealContainer>
  <ScrollRevealItem>Content 1</ScrollRevealItem>
  <ScrollRevealItem>Content 2</ScrollRevealItem>
  <ScrollRevealItem>Content 3</ScrollRevealItem>
</ScrollRevealContainer>
```

Or individual sections:

```jsx
<ScrollRevealSection type="slideInScroll">
  <h2>This fades and slides in on scroll</h2>
</ScrollRevealSection>
```

**Animation Types:**
- `fadeInScroll` - Fade in
- `slideInScroll` - Slide in from bottom
- `scaleInScroll` - Scale in
- `rotateInScroll` - Rotate in

### 5. Run Tracking Visualization

Display beautiful run metrics:

```jsx
<RunTrackingVisualization
  distance={10.73}
  pace="3:59"
  time="42:44"
  calories={163}
  elevation={120}
  animated={true}
/>
```

Features:
- Animated GPS route visualization
- Real-time metric counters
- Glowing start/end markers
- Beautiful metric cards
- Cinematic border glow

### 6. Premium Cards

Glassmorphic cards with hover effects:

```jsx
import { PremiumCard } from "../components/motionUIIndex";

<PremiumCard glowColor="green" onClick={() => console.log('clicked')}>
  <h3 className="text-white">Card Title</h3>
  <p className="text-gray-300">Card content</p>
</PremiumCard>
```

**Props:**
- `glowColor` - "green", "blue", or "pink"
- `onClick` - Click handler
- `hoverable` - Enable hover effects (default: true)
- `className` - Additional classes

### 7. Neon Buttons

Premium buttons with glow:

```jsx
import { NeonButton } from "../components/motionUIIndex";

<NeonButton
  variant="primary"
  size="lg"
  icon="🏃"
  onClick={() => handleClick()}
>
  Start Run
</NeonButton>
```

**Variants:** primary, secondary, ghost, danger
**Sizes:** sm, md, lg

### 8. Animated Counters

Smoothly animated numbers:

```jsx
import { AnimatedCounter } from "../components/motionUIIndex";

<div className="text-4xl font-bold">
  <AnimatedCounter
    value={156.8}
    duration={2}
    decimals={1}
    suffix=" km"
    prefix="Total: "
  />
</div>
```

### 9. Stat Display Cards

Beautiful stat cards with icons:

```jsx
import { StatDisplay } from "../components/motionUIIndex";

<div className="grid grid-cols-4 gap-4">
  <StatDisplay
    icon="🏃"
    label="Total Distance"
    value={156.8}
    unit="km"
    color="green"
  />
  <StatDisplay
    icon="⚡"
    label="Avg Pace"
    value={5.3}
    unit="min/km"
    color="blue"
  />
  <StatDisplay
    icon="🔥"
    label="Calories"
    value={1240}
    unit="kcal"
    color="pink"
  />
</div>
```

### 10. Glowing Text

Animated glowing text effects:

```jsx
import { GlowingText } from "../components/motionUIIndex";

<h1>
  Welcome to <GlowingText color="green">Run Club</GlowingText>
</h1>
```

**Colors:** green, blue, pink
**Sizes:** sm, md, lg, xl, 2xl

### 11. Pulsing Dots

Animated indicator dots:

```jsx
import { PulsingDot } from "../components/motionUIIndex";

<div className="flex gap-2">
  <PulsingDot color="green" size="md" />
  <PulsingDot color="blue" size="sm" />
  <PulsingDot color="pink" size="lg" />
</div>
```

### 12. Floating Particles

Background particle animations:

```jsx
import { FloatingParticles } from "../components/motionUIIndex";

<div className="relative w-full h-screen">
  <FloatingParticles count={20} />
  {/* Your content */}
</div>
```

### 13. Gradient Border

Animated gradient border effect:

```jsx
import { GradientBorder } from "../components/motionUIIndex";

<GradientBorder className="p-6" borderWidth={2} animated={true}>
  <div className="text-white">Content with gradient border</div>
</GradientBorder>
```

## 🎨 Color System

### Neon Colors (CSS Variables)

```css
/* Green */
--accent-neon: #00ff88;          /* Primary neon green */
--accent-neon-bright: #00ffaa;   /* Brighter green */
--accent-neon-dim: #00cc6f;      /* Darker green */

/* Blue */
--accent-blue: #00d4ff;          /* Primary electric blue */
--accent-blue-bright: #00e8ff;   /* Brighter blue */
--accent-blue-dim: #00a8cc;      /* Darker blue */

/* Pink */
--accent-pink: #ff00ff;          /* Primary neon pink */
--accent-pink-bright: #ff33ff;   /* Brighter pink */
--accent-pink-dim: #cc00cc;      /* Darker pink */

/* Background */
--bg-base: #0a0a0a;              /* Main background */
--bg-elevated: rgba(10, 10, 10, 0.85);  /* Elevated surfaces */
--bg-panel: rgba(17, 17, 17, 0.6);     /* Panel backgrounds */
```

### Using Colors in Components

```jsx
// Text colors
<div className="text-neon-green">Green text</div>
<div className="text-neon-blue">Blue text</div>
<div className="text-neon-pink">Pink text</div>

// Shadows
<div className="shadow-neon-glow">Glowing shadow</div>
<div className="shadow-neon-blue">Blue glow</div>
<div className="shadow-neon-pink">Pink glow</div>

// Borders
<div className="border border-neon-green">Green border</div>
<div className="border-neon-blue-glow">Blue glow border</div>
```

## 🎬 Animation Library Reference

### Custom Motion Variants

Import from `utils/motionAnimations.js`:

```jsx
import {
  heroAnimations,
  scrollAnimations,
  cardAnimations,
  buttonAnimations,
  SPRING,
  EASING,
} from "../utils/motionAnimations";
```

### Example: Using Spring Physics

```jsx
import { SPRING } from "../utils/motionAnimations";

<motion.div
  whileHover={{ scale: 1.1 }}
  transition={SPRING.tight}
>
  Bouncy hover
</motion.div>
```

**Spring Options:**
- `SPRING.tight` - Snappy, quick response
- `SPRING.smooth` - Smooth, natural feel
- `SPRING.loose` - Slow, elegant
- `SPRING.bouncy` - Playful bounce
- `SPRING.cinematic` - Premium feel

### Custom Easing

```jsx
import { EASING } from "../utils/motionAnimations";

<motion.div
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 0.8,
    ease: EASING.smooth,  // or .bounce, .elastic, .smooth2, .snappy
  }}
>
  Content
</motion.div>
```

## 📱 Responsive Design

All components include mobile responsiveness:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Components automatically stack on mobile */}
</div>
```

## ♿ Accessibility

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

## 🔧 Performance Tips

1. **Use transform & opacity only** for animations
2. **Lazy load** motion components
3. **Limit particle count** (default: 20)
4. **Use `whileInView`** instead of continuous animations
5. **Avoid animating layout** (use transform instead)

## 🎯 Common Patterns

### Feature Grid with Stagger

```jsx
<ScrollRevealContainer staggerDelay={0.1}>
  {features.map((feature, i) => (
    <ScrollRevealItem key={i}>
      <PremiumCard>
        <GlowingText>{feature.title}</GlowingText>
      </PremiumCard>
    </ScrollRevealItem>
  ))}
</ScrollRevealContainer>
```

### Dashboard with Metrics

```jsx
<div className="space-y-8">
  <div className="grid grid-cols-4 gap-4">
    <StatDisplay icon="🏃" label="Runs" value={24} color="green" />
    <StatDisplay icon="📍" label="Distance" value={156.8} color="blue" />
    <StatDisplay icon="⏱️" label="Time" value={52} color="pink" />
    <StatDisplay icon="🔥" label="Calories" value={3420} color="green" />
  </div>
  
  <RunTrackingVisualization {...runData} />
  
  <PremiumCard>
    <h3 className="text-gradient-neon">Recent Activity</h3>
  </PremiumCard>
</div>
```

### Modal/Popup

```jsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center"
    >
      <PremiumCard>Modal content</PremiumCard>
    </motion.div>
  )}
</AnimatePresence>
```

## 🚨 Troubleshooting

**Animations not working?**
- Check that Framer Motion is imported
- Ensure `AnimatePresence` wraps conditional renders
- Verify `whileInView` has proper viewport settings

**Performance issues?**
- Reduce particle count
- Use `will-change` sparingly
- Lazy load components
- Check DevTools Performance tab

**Colors not showing?**
- Verify Tailwind config includes custom colors
- Check CSS variable names match
- Ensure dark mode is enabled

**Responsive issues?**
- Test on actual mobile devices
- Check Tailwind breakpoints
- Use mobile-first approach

## 📚 File Reference

- **Animation Library:** `src/utils/motionAnimations.js`
- **Motion Components:** `src/components/motion/`
- **Hero Component:** `src/components/hero/CinematicHeroSection.jsx`
- **Visualization:** `src/components/visualization/RunTrackingVisualization.jsx`
- **Premium UI:** `src/components/premium/PremiumUIComponents.jsx`
- **Component Index:** `src/components/motionUIIndex.js`
- **Main Styles:** `src/index.css`
- **Config:** `tailwind.config.js`

## 🎓 Learn More

Check the reference implementation in `DashboardPage.jsx` to see real-world usage of these components!

---

**Happy animating! 🚀**
