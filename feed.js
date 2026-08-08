/* ═══════════════════════════════════════════════════════════
   LIMIT BREAK — CHAMPION / LIVE FEED
   Same champion data as index.html (see champion.js), laid out
   as an 'L' around a video feed that sits in the top-left of
   the canvas. This layout paints nothing over the opening — put
   the video source *underneath* this browser source in OBS.
   ═══════════════════════════════════════════════════════════ */

let config = {
  // Size of the transparent opening, in px on the 1920x1080 canvas.
  // 3/4 of the canvas by default, so a 16:9 feed drops in as-is.
  feed_width: 1440,
  feed_height: 810,
  // Draw a hatched placeholder in the opening while lining OBS up.
  // Override per-source with ?feed_preview=1
  feed_preview: false,
};

LoadEverything().then(() => {
  config = ChampionSetup(config, "champion_feed");

  // The opening drives the whole composition; hand its size to the CSS
  let feedWidth = Number(window.feed_width ?? config.feed_width) || 1440;
  let feedHeight = Number(window.feed_height ?? config.feed_height) || 810;

  document.documentElement.style.setProperty("--feed-w", feedWidth / 16 + "rem");
  document.documentElement.style.setProperty("--feed-h", feedHeight / 16 + "rem");

  $("body").toggleClass(
    "feed_preview",
    ChampionFlag(window.feed_preview ?? config.feed_preview)
  );
  $(".feed_size").text(`${feedWidth} × ${feedHeight}`);

  let startingAnimation = gsap
    .timeline({ paused: true })
    .from([".chrome"], { duration: 0.9, autoAlpha: 0, ease: "power2.out" }, 0)
    .from([".frame"], { duration: 1, autoAlpha: 0, ease: "power2.out" }, 0)
    // The seam draws itself down the side of the feed, then around the
    // corner and out along the bottom
    .from(
      [".seam--v"],
      { duration: 0.6, scaleY: 0, ease: "power3.inOut" },
      0.15
    )
    .from(
      [".seam--h"],
      { duration: 0.7, scaleX: 0, ease: "power3.inOut" },
      0.7
    )
    .from(
      [".seam_corner"],
      { duration: 0.5, scale: 0, autoAlpha: 0, ease: "back.out(3)" },
      0.65
    )
    .from(
      [".brand_logo"],
      { duration: 0.9, y: -50, autoAlpha: 0, ease: "expo.out" },
      0.3
    )
    .from(
      [".art"],
      { duration: 1.2, xPercent: 16, autoAlpha: 0, ease: "expo.out" },
      0.4
    )
    .from(
      [".event_line"],
      { duration: 0.7, x: -40, autoAlpha: 0, ease: "power3.out" },
      0.9
    )
    .from(
      [".tournament_name"],
      { duration: 0.7, x: -40, autoAlpha: 0, ease: "power3.out" },
      1.0
    )
    .from(
      [".champion_word"],
      { duration: 0.9, x: -40, autoAlpha: 0, ease: "expo.out" },
      1.1
    )
    .from(
      [".bar_split"],
      { duration: 0.7, scaleY: 0, transformOrigin: "center", ease: "expo.out" },
      1.25
    )
    .from(
      [".sponsor_logo", ".champion_name"],
      { duration: 0.9, y: 40, autoAlpha: 0, ease: "expo.out", stagger: 0.08 },
      1.3
    )
    .from(
      [".real_name"],
      { duration: 0.7, y: 24, autoAlpha: 0, ease: "power3.out" },
      1.45
    )
    .from(
      [".meta > *"],
      { duration: 0.6, y: 20, autoAlpha: 0, ease: "power3.out", stagger: 0.07 },
      1.5
    )
    .from(
      [".chip.character_name"],
      { duration: 0.7, y: 24, autoAlpha: 0, ease: "power3.out" },
      1.4
    )
    .from(
      [".footer"],
      { duration: 0.7, y: 20, autoAlpha: 0, ease: "power3.out" },
      1.6
    );

  ChampionAmbience();

  Start = async (event) => {
    startingAnimation.restart();
  };

  Update = async (event) => {
    // The rail is a tall portrait slot, so the art is framed tighter than
    // in index.html — assets_feed in settings.json tunes it
    await ApplyChampionState(event, config, {
      load_settings_path: "assets_feed",
      anim_out: {
        x: "100%",
        stagger: 0.1,
      },
    });
  };
});
