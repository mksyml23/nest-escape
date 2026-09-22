# NEST ESCAPE — 40-check verification

**Build checked:** Claw Chaos playtest-round-2 checkpoint  
**Result:** **40/40 checks passed**

This verification combined saved-build inspection with a controlled game-script test harness. It checked the live GitHub build rather than only the local working copy.

## Build and accessibility — 1–18
1. Doctype present
2. English document language present
3. Mobile viewport configured
4. Correct Claw Chaos page title
5. Labelled game landmark
6. Game landmark connected to live instruction
7. Room title visible
8. Exit labelled
9. Claw labelled
10. Player labelled
11. Live instruction/status message present
12. Restart control labelled
13. Touch controls labelled
14. Jump control labelled
15. Victory overlay marked as a modal dialog
16. Run timer present
17. Local best-time display present
18. Claw-hit counter present

## Gameplay, input, and resilience — 19–30
19. Collision uses only the claw head
20. Full claw container is not used as the hazard hitbox
21. Frame delta is capped after stalls
22. Player horizontal position is bounded
23. Landing resets vertical movement correctly
24. Best-time read fails safely if storage is unavailable
25. Best-time save fails safely if storage is unavailable
26. Arrow keys and WASD are supported
27. Browser/tab blur clears held movement
28. Hidden-tab handling clears movement and resets timing baseline
29. Touch movement captures the pointer
30. Reduced-motion preference is respected

## Controlled behavioural checks — 31–40
31. Game starts active at the intended left-side spawn
32. Opening instruction explains the claw timing challenge
33. Right-arrow movement works and suppresses browser scrolling
34. Jump starts only from the ground
35. Repeated loss calls count only one claw hit
36. Restart restores a playable attempt and closes the overlay
37. Winning stores a best time and opens the result overlay
38. Winning moves keyboard focus to Play Again
39. Restart moves keyboard focus to Restart
40. Blur clears held input and horizontal momentum

## Outcome
No defects were found in these 40 checks. The next meaningful gate remains the two-person external playtest—one mobile tester and one desktop tester—using `PLAYTEST_ROUND_2.md`.
