(() => {
  function readTriangles(buffer) {
    const view = new DataView(buffer);
    if (buffer.byteLength < 84) return [];
    const count = view.getUint32(80, true);
    const expected = 84 + count * 50;
    if (expected <= buffer.byteLength && count > 0 && count < 1200000) {
      const triangles = [];
      let offset = 84;
      for (let i = 0; i < count; i += 1) {
        offset += 12;
        const tri = [];
        for (let v = 0; v < 3; v += 1) {
          tri.push({
            x: view.getFloat32(offset, true),
            y: view.getFloat32(offset + 4, true),
            z: view.getFloat32(offset + 8, true),
          });
          offset += 12;
        }
        offset += 2;
        triangles.push(tri);
      }
      return triangles;
    }
    const text = new TextDecoder().decode(buffer);
    const values = [];
    const re = /vertex\s+(-?\d+(?:\.\d+)?(?:e[-+]?\d+)?)\s+(-?\d+(?:\.\d+)?(?:e[-+]?\d+)?)\s+(-?\d+(?:\.\d+)?(?:e[-+]?\d+)?)/gi;
    let match;
    while ((match = re.exec(text))) {
      values.push({ x: Number(match[1]), y: Number(match[2]), z: Number(match[3]) });
    }
    const triangles = [];
    for (let i = 0; i + 2 < values.length; i += 3) triangles.push([values[i], values[i + 1], values[i + 2]]);
    return triangles;
  }

  function bounds(triangles) {
    const box = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity };
    triangles.forEach((tri) => tri.forEach((p) => {
      box.minX = Math.min(box.minX, p.x); box.maxX = Math.max(box.maxX, p.x);
      box.minY = Math.min(box.minY, p.y); box.maxY = Math.max(box.maxY, p.y);
      box.minZ = Math.min(box.minZ, p.z); box.maxZ = Math.max(box.maxZ, p.z);
    }));
    return box;
  }

  function previewTriangles(triangles, box) {
    const minRaisedY = box.minY + Math.max(0.03, (box.maxY - box.minY) * 0.02);
    const raised = triangles.filter((tri) => tri.some((p) => p.y > minRaisedY));
    const source = raised.length ? raised : triangles;
    const maxPreviewTriangles = 22000;
    if (source.length <= maxPreviewTriangles) return source;
    const stride = Math.ceil(source.length / maxPreviewTriangles);
    return source.filter((_, index) => index % stride === 0);
  }

  function renderSolidHeightmap(canvas, triangles, box, ctx, w, h) {
    const columns = 240;
    const rows = 240;
    const heights = new Float32Array(columns * rows);
    const seen = new Uint8Array(columns * rows);
    const xSpan = Math.max(box.maxX - box.minX, 0.001);
    const zSpan = Math.max(box.maxZ - box.minZ, 0.001);
    const ySpan = Math.max(box.maxY - box.minY, 0.001);

    triangles.forEach((tri) => tri.forEach((point) => {
      const heightSignal = (point.y - box.minY) / ySpan;
      if (heightSignal < 0.035) return;
      const x = Math.max(0, Math.min(columns - 1, Math.round(((point.x - box.minX) / xSpan) * (columns - 1))));
      const y = Math.max(0, Math.min(rows - 1, Math.round(((point.z - box.minZ) / zSpan) * (rows - 1))));
      const index = y * columns + x;
      heights[index] = Math.max(heights[index], heightSignal);
      seen[index] = 1;
    }));

    const scale = Math.min(w * 0.78 / columns, h * 0.78 / rows);
    const cell = Math.max(1.2, scale * 2.35);
    const offsetX = (w - columns * scale) / 2;
    const offsetY = (h - rows * scale) / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(15, 31, 48, .18)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = 'rgba(19, 73, 111, .22)';
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        if (!seen[index]) continue;
        const x = offsetX + column * scale;
        const y = offsetY + row * scale;
        ctx.fillRect(x, y, cell, cell);
      }
    }
    ctx.restore();

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        if (!seen[index]) continue;
        const h0 = heights[index];
        const right = column + 1 < columns ? heights[index + 1] : h0;
        const down = row + 1 < rows ? heights[index + columns] : h0;
        const light = Math.max(31, Math.min(86, 82 - h0 * 54 - (h0 - right) * 18 - (h0 - down) * 12));
        ctx.fillStyle = `hsl(202 62% ${light}%)`;
        ctx.fillRect(offsetX + column * scale, offsetY + row * scale, cell, cell);
      }
    }
  }

  function render(canvas, triangles, angle) {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#f8fbff');
    gradient.addColorStop(1, '#eef6f7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    if (!triangles.length) return;
    const box = bounds(triangles);
    if (canvas.dataset.previewMode !== 'wireframe' && Math.abs(angle) < 0.001) {
      renderSolidHeightmap(canvas, triangles, box, ctx, w, h);
      return;
    }

    const displayTriangles = previewTriangles(triangles, box);
    const cx = (box.minX + box.maxX) / 2;
    const cy = (box.minY + box.maxY) / 2;
    const cz = (box.minZ + box.maxZ) / 2;
    const span = Math.max(box.maxX - box.minX, box.maxY - box.minY, box.maxZ - box.minZ, 1);
    const scale = Math.min(w, h) * 0.82 / span;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const tilt = -1.42;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    function project(p) {
      const x0 = p.x - cx;
      const y0 = p.y - cy;
      const z0 = p.z - cz;
      const x1 = x0 * cos - y0 * sin;
      const y1 = x0 * sin + y0 * cos;
      const z1 = z0;
      const y2 = y1 * cosT - z1 * sinT;
      const z2 = y1 * sinT + z1 * cosT;
      return { x: w / 2 + x1 * scale, y: h / 2 - y2 * scale, z: z2 };
    }

    const heightSpan = Math.max(box.maxY - box.minY, 0.001);
    const projected = displayTriangles.map((tri) => {
      const pts = tri.map(project);
      const avgY = tri.reduce((sum, p) => sum + p.y, 0) / 3;
      return { pts, z: (pts[0].z + pts[1].z + pts[2].z) / 3, heightSignal: (avgY - box.minY) / heightSpan };
    }).sort((a, b) => a.z - b.z);

    projected.forEach(({ pts, heightSignal }) => {
      const shade = Math.max(24, Math.min(92, 92 - heightSignal * 68));
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      ctx.lineTo(pts[1].x, pts[1].y);
      ctx.lineTo(pts[2].x, pts[2].y);
      ctx.closePath();
      const fill = `hsl(204 56% ${shade}%)`;
      ctx.fillStyle = fill;
      ctx.fill();
      if (canvas.dataset.previewMode === 'wireframe') {
        ctx.strokeStyle = 'rgba(10,22,38,.22)';
        ctx.lineWidth = 0.45;
        ctx.stroke();
      } else {
        ctx.strokeStyle = fill;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });
  }

  window.PNGTOSTLPreview = {
    mount(canvas, blob) {
      if (!canvas || !blob) return;
      blob.arrayBuffer().then((buffer) => {
        const triangles = readTriangles(buffer);
        let angle = 0;
        let raf = 0;
        const draw = () => render(canvas, triangles, angle);
        draw();
        canvas.dataset.previewTriangles = String(triangles.length);
        const animate = () => {
          if (canvas.dataset.spin !== '1') return;
          angle += 0.018;
          render(canvas, triangles, angle);
          raf = requestAnimationFrame(animate);
        };
        canvas.onclick = () => {
          canvas.dataset.spin = canvas.dataset.spin === '1' ? '0' : '1';
          if (canvas.dataset.spin === '1') animate();
          else cancelAnimationFrame(raf);
        };
        window.addEventListener('resize', draw, { passive: true });
      });
    },
  };
})();
