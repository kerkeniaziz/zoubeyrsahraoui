/**
 * The box the hero scene occupies, shared by the real Lottie scene and by the
 * placeholder shown while its chunk loads.
 *
 * Both must agree exactly: the placeholder used to be a bare `w-full`
 * aspect-square, so it reserved the full 652px grid column while the loaded
 * scene caps at 31rem (496px). The square collapsed by 156px on arrival and,
 * because the hero grid is `items-center`, the name next to it jumped 78px up.
 */
export const heroSceneFrame =
  "relative mx-auto w-full max-w-[21rem] sm:max-w-[26rem] lg:max-w-[31rem]"
