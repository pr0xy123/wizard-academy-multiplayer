# Quick Start - Testing Your Integrated Models 🚀

## Start the Game

1. **Run the server:**
   ```bash
   node server.js
   ```

2. **Open browser:** `http://localhost:3000`

3. **Open Console:** Press `F12` to see loading progress

## What You Should See

### ✅ Success Indicators

**In Console:**
```
✓ Loading dungeon floor tiles...
✓ First floor tile loaded successfully!
✓ Loading dungeon walls...
✓ Attempting to load mage character model...
✓ Using 3D model for mage
✓ Loaded X animations from Rig_Medium_MovementBasic
✓ Playing animation: [animation name]
```

**In Game:**
- Beautiful 3D character model (not geometric shapes!)
- Detailed dungeon floor with varied tiles
- Walls with doorways and windows
- Character animates when you move (WASD keys)
- Character rotates to face movement direction

### ⚠️ Fallback Mode (Still Works!)

If models don't load, you'll see:
- Geometric shapes for character (colored cylinders/spheres)
- Simple plane for floor
- Box shapes for walls
- Game is fully playable!

This means file paths might need adjustment, but the game works!

## Test Each Feature

### 1. Character Models
- Click each class button: Warrior, Mage, Knight, Rogue, Ranger
- Each should show a different 3D character
- Look for "✓ Using 3D model for [class]" in console

### 2. Animations
- Move with WASD keys
- Character should walk when moving
- Character returns to idle when stopped
- Look for "Playing [animation]" in console

### 3. Dungeon Environment
- Look at the floor - should see varied stone/wood tiles
- Look at walls - should see detailed brick walls
- Some walls should have doorways
- Some walls should look damaged/broken

## Common Issues & Fixes

### Issue: "404 Not Found" for models
**Solution:**
- Check file paths are correct (case-sensitive!)
- Verify .gltf and .bin files are in same folder
- Make sure you extracted all model files

### Issue: Game is slow/laggy
**Solution:**
Open [index.html](public/index.html) and find line ~1618:
```javascript
// REDUCE floor tiles
for (let x = -50; x <= 50; x += 4) { // Change 2 to 4
```

### Issue: No animations playing
**Solution:**
- Verify `/models/animations/Rig_Medium_MovementBasic.glb` exists
- Game still works! Static models look great too
- Animations are a bonus feature

### Issue: Character not visible
**Solution:**
- Try selecting a different class
- Check console for loading errors
- Fallback geometric character will appear

## Controls Reminder

- **WASD** or **Arrow Keys**: Move
- **Q/E**: Rotate camera
- **1-5**: Cast spells
- **P**: Use health potion
- **Space**: Interact (chests, crystals)

## Model Files Being Loaded

### Characters (5 models):
```
/models/characters/warrior/Barbarian.glb
/models/characters/mage/Mage.glb
/models/characters/knight/Knight.glb
/models/characters/rogue/Rogue.glb
/models/characters/ranger/Ranger.glb
```

### Animations (1 pack):
```
/models/animations/Rig_Medium_MovementBasic.glb
```

### Floor Tiles (4 types × many instances):
```
/models/environment/dungeon/floors/floor_tile_large.gltf
/models/environment/dungeon/floors/floor_tile_small.gltf
/models/environment/dungeon/floors/floor_dirt_large.gltf
/models/environment/dungeon/floors/floor_wood_large.gltf
```

### Wall Pieces (5+ types):
```
/models/environment/dungeon/walls/wall.gltf
/models/environment/dungeon/walls/wall_corner.gltf
/models/environment/dungeon/walls/wall_doorway.gltf
/models/environment/dungeon/walls/wall_broken.gltf
/models/environment/dungeon/walls/wall_window_closed.gltf
```

## Performance Notes

- **First load**: May take 2-5 seconds (loading all models)
- **After cache**: Instant! Models are cached
- **Expected FPS**: 60 FPS on modern hardware
- **Model count**: 100+ floor tiles, 50+ walls, 1 character

If performance is bad, you can:
1. Reduce tile density (see "Game is slow" fix above)
2. Reduce wall count (same approach)
3. Disable animations (still looks great!)

## Next: Adding Props

You mentioned adding more props. Here's how:

### Load a Banner:
```javascript
loadEnvironmentProp('dungeon/props/banner/banner_red', (banner) => {
    banner.position.set(x, 0, z);
    scene.add(banner);
});
```

### Load a Keg/Barrel:
```javascript
loadEnvironmentProp('dungeon/props/keg/keg', (keg) => {
    keg.position.set(x, 0, z);
    scene.add(keg);
});
```

Place these calls in `buildDungeon()` function or create a new `decorateDungeon()` function!

## Success!

If you see 3D character models and detailed dungeon tiles, **everything is working!** 🎉

The game now uses professional 3D assets instead of geometric shapes.

For questions or to add more features, just ask!

---
**Status**: Ready to test! Start the server and open the game! 🎮
