(() => {
  function bootConverter(root) {
    if (!root || root.dataset.converterBooted === '1') return;
    root.dataset.converterBooted = '1';
    const form = root.querySelector('form[data-converter-form="true"]');
    if (!form) return;

    const fileInput = form.querySelector('input[name="file"]');
    const button = form.querySelector('[data-generate-stl="true"]');
    const downloadLink = form.querySelector('[data-download-stl="true"]');
    const status = form.querySelector('[data-converter-status]');
    const message = form.querySelector('[data-converter-message]');
    const previewCanvas = form.querySelector('[data-stl-preview="true"]');
    const metrics = form.querySelector('[data-result-metrics="true"]');
    const cleanPreviewPanel = form.querySelector('[data-clean-preview-panel="true"]');
    const cleanPreviewImage = form.querySelector('[data-clean-preview-image="true"]');
    const modeInput = form.querySelector('select[name="mode"]');
    const widthInput = form.querySelector('input[name="widthMm"]');
    const depthInput = form.querySelector('input[name="depth"]');
    const baseInput = form.querySelector('input[name="baseMm"]');
    const thresholdInput = form.querySelector('input[name="threshold"]');
    const smoothingInput = form.querySelector('input[name="smoothing"]');
    const detailInput = form.querySelector('input[name="detail"]');
    const qualityInput = form.querySelector('select[name="quality"]');
    const invertInput = form.querySelector('input[name="invert"]');
    const hasSamplePreset = form.dataset.samplePreset === 'true';
    let lastFileSignature = '';

    function setText(el, text) {
      if (el) el.textContent = text;
    }

    function presetPayload() {
      if (!hasSamplePreset) return {};
      return {
        sample_slug: form.dataset.sampleSlug || 'unknown',
        sample_title: form.dataset.sampleTitle || 'unknown',
        sample_category: form.dataset.sampleCategory || 'unknown'
      };
    }

    function track(eventName, detail) {
      const payload = Object.assign({ tool: form.dataset.tool || form.dataset.mode || 'converter', mode: selectedMode(), path: location.pathname }, presetPayload(), detail || {});
      window.pngtostlEvents = window.pngtostlEvents || [];
      window.pngtostlEvents.push({ event: eventName, payload, ts: Date.now() });
      window.dispatchEvent(new CustomEvent('pngtostl:event', { detail: { name: eventName, payload } }));
      if (typeof window.gtag === 'function') window.gtag('event', eventName, payload);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ...payload });
    }

    function trackBoth(primaryEventName, legacyEventName, detail) {
      track(primaryEventName, detail || {});
      track(legacyEventName, detail || {});
    }

    function trackSamplePreset(eventName, detail) {
      if (!hasSamplePreset) return;
      track(eventName, detail || {});
    }

    trackSamplePreset('sample_preset_loaded', {
      width_mm: widthInput ? widthInput.value : 'n/a',
      depth_mm: depthInput ? depthInput.value : 'n/a',
      detail: detailInput ? detailInput.value : 'n/a',
      smoothing: smoothingInput ? smoothingInput.value : 'n/a'
    });

    function selectedMode() {
      return modeInput ? modeInput.value : form.dataset.mode || 'icon';
    }

    function qualityDetail() {
      const value = qualityInput ? qualityInput.value : 'fast';
      if (value === 'high') return 320;
      if (value === 'standard') return 256;
      return detailInput ? Number(detailInput.value) || 128 : 128;
    }

    function formatRangeValue(input) {
      const value = Number(input.value);
      if (input.name === 'widthMm') return Math.round(value) + ' mm';
      if (input.name === 'depth' || input.name === 'baseMm') return value.toFixed(1) + ' mm';
      if (input.name === 'threshold' || input.name === 'smoothing') return Math.round(value) + '%';
      if (input.name === 'detail') return Math.round(value).toString();
      return input.value;
    }

    function syncRange(input) {
      const output = form.querySelector('[data-value="' + input.name + '"]');
      if (output) output.textContent = formatRangeValue(input);
    }

    function bindRange(input) {
      if (!input) return;
      input.addEventListener('input', () => syncRange(input));
      input.addEventListener('change', () => syncRange(input));
      syncRange(input);
    }

    function formatNumber(value) {
      const number = Number(value);
      return Number.isFinite(number) ? number.toLocaleString('en-US') : String(value || 'n/a');
    }

    function formatFileSize(bytes) {
      const size = Number(bytes) || 0;
      return size >= 1024 * 1024 ? (size / 1024 / 1024).toFixed(1) + ' MB' : Math.round(size / 1024) + ' KB';
    }

    function setMetrics(items) {
      if (!metrics) return;
      if (!items || !items.length) {
        metrics.style.display = 'none';
        metrics.innerHTML = '';
        return;
      }
      metrics.innerHTML = items.map((item) => '<div><span>' + item.label + '</span><strong>' + item.value + '</strong></div>').join('');
      metrics.style.display = 'grid';
    }

    function clearCleanPreview() {
      if (cleanPreviewImage && cleanPreviewImage.dataset.objectUrl) {
        URL.revokeObjectURL(cleanPreviewImage.dataset.objectUrl);
        cleanPreviewImage.removeAttribute('data-object-url');
      }
      if (cleanPreviewImage) cleanPreviewImage.removeAttribute('src');
      if (cleanPreviewPanel) cleanPreviewPanel.hidden = true;
    }

    function showCleanPreview(blob) {
      if (!cleanPreviewPanel || !cleanPreviewImage || !blob) return;
      if (cleanPreviewImage.dataset.objectUrl) URL.revokeObjectURL(cleanPreviewImage.dataset.objectUrl);
      const url = URL.createObjectURL(blob);
      cleanPreviewImage.src = url;
      cleanPreviewImage.dataset.objectUrl = url;
      cleanPreviewPanel.hidden = false;
    }

    function setButtonState(label, disabled) {
      if (!button) return;
      button.disabled = Boolean(disabled);
      button.textContent = label;
    }

    function emptyMessage() {
      return form.dataset.emptyMessage || 'Upload an image to generate STL geometry. STL files do not preserve color.';
    }

    [widthInput, depthInput, baseInput, thresholdInput, smoothingInput, detailInput].forEach(bindRange);

    function syncFile() {
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (!file) {
        lastFileSignature = '';
        setText(status, 'Waiting for image');
        setText(message, emptyMessage());
        setButtonState('Choose an image first', true);
        if (downloadLink) {
          downloadLink.style.display = 'none';
          downloadLink.removeAttribute('href');
        }
        setMetrics([]);
        clearCleanPreview();
        return;
      }
      const signature = [file.name, file.size, file.lastModified || 0].join(':');
      if (signature === lastFileSignature && button && !button.disabled) return;
      lastFileSignature = signature;
      setText(status, 'Image selected');
      setButtonState('Generate STL now', false);
      if (downloadLink) {
        downloadLink.style.display = 'none';
        downloadLink.removeAttribute('href');
      }
      if (previewCanvas) {
        previewCanvas.dataset.spin = '0';
        const ctx = previewCanvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      }
      setText(message, file.name + ' selected.\nClick “Generate STL now” to create the preview and download. You can adjust settings first if needed.');
      trackBoth('converter_upload_selected', 'pngtostl_upload_selected', { fileType: file.type || 'unknown', fileSizeKb: Math.round(file.size / 1024) });
      trackSamplePreset('sample_preset_upload_selected', { fileType: file.type || 'unknown', fileSizeKb: Math.round(file.size / 1024) });
      setMetrics([]);
      clearCleanPreview();
    }

    function inspectImageFile(file) {
      if (!file || !file.type || !file.type.startsWith('image/')) return Promise.resolve({ hasTransparency: false });
      return new Promise((resolve) => {
        const image = new Image();
        const objectUrl = URL.createObjectURL(file);
        image.onload = () => {
          try {
            const max = 80;
            const scale = Math.min(1, max / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height, 1));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
            canvas.height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let transparent = 0;
            let borderR = 0, borderG = 0, borderB = 0, borderCount = 0;
            let brightLowSat = 0, darkLine = 0, grayish = 0;
            const lumaGrid = [];
            for (let y = 0; y < canvas.height; y += 1) {
              const lumaRow = [];
              for (let x = 0; x < canvas.width; x += 1) {
                const i = (y * canvas.width + x) * 4;
                if (data[i + 3] < 245) transparent += 1;
                const maxChannel = Math.max(data[i], data[i + 1], data[i + 2]);
                const minChannel = Math.min(data[i], data[i + 1], data[i + 2]);
                const saturation = (maxChannel - minChannel) / 255;
                const luma = (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722) / 255;
                lumaRow.push(luma);
                if (luma > 0.72 && saturation < 0.16) brightLowSat += 1;
                if (luma < 0.62 && saturation < 0.22) darkLine += 1;
                if (saturation < 0.2) grayish += 1;
                if (x < 3 || y < 3 || x >= canvas.width - 3 || y >= canvas.height - 3) {
                  borderR += data[i]; borderG += data[i + 1]; borderB += data[i + 2]; borderCount += 1;
                }
              }
              lumaGrid.push(lumaRow);
            }
            const pixels = Math.max(1, data.length / 4);
            const avgBorder = { r: borderR / Math.max(1, borderCount), g: borderG / Math.max(1, borderCount), b: borderB / Math.max(1, borderCount) };
            const borderLuma = (avgBorder.r * 0.2126 + avgBorder.g * 0.7152 + avgBorder.b * 0.0722) / 255;
            let subjectLike = 0;
            for (let i = 0; i < data.length; i += 4) {
              const dr = data[i] - avgBorder.r;
              const dg = data[i + 1] - avgBorder.g;
              const db = data[i + 2] - avgBorder.b;
              const distance = Math.sqrt(dr * dr + dg * dg + db * db);
              if (distance > 42) subjectLike += 1;
            }
            URL.revokeObjectURL(objectUrl);
            const transparentRatio = transparent / pixels;
            const subjectRatio = subjectLike / pixels;
            let transitions = 0;
            for (let y = 0; y < canvas.height; y += 1) {
              for (let x = 1; x < canvas.width; x += 1) {
                if (Math.abs(lumaGrid[y][x] - lumaGrid[y][x - 1]) > 0.08) transitions += 1;
              }
            }
            for (let x = 0; x < canvas.width; x += 1) {
              for (let y = 1; y < canvas.height; y += 1) {
                if (Math.abs(lumaGrid[y][x] - lumaGrid[y - 1][x]) > 0.08) transitions += 1;
              }
            }
            const transitionRatio = transitions / Math.max(1, canvas.width * (canvas.height - 1) + canvas.height * (canvas.width - 1));
            const probableSketch = transparentRatio < 0.08 && brightLowSat / pixels > 0.46 && grayish / pixels > 0.64 && darkLine / pixels > 0.025 && darkLine / pixels < 0.42 && transitionRatio > 0.045;
            resolve({
              hasTransparency: transparentRatio > 0.08,
              removableBackground: !probableSketch && transparentRatio <= 0.08 && borderLuma > 0.78 && subjectRatio > 0.04 && subjectRatio < 0.82,
              probableSketch,
              subjectRatio,
              background: avgBorder
            });
          } catch (_) {
            URL.revokeObjectURL(objectUrl);
            resolve({ hasTransparency: false });
          }
        };
        image.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve({ hasTransparency: false });
        };
        image.src = objectUrl;
      });
    }

    function setSketchWorkflowDefaults() {
      if (modeInput) modeInput.value = 'sketch';
      if (depthInput) { depthInput.value = '2.2'; syncRange(depthInput); }
      if (baseInput) { baseInput.value = '1.1'; syncRange(baseInput); }
      if (thresholdInput) { thresholdInput.value = '54'; syncRange(thresholdInput); }
      if (smoothingInput) { smoothingInput.value = '52'; syncRange(smoothingInput); }
      if (detailInput) { detailInput.value = '180'; syncRange(detailInput); }
      if (qualityInput && qualityInput.value === 'fast') qualityInput.value = 'standard';
    }

    function normalizeImageFile(file, imageInfo) {
      const supportedInput = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml'].includes(file.type);
      if (!supportedInput) return Promise.reject(new Error('Unsupported image format. Use PNG, JPG, WebP, GIF, BMP, or SVG.'));
      return new Promise((resolve, reject) => {
        const image = new Image();
        const objectUrl = URL.createObjectURL(file);
        image.onload = () => {
          try {
            const sourceWidth = image.naturalWidth || image.width;
            const sourceHeight = image.naturalHeight || image.height;
            const maxInputSide = 1024;
            const scale = Math.min(1, maxInputSide / Math.max(sourceWidth, sourceHeight, 1));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(sourceWidth * scale));
            canvas.height = Math.max(1, Math.round(sourceHeight * scale));
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            if (imageInfo && imageInfo.removableBackground && imageInfo.background) {
              const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = frame.data;
              const bg = imageInfo.background;
              for (let i = 0; i < data.length; i += 4) {
                const dr = data[i] - bg.r;
                const dg = data[i + 1] - bg.g;
                const db = data[i + 2] - bg.b;
                const distance = Math.sqrt(dr * dr + dg * dg + db * db);
                if (distance < 30) data[i + 3] = 0;
                else if (distance < 58) data[i + 3] = Math.round(((distance - 30) / 28) * 255);
              }
              ctx.putImageData(frame, 0, 0);
            }
            URL.revokeObjectURL(objectUrl);
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('Could not normalize this image input.'));
                return;
              }
              const name = file.name.replace(/\.[^.]+$/, '') + '.png';
              resolve(new File([blob], name, { type: 'image/png' }));
            }, 'image/png');
          } catch (error) {
            URL.revokeObjectURL(objectUrl);
            reject(error);
          }
        };
        image.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Could not read the image file.'));
        };
        image.src = objectUrl;
      });
    }

    async function generateStl(event) {
      if (event) event.preventDefault();
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (!file) {
        setText(status, 'Waiting for image');
        setText(message, 'Upload an image before generating an STL.');
        setButtonState('Choose an image first', true);
        return;
      }

      setButtonState('Generating STL...', true);
      const imageInfo = await inspectImageFile(file);
      if (modeInput && selectedMode() === 'extrude' && imageInfo.probableSketch) {
        setSketchWorkflowDefaults();
        setText(message, 'Hand-drawn line art / graph-paper sketch detected. Switching to Sketch line relief so the drawing lines are preserved instead of becoming a solid silhouette...');
      }
      const shouldCutoutSubject = !imageInfo.probableSketch && (imageInfo.hasTransparency || imageInfo.removableBackground);
      if (modeInput && selectedMode() === 'relief' && shouldCutoutSubject) {
        modeInput.value = 'logo';
        if (qualityInput && qualityInput.value === 'fast') qualityInput.value = 'standard';
        setText(message, (imageInfo.hasTransparency ? 'Transparent background detected.' : 'Light background detected and removed.') + ' Using logo/cutout relief so the subject does not become a full square plate...');
      }
      trackBoth('converter_generate_clicked', 'pngtostl_generate_clicked', { fileType: file.type || 'unknown', fileSizeKb: Math.round(file.size / 1024), auto_mode: selectedMode() });
      trackSamplePreset('sample_preset_generate_clicked', { fileType: file.type || 'unknown', fileSizeKb: Math.round(file.size / 1024) });
      setText(status, 'Processing');
      if (!shouldCutoutSubject && !imageInfo.probableSketch) setText(message, 'Generating a fast preview STL at detail level ' + qualityDetail() + '...');

      let normalizedFile;
      try {
        normalizedFile = await normalizeImageFile(file, imageInfo);
      } catch (error) {
        setText(status, 'Needs fix');
        setText(message, error && error.message ? error.message : 'Use a PNG, JPG, WebP, GIF, BMP, or SVG image.');
        trackBoth('converter_generate_error', 'pngtostl_generate_error', { reason: 'normalize_failed' });
        trackSamplePreset('sample_preset_generate_error', { reason: 'normalize_failed' });
        setButtonState('Generate STL', false);
        return;
      }

      const formData = new FormData();
      formData.set('file', normalizedFile);
      formData.set('mode', selectedMode());
      formData.set('depth', depthInput ? depthInput.value : (form.dataset.maxThicknessMm || '1.8'));
      formData.set('widthMm', widthInput ? widthInput.value : '90');
      formData.set('baseMm', baseInput ? baseInput.value : (form.dataset.minThicknessMm || '1'));
      formData.set('threshold', String((Number(thresholdInput ? thresholdInput.value : 55) / 100).toFixed(2)));
      formData.set('smoothing', String((Number(smoothingInput ? smoothingInput.value : 25) / 100).toFixed(2)));
      formData.set('detail', String(qualityDetail()));
      formData.set('invert', String(invertInput ? invertInput.checked : selectedMode() === 'lithophane'));
      formData.set('minThicknessMm', form.dataset.minThicknessMm || '0.8');
      formData.set('maxThicknessMm', form.dataset.maxThicknessMm || (depthInput ? depthInput.value : '3.2'));

      if (selectedMode() === 'sketch') {
        try {
          const previewResponse = await fetch('/api/stl/clean-preview', { method: 'POST', body: formData });
          if (previewResponse.ok) showCleanPreview(await previewResponse.blob());
        } catch (_) {}
      } else {
        clearCleanPreview();
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        const response = await fetch('/api/stl/convert', { method: 'POST', body: formData, signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) {
          let body = { message: 'Conversion failed.' };
          try { body = await response.json(); } catch (_) {}
          setText(status, 'Needs fix');
          setText(message, body.message || 'Conversion failed.');
          trackBoth('converter_generate_error', 'pngtostl_generate_error', { reason: body.message || 'response_not_ok', status: response.status });
          trackSamplePreset('sample_preset_generate_error', { reason: body.message || 'response_not_ok', status: response.status });
          return;
        }
        const blob = await response.blob();
        const outputKind = response.headers.get('x-tool-output-kind') || selectedMode();
        const triangleCount = response.headers.get('x-tool-triangle-count') || 'unknown';
        const gridColumns = response.headers.get('x-tool-grid-columns');
        const gridRows = response.headers.get('x-tool-grid-rows');
        const occupiedRatio = response.headers.get('x-tool-occupied-ratio');
        const url = URL.createObjectURL(blob);
        const filename = form.dataset.filename || (outputKind === 'lithophane' ? 'pngtostl-lithophane.stl' : 'pngtostl-' + outputKind + '.stl');
        if (downloadLink) {
          if (downloadLink.dataset.objectUrl) URL.revokeObjectURL(downloadLink.dataset.objectUrl);
          downloadLink.href = url;
          downloadLink.dataset.objectUrl = url;
          downloadLink.download = filename;
          downloadLink.style.display = 'block';
          downloadLink.onclick = () => {
            const downloadPayload = { output_kind: outputKind, bytes: blob.size, triangles: triangleCount };
            trackBoth('converter_download_click', 'pngtostl_download_clicked', downloadPayload);
            trackSamplePreset('sample_preset_download_clicked', downloadPayload);
          };
        }
        if (previewCanvas && window.PNGTOSTLPreview && typeof window.PNGTOSTLPreview.mount === 'function') {
          window.PNGTOSTLPreview.mount(previewCanvas, blob);
        }
        setText(status, 'STL ready');
        trackBoth('converter_generate_success', 'pngtostl_generate_success', { output_kind: outputKind, bytes: blob.size, triangles: triangleCount, coverage: occupiedRatio || 'n/a' });
        trackSamplePreset('sample_preset_generate_success', { output_kind: outputKind, bytes: blob.size, triangles: triangleCount, coverage: occupiedRatio || 'n/a' });
        const widthMm = Math.round(Number(widthInput ? widthInput.value : 0) || 0);
        const reliefMm = Number(depthInput ? depthInput.value : 0) || 0;
        setMetrics([
          { label: 'Triangles', value: formatNumber(triangleCount) },
          { label: 'File size', value: formatFileSize(blob.size) },
          { label: 'Coverage', value: occupiedRatio ? Math.round(Number(occupiedRatio) * 100) + '%' : 'n/a' },
          { label: 'Size', value: widthMm ? widthMm + ' mm wide' : 'n/a' },
          { label: 'Relief depth', value: reliefMm ? reliefMm.toFixed(1) + ' mm' : 'n/a' },
          { label: 'Mesh check', value: 'Printable STL' },
        ]);
        setText(
          message,
          'Binary ' + outputKind + ' STL is ready from ' + normalizedFile.name + '.\n' +
          'Mesh: ' + (gridColumns && gridRows ? gridColumns + ' x ' + gridRows + ', ' : '') + triangleCount + ' triangles\n' +
          'File size: ' + Math.round(blob.size / 1024) + ' KB' +
          (occupiedRatio ? '\nRaised/detail coverage: ' + Math.round(Number(occupiedRatio) * 100) + '%' : '') +
          '\nOpen it from the front/top view. STL is single-material geometry, not a color image.'
        );
      } catch (error) {
        setText(status, 'Needs fix');
        setText(message, 'Conversion failed. Please try another image or lower the detail level.');
        trackBoth('converter_generate_error', 'pngtostl_generate_error', {
          reason: error && error.name === 'AbortError' ? 'timeout' : 'network_or_runtime_error',
          message: error && error.message ? error.message : 'Conversion failed'
        });
        trackSamplePreset('sample_preset_generate_error', {
          reason: error && error.name === 'AbortError' ? 'timeout' : 'network_or_runtime_error'
        });
      } finally {
        const hasFile = fileInput && fileInput.files && fileInput.files[0];
        setButtonState(hasFile ? 'Generate STL now' : 'Choose an image first', !hasFile);
      }
    }

    fileInput && fileInput.addEventListener('change', syncFile);
    fileInput && fileInput.addEventListener('input', syncFile);
    form.addEventListener('submit', generateStl);
    button && button.addEventListener('click', generateStl);
    syncFile();
    if (fileInput) {
      setInterval(() => {
        const file = fileInput.files && fileInput.files[0];
        const signature = file ? [file.name, file.size, file.lastModified || 0].join(':') : '';
        if (signature !== lastFileSignature) syncFile();
      }, 500);
    }
  }

  function bootAll() {
    document.querySelectorAll('[data-converter-root="true"]').forEach(bootConverter);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootAll);
  else bootAll();
  window.addEventListener('pageshow', bootAll);
})();
