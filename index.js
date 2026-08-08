/* ═══════════════════════════════════════════════════════════
   LIMIT BREAK — CHAMPION SCENE
   Full-screen winner graphic: character art on the left, the
   champion's details on the right. All of the TSH data plumbing
   is shared with the live-feed scene — see champion.js.
   ═══════════════════════════════════════════════════════════ */

LoadEverything().then(() => {
  const config = ChampionSetup();

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

  ChampionAmbience();

  Start = async (event) => {
    startingAnimation.restart();
  };

  Update = async (event) => {
    await ApplyChampionState(event, config);
  };
});
