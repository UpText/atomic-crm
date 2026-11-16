/** A hash change cannot leave App's initial callback branch; reload after cleaning the URL. */
export function returnToCrm(
  location: Pick<Location, "pathname" | "reload"> = window.location,
  history: Pick<History, "replaceState"> = window.history,
) {
  history.replaceState(null, "", location.pathname + "#/");
  location.reload();
}
