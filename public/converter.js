(() => {
  function bootConverter(root) {
    if (!root || root.dataset.converterBooted === '1') return;
    const form = root.querySelector('form[data-converter-form="true"]');
    if (!form) return;
    root.dataset.converterBooted = '1';

    const fileInput = form.querySelector('input[name="file"]');
    const fileNameLabel = form.querySelector('[data-file-name="true"]');
    const button = form.querySelector('[data-generate-stl="true"]');
    const downloadLink = form.querySelector('[data-download-stl="true"]');
    const status = form.querySelector('[data-converter-status]');
    const message = form.querySelector('[data-converter-message]');
    const previewCanvas = root.querySelector('[data-stl-preview]');
    const previewEmptyState = root.querySelector('[data-preview-empty-state]');
    const metrics = form.querySelector('[data-result-metrics="true"]');
    const cleanPreviewPanel = form.querySelector('[data-clean-preview-panel="true"]');
    const cleanPreviewImage = form.querySelector('[data-clean-preview-image="true"]');
    const diagnosisPanel = form.querySelector('[data-image-diagnosis="true"]');
    const diagnosisTitle = form.querySelector('[data-diagnosis-title="true"]');
    const diagnosisMessage = form.querySelector('[data-diagnosis-message="true"]');
    const diagnosisAlpha = form.querySelector('[data-diagnosis-alpha="true"]');
    const diagnosisSubject = form.querySelector('[data-diagnosis-subject="true"]');
    const diagnosisComplexity = form.querySelector('[data-diagnosis-complexity="true"]');
    const lithophaneSuggestion = form.querySelector('[data-lithophane-suggestion="true"]');
    const modeInput = form.querySelector('select[name="mode"]');
    const widthInput = form.querySelector('input[name="widthMm"]');
    const depthInput = form.querySelector('input[name="depth"]');
    const baseInput = form.querySelector('input[name="baseMm"]');
    const thresholdInput = form.querySelector('input[name="threshold"]');
    const smoothingInput = form.querySelector('input[name="smoothing"]');
    const detailInput = form.querySelector('input[name="detail"]');
    const qualityInputs = Array.from(form.querySelectorAll('input[name="quality"], select[name="quality"]'));
    const invertInput = form.querySelector('input[name="invert"]');
    const hasSamplePreset = form.dataset.samplePreset === 'true';
    let lastFileSignature = '';

    function setText(el, text) {
      if (el) el.textContent = text;
    }

    const pageLang = (document.documentElement.lang || '').trim() || (navigator.language || '').trim();
    const isZh = /^zh\b/i.test(pageLang);
    function copy(en, zh) {
      return isZh ? zh : en;
    }

    function setFileNameLabel(file) {
      if (!fileNameLabel) return;
      fileNameLabel.textContent = file ? file.name : copy('No file selected', '未选择文件');
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

    function selectedQuality() {
      const checked = qualityInputs.find((input) => input.type === 'radio' && input.checked);
      if (checked) return checked.value;
      const select = qualityInputs.find((input) => input.tagName === 'SELECT');
      return select ? select.value : 'fast';
    }

    function isPhotoTool() {
      const tool = form.dataset.tool || '';
      return tool === 'photo-to-stl' || tool === 'photo-to-lithophane';
    }

    function setQualityValue(value) {
      qualityInputs.forEach((input) => {
        if (input.type === 'radio') input.checked = input.value === value;
        else input.value = value;
      });
    }

    qualityInputs.forEach((input) => {
      const label = input.closest('label');
      const applyQuality = (event) => {
        if (event) event.preventDefault();
        setQualityValue(input.value);
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('input', { bubbles: true }));
      };
      input.addEventListener('click', applyQuality);
      if (label) label.addEventListener('click', applyQuality);
    });

    function qualityDetail() {
      const value = selectedQuality();
      if (value === 'high') return 352;
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

    function setRangeValue(input, value) {
      if (!input) return;
      input.value = String(value);
      syncRange(input);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
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

    function resetDiagnosis() {
      if (diagnosisPanel) {
        diagnosisPanel.hidden = true;
        diagnosisPanel.classList.remove('good', 'warn', 'bad', 'photoCheck');
      }
      setText(diagnosisTitle, copy('Upload an image to get a recommendation', '上传图片后获取建议'));
      setText(diagnosisMessage, copy('Transparent logos, icons, stickers, and simple silhouettes are the safest inputs for clean STL extrusion.', '透明标志、图标、贴纸和简单轮廓最适合生成干净挤压 STL。'));
      setText(diagnosisAlpha, copy('Transparency: waiting', '透明度：等待中'));
      setText(diagnosisSubject, copy('Subject coverage: waiting', '主体占比：等待中'));
      setText(diagnosisComplexity, copy('Complexity: waiting', '复杂度：等待中'));
      if (lithophaneSuggestion) lithophaneSuggestion.hidden = true;
    }

    function classifyImage(info) {
      const subjectRatio = Number(info && info.subjectRatio) || 0;
      const edgeRatio = Number(info && info.edgeRatio) || 0;
      const boundaryRatio = Number(info && info.boundaryRatio) || 0;
      const componentCount = Number(info && info.componentCount) || 0;
      const lumaSpread = Number(info && info.lumaSpread) || 0;
      const hasTransparency = Boolean(info && info.hasTransparency);
      const removableBackground = Boolean(info && info.removableBackground);
      const simpleCoverage = subjectRatio > 0.03 && subjectRatio < 0.72;
      const simpleEdges = edgeRatio < 0.34 && boundaryRatio < 0.24 && componentCount <= 3;
      const complexCutout = boundaryRatio > 0.24 || componentCount > 3;
      const logoFit = (hasTransparency || removableBackground) && simpleCoverage && simpleEdges;
      const silhouetteFit = !hasTransparency && removableBackground && simpleCoverage && simpleEdges;
      const photoLike = !hasTransparency && lumaSpread > 0.25 && edgeRatio > 0.28;
      const tooComplex = edgeRatio > 0.42 || subjectRatio > 0.86 || complexCutout;
      if (logoFit || silhouetteFit) return { level: 'good', title: copy('Good fit for clean logo/icon STL', '适合生成干净的标志/图标 STL'), message: hasTransparency ? copy('Transparency detected. Clean extrude or logo badge mode is the safest workflow.', '检测到透明背景，干净挤压或标志徽章模式最稳。') : copy('Light background with a clear subject detected. Clean extrude can work after background removal.', '检测到浅色背景和清晰主体，移除背景后可尝试干净挤压。') };
      if (photoLike) return { level: 'warn', title: copy('Better as backlit panel or raised surface', '更适合照片面板或浮雕面板'), message: copy('This looks more like a photo/tonal image than a flat logo. Use backlit photo panel or photo raised surface mode instead of clean extrude.', '这更像照片或明暗图，不像扁平标志。建议用照片面板或浮雕面板，不要直接干净挤压。') };
      if (tooComplex) return { level: 'bad', title: copy('Recommended: raised photo panel', '推荐：浮雕/照片面板'), message: copy('This image has rich detail, so a clean logo cutout is not the best path. The converter can route it to a raised-surface preview instead.', '这张图细节较多，不适合按简单标志切边；转换器会优先用浮雕面板方式生成预览。') };
      return { level: 'warn', title: copy('Usable, but check the preview carefully', '可以尝试，但需要仔细检查预览'), message: copy('The image may work, but clean extrude is safest with transparent logos, icons, and simple silhouettes.', '这张图可能可用，但干净挤压最适合透明标志、图标和简单轮廓。') };
    }

    function classifyPhotoImage(info) {
      const subjectRatio = Number(info && info.subjectRatio) || 0;
      const edgeRatio = Number(info && info.edgeRatio) || 0;
      const boundaryRatio = Number(info && info.boundaryRatio) || 0;
      const componentCount = Number(info && info.componentCount) || 0;
      const lumaSpread = Number(info && info.lumaSpread) || 0;
      const busyBackground = edgeRatio > 0.18 || boundaryRatio > 0.4 || componentCount > 8;
      const tinySubject = subjectRatio > 0 && subjectRatio < 0.12;
      const tonalPhoto = lumaSpread > 0.18;
      if (busyBackground) return { level: 'warn', title: copy('Image check: Try smoother relief', '图片检查：建议更平滑的浮雕'), message: copy('Background busy · crop tighter or try lithophane', '背景较复杂 · 建议裁紧或试试透光照片板'), suggestLithophane: true };
      if (tinySubject) return { level: 'warn', title: copy('Image check: Photo relief possible', '图片检查：可生成照片浮雕'), message: copy('Subject small · crop tighter before generating', '主体偏小 · 生成前建议裁紧') };
      if (tonalPhoto) return { level: 'good', title: copy('Image check: Photo relief recommended', '图片检查：推荐照片浮雕'), message: copy('Subject clear · background moderate', '主体清晰 · 背景适中') };
      return { level: 'warn', title: copy('Image check: Try lithophane', '图片检查：可试试透光照片板'), message: copy('Low tonal range · lithophane may keep detail better', '明暗层次较少 · 透光照片板可能保留更多细节'), suggestLithophane: true };
    }

    function updateDiagnosis(info) {
      if (!diagnosisPanel || !info) return;
      const photoTool = isPhotoTool();
      const classification = photoTool ? classifyPhotoImage(info) : classifyImage(info);
      diagnosisPanel.hidden = false;
      diagnosisPanel.classList.remove('good', 'warn', 'bad');
      diagnosisPanel.classList.toggle('photoCheck', photoTool);
      diagnosisPanel.classList.add(classification.level);
      setText(diagnosisTitle, classification.title);
      setText(diagnosisMessage, classification.message);
      setText(diagnosisAlpha, photoTool ? '' : copy('Transparency: ', '透明度：') + (info.hasTransparency ? copy('yes', '有') : info.removableBackground ? copy('background removable', '背景可移除') : copy('no', '无')));
      setText(diagnosisSubject, photoTool ? classification.message : copy('Subject coverage: ', '主体占比：') + Math.round((Number(info.subjectRatio) || 0) * 100) + '%');
      setText(diagnosisComplexity, photoTool ? '' : copy('Complexity: ', '复杂度：') + Math.round((Number(info.edgeRatio) || 0) * 100) + '% · ' + copy('shape ', '形状 ') + Math.round((Number(info.boundaryRatio) || 0) * 100) + '% · ' + copy('parts ', '部件 ') + (Number(info.componentCount) || 0));
      if (lithophaneSuggestion) {
        lithophaneSuggestion.hidden = !(photoTool && classification.suggestLithophane);
        lithophaneSuggestion.textContent = copy('Try lithophane', '试试透光照片板');
      }
      if (photoTool) {
        setButtonState(copy('Generate photo relief preview', '生成照片浮雕预览'), false);
      } else if (modeInput && selectedMode() === 'extrude') {
        if (classification.level === 'good') setButtonState(copy('Generate clean STL now', '生成干净 STL'), false);
        if (classification.level === 'warn') setButtonState(copy('Generate photo panel preview', '生成照片面板预览'), false);
        if (classification.level === 'bad') setButtonState(copy('Generate safer STL preview', '生成安全 STL 预览'), false);
      }
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

    function markPreviewFailed(reason) {
      if (!previewCanvas) return;
      previewCanvas.dataset.previewReady = '0';
      previewCanvas.dataset.previewRenderer = 'none';
      previewCanvas.dataset.previewError = reason || 'conversion_failed';
      if (previewEmptyState) previewEmptyState.hidden = false;
    }

    function emptyMessage() {
      return form.dataset.emptyMessage || 'Upload an image to generate STL geometry. STL files do not preserve color.';
    }

    [widthInput, depthInput, baseInput, thresholdInput, smoothingInput, detailInput].forEach(bindRange);

    async function syncFile() {
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (!file) {
        setFileNameLabel(null);
        lastFileSignature = '';
        setText(status, copy('Waiting for image', '等待上传图片'));
        setText(message, emptyMessage());
        setButtonState(copy('Choose an image first', '先选择图片'), true);
        if (downloadLink) {
          downloadLink.style.display = 'none';
          downloadLink.removeAttribute('href');
        }
        setMetrics([]);
        clearCleanPreview();
        resetDiagnosis();
        return;
      }
      setFileNameLabel(file);
      const signature = [file.name, file.size, file.lastModified || 0].join(':');
      if (signature === lastFileSignature && button && !button.disabled) return;
      lastFileSignature = signature;
      setText(status, copy('Image selected', '图片已选择'));
      setButtonState(copy('Generate STL now', '生成 STL'), false);
      if (downloadLink) {
        downloadLink.style.display = 'none';
        downloadLink.removeAttribute('href');
      }
      if (previewCanvas) {
        previewCanvas.dataset.spin = '0';
        const ctx = previewCanvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      }
      setText(message, file.name + copy(' selected.\nRunning an image suitability check before STL generation.', ' 已选择。\n正在生成前检查图片是否适合 STL。'));
      if (diagnosisPanel) {
        diagnosisPanel.hidden = false;
        diagnosisPanel.classList.remove('good', 'warn', 'bad');
        if (lithophaneSuggestion) lithophaneSuggestion.hidden = true;
        setText(diagnosisTitle, copy('Checking image suitability...', '正在检查图片适配度……'));
        setText(diagnosisMessage, copy('Looking for transparency, clear subject coverage, and excessive texture/noise.', '正在检查透明度、主体占比以及过多纹理/噪点。'));
      }
      try {
        const info = await inspectImageFile(file);
        updateDiagnosis(info);
        setText(message, file.name + copy(' selected.\nCheck the recommendation, then generate the STL preview.', ' 已选择。\n查看推荐结果后生成 STL 预览。'));
      } catch (_) {
        setText(diagnosisTitle, copy('Image check unavailable', '图片检查暂不可用'));
        setText(diagnosisMessage, copy('You can still generate, but use simple transparent logos or icons for the cleanest STL output.', '仍可继续生成，但简单透明标志或图标的 STL 效果最干净。'));
      }
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
            for (let y = 0; y < canvas.height; y += 1) {
              for (let x = 0; x < canvas.width; x += 1) {
                const i = (y * canvas.width + x) * 4;
                if (data[i + 3] < 245) transparent += 1;
                if (x < 3 || y < 3 || x >= canvas.width - 3 || y >= canvas.height - 3) {
                  borderR += data[i]; borderG += data[i + 1]; borderB += data[i + 2]; borderCount += 1;
                }
              }
            }
            const pixels = Math.max(1, data.length / 4);
            const avgBorder = { r: borderR / Math.max(1, borderCount), g: borderG / Math.max(1, borderCount), b: borderB / Math.max(1, borderCount) };
            const borderLuma = (avgBorder.r * 0.2126 + avgBorder.g * 0.7152 + avgBorder.b * 0.0722) / 255;
            let subjectLike = 0;
            let lumaSum = 0;
            let lumaSqSum = 0;
            let edgeChanges = 0;
            let edgeSamples = 0;
            const lumas = new Float32Array(pixels);
            const mask = new Uint8Array(pixels);
            for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
              const luma = (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722) / 255;
              lumas[p] = luma;
              lumaSum += luma;
              lumaSqSum += luma * luma;
              const dr = data[i] - avgBorder.r;
              const dg = data[i + 1] - avgBorder.g;
              const db = data[i + 2] - avgBorder.b;
              const distance = Math.sqrt(dr * dr + dg * dg + db * db);
              if (distance > 42) {
                subjectLike += 1;
                mask[p] = 1;
              }
            }
            for (let y = 1; y < canvas.height; y += 1) {
              for (let x = 1; x < canvas.width; x += 1) {
                const p = y * canvas.width + x;
                const diff = Math.max(Math.abs(lumas[p] - lumas[p - 1]), Math.abs(lumas[p] - lumas[p - canvas.width]));
                if (diff > 0.18) edgeChanges += 1;
                edgeSamples += 1;
              }
            }
            let boundaryPixels = 0;
            const seen = new Uint8Array(pixels);
            const queue = [];
            let componentCount = 0;
            for (let y = 1; y < canvas.height - 1; y += 1) {
              for (let x = 1; x < canvas.width - 1; x += 1) {
                const start = y * canvas.width + x;
                if (!mask[start]) continue;
                if (!mask[start - 1] || !mask[start + 1] || !mask[start - canvas.width] || !mask[start + canvas.width]) boundaryPixels += 1;
                if (seen[start]) continue;
                componentCount += 1;
                if (componentCount > 12) continue;
                seen[start] = 1;
                queue.length = 0;
                queue.push(start);
                for (let qi = 0; qi < queue.length; qi += 1) {
                  const p = queue[qi];
                  const neighbors = [p - 1, p + 1, p - canvas.width, p + canvas.width];
                  for (const next of neighbors) {
                    if (next < 0 || next >= pixels || seen[next] || !mask[next]) continue;
                    seen[next] = 1;
                    queue.push(next);
                  }
                }
              }
            }
            URL.revokeObjectURL(objectUrl);
            const transparentRatio = transparent / pixels;
            const subjectRatio = subjectLike / pixels;
            const avgLuma = lumaSum / pixels;
            const lumaSpread = Math.sqrt(Math.max(0, lumaSqSum / pixels - avgLuma * avgLuma));
            resolve({
              hasTransparency: transparentRatio > 0.08,
              removableBackground: transparentRatio <= 0.08 && borderLuma > 0.78 && subjectRatio > 0.04 && subjectRatio < 0.82,
              subjectRatio,
              edgeRatio: edgeChanges / Math.max(1, edgeSamples),
              boundaryRatio: boundaryPixels / Math.max(1, subjectLike),
              componentCount,
              lumaSpread,
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
        setText(status, copy('Waiting for image', '等待上传图片'));
        setText(message, copy('Upload an image before generating an STL.', '请先上传图片，再生成 STL。'));
        setButtonState(copy('Choose an image first', '先选择图片'), true);
        return;
      }

      setButtonState(copy('Generating STL...', '正在生成 STL……'), true);
      setText(status, copy('Checking image', '检查图片中'));
      setText(message, copy('Reading the image and choosing a safe STL workflow...', '正在读取图片并选择稳定的 STL 工作流……'));
      const imageInfo = await inspectImageFile(file);
      updateDiagnosis(imageInfo);
      const classification = classifyImage(imageInfo);
      const autoRouteComplexImage = modeInput && selectedMode() === 'extrude' && classification.level === 'bad';
      if (autoRouteComplexImage) {
        modeInput.value = 'relief';
        setQualityValue('standard');
        setRangeValue(smoothingInput, 90);
        setText(status, copy('Using smooth relief workflow', '使用平滑浮雕工作流'));
        setText(message, classification.message + copy('\nAutomatically using Standard 256 smooth relief for a stable preview. Detailed 352 is still available after the preview works.', '\n已自动使用 Standard 256 平滑浮雕，先保证稳定预览。预览正常后仍可手动尝试 Detailed 352。'));
        trackBoth('converter_auto_routed_complex_image', 'pngtostl_auto_routed_complex_image', { reason: 'image_not_fit_for_clean_extrude' });
      }
      if (modeInput && selectedMode() === 'extrude' && classification.level === 'warn') {
        modeInput.value = 'relief';
        if (selectedQuality() === 'fast') setQualityValue('standard');
        setRangeValue(smoothingInput, 80);
        setText(message, classification.message + copy('\nAutomatically using smoother photo relief mode instead of clean extrude...', '\n已自动改用更平滑的照片浮雕面板，不再使用干净挤压……'));
      }
      const shouldCutoutSubject = imageInfo.hasTransparency || imageInfo.removableBackground;
      if (modeInput && selectedMode() === 'relief' && shouldCutoutSubject && !autoRouteComplexImage) {
        modeInput.value = 'logo';
        if (selectedQuality() === 'fast') setQualityValue('standard');
        setText(message, (imageInfo.hasTransparency ? copy('Transparent background detected.', '检测到透明背景。') : copy('Light background detected and removed.', '检测到浅色背景并已移除。')) + copy(' Using logo badge mode so the subject does not become a full square plate...', ' 已使用标志徽章模式，避免主体变成整块方形板……'));
      }
      trackBoth('converter_generate_clicked', 'pngtostl_generate_clicked', { fileType: file.type || 'unknown', fileSizeKb: Math.round(file.size / 1024), auto_mode: selectedMode() });
      trackSamplePreset('sample_preset_generate_clicked', { fileType: file.type || 'unknown', fileSizeKb: Math.round(file.size / 1024) });
      setText(status, copy('Processing', '处理中'));
      if (!shouldCutoutSubject) setText(message, copy('Generating a fast preview STL at detail level ', '正在按细节级别 ') + qualityDetail() + copy('...', ' 生成快速 STL 预览……'));

      let normalizedFile;
      try {
        normalizedFile = await normalizeImageFile(file, imageInfo);
      } catch (error) {
        setText(status, copy('Needs fix', '需要修正'));
        setText(message, error && error.message ? error.message : copy('Use a PNG, JPG, WebP, GIF, BMP, or SVG image.', '请使用 PNG、JPG、WebP、GIF、BMP 或 SVG 图片。'));
        trackBoth('converter_clean_preview_failed', 'pngtostl_clean_preview_failed', { reason: error && error.message ? error.message : 'unknown' });
        setButtonState(copy('Generate STL', '生成 STL'), false);
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
          setText(status, copy('Needs fix', '需要修正'));
          setText(message, body.message || copy('Conversion failed.', '转换失败。'));
          markPreviewFailed('api_' + response.status);
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
        if (previewEmptyState) previewEmptyState.hidden = true;
        setText(status, copy('STL ready', 'STL 已就绪'));
        trackBoth('converter_generate_success', 'pngtostl_generate_success', { output_kind: outputKind, bytes: blob.size, triangles: triangleCount, coverage: occupiedRatio || 'n/a' });
        trackSamplePreset('sample_preset_generate_success', { output_kind: outputKind, bytes: blob.size, triangles: triangleCount, coverage: occupiedRatio || 'n/a' });
        const widthMm = Math.round(Number(widthInput ? widthInput.value : 0) || 0);
        const reliefMm = Number(depthInput ? depthInput.value : 0) || 0;
        setMetrics([
          { label: copy('Triangles', '三角面'), value: formatNumber(triangleCount) },
          { label: copy('File size', '文件大小'), value: formatFileSize(blob.size) },
          { label: copy('Coverage', '覆盖率'), value: occupiedRatio ? Math.round(Number(occupiedRatio) * 100) + '%' : 'n/a' },
          { label: copy('Size', '尺寸'), value: widthMm ? widthMm + copy(' mm wide', ' mm 宽') : 'n/a' },
          { label: copy('Relief depth', '浮雕深度'), value: reliefMm ? reliefMm.toFixed(1) + ' mm' : 'n/a' },
          { label: copy('Mesh check', '网格检查'), value: copy('Printable STL', '可打印 STL') },
        ]);
        setText(
          message,
          copy('Binary ', '二进制 ') + outputKind + copy(' STL is ready from ', ' STL 已从 ') + normalizedFile.name + copy('.\n', ' 生成完成。\n') +
          copy('Mesh: ', '网格：') + (gridColumns && gridRows ? gridColumns + ' x ' + gridRows + ', ' : '') + triangleCount + copy(' triangles\n', ' 个三角面\n') +
          copy('File size: ', '文件大小：') + Math.round(blob.size / 1024) + ' KB' +
          (occupiedRatio ? copy('\nRaised/detail coverage: ', '\n凸起/细节覆盖率：') + Math.round(Number(occupiedRatio) * 100) + '%' : '') +
          copy('\nOpen it from the front/top view. STL is single-material geometry, not a color image.', '\n建议从正面/顶部视图检查。STL 是单材质几何文件，不保留彩色图片。')
        );
      } catch (error) {
        setText(status, copy('Needs fix', '需要修正'));
        setText(message, copy('Conversion failed. Please try another image or lower the detail level.', '转换失败。请换一张图片，或降低细节级别后重试。'));
        markPreviewFailed(error && error.name === 'AbortError' ? 'timeout' : 'network_or_runtime_error');
        trackBoth('converter_generate_error', 'pngtostl_generate_error', {
          reason: error && error.name === 'AbortError' ? 'timeout' : 'network_or_runtime_error',
          message: error && error.message ? error.message : 'Conversion failed'
        });
        trackSamplePreset('sample_preset_generate_error', {
          reason: error && error.name === 'AbortError' ? 'timeout' : 'network_or_runtime_error'
        });
      } finally {
        const hasFile = fileInput && fileInput.files && fileInput.files[0];
        setButtonState(hasFile ? copy('Generate STL now', '生成 STL') : copy('Choose an image first', '先选择图片'), !hasFile);
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

  function bootWithRetries() {
    bootAll();
    [100, 500, 1200].forEach((delay) => setTimeout(bootAll, delay));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootWithRetries);
  else bootWithRetries();
  window.addEventListener('pageshow', bootWithRetries);
})();
