"""Kanal postlarini t.me/<kanal>/<id>?embed=1 sahifalaridan birma-bir yig'ib data/posts.json ga yozadi.
(Kanalning t.me/s/ umumiy ko'rinishi yopiq bo'lgani uchun.)"""
import json, re, html, urllib.request, urllib.error, os, datetime, time

CH = "yol_muhandis"
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "posts.json")
MISS_LIMIT = 25      # ketma-ket shuncha bo'sh id dan keyin to'xtaydi
MAX_PROBE = 400


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (site-bot)"})
    try:
        return urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")
    except urllib.error.HTTPError:
        return ""


def clean(fragment):
    t = re.sub(r"<br\s*/?>", "\n", fragment)
    t = re.sub(r"<[^>]+>", "", t)
    return html.unescape(t).strip()


def fetch(pid):
    page = get(f"https://t.me/{CH}/{pid}?embed=1&mode=tme")
    if not page or "tgme_widget_message_error" in page or "tgme_widget_message " not in page and "tgme_widget_message_bubble" not in page:
        return None
    tx = re.search(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', page, re.S)
    dt = re.search(r'<time[^>]*datetime="([^"]+)"', page)
    ph = re.search(r"tgme_widget_message_photo_wrap[^>]*background-image:url\('([^']+)'\)", page)
    vth = re.search(r"tgme_widget_message_video_thumb[^>]*background-image:url\('([^']+)'\)", page)
    vd = "tgme_widget_message_video" in page
    poll = re.search(r'<div class="tgme_widget_message_poll_question">(.*?)</div>', page, re.S)
    text = clean(tx.group(1)) if tx else (("📊 " + clean(poll.group(1))) if poll else "")
    text = re.split(r"\n━{5,}", text)[0].strip()
    photo = (ph or vth).group(1) if (ph or vth) else None
    return dict(id=pid, date=dt.group(1) if dt else None, text=text, photo=photo, video=vd)


def main():
    try:
        old = json.load(open(OUT))
    except Exception:
        old = {"posts": []}
    seen = {p["id"]: p for p in old.get("posts", [])}
    start = max(seen) + 1 if seen else 1
    # oxirgi 5 ta postni ham qayta tekshiramiz (tahrirlangan bo'lishi mumkin)
    for pid in sorted(seen)[-5:]:
        p = fetch(pid)
        if p:
            seen[pid] = p
    miss, pid = 0, start
    while miss < MISS_LIMIT and pid < start + MAX_PROBE:
        p = fetch(pid)
        if p and (p["text"] or p["photo"]):
            seen[pid] = p
            miss = 0
        else:
            miss += 1
        pid += 1
        time.sleep(0.3)
    posts = sorted(seen.values(), key=lambda p: p["id"], reverse=True)[:300]
    data = {"updated": datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z", "posts": posts}
    json.dump(data, open(OUT, "w"), ensure_ascii=False, indent=1)
    print("postlar:", len(posts), "oxirgi id:", posts[0]["id"] if posts else None)


main()
