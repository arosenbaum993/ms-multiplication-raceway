// A dashboard portrait uses one animation frame, never the full sprite sheet.
document.querySelectorAll('canvas[data-tile-sprite]').forEach(canvas => {
  const image = new Image();
  image.onload = () => {
    const columns = Number(canvas.dataset.columns);
    const rows = Number(canvas.dataset.rows);
    const frame = Number(canvas.dataset.frame || 0);
    const width = image.naturalWidth / columns;
    const height = image.naturalHeight / rows;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.min(canvas.width / width, canvas.height / height);
    const dw = width * scale, dh = height * scale;
    context.drawImage(image, frame * width, 0, width, height,
      (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
  };
  image.src = canvas.dataset.tileSprite;
});
