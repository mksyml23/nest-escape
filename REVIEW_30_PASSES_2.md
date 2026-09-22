# NEST ESCAPE — second independent 30-pass full-code review

This is a fresh, separate review of the complete current `index.html`, rather than a repeat of the earlier checklist. It covers the page structure, CSS room layout, animation geometry, game loop, collisions, inputs, responsive view, access needs, and playtest quality.

1. **Build scope** — Confirmed this remains one focused room rather than growing into unfinished menus or room two.
2. **Document setup** — Language, viewport, theme colour, and title are appropriate for a standalone browser game.
3. **Visual shell** — The arcade-room backdrop is distinct without requiring image assets or a slow loading sequence.
4. **Layer order** — Floor, props, claw, player, HUD, controls, and modal have a coherent z-index order.
5. **Visual hierarchy** — The title, exit sign, and objective convey the premise quickly.
6. **Start readability** — The player begins left of the hazard with a legible route to the right.
7. **Exit readability** — The warm gold frame and oversized arrow keep the destination clear.
8. **Hazard silhouette** — Cable, head, prongs, shadow, and warning glow make the claw recognisable.
9. **Hazard geometry** — The claw head sat visually too high to reliably intersect the grounded player; lower it into the lane.
10. **Hazard motion** — The current movement is predictable enough for a first playtest; retain it while correcting height.
11. **Hit fairness** — Collision correctly uses the claw head rather than the full cable container.
12. **Collision clarity** — Preserve a slightly forgiving collision pad, so near misses do not feel rigged.
13. **Exit collision** — The door hit target is forgiving enough to avoid frustrating pixel-perfect finishes.
14. **Movement input** — Left/right cancellation and velocity decay are stable and easy to reason about.
15. **Jump physics** — The jump is optional but useful, especially once the claw reaches the player lane.
16. **Frame safety** — Delta-time clamping prevents giant movement after a stalled frame.
17. **Background safety** — Hiding the page clears movement and pauses progress.
18. **Restart behaviour** — Reset clears state and closes the result overlay correctly.
19. **Result behaviour** — Win ends input, records success, and presents a replay action.
20. **Personal replay loop** — A local best time gives an immediate, lightweight reason to play again.
21. **Storage resilience** — Storage reads/writes fail safely when unavailable.
22. **Keyboard support** — WASD, arrows, Space, R, and Escape cover the important interactions.
23. **Touch support** — Pointer capture and cancel handling reduce stuck movement on touch screens.
24. **Focus visibility** — The game lacks a dedicated visible keyboard-focus style; add one for controls and actions.
25. **Dialog accessibility** — Focus moves to Play Again upon winning; keyboard users have a sensible landing point.
26. **Reduced motion** — A preference rule disables repeating animation without removing meaning from the room.
27. **Screen-reader context** — Tie the game landmark to the live instruction/status message.
28. **Narrow layouts** — Three stat pills can compete with the header on small phones; compact and reposition them.
29. **Code cleanup** — Remove the unused `hiddenAt` state field to keep the small engine honest.
30. **Playtest outcome** — The strongest useful changes are a real hazard lane, better focus treatment, stronger mobile HUD, and clearer timing instruction—not extra features.

## Changes selected after this review
- Lower the claw and give it a two-sided swing, so timing the dash is actually required.
- Add visible keyboard focus and landmark-to-status context.
- Compact the mobile HUD and make the first instruction explain the timing challenge.
- Remove unused game state.
