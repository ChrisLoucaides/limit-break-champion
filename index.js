/* ═══════════════════════════════════════════════════════════
   LIMIT BREAK — CHAMPION SCENE
   Everything on screen is pulled from TSH's program state:
     tournamentInfo.tournamentName -> "<Tournament> CHAMPION"
     score.<n>.team.<t>            -> champion name / character art
   By default the champion is whichever side of the scoreboard
   holds the higher score, so it fills in the moment grands end.
   ═══════════════════════════════════════════════════════════ */

let config = {
  // "auto" | 1 | 2 — which scoreboard side is the champion.
  // Override per-source with ?champion_team=2 in the browser source URL.
  champion_team: "auto",
  // Word placed after the tournament name
  champion_label: "Champion",
  // Show the event name ("Ultimate Singles") above the title
  display_event_name: true,
};

// start.gg hands back numeric codes for the Cypriot districts; map them onto
// the three-letter abbreviations we show on the flag chip. Anything unmapped
// falls through to whatever start.gg gave us.
const STATE_CODE_LABELS = {
  "01": "NIC",
  "02": "LIM",
  "03": "LCA",
  "04": "FAM",
  "05": "PAF",
  "06": "KYR",
};

function stateLabel(code) {
  return STATE_CODE_LABELS[code] ?? code;
}

function makeVariantHTML(variant) {
  let str = "";

  if (variant.icon_path) {
    let y_ = 28;
    let { x, y } = variant.image_size ?? { x: 32, y: 32 };
    x = x * (y_ / y);
    str += `<img src="${"../../" + variant.icon_path}" class="variant_icon" width="${x}" height="${y_}"/>`;
  }
  if (variant.display_name) {
    str += `<span class="variant_name">${variant.display_name}</span>`;
  }

  return str;
}

// Which side of the scoreboard won. Explicit config/URL param wins,
// otherwise the higher score; a tie falls back to team 1.
function ResolveChampionTeam(scoreboard) {
  let forced = window.champion_team ?? config.champion_team;

  if (String(forced) === "1" || String(forced) === "2") return Number(forced);

  let score1 = Number(_.get(scoreboard, "team.1.score", 0)) || 0;
  let score2 = Number(_.get(scoreboard, "team.2.score", 0)) || 0;

  return score2 > score1 ? 2 : 1;
}

