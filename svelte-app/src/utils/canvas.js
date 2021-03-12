export const setupCanvas = (
    canvas,
    width = 0,
    height = 0,
    pixelRatio = 1,
    compositeType = 'normal',
    backgroundColor = null
  ) => {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.scale(pixelRatio, pixelRatio);

  ctx.globalCompositeOperation = compositeType;

  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  return ctx;
};
