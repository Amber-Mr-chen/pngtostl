#!/usr/bin/env python3
import json
import math
import struct
import sys
import time
import uuid
import urllib.error
import urllib.request
import zlib

BASE = "http://127.0.0.1:3030"


def png_rgba(width, height, pixel):
    rows = []
    for y in range(height):
        row = bytearray([0])
        for x in range(width):
            row += bytes(pixel(x, y))
        rows.append(bytes(row))

    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)

    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(b"".join(rows)))
        + chunk(b"IEND", b"")
    )


def multipart(fields, file_bytes=None, filename="fixture.png", file_type="image/png"):
    boundary = "----qa" + uuid.uuid4().hex
    parts = []

    def add(name, value, fn=None, content_type=None):
        parts.append(f"--{boundary}\r\n".encode())
        disposition = f'Content-Disposition: form-data; name="{name}"'
        if fn:
            disposition += f'; filename="{fn}"'
        parts.append((disposition + "\r\n").encode())
        if content_type:
            parts.append((f"Content-Type: {content_type}\r\n").encode())
        parts.append(b"\r\n")
        parts.append(value if isinstance(value, bytes) else str(value).encode())
        parts.append(b"\r\n")

    if file_bytes is not None:
        add("file", file_bytes, filename, file_type)
    for key, value in fields.items():
        add(key, value)
    parts.append(f"--{boundary}--\r\n".encode())
    return b"".join(parts), boundary


def post_convert(png, **overrides):
    fields = {
        "mode": "icon",
        "depth": "1.8",
        "widthMm": "90",
        "baseMm": "1",
        "threshold": "0.55",
        "smoothing": "0.25",
        "detail": "180",
        "invert": "false",
        "minThicknessMm": "0.8",
        "maxThicknessMm": "3.2",
    }
    fields.update({key: str(value) for key, value in overrides.items()})
    body, boundary = multipart(fields, png)
    req = urllib.request.Request(
        BASE + "/api/stl/convert",
        data=body,
        headers={"Content-Type": "multipart/form-data; boundary=" + boundary},
        method="POST",
    )
    response = urllib.request.urlopen(req, timeout=30)
    return response, response.read()


def expect(condition, message):
    if not condition:
        raise AssertionError(message)


def stl_triangle_count(body):
    expect(len(body) >= 84, "binary STL shorter than 84-byte header")
    return struct.unpack("<I", body[80:84])[0]


def wait_server():
    for _ in range(20):
        try:
            response = urllib.request.urlopen(BASE + "/", timeout=3)
            if response.status == 200:
                return
        except Exception:
            time.sleep(0.5)
    raise RuntimeError("dev server is not reachable")