LoadEverything().then(() => {
  config = _.defaultsDeep(
    {},
    window.config || {},
    _.get(tsh_settings, "champion", {}),
    config
  );

  $(".cw_fill, .cw_shine").text(config.champion_label);

  let startingAnimation = gsap
    .timeline({ paused: true })
    .from([".frame"], { duration: 1, autoAlpha: 0, ease: "power2.out" }, 0)
    .from(
      [".art"],
      { duration: 1.3, xPercent: -14, autoAlpha: 0, ease: "expo.out" },
      0
    )
    .from(
      [".brand_logo"],
      { duration: 0.9, y: -60, autoAlpha: 0, ease: "expo.out" },
      0.15
    )
    .from(
      [".event_line"],
      { duration: 0.7, x: 60, autoAlpha: 0, ease: "power3.out" },
      0.3
    )
    .from(
      [".tournament_name"],
      { duration: 0.7, x: 60, autoAlpha: 0, ease: "power3.out" },
      0.4
    )
    .from(
      [".champion_word"],
      { duration: 0.9, x: 60, autoAlpha: 0, ease: "expo.out" },
      0.5
    )
    .from(
      [".title_rule"],
      { duration: 0.8, scaleX: 0, transformOrigin: "left center", ease: "expo.out" },
      0.7
    )
    .from(
      [".sponsor_logo", ".champion_name"],
      { duration: 0.9, x: 60, autoAlpha: 0, ease: "expo.out", stagger: 0.08 },
      0.8
    )
    .from(
      [".real_name"],
      { duration: 0.7, x: 40, autoAlpha: 0, ease: "power3.out" },
      1.0
    )
    .from(
      [".meta > *"],
      { duration: 0.6, y: 24, autoAlpha: 0, ease: "power3.out", stagger: 0.08 },
      1.1
    )
    .from(
      [".footer"],
      { duration: 0.7, x: 40, autoAlpha: 0, ease: "power3.out" },
      1.3
    );

  // Slow breathing on the corner glows so the hold never looks frozen
  gsap.to(".glow--cyan", {
    duration: 7,
    scale: 1.12,
    opacity: 0.8,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
  gsap.to(".glow--magenta", {
    duration: 9,
    scale: 1.15,
    opacity: 0.75,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });

  Start = async (event) => {
    startingAnimation.restart();
  };

  Update = async (event) => {
    let data = event.data;

    // ------- TITLE -------------------------------------------------
    SetInnerHtml(
      $(".tournament_name"),
      _.get(data, "tournamentInfo.tournamentName", "")
    );

    SetInnerHtml(
      $(".event_name"),
      config.display_event_name
        ? _.get(data, "tournamentInfo.eventName", "")
        : ""
    );

    let entrants = Number(_.get(data, "tournamentInfo.numEntrants", 0)) || 0;
    $(".footer").toggleClass("hidden", entrants <= 0);
    SetInnerHtml($(".entrants"), entrants > 0 ? `${entrants} Entrants` : "");

    // ------- CHAMPION ----------------------------------------------
    let scoreboard = _.get(data, `score.${window.scoreboardNumber}`, {});
    let teamNumber = ResolveChampionTeam(scoreboard);
    let team = _.get(scoreboard, `team.${teamNumber}`, {});
    let players = Object.values(_.get(team, "player", {})).filter((p) => !!p);
    let isTeams = players.length > 1;

    let transcriptedNames = [];
    for (const player of players) {
      if (player.name) transcriptedNames.push(await Transcript(player.name));
    }

    if (isTeams) {
      let teamName = team.teamName && team.teamName.trim() ? team.teamName : "";

      SetInnerHtml(
        $(".champion_name"),
        teamName
          ? teamName
          : transcriptedNames
              .map((name) => `<span>${name}</span>`)
              .join('<span class="slash">/</span>')
      );

      // With a team name up top, list the members underneath instead of a real name
      SetInnerHtml(
        $(".real_name"),
        teamName
          ? transcriptedNames
              .map((name) => `<span>${name}</span>`)
              .join('<span class="slash">/</span>')
          : ""
      );
    } else {
      let player = players[0] ?? {};

      SetInnerHtml(
        $(".champion_name"),
        `
          ${player.team ? `<span class="sponsor">${player.team}</span>` : ""}
          ${transcriptedNames[0] ?? ""}
        `
      );

      SetInnerHtml($(".real_name"), player.real_name);
    }

    // ------- PLAYER DETAILS ----------------------------------------
    // Personal chips only make sense for a single champion
    let soloPlayer = isTeams ? {} : players[0] ?? {};

    SetInnerHtml(
      $(".sponsor_logo"),
      soloPlayer.sponsor_logo
        ? `<img class="sponsor_icon" src="../../${soloPlayer.sponsor_logo}" />`
        : ""
    );

    SetInnerHtml($(".pronoun"), soloPlayer.pronoun ?? "");

    SetInnerHtml(
      $(".seed"),
      soloPlayer.seed ? `Seed ${soloPlayer.seed}` : ""
    );

    SetInnerHtml($(".twitter"), soloPlayer.twitter ?? "");

    SetInnerHtml(
      $(".flagcountry"),
      _.get(soloPlayer, "country.asset")
        ? `<img class="flag" src="../../${soloPlayer.country.asset}" /><div class="flagname">${soloPlayer.country.code}</div>`
        : ""
    );

    SetInnerHtml(
      $(".flagstate"),
      _.get(soloPlayer, "state.asset")
        ? `<img class="flag" src="../../${soloPlayer.state.asset}" /><div class="flagname">${stateLabel(soloPlayer.state.code)}</div>`
        : ""
    );

    // ------- CHARACTER ---------------------------------------------
    let characterNames = [];
    let single_variant = null;

    // With one shared variant across every character, show it once at the end
    let allCharacters = players.flatMap((p) =>
      Object.values(_.get(p, "character", {}))
    );

    if (tsh_settings.force_variant_last && allCharacters.length > 1) {
      for (const c of allCharacters) {
        if (c.variant) {
          if (single_variant) {
            single_variant = false;
          } else if (single_variant === null) {
            single_variant = c.variant;
          }
        }
      }
    }

    for (const c of allCharacters) {
      let res = [];
      if (c.name) res.push(c.name);
      if (c.variant && !single_variant) res.push(makeVariantHTML(c.variant));
      if (res.length) {
        characterNames.push(res.join('<div class="variant_intercal"></div>'));
      }
    }

    SetInnerHtml(
      $(".character_name"),
      characterNames.join(" / ") +
        (single_variant ? makeVariantHTML(single_variant) : "")
    );

    // The source path changes when the winning side changes, so drop the
    // container's state to force assetUtils to rebuild the art
    let source = `score.${window.scoreboardNumber}.team.${teamNumber}`;
    let characterContainer = $(".champion.character");

    if (characterContainer.data("source") !== source) {
      characterContainer.removeClass(
        "tsh_character_container tsh_character_container_active"
      );
    }

    await CharacterDisplay(
      characterContainer,
      {
        source: source,
        scale_based_on_parent: true,
        anim_out: {
          x: "-100%",
          stagger: 0.1,
        },
        anim_in: {
          x: 0,
          duration: 1,
          ease: "expo.out",
          autoAlpha: 1,
          stagger: 0.2,
        },
      },
      event
    );
  };
});
