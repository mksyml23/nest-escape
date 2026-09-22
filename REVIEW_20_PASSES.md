# NEST ESCAPE — 20-pass review

This review was deliberately capped at exactly 20 passes before the next build checkpoint.

1. **First-play clarity** — The goal must be visible immediately: move right, avoid the claw, reach EXIT.
2. **Impossible route check** — The original claw machine occupied the only horizontal route. The cabinet is now scenery; only the moving claw is dangerous.
3. **Layout hierarchy** — Keep title and objective at the top, gameplay in the middle, controls at the bottom.
4. **Safe start space** — Give the player a clear, hazard-free area at spawn.
5. **Fair obstacle spacing** — Place the claw after a short approach and before the exit, leaving room to react.
6. **Readable exit** — Use a large, warm neon door and an arrow so the destination is obvious.
7. **Visual style** — Use one consistent chunky, low-poly-inspired arcade style: dark navy, aqua, pink, gold and violet.
8. **Texture restraint** — Add subtle stars, wall panels, floor tiles and scanlines without making the screen noisy.
9. **Depth** — Use layered wall, floor, shadows and neon glow so the room does not look like flat stickers.
10. **Machine identity** — Turn the cabinet into a recognizable arcade-claw machine with a glass bay, header and prize shapes.
11. **Player readability** — Give the player a bright hoodie, face and ground shadow so they stand out from the room.
12. **Motion quality** — Animate the claw with a smooth pendulum movement rather than a static hazard.
13. **Controls** — Support keyboard movement, jumping, and mobile on-screen left/right/jump controls.
14. **Game feel** — Add a jump arc, landing squash, hazard flash, status messages and a proper win overlay.
15. **Restart flow** — Make restart available through R, a visible restart button, and the game-over message.
16. **Touch safety** — Prevent accidental browser zoom/scroll behaviour in the game area and make buttons large enough to tap.
17. **Accessibility** — Add labelled controls, live game messages, strong colour contrast and a reduced-motion fallback.
18. **Code structure** — Separate state, input, physics/update, collision, rendering and reset functions.
19. **Performance and resilience** — Use one requestAnimationFrame loop, no external libraries/assets, and clamp movement to room bounds.
20. **Release scope** — Stop at one polished room. No ads, extra rooms, login, leaderboard, or publishing work in this checkpoint.
