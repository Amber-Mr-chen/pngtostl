import bpy
from pathlib import Path

SRC = Path('/root/projects/pngtostl/assets/sketchfab-golden-temple/source/golden-temple-glb.glb')
OUT = Path('/root/projects/pngtostl/public/samples/golden-temple-web-preview.glb')
DECIMATE_RATIO = 0.055

COLOR_RULES = [
    (('roofholds', 'rooflogs', 'biglog', 'interiorroof', 'introof', 'columnext', 'woodblue'), (0.05, 0.42, 0.34, 1.0), 0.0, 0.55),
    (('gold', 'ornament', 'deco', 'stars'), (1.0, 0.66, 0.10, 1.0), 0.22, 0.34),
    (('roof',), (0.95, 0.58, 0.08, 1.0), 0.16, 0.42),
    (('redgold', 'door', 'column', 'wallblock', 'wall', 'material.003', 'material.004', 'material.006'), (0.70, 0.08, 0.035, 1.0), 0.0, 0.48),
    (('plattform', 'platform'), (0.58, 0.55, 0.50, 1.0), 0.0, 0.72),
]
DEFAULT_COLOR = (0.66, 0.18, 0.10, 1.0)

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()
bpy.ops.import_scene.gltf(filepath=str(SRC))

mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
for obj in mesh_objects:
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    poly_count = len(obj.data.polygons)
    if poly_count > 30000:
        modifier = obj.modifiers.new('web_preview_decimate', 'DECIMATE')
        modifier.ratio = DECIMATE_RATIO
        modifier.use_collapse_triangulate = True
        try:
            bpy.ops.object.modifier_apply(modifier=modifier.name)
        except Exception:
            obj.modifiers.remove(modifier)
    obj.select_set(False)

for material in bpy.data.materials:
    material.use_nodes = True
    nodes = material.node_tree.nodes if material.node_tree else []
    principled = next((node for node in nodes if node.type == 'BSDF_PRINCIPLED'), None)
    if not principled:
        continue
    name = material.name.lower()
    color, metallic, roughness = DEFAULT_COLOR, 0.0, 0.58
    for keys, candidate_color, candidate_metallic, candidate_roughness in COLOR_RULES:
        if any(key in name for key in keys):
            color, metallic, roughness = candidate_color, candidate_metallic, candidate_roughness
            break
    base = principled.inputs.get('Base Color')
    metal = principled.inputs.get('Metallic')
    rough = principled.inputs.get('Roughness')
    if base:
        base.default_value = color
    if metal:
        metal.default_value = metallic
    if rough:
        rough.default_value = roughness
    for input_socket in principled.inputs:
        for link in list(input_socket.links):
            material.node_tree.links.remove(link)
    for node in list(nodes):
        if node.type in {'TEX_IMAGE', 'TEX_COORD', 'MAPPING', 'NORMAL_MAP'}:
            material.node_tree.nodes.remove(node)

for obj in mesh_objects:
    obj.select_set(True)
bpy.context.view_layer.objects.active = mesh_objects[0] if mesh_objects else None
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

OUT.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=str(OUT),
    export_format='GLB',
    export_apply=True,
    export_materials='EXPORT',
    export_yup=True,
)
print(f'WROTE {OUT} {OUT.stat().st_size} bytes mesh_objects={len(mesh_objects)} decimate={DECIMATE_RATIO}')
