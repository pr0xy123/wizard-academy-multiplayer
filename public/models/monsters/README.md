# KayKit Monster Models

Drop your KayKit Monsters pack GLB files here. The game will automatically load them
and fall back to geometric placeholders if a file is missing.

## Expected structure

```
monsters/
  goblin/
    Goblin.glb
  skeleton/
    Skeleton.glb
  orc/
    Orc.glb
  troll/
    Troll.glb
  werewolf/
    Werewolf.glb
```

## Animations

Monsters use the shared Rig_Medium_* or Rig_Large_* animation packs already in
`/models/animations/`. Goblin, Skeleton, and Orc use Rig_Medium; Troll and Werewolf
use Rig_Large. No per-monster animation files needed.

## Adding more monster types

To add a new monster, add an entry to `MONSTER_CONFIGS` in index.html:

```js
{ name: 'Spider', glb: '/models/monsters/spider/Spider.glb',
  color: 0x222222, accent: 0xff0000, scale: 0.8, hp: 20, xp: 25, animRig: 'Medium' }
```
