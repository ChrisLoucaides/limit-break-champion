# Limit Break — Champion Scene

Full-screen winner graphic for the end of a Smash Ultimate bracket. Everything
on screen comes from Tournament Stream Helper's program state.

## OBS setup

Add a **Browser** source pointing at `index.html`, **1920 x 1080**:

```
http://localhost:5000/layout/limit-break-champion/index.html
```

(or the local file, if you don't run TSH's web server). Tick
*"Refresh browser when scene becomes active"* is not needed — the layout
replays its intro animation on every OBS scene activation.

## What comes from TSH

| On screen | Source |
| --- | --- |
| `ULTIMATE SINGLES` | `tournamentInfo.eventName` |
| `LIMIT BREAK 2026` | `tournamentInfo.tournamentName` |
| Player / team name, sponsor | winning side of scoreboard 1 |
| Real name, pronouns, seed, twitter, flags | winning player |
| Character art + character chip | winning player's character |
| `32 ENTRANTS` | `tournamentInfo.numEntrants` |

The word after the tournament name (`CHAMPION`) is the only fixed copy.

## Picking the winner

By default the champion is whichever side of the scoreboard has the **higher
score**, so the scene fills in on its own once grands are scored. A tie falls
back to team 1.

To pin it to a side, either edit `settings.json`:

```json
{ "champion": { "champion_team": 2 } }
```

or add a URL parameter to the browser source:

```
index.html?champion_team=2
```

Other `settings.json` keys under `champion`:

- `champion_label` — the word after the tournament name (default `Champion`)
- `display_event_name` — show/hide the event name line (default `true`)

## Character art

`settings.json` → `assets.default` controls which art is used and how it is
framed. It prefers `mural_art`, falls back to `full` / `portrait` / the largest
asset available, and is zoomed to sit full-body in the left panel. Raise
`custom_zoom` for a tighter crop.

## Styling

Follows `limit-break-bgd/brand-guidelines.css`: cyan `#00D4FF` → magenta
`#EE00CC` on `#08081A`, Barlow Condensed for display type, Inter for body copy.
Barlow Condensed is bundled in `assets/fonts/` so the scene never depends on a
network connection mid-event.
