# Wizard Academy Multiplayer 🧙‍♂️⚔️

An educational multiplayer dungeon crawler game where players solve math problems to defeat enemies and progress through magical dungeons!

## ✨ New: Professional 3D Character Models & Animations!

The game now supports beautiful animated character models from the KayKit asset packs:
- **Animated Characters**: Warrior, Mage, Rogue, and Ranger
- **Smooth Animations**: Idle, walking, running, and combat animations
- **Dungeon Environment**: 200+ props and environment pieces
- **Easy Integration**: Just download and drop the files in!

### 🎯 Quick Setup (5 minutes)
See [QUICK_START.md](QUICK_START.md) for easy instructions to add 3D models to your game!

## Features

- **Three.js 3D Graphics**: Immersive dungeon exploration with dynamic lighting
- **Character Classes**: Choose between Warrior, Mage, or Rogue
- **Educational Combat**: Solve math problems to defeat enemies
- **Multiplayer Support**: Play with friends via Socket.io
- **Spell System**: Cast different spells to aid in combat
- **Progressive Difficulty**: Dungeon challenges scale with your level
- **XP & Leveling**: Gain experience and level up your character

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
├── server.js              # Express & Socket.io server
├── public/
│   ├── index.html        # Main game file with Three.js
│   ├── models/           # 3D character and environment models
│   │   ├── characters/   # Character models (warrior, mage, rogue)
│   │   ├── animations/   # Character animations
│   │   └── environment/  # Dungeon props and pieces
│   └── js/
│       └── GLTFLoader.js # Model loader
├── QUICK_START.md        # Quick guide to add 3D models
└── ASSET_INTEGRATION_GUIDE.md  # Detailed integration guide
```

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
