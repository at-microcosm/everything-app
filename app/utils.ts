export function nice_time_ago(us: Number): String {
  let dt = +new Date() - (us / 1000);
  if (dt < 1000) {
    return `${Math.round(dt)} ms`;
  }
  dt /= 1000; // seconds
  if (dt < 60) {
    return `${Math.round(dt)} s`;
  }
  dt /= 60; // minutes
  if (dt < 60) {
    return `${Math.round(dt)} min${Math.round(dt) > 1 ? 's' : ''}`;
  }
  dt /= 60; // hours
  if (dt < 48) {
    return `${Math.round(dt)} hr${Math.round(dt) > 1 ? 's' : ''}`;
  }
  dt /= 24; // days
  return `${Math.round(dt)} day${Math.round(dt) > 1 ? 's' : ''}`;
}
