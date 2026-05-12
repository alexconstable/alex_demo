# Research Notes

Research date: 2026-05-10

## Finding

The safest shippable design is an external overlay checklist.

I did not find a legitimate public API that exposes a player's Prime Elder booleans directly from The Isle. Reading them automatically would likely require memory inspection, private game state, or server-side access. That is not appropriate for a public mod-community `.exe`.

## Public Requirements

The image supplied by the user shows `EligiblePrimeElder` booleans:

- `bVisitedASanctuaryAsJuv`
- `bHatchedFromEgg`
- `bAchievedPerfectDiet`
- `bVisitedMassMigrationZone`
- `bVisited2MigrationZones`
- `bVisited4PatrolZones`
- `bNeverInfertile`
- `bNeverMuscleSpasms`
- `bRaisedChildrenToSubadult`

Reddit discussion around Prime Elder repeatedly describes the requirement as a checklist where 5 completed conditions are needed. Community posts also warn that zone boundaries and map overlays can be inaccurate, so the app treats auto location matching as a helper only.

Sources:

- Reddit: https://www.reddit.com/r/theisle/comments/1pueu50/prime_elder_requirements/
- Reddit: https://www.reddit.com/r/theisle/comments/1p60ywr/prime_elder_requirements/
- Community guide: https://www.theisle-game.com/en/guides/elder-system-guide-frail-prime-elder

## Implementation Choice

The overlay:

- counts checked objectives against a target of 5
- starts the "never infertile" and "never muscle spasms" objectives checked, since they remain true until failed
- provides migration and patrol counters
- does not include browser login or map-tracker integrations

The app does not attempt to auto-detect:

- perfect diet
- temporary infertility
- muscle spasms
- hatching
- offspring age
- the exact server-side Prime state
