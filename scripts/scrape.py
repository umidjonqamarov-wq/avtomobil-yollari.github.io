"""t.me/s/yol_muhandis ochiq sahifasidan postlarni yig'ib data/posts.json ga yozadi."""
import json, re, html, urllib.request, os, datetime

CH = "yol_muhandis"
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "posts.json")


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (site-bot)"})
    return urllib.request.urlopen(req, timeout=40).read().decode("utf-8", "replace")


def clean(fragment):
    t = re.sub(r"<br\s*/?>", "\n", fragment)
    t = re.sub(r"<[^>]+>", "", t)
    return html.unescape(t).strip()


def parse(page):
    out = []
    for block in re.split(r'(?=<div class="tgme_widget_message_wrap)', page)[1:]:
        m = re.search(r'data-post="%s/(\d+)"' % CH, block)
        if not m:
            continue
        pid = int(m.group(1))
        tx = re.search(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', block, re.S)
        dt = re.search(r'<time[^>]*datetime="([^"]+)"', block)
        ph = re.search(r"tgme_widget_message_photo_wrap[^>]*background-image:url\('([^']+)'\)", block)
        vd = "tgme_widget_message_video" in block
        text = clean(tx.group(1)) if tx else ""
        # kanal footerini olib tashlash
        text = re.split(r"\n━{5,}", text)[0].strip()
        if not text and not ph:
            continue
        out.append(dict(id=pid, date=dt.group(1) if dt else None, text=text,
                        photo=ph.group(1) if ph else None, video=vd))
    return out


def main():
    try:
        old = json.load(open(OUT))
    except Exception:
        old = {"posts": []}
    seen = {p["id"]: p for p in old.get("posts", [])}
    url, pages = f"https://t.me/s/{CH}", 0
    while url and pages < 8:
        page = get(url)
        items = parse(page)
        new = [p for p in items if p["id"] not in seen]
        for p in items:
            seen[p["id"]] = p  # matn tahrir qilingan bo'lsa yangilanadi
        pages += 1
        if not items or (not new and pages > 1):
            break
        url = f"https://t.me/s/{CH}?before={min(p['id'] for p in items)}"
    posts = sorted(seen.values(), key=lambda p: p["id"], reverse=True)[:300]
    if not posts and old.get("posts"):
        raise SystemExit("Postlar topilmadi — sahifa tuzilishi o'zgargan bo'lishi mumkin")
    data = {"updated": datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z", "posts": posts}
    json.dump(data, open(OUT, "w"), ensure_ascii=False, indent=1)
    print("postlar:", len(posts))


main()
