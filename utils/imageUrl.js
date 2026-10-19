// Ask the image server for a picture close to the size we will actually draw it,
// instead of downloading the full-size original and shrinking it on the phone.
// The sample catalog uses picsum.photos, whose URLs end in /<width>/<height>.
// A real backend would use its own resize parameter (for example ?w=300) or a CDN.
const SIZE_AT_END = /\/(\d+)\/(\d+)$/;

export function sizedImageUrl(url, displayWidth, pixelRatio = 2) {
  const match = url.match(SIZE_AT_END);
  if (!match) return url; // not a URL we know how to resize

  const [, originalWidth, originalHeight] = match;
  const wantedWidth = Math.min(Math.round(displayWidth * pixelRatio), Number(originalWidth));
  const wantedHeight = Math.round((wantedWidth * Number(originalHeight)) / Number(originalWidth));
  return url.replace(SIZE_AT_END, `/${wantedWidth}/${wantedHeight}`);
}