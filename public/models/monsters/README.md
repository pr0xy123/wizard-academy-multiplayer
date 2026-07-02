# Monster Models

Place KayKit monster `.glb` files here. The game will automatically use embedded animations
(`Idle`, `Walk`, `Attack`, `Die`) from each model.

## Expected File Paths

```
monsters/
├── goblin/
│   └── Goblin.glb        ← place KayKit goblin .glb here
├── orc/
│   └── Orc.glb
├── skeleton/
│   └── Skeleton.glb
└── troll/
    └── Troll.glb
```

## Where to get monsters

**KayKit Dungeon Remastered** pack includes animated monster models:
- https://kaylousberg.itch.io/kaykit-dungeon-remastered

Download the pack, find monster `.glb` files, and place them in the corresponding folders above.

## How animations are loaded

When the game loads a monster model it looks for embedded animation clips with these names
(case-insensitive partial match):

| State  | Clip name hint         |
|--------|------------------------|
| Idle   | `idle`                 |
| Walk   | `walk`                 |
| Attack | `attack`, `slash`, `swing` |
| Run    | `run`                  |
| Die    | `die`, `death`         |

If the model file is missing the game automatically falls back to a simple procedural mesh
so the game always works even without the asset files.
