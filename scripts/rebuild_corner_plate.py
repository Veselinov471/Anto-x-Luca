"""Clean glossy-corner plate from Serena/Melody, then recomposite products."""
from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "products"
BACKUP = PUBLIC / "_bg_backup"
PLATE_PATH = PUBLIC / "_studio_corner_plate.jpg"
W, H = 1200, 1600

KEEP_FOLDERS = {"serena", "melody"}
SKIP_FILES = {"melody/verde_menta.jpg"}

session = new_session("isnet-general-use")


def bag_mask(img_rgb: np.ndarray) -> np.ndarray:
    """Hard bag mask: rembg + non-white color, heavily dilated."""
    pil = Image.fromarray(img_rgb)
    cut = remove(pil, session=session).convert("RGBA")
    alpha = np.asarray(cut)[:, :, 3]
    hsv = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2HSV)

    # rembg foreground
    fg = alpha > 90
    # colored / darker product pixels (not glossy white wall)
    colored = (hsv[:, :, 1] > 28) | (hsv[:, :, 2] < 175)
    # exclude extreme top strip light-panel whites from "colored"
    colored[: int(H * 0.12), :] = False
    mask = (fg | colored).astype(np.uint8) * 255

    # Kill small speckles, then expand so no bag edge remains
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8), iterations=2)
    mask = cv2.dilate(mask, np.ones((31, 31), np.uint8), iterations=3)
    return mask


def build_plate() -> Image.Image:
    # Prefer Serena rosso as geometry base (clearest corner + light panels)
    base_path = PUBLIC / "serena" / "rosso.jpg"
    base = np.asarray(
        Image.open(base_path).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
    )
    mask = bag_mask(base)

    # Pull extra clean wall/floor patches from other corner photos (only where
    # those photos are confidently background AND base was masked).
    extras = [
        PUBLIC / "serena" / "azzurro.jpg",
        PUBLIC / "serena" / "cuoio.jpg",
        PUBLIC / "melody" / "cuoio.jpg",
        PUBLIC / "melody" / "azzurro.jpg",
        PUBLIC / "melody" / "rosso.jpg",
    ]
    filled = base.copy()
    need = mask > 0
    for path in extras:
        if not path.exists() or not need.any():
            continue
        other = np.asarray(
            Image.open(path).convert("RGB").resize((W, H), Image.Resampling.LANCZOS)
        )
        other_mask = bag_mask(other)
        usable = need & (other_mask == 0)
        filled[usable] = other[usable]
        need[usable] = False
        print(path.name, "patched", int(usable.sum()), "remaining", int(need.sum()))

    # Inpaint whatever is still missing (center under bags)
    hole = need.astype(np.uint8) * 255
    # Also force-inpaint original bag region so we don't keep any residual
    hole = cv2.bitwise_or(hole, mask)
    bgr = cv2.cvtColor(filled, cv2.COLOR_RGB2BGR)
    # Where we already patched from extras, keep those pixels: shrink hole
    keep_extra = (mask > 0) & (~need)
    hole[keep_extra] = 0

    # But still inpaint all original bag area that wasn't successfully patched
    hole2 = ((mask > 0) & need).astype(np.uint8) * 255
    # Expand a bit for blend
    hole2 = cv2.dilate(hole2, np.ones((15, 15), np.uint8), iterations=1)

    inpainted = cv2.inpaint(bgr, hole2, 22, cv2.INPAINT_TELEA)
    # Second pass NS for smoother walls
    inpainted = cv2.inpaint(inpainted, hole2, 8, cv2.INPAINT_NS)
    plate = cv2.cvtColor(inpainted, cv2.COLOR_BGR2RGB)

    # Restore unmasked real pixels exactly (sharp light panels / corner seam)
    plate = np.where(mask[:, :, None] == 0, base, plate)

    # Soft blend only at mask boundary
    edge = cv2.dilate(mask, np.ones((9, 9), np.uint8), iterations=1)
    edge = cv2.subtract(edge, cv2.erode(mask, np.ones((9, 9), np.uint8), iterations=1))
    edge_f = (edge.astype(np.float32) / 255.0)[:, :, None]
    plate = (
        plate.astype(np.float32) * (1 - edge_f * 0.35)
        + cv2.GaussianBlur(plate, (7, 7), 0).astype(np.float32) * (edge_f * 0.35)
    ).astype(np.uint8)

    # Desaturate center fill slightly so no color bleed from red bag
    hsv = cv2.cvtColor(plate, cv2.COLOR_RGB2HSV).astype(np.float32)
    center = np.zeros((H, W), dtype=np.float32)
    cv2.ellipse(
        center,
        (W // 2, int(H * 0.52)),
        (int(W * 0.28), int(H * 0.32)),
        0,
        0,
        360,
        1.0,
        -1,
    )
    center = cv2.GaussianBlur(center, (81, 81), 0)
    hsv[:, :, 1] = hsv[:, :, 1] * (1 - 0.85 * center)
    # Lift midtones in filled region toward clean white wall
    hsv[:, :, 2] = np.clip(hsv[:, :, 2] + 8 * center, 0, 255)
    plate = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB)

    out = Image.fromarray(plate)
    out.save(PLATE_PATH, quality=95, optimize=True)
    print("saved plate", PLATE_PATH)
    return out


