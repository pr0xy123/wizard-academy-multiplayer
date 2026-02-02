# Wizard Academy - Code Refactoring Plan

## Current Status
- **Single file**: index.html (1958 lines)
- **Issues**: Hard to maintain, security concerns, difficult debugging

## Target Structure

```
/public
├── index.html (100 lines - structure only)
├── css/
│   └── style.css ✅ (CREATED - 350 lines)
├── js/
│   ├── gameState.js ✅ (CREATED - 60 lines)
│   ├── threeSetup.js ✅ (CREATED - 110 lines)
│   ├── characters.js (TODO - ~350 lines)
│   ├── dungeon.js (TODO - ~250 lines)
│   ├── combat.js (TODO - ~150 lines)
│   ├── curriculum.js (TODO - ~200 lines)
│   ├── ui.js (TODO - ~200 lines)
│   └── main.js (TODO - ~100 lines)
└── models/ (existing KayKit assets)
```

## Files Created So Far

### ✅ css/style.css
Contains all CSS styling:
- Layout (body, containers)
- HUD styling
- Modal windows
- Buttons and inputs
- Animations
- Class selection UI
- Combat UI

### ✅ js/gameState.js
Contains game state management:
- GameState object
- Player data structure
- Save/Load functions
- Animation state tracking

### ✅ js/threeSetup.js
Contains Three.js initialization:
- Scene, camera, renderer setup
- Lighting configuration
- Window resize handling
- Camera update function

## Next Steps to Complete Refactoring

### 1. Create characters.js (~350 lines)
Extract from current index.html:
- Character model paths
- Weapon model paths
- `createCharacter()` function
- `loadAnimationsForCharacter()` function
- `setupAnimations()` function
- `loadWeaponForCharacter()` function
- `updateCharacterAnimation()` function

### 2. Create dungeon.js (~250 lines)
Extract from current index.html:
- `buildWorld()` function
- Room themes configuration
- `buildCorridors()` function
- `loadDungeonTile()` function
- Wall/floor placement logic
- Placed floors tracking

### 3. Create combat.js (~150 lines)
Extract from current index.html:
- `startCombat()` function
- Enemy data/spawning
- Combat calculations
- XP/level system
- Interaction checking

### 4. Create curriculum.js (~200 lines)
Extract from current index.html:
- Question generation
- Grade-based difficulty
- Subject areas (math, science, etc.)
- Answer validation

### 5. Create ui.js (~200 lines)
Extract from current index.html:
- HUD update functions
- Modal opening/closing
- Input handling (keyboard)
- Floating text system
- Class selection
- Inventory display

### 6. Create main.js (~100 lines)
Extract from current index.html:
- Game initialization sequence
- Main game loop (`animate()`)
- Movement handling (`updateMovement()`)
- Crystal/chest interactions
- Start screen logic

### 7. Update index.html (~100 lines)
Strip down to just:
- HTML structure (divs, modals)
- Script tag imports (load all JS files)
- Canvas element
- No inline CSS or JavaScript

## Benefits of Refactoring

1. **Security**: Easier to implement Content Security Policy (CSP)
2. **Maintainability**: Find and fix bugs faster
3. **Performance**: Browser can cache JS/CSS files
4. **Collaboration**: Multiple developers can work on different modules
5. **Testing**: Can unit test individual modules
6. **Code Reuse**: Import modules into other projects

## Implementation Strategy

**Option A: Gradual Migration** (Recommended)
- Keep current index.html working
- Create new files alongside
- Test each module independently
- Switch over when complete

**Option B: Complete Rewrite**
- Create all new files at once
- More risk but cleaner result
- Faster but requires careful testing

## Would you like me to:
1. Continue creating the remaining JavaScript modules?
2. Create a simplified new index.html to use these modules?
3. Test the modular version alongside the current one?

Let me know how you'd like to proceed!
