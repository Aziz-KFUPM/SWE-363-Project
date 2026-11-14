# Converts a Claude Code session transcript (.jsonl) into a readable Markdown file.
# Usage: python3 export_conversation.py <session.jsonl> <output.md>
# Re-run this after the final session so the export covers the whole conversation.
import json, sys

src, dst = sys.argv[1], sys.argv[2]
lines = []

def block_text(b):
    t = b.get("type")
    if t == "text":
        return b.get("text", "")
    if t == "thinking":
        return "*(assistant reasoning)*\n\n" + b.get("thinking", "") if b.get("thinking") else ""
    if t == "tool_use":
        inp = json.dumps(b.get("input", {}), indent=2, ensure_ascii=False)
        return f"**Tool call: {b.get('name')}**\n\n```json\n{inp}\n```"
    if t == "tool_result":
        c = b.get("content", "")
        if isinstance(c, list):
            parts = []
            for x in c:
                if x.get("type") == "text":
                    parts.append(x.get("text", ""))
                elif x.get("type") == "image":
                    parts.append("[image data omitted here, present in the .jsonl file]")
            c = "\n".join(parts)
        return f"**Tool result**\n\n```\n{c}\n```"
    if t == "image":
        return "[image data omitted here, present in the .jsonl file]"
    return ""

for raw in open(src, encoding="utf8"):
    raw = raw.strip()
    if not raw:
        continue
    try:
        rec = json.loads(raw)
    except json.JSONDecodeError:
        continue
    msg = rec.get("message")
    if not msg or rec.get("type") not in ("user", "assistant"):
        continue
    role = "User" if msg.get("role") == "user" else "Assistant (Claude Code)"
    content = msg.get("content", "")
    if isinstance(content, str):
        body = content
    else:
        body = "\n\n".join(filter(None, (block_text(b) for b in content)))
    if not body.strip():
        continue
    lines.append(f"## {role} — {rec.get('timestamp', '')}\n\n{body}\n")

with open(dst, "w", encoding="utf8") as f:
    f.write("# Claude Code conversation export (complete, unedited text)\n\n")
    f.write(f"Source transcript: `{src.split('/')[-1]}`. Tool inputs and outputs are included verbatim; only binary image data is omitted (it is in the .jsonl).\n\n")
    f.write("\n".join(lines))
print(f"wrote {dst} with {len(lines)} messages")
