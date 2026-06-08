export const converterBootstrapScript = `
(() => {
  function bootConverter(root) {
    if (!root || root.dataset.converterBooted === '1') return;
    root.dataset.converterBooted = '1';
    const form = root.querySelector('form[data-converter-form="true"]');
    if (!form) return;

    const widthInput = form.querySelector('input[name="widthMm"]');
    const depthInput = form.querySelector('input[name="depth"]');
    const baseInput = form.querySelector('input[name="baseMm"]');
    const thresholdInput = form.querySelector('input[name="threshold"]');
    const smoothingInput = form.querySelector('input[name="smoothing"]');
    const detailInput = form.querySelector('input[name="detail"]');
    const fileInput = form.querySelector('input[name="file"]');
    const invertInput = form.querySelector('input[name="invert"]');
    const modeInput = form.querySelector('select[name="mode"]');
    const widthValue = form.querySelector('[data-value="widthMm"]');
    const depthValue = form.querySelector('[data-value="depth"]');
    const baseValue = form.querySelector('[data-value="baseMm"]');
    const thresholdValue = form.querySelector('[data-value="threshold"]');
    const smoothingValue = form.querySelector('[data-value="smoothing"]');
    const detailValue = form.querySelector('[data-value="detail"]');
    const status = form.querySelector('[data-converter-status]');
    const message = form.querySelector('[data-converter-message]');
    const button = form.querySelector('[data-generate-stl="true"]');

    function setText(el, text) { if (el) el.textContent = text; }
    function trackEvent(event, payload) {
      if (typeof window === 'undefined') return;
      const cleanPayload = {};
      Object.keys(payload || {}).forEach((key) => {
        if (payload[key] !== undefined) cleanPayload[key] = payload[key];
      });
      window.pngtostlEvents = window.pngtostlEvents || [];
      window.pngtostlEvents.push({ event, payload: cleanPayload, ts: Date.now() });
      if (typeof window.gtag === 'function') window.gtag('event', event, cleanPayload);
      if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event }, cleanPayload));
    }
    function converterContext(extra) {
      const file = fileInput && fileInput.files && fileInput.files[0];
      const selectedMode = mode();
      return Object.assign({
        tool: form.dataset.tool || form.dataset.mode || 'converter',
        mode: selectedMode || 'none',
        path: location.pathname,
        file_type: file && file.type ? file.type : 'n/a',
        file_ext: file && file.name && file.name.indexOf('.') >= 0 ? file.name.split('.').pop().toLowerCase() : 'n/a',
        file_size: file ? file.size : 0,
        detail: detailInput ? detailInput.value : '180',
        width_mm: widthInput ? widthInput.value : '90'
      }, extra || {});
    }
    function trackConverterError(extra) {
      const payload = converterContext(extra);
      trackEvent('converter_generate_error', payload);
      trackEvent('pngtostl_generate_error', payload);
    }
    function mode() { return modeInput ? modeInput.value : (form.dataset.mode || ''); }
    function syncWidth() { setText(widthValue, (widthInput ? widthInput.value : '90') + ' mm'); }
    function syncDepth() { setText(depthValue, Number(depthInput ? depthInput.value : 1.8).toFixed(1) + ' mm'); }
    function syncBase() { setText(baseValue, Number(baseInput ? baseInput.value : 1).toFixed(1) + ' mm'); }
    function syncThreshold() { setText(thresholdValue, (thresholdInput ? thresholdInput.value : '55') + '%'); }
    function syncSmoothing() { setText(smoothingValue, (smoothingInput ? smoothingInput.value : '25') + '%'); }
    function syncDetail() { setText(detailValue, detailInput ? detailInput.value : '180'); }
    function syncFile() {
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (file) {
        const fileSignature = [file.name, file.size, file.type || 'unknown', file.lastModified || 0].join(':');
        if (form.dataset.lastTrackedFile !== fileSignature) {
          form.dataset.lastTrackedFile = fileSignature;
          const uploadPayload = converterContext({
            file_name_length: file.name ? file.name.length : 0
          });
          trackEvent('converter_upload_selected', uploadPayload);
          trackEvent('pngtostl_upload_selected', uploadPayload);
        }
        setText(status, 'File selected');
        setText(message, file.name + ' selected.\nTip: STL stores geometry only, so colors will not appear in Paint 3D.');
      } else {
        setText(status, mode() ? 'Waiting for PNG' : 'Helper tool');
        setText(message, 'Upload a PNG to generate a front-facing STL relief. STL files do not preserve color.');
      }
    }

    widthInput && widthInput.addEventListener('input', syncWidth);
    depthInput && depthInput.addEventListener('input', syncDepth);
    baseInput && baseInput.addEventListener('input', syncBase);
    thresholdInput && thresholdInput.addEventListener('input', syncThreshold);
    smoothingInput && smoothingInput.addEventListener('input', syncSmoothing);
    detailInput && detailInput.addEventListener('input', syncDetail);
    fileInput && fileInput.addEventListener('change', syncFile);
    modeInput && modeInput.addEventListener('change', syncFile);
    syncWidth(); syncDepth(); syncBase(); syncThreshold(); syncSmoothing(); syncDetail(); syncFile();

    async function generateStl(event) {
      if (event) event.preventDefault();
      const selectedMode = mode();
      const generatePayload = converterContext({ has_mode: Boolean(selectedMode) });
      trackEvent('converter_generate_clicked', generatePayload);
      trackEvent('pngtostl_generate_clicked', generatePayload);
      if (!selectedMode) {
        setText(status, 'Helper tool');
        setText(message, 'Use this helper to choose the right STL workflow before generating a file.');
        trackConverterError({
          error_type: 'missing_mode',
          error_message: 'No STL workflow selected'
        });
        return;
      }
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (!file) {
        setText(status, 'Needs fix');
        setText(message, 'Choose a PNG file first.');
        trackConverterError({
          error_type: 'missing_file',
          error_message: 'Choose a file first'
        });
        return;
      }
      setText(status, 'Processing');
      setText(message, 'Generating a binary STL at detail level ' + (detailInput ? detailInput.value : '180') + '...');
      if (button) { button.disabled = true; button.textContent = 'Generating...'; }
      const formData = new FormData();
      formData.set('file', file);
      formData.set('mode', selectedMode);
      formData.set('depth', depthInput ? depthInput.value : '1.8');
      formData.set('widthMm', widthInput ? widthInput.value : '90');
      formData.set('baseMm', baseInput ? baseInput.value : '1');
      formData.set('threshold', String((Number(thresholdInput ? thresholdInput.value : 55) / 100).toFixed(2)));
      formData.set('smoothing', String((Number(smoothingInput ? smoothingInput.value : 25) / 100).toFixed(2)));
      formData.set('detail', detailInput ? detailInput.value : '180');
      formData.set('invert', String(invertInput ? invertInput.checked : false));
      formData.set('minThicknessMm', '0.8');
      formData.set('maxThicknessMm', '3.2');
      try {
        const response = await fetch('/api/stl/convert', { method: 'POST', body: formData });
        if (!response.ok) {
          let body = { message: 'Conversion failed.' };
          try { body = await response.json(); } catch (_) {}
          setText(status, 'Needs fix');
          setText(message, body.message || 'Conversion failed.');
          trackConverterError({
            error_type: 'api_error',
            status_code: response.status,
            error_message: body.message || 'Conversion failed.'
          });
          return;
        }
        const blob = await response.blob();
        const outputKind = response.headers.get('x-tool-output-kind') || selectedMode;
        const triangleCount = response.headers.get('x-tool-triangle-count') || 'unknown';
        const gridColumns = response.headers.get('x-tool-grid-columns');
        const gridRows = response.headers.get('x-tool-grid-rows');
        const occupiedRatio = response.headers.get('x-tool-occupied-ratio');
        const url = URL.createObjectURL(blob);
        const successPayload = {
          tool: form.dataset.tool || form.dataset.mode || 'converter',
          mode: selectedMode,
          path: location.pathname,
          output_kind: outputKind,
          bytes: blob.size,
          triangles: triangleCount,
          coverage: occupiedRatio || 'n/a'
        };
        trackEvent('converter_generate_success', successPayload);
        trackEvent('pngtostl_generate_success', successPayload);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = outputKind === 'lithophane' ? 'pngtostl-lithophane.stl' : 'pngtostl-' + outputKind + '.stl';
        document.body.appendChild(anchor);
        anchor.click();
        const downloadPayload = converterContext({
          output_kind: outputKind,
          bytes: blob.size,
          triangles: triangleCount,
          auto_download: true
        });
        trackEvent('converter_download_click', downloadPayload);
        trackEvent('pngtostl_download_clicked', downloadPayload);
        anchor.remove();
        URL.revokeObjectURL(url);
        setText(status, 'STL ready');
        setText(
          message,
          'Downloaded binary ' + outputKind + ' STL from ' + file.name + '.\n' +
          'Mesh: ' + (gridColumns && gridRows ? gridColumns + ' x ' + gridRows + ', ' : '') + triangleCount + ' triangles\n' +
          'File size: ' + Math.round(blob.size / 1024) + ' KB' +
          (occupiedRatio ? '\nRaised/detail coverage: ' + Math.round(Number(occupiedRatio) * 100) + '%' : '') +
          '\nOpen it from the front/top view. STL is single-material geometry, not a color image.'
        );
      } catch (error) {
        setText(status, 'Needs fix');
        setText(message, 'Conversion failed. Please try another PNG or lower the detail level.');
        trackConverterError({
          error_type: 'network_or_runtime_error',
          error_message: error && error.message ? error.message : 'Conversion failed'
        });
      } finally {
        if (button) { button.disabled = false; button.textContent = 'Generate STL'; }
      }
    }

    form.addEventListener('submit', generateStl);
    button && button.addEventListener('click', generateStl);
  }

  function bootAll() {
    document.querySelectorAll('[data-converter-root="true"]').forEach(bootConverter);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootAll);
  else bootAll();
  document.addEventListener('readystatechange', bootAll);
})();
`;
