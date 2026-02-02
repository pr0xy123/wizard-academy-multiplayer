# Wizard Academy Multiplayer 🧙‍♂️⚔️

An educational multiplayer dungeon crawler game where players solve questions to defeat enemies and progress through magical dungeons!

## ✨ What's New: Professional Code Architecture!

The game has been completely refactored with production-ready architecture:
- **Modular Structure**: Clean separation of concerns (8 JavaScript modules)
- **Enhanced Security**: No inline scripts, CSP-ready
- **Better Maintainability**: Small, focused files (50-350 lines each)
- **Production Ready**: Optimized for deployment and collaboration

See [REFACTORING_COMPLETE.md](REFACTORING_COMPLETE.md) for full details!

## 🎮 Features

### 3D Graphics & Models
- **Three.js Rendering**: Immersive 3D dungeon exploration
- **KayKit Character Models**: 5 playable classes with full animations
  - Warrior (2H Melee), Mage (Staff), Rogue (Daggers), Knight (Sword & Shield), Ranger (Bow)
- **94 Animations**: Smooth idle, walk, attack, and combat animations
- **Dungeon Environment**: 200+ tiles, walls, props from KayKit Dungeon Remastered
- **Dynamic Lighting**: Ambient, directional, and atmospheric torch lighting

### Educational Content
- **Multiple Subjects**: Math, Science, History, Literature, Geography, Art, Music
- **Grade-Based Questions**: Adaptive difficulty for grades 3-12
- **Hint System**: Educational hints when students struggle
- **Multiple Answer Formats**: Accepts various correct answer formats

### Gameplay
- **Character Classes**: Choose from 5 unique classes with different abilities
- **Question-Based Combat**: Answer questions correctly to attack enemies
- **Spell System**: Cast elemental spells (Fire, Ice, Lightning)
- **Progressive Difficulty**: Enemies scale with player level
- **XP & Leveling**: Gain experience and level up (health restoration on level-up)
- **Treasure & Gold**: Find chests and knowledge crystals for rewards
- **Multiplayer Support**: Play with friends via Socket.io (ready for expansion)

## Getting Started

### Prerequisites
- Node.js installed
- Modern web browser with WebGL support

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pr0xy123/wizard-academy-multiplayer.git
   cd wizard-academy-multiplayer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Open your browser to `http://localhost:3000`

### Adding 3D Models (Optional but Recommended!)

Download FREE character and environment assets:

1. **KayKit Adventurers** (Characters): https://kaylousberg.itch.io/kaykit-adventurers
2. **KayKit Character Animations**: https://kaylousberg.itch.io/kaykit-character-animations
3. **KayKit Dungeon Remastered** (Environment): https://kaylousberg.itch.io/kaykit-dungeon-remastered

Follow the [QUICK_START.md](QUICK_START.md) guide for easy setup!

## How to Play

1. **Choose Your Class**: Select Warrior, Mage, or Rogue
2. **Explore the Dungeon**: Use WASD or arrow keys to move, Q/E to rotate camera
3. **Collect Crystals**: Find magical crystals throughout the dungeon
4. **Battle Enemies**: Solve math problems to defeat monsters
5. **Cast Spells**: Use number keys 1-6 to cast different spells
6. **Level Up**: Gain XP from combat and exploration
7. **Multiplayer**: Create or join a room to play with friends!

## Tech Stack

- **Frontend**: Three.js, Vanilla JavaScript, Tailwind CSS
- **Backend**: Node.js, Express, Socket.io
- **3D Models**: KayKit assets (optional)
- **Audio**: Tone.js for sound effects

## Project Structure

```
wizard-academy-multiplayer/
├── server.js                    # Express & Socket.io server
├── public/
│   ├── index.html              # Main HTML structure (215 lines)
│   ├── css/
│   │   └── style.css           # All styling (350 lines)
│   ├── js/                     # Modular JavaScript
│   │   ├── gameState.js        # Player data & save/load
│   │   ├── threeSetup.js       # Scene, camera, lighting
│   │   ├── characters.js       # Character models & animations
│   │   ├── curriculum.js       # Educational questions
│   │   ├── dungeon.js          # World generation
│   │   ├── combat.js           # Combat system
│   │   ├── ui.js               # HUD & input handling
│   │   └── main.js             # Game loop & initialization
│   └── models/                 # 3D Assets (KayKit)
│       ├── characters/         # 5 playable classes
│       │   ├── warrior/       # Barbarian + weapons
│       │   ├── mage/          # Mage + staffs
│       │   ├── rogue/         # Rogue + daggers
│       │   ├── knight/        # Knight + sword/shield
│       │   └── ranger/        # Ranger + bow
│       ├── animations/        # 94 animations (3 packs)
│       │   ├── KayKit_AnimationPack_MovementBasic.glb
│       │   ├── KayKit_AnimationPack_CombatMelee.glb
│       │   └── KayKit_AnimationPack_General.glb
│       └── environment/       # Dungeon Remastered
│           └── dungeon/
│               ├── floors/    # 30+ floor variants
│               ├── walls/     # 40+ wall variants
│               └── props/     # 100+ decorations
├── QUICK_START.md             # Asset download guide
├── REFACTORING_COMPLETE.md    # Architecture documentation
└── ASSET_INTEGRATION_GUIDE.md # Detailed integration guide
```

## Code Architecture

The game uses a **modular architecture** for better maintainability and security:

### Module Overview
- **gameState.js**: Centralized game state management, save/load system
- **threeSetup.js**: Three.js initialization, lighting, camera controls
- **characters.js**: Character loading, animation system, weapon attachment
- **curriculum.js**: Educational content (6 subjects, 3 difficulty levels)
- **dungeon.js**: Procedural world generation, room themes
- **combat.js**: Question-based combat, enemy AI, rewards
- **ui.js**: HUD updates, input handling, modals
- **main.js**: Game loop orchestration, initialization sequence

### Benefits
- ✅ **Security**: No inline scripts, CSP-ready
- ✅ **Maintainability**: Small, focused files (50-350 lines)
- ✅ **Performance**: Browser can cache modules
- ✅ **Scalability**: Easy to add new features
- ✅ **Collaboration**: Multiple developers can work simultaneously

See [REFACTORING_COMPLETE.md](REFACTORING_COMPLETE.md) for full architecture details.

## Asset Credits

This game supports free 3D assets by **Kay Lousberg** (https://kaylousberg.com/):
- KayKit Adventurers Character Pack (CC0 License)
- KayKit Character Animations (CC0 License)
- KayKit Dungeon Remastered (CC0 License)

These assets are completely free for personal and commercial use!

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Add new character classes or spells

## License

MIT License - Feel free to use this project for learning or building your own games!

## Support

Join the KayKit Discord community for asset support: https://discord.gg/JC7HGnnUqH

---

**Ready to add awesome 3D graphics?** Check out [QUICK_START.md](QUICK_START.md)! 🚀
