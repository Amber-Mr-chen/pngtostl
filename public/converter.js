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
    const modeInput = form.querySelector('select[name="mode"]');
    const widthInput = form.querySelector('input[name="widthMm"]');
    const depthInput = form.querySelector('input[name="depth"]');
    const baseInput = form.querySelector('input[name="baseMm"]');
    const thresholdInput = form.querySelector('input[name="threshold"]');
    const smoothingInput = form.querySelector('input[name="smoothing"]');
    const detailInput = form.querySelector('input[name="detail"]');
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
    }

    function normalizeImageFile(file) {
      if (file.type === 'image/png') return Promise.resolve(file);
      const supportedInput = ['image/jpeg', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml'].includes(file.type);
      if (!supportedInput) return Promise.reject(new Error('Unsupported image format. Use PNG, JPG, WebP, GIF, BMP, or SVG.'));
      return new Promise((resolve, reject) => {
        const image = new Image();
        const objectUrl = URL.createObjectURL(file);
        image.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth || image.width;
            canvas.height = image.naturalHeight || image.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
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
      trackBoth('converter_generate_clicked', 'pngtostl_generate_clicked', { fileType: file.type || 'unknown', fileSizeKb: Math.round(file.size / 1024) });
      trackSamplePreset('sample_preset_generate_clicked', { fileType: file.type || 'unknown', fileSizeKb: Math.round(file.size / 1024) });
      setText(status, 'Processing');
      setText(message, 'Generating a fast preview STL at detail level ' + (detailInput ? detailInput.value : '96') + '...');

      let normalizedFile;
      try {
        normalizedFile = await normalizeImageFile(file);
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
      formData.set('detail', detailInput ? detailInput.value : '96');
      formData.set('invert', String(invertInput ? invertInput.checked : selectedMode() === 'lithophane'));
      formData.set('minThicknessMm', form.dataset.minThicknessMm || '0.8');
      formData.set('maxThicknessMm', form.dataset.maxThicknessMm || (depthInput ? depthInput.value : '3.2'));

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);
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
        setMetrics([
          { label: 'Triangles', value: triangleCount },
          { label: 'File size', value: Math.round(blob.size / 1024) + ' KB' },
          { label: 'Coverage', value: occupiedRatio ? Math.round(Number(occupiedRatio) * 100) + '%' : 'n/a' },
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
