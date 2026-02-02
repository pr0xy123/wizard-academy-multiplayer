# Teacher's Guide - Wizard Academy

## Access Control

The game now includes a PIN-based access control system to manage student access.

### Changing the Access PIN

1. Open `public/index.html`
2. Find line ~2243: `const TEACHER_PIN = '1234';`
3. Change `'1234'` to your desired PIN
4. Save and redeploy

**Default PIN: 1234**

### Multiple Access Codes (Advanced)

To allow different codes for different classes/groups:

```javascript
const ALLOWED_PINS = ['1234', '5678', '9012'];

function checkAccessCode() {
    const input = document.getElementById('access-code').value;
    if (ALLOWED_PINS.includes(input)) {
        // Access granted
    }
}
```

### Session Management

- Students need to enter the PIN each time they load the page
- No cookies or tracking - maximizes privacy
- Progress is saved in browser localStorage (per device)

## Character Classes

All 5 character classes are now available:

| Class   | Icon | Health | Mana | Style          |
|---------|------|--------|------|----------------|
| Warrior | ⚔️   | 120    | 30   | Tank/Melee     |
| Knight  | 🛡️   | 110    | 40   | Balanced       |
| Rogue   | 🗡️   | 80     | 60   | Fast/Agile     |
| Ranger  | 🏹   | 90     | 55   | Ranged         |
| Mage    | 🔮   | 70     | 80   | Spell Caster   |

## Room Designer

Students will see the **Dungeon Room Designer** after selecting their character:

- **Preset Layouts**: Cross Pattern (default), Grid Layout, Linear Path
- **Custom Design**: Click to place rooms, drag to move, right-click to remove
- **Room Settings**: Adjustable size (2-8 tiles) and theme (5 dungeon styles)

This eliminates the random maze generation issues and gives students creative control over their learning environment.

## Student Progress

Progress is automatically saved:
- Every 60 seconds during gameplay
- Stored in browser localStorage
- Includes: level, XP, gold, potions, skills

Students can continue their progress by using the "Load Game" button on the start screen.

## Tips

1. **First Time Setup**: Use the default PIN (1234) to test, then change it
2. **Difficulty**: Questions adapt to the grade level set in GameState.player.grade
3. **Room Design**: Encourage students to create interesting layouts - it's part of the learning!
4. **Model Loading**: If GLTF models fail to load, fallback colored characters appear automatically