def soft_shadow(cut_layer: Image.Image) -> Image.Image:
    a = np.asarray(cut_layer.split()[-1])
    ys, xs = np.where(a > 40)
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if len(ys) == 0:
        return shadow
    y1 = int(ys.max())
    x0, x1 = int(xs.min()), int(xs.max())
    cx = (x0 + x1) / 2
    bw = max(40, int((x1 - x0) * 0.70))
    bh = max(14, int((y1 - ys.min()) * 0.07))
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.ellipse(
        [cx - bw * 0.5, y1 - bh * 0.25, cx + bw * 0.5, y1 + bh * 0.7],
        fill=(25, 25, 25, 95),
    )
    draw.ellipse(
        [cx - bw * 0.95, y1 - bh * 0.1, cx + bw * 0.95, y1 + bh * 1.5],
        fill=(35, 35, 35, 40),
    )
    return overlay.filter(ImageFilter.GaussianBlur(radius=12))


def clean_cutout(raw: Image.Image) -> Image.Image:
    """Remove BG and strip leftover white props / boards under bag."""
    cut = remove(raw, session=session).convert("RGBA")
    arr = np.asarray(cut).copy()
    rgb = arr[:, :, :3]
    a = arr[:, :, 3]
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)

    # Drop near-white / near-transparent fringe that rembg often leaves (boards, props)
    near_white = (hsv[:, :, 1] < 28) & (hsv[:, :, 2] > 210) & (a > 0)
    # Keep white only if surrounded by strong product (handles may be pale)
    # Remove white blobs in lower 35% that look like stacked boards
    lower = np.zeros_like(a, dtype=bool)
    lower[int(H * 0.62) :, :] = True
    # For images not yet resized to W,H — use cut size
    h, w = a.shape
    lower = np.zeros((h, w), dtype=bool)
    lower[int(h * 0.58) :, :] = True
    drop = near_white & lower
    # Also drop very low-alpha fringe
    drop |= (a > 0) & (a < 40)

    a = a.copy()
    a[drop] = 0
    arr[:, :, 3] = a

    # Crop to opaque content
    ys, xs = np.where(a > 30)
    if len(ys) == 0:
        return Image.fromarray(arr)
    pad = 8
    y0, y1 = max(0, ys.min() - pad), min(h, ys.max() + pad)
    x0, x1 = max(0, xs.min() - pad), min(w, xs.max() + pad)
    return Image.fromarray(arr[y0:y1, x0:x1])


def place_cutout(cut: Image.Image, plate: Image.Image) -> Image.Image:
    cut = cut.convert("RGBA")
    cw, ch = cut.size
    target_h = int(H * 0.70)
    scale = target_h / ch
    nw, nh = max(1, int(cw * scale)), max(1, int(ch * scale))
    if nw > int(W * 0.86):
        scale = (W * 0.86) / cw
        nw, nh = max(1, int(cw * scale)), max(1, int(ch * scale))
    cut_r = cut.resize((nw, nh), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    x = (W - nw) // 2
    y = int(H * 0.55 - nh * 0.55)
    y = max(int(H * 0.10), min(y, H - nh - int(H * 0.07)))
    canvas.paste(cut_r, (x, y), cut_r)

    bg = plate.convert("RGBA")
    out = Image.alpha_composite(bg, soft_shadow(canvas))
    out = Image.alpha_composite(out, canvas)
    return out.convert("RGB")


def backup_path(rel: Path) -> Path:
    return BACKUP / f"{rel.parent.name}__{rel.name}"


def process_all(plate: Image.Image) -> None:
    BACKUP.mkdir(parents=True, exist_ok=True)
    done = 0
    for folder in sorted(p for p in PUBLIC.iterdir() if p.is_dir() and not p.name.startswith("_")):
        if folder.name in KEEP_FOLDERS:
            continue
        for img_path in sorted(folder.glob("*.jpg")):
            rel = img_path.relative_to(PUBLIC)
            if str(rel).replace("\\", "/") in SKIP_FILES:
                print("skip", rel)
                continue
            src = backup_path(rel)
            if not src.exists():
                Image.open(img_path).save(src, quality=95)
                print("backed up", rel)
            raw = Image.open(src).convert("RGB")
            cut = clean_cutout(raw)
            out = place_cutout(cut, plate)
            out.save(img_path, quality=92, optimize=True)
            done += 1
            print("ok", rel)
    print("composited", done)


if __name__ == "__main__":
    plate = build_plate()
    process_all(plate)
