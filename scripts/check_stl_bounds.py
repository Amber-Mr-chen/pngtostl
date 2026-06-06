#!/usr/bin/env python3
import struct
import urllib.request
from step11_core_tool_qa import png_rgba, post_convert, wait_server


def bounds(body):
    tri = struct.unpack('<I', body[80:84])[0]
    xs=[]; ys=[]; zs=[]
    offset=84
    for _ in range(tri):
        offset += 12
        for _ in range(3):
            x,y,z=struct.unpack('<fff', body[offset:offset+12])
            xs.append(x); ys.append(y); zs.append(z)
            offset += 12
        offset += 2
    return {
        'triangles': tri,
        'x': (min(xs), max(xs)),
        'y': (min(ys), max(ys)),
        'z': (min(zs), max(zs)),
    }

wait_server()
transparent_icon = png_rgba(
    64, 64,
    lambda x, y: (0, 0, 0, 255)
    if (16 <= x <= 47 and (y in (16, 47) or x in (16, 47) or (22 <= x <= 27 and 26 <= y <= 31) or (37 <= x <= 42 and 26 <= y <= 31) or (26 <= x <= 39 and 40 <= y <= 43)))
    else (0, 0, 0, 0),
)
_, body = post_convert(transparent_icon, detail=96)
print(bounds(body))