def main():
    wait_server()
    homepage = urllib.request.urlopen(BASE + "/?qa=gate", timeout=5).read().decode("utf-8", "ignore")
    expect("Image to 3D printing toolkit" in homepage, "homepage must be a tool-directory landing page")
    expect("Upload one image" in homepage and "Core STL workflows" in homepage, "homepage must present a universal upload entry and task-first directory")
    expect('/image-to-stl' in homepage and '/logo-to-stl' in homepage and '/lithophane-generator' in homepage and '/heightmap-to-stl' in homepage, "homepage must expose task-first tool entries")

    converter_page = urllib.request.urlopen(BASE + "/png-to-stl?qa=gate", timeout=5).read().decode("utf-8", "ignore")
    expect('type="button"' in converter_page and "data-generate-stl" in converter_page, "Generate button must not be native submit")
    expect('/converter.js' in converter_page, "converter.js script missing from converter page")
    expect('/stl-preview.js' in converter_page, "stl-preview.js script missing from converter page")
    expect('data-stl-preview="true"' in converter_page, "STL preview canvas missing from converter page")
    expect('data-result-metrics="true"' in converter_page, "result metrics panel missing from converter page")
    expect("Detail level" in converter_page, "Detail level control missing")

    logo_page = urllib.request.urlopen(BASE + "/logo-to-stl?qa=gate", timeout=5).read().decode("utf-8", "ignore")
    heightmap_page = urllib.request.urlopen(BASE + "/heightmap-to-stl?qa=gate", timeout=5).read().decode("utf-8", "ignore")
    lithophane_page = urllib.request.urlopen(BASE + "/lithophane-generator?qa=gate", timeout=5).read().decode("utf-8", "ignore")
    jpg_page = urllib.request.urlopen(BASE + "/jpg-to-stl?qa=gate", timeout=5).read().decode("utf-8", "ignore")
    expect("Logo preset locks" in logo_page and "value=\"160\"" in logo_page, "logo page must use a distinct logo preset")
    expect("Heightmap preset maps" in heightmap_page and "value=\"180\"" in heightmap_page, "heightmap page must use a distinct heightmap preset")
    expect("Lithophane preset maps" in lithophane_page and "Invert for lithophane" in lithophane_page, "lithophane page must use a distinct lithophane preset")
    expect("image/jpeg,image/png,image/webp,image/gif,image/bmp" in jpg_page and "Common image formats are normalized" in jpg_page, "JPG page must accept common browser-readable image formats and show normalization behavior")

    transparent_icon = png_rgba(
        64,
        64,
        lambda x, y: (0, 0, 0, 255)
        if (16 <= x <= 47 and (y in (16, 47) or x in (16, 47) or (22 <= x <= 27 and 26 <= y <= 31) or (37 <= x <= 42 and 26 <= y <= 31) or (26 <= x <= 39 and 40 <= y <= 43)))
        else (0, 0, 0, 0),
    )
    white_bg_icon = png_rgba(64, 64, lambda x, y: (0, 0, 0, 255) if 20 <= x <= 43 and 20 <= y <= 43 else (255, 255, 255, 255))
    wide_icon = png_rgba(256, 128, lambda x, y: (0, 0, 0, 255) if 50 < x < 205 and 30 < y < 95 and ((x // 12 + y // 12) % 2 == 0) else (0, 0, 0, 0))

    r1, b1 = post_convert(transparent_icon, detail=180)
    expect(r1.status == 200, "transparent icon conversion failed")
    expect(r1.headers.get("content-type") == "model/stl", "content-type must be model/stl")
    expect(stl_triangle_count(b1) == int(r1.headers.get("x-tool-triangle-count")), "binary triangle count header mismatch")
    expect(stl_triangle_count(b1) < 6000, "icon output should not create a full square back plate")
    occ1 = float(r1.headers.get("x-tool-occupied-ratio"))
    expect(0.02 < occ1 < 0.75, f"transparent icon coverage suspicious: {occ1}")

    r2, b2 = post_convert(white_bg_icon, detail=180)
    occ2 = float(r2.headers.get("x-tool-occupied-ratio"))
    expect(0.05 < occ2 < 0.75, f"white bg icon coverage suspicious: {occ2}")

    r3, b3 = post_convert(wide_icon, detail=96)
    r4, b4 = post_convert(wide_icon, detail=320)
    grid3 = (int(r3.headers.get("x-tool-grid-columns")), int(r3.headers.get("x-tool-grid-rows")))
    grid4 = (int(r4.headers.get("x-tool-grid-columns")), int(r4.headers.get("x-tool-grid-rows")))
    tri3 = int(r3.headers.get("x-tool-triangle-count"))
    tri4 = int(r4.headers.get("x-tool-triangle-count"))
    expect(grid3 == (96, 48), f"detail 96 grid wrong: {grid3}")
    expect(grid4 == (256, 128), f"detail 320 should preserve 256x128 input: {grid4}")
    expect(tri4 > tri3 and len(b4) > len(b3), "detail must increase mesh and file size")

    text_body, boundary = multipart({}, b"not png", "bad.txt", "text/plain")
    bad_req = urllib.request.Request(
        BASE + "/api/stl/convert",
        data=text_body,
        headers={"Content-Type": "multipart/form-data; boundary=" + boundary},
        method="POST",
    )
    try:
        urllib.request.urlopen(bad_req, timeout=10)
        raise AssertionError("text/plain should fail")
    except urllib.error.HTTPError as error:
        expect(error.code == 415, f"text/plain should return 415, got {error.code}")
        payload = json.loads(error.read().decode())
        expect(payload.get("error") == "UNSUPPORTED_FILE_TYPE", "wrong unsupported file error")

    print("PASS step11 core tool QA gate")
    print(json.dumps({
        "transparentCoverage": occ1,
        "whiteBgCoverage": occ2,
        "detail96": {"grid": grid3, "triangles": tri3, "bytes": len(b3)},
        "detail320": {"grid": grid4, "triangles": tri4, "bytes": len(b4)},
    }, indent=2))


if __name__ == "__main__":
    main()
