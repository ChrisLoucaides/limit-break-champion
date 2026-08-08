# Limit Break — Champion

Two winner graphics for the end of a Smash Ultimate bracket. Everything on
screen comes from Tournament Stream Helper's program state, and both scenes
read the same data (`champion.js`), so they always agree on who won.

| Scene | File | Use |
| --- | --- | --- |
| Full screen | `index.html` | Standalone winner card — art left, details right |
| Live feed | `feed.html` | Layout wrapped around a live video feed in an 'L' |

## OBS setup

### Full-screen scene

Add a **Browser** source pointing at `index.html`, **1920 x 1080**:

```
http://localhost:5000/layout/limit-break-champion/index.html
```

### Live-feed scene

`feed.html` leaves the top-left **1440 x 810** of the canvas fully
transparent and paints the layout in an 'L' around it — character art in the
right rail, champion copy in the bottom bar.

1. Add your video source (camera / capture card / game feed) and size it to
   **1440 x 810 at position 0, 0**.
2. Add a **Browser** source at **1920 x 1080**, position 0, 0:

   ```
   http://localhost:5000/layout/limit-break-champion/feed.html
   ```

3. Put the browser source **above** the video source in the scene list.

To line the video up, load the layout once with `?feed_preview=1` — the
opening fills with a hatched *LIVE FEED* guide showing its exact size.

Both scenes replay their intro animation on every OBS scene activation, so
*"Refresh browser when scene becomes active"* isn't needed.

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

Other `settings.json` keys under `champion` (both scenes):

- `champion_label` — the word after the tournament name (default `Champion`)
- `display_event_name` — show/hide the event name line (default `true`)

## Resizing the feed opening

`settings.json` → `champion_feed` controls the transparent opening in
`feed.html`, in px on the 1920x1080 canvas:

```json
{ "champion_feed": { "feed_width": 1440, "feed_height": 810 } }
```

The rail and bar resize to whatever is left over, so keep the opening close to
the default if you want the copy to sit comfortably. Any of these can also be
passed per-source: `feed.html?feed_width=1280&feed_height=720&feed_preview=1`.

## Character art

`settings.json` → `assets.default` controls which art is used and how it is
framed. It prefers `mural_art`, falls back to `full` / `portrait` / the largest
asset available, and is zoomed to sit full-body in the left panel of the
full-screen scene. Raise `custom_zoom` for a tighter crop.

`assets_feed.default` overrides that for the live-feed scene only — the rail is
a narrow portrait slot, so the art is framed tighter there. Anything it doesn't
set falls back to `assets.default`.

## Styling

Follows `limit-break-bgd/brand-guidelines.css`: cyan `#00D4FF` → magenta
`#EE00CC` on `#08081A`, Barlow Condensed for display type, Inter for body copy.
Barlow Condensed is bundled in `assets/fonts/` so the scenes never depend on a
network connection mid-event.

`index.css` and `feed.css` are per-scene and self-contained; `champion.js` holds
the TSH plumbing both share, and each scene's `.js` only owns its own intro
timeline.
