interface Window {
  mozCancelAnimationFrame?: Window['cancelAnimationFrame'];
  mozRequestAnimationFrame?: Window['requestAnimationFrame'];
  msCancelAnimationFrame?: Window['cancelAnimationFrame'];
  msRequestAnimationFrame?: Window['requestAnimationFrame'];
  webkitCancelAnimationFrame?: Window['cancelAnimationFrame'];
  webkitRequestAnimationFrame?: Window['requestAnimationFrame'];
}
