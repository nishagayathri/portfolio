import json
import sys

def main() -> None:
    path = sys.argv[1]
    out_path = sys.argv[2]
    with open(path, encoding="utf-8") as f:
        for line in f:
            o = json.loads(line)
            if o.get("role") != "user":
                continue
            parts = o.get("message", {}).get("content", [])
            if not parts or parts[0].get("type") != "text":
                continue
            text = parts[0].get("text", "")
            if "291 467" not in text:
                continue
            i = text.find("<svg")
            if i < 0:
                continue
            j = text.find("</svg>", i)
            if j < 0:
                continue
            svg = text[i : j + len("</svg>")]
            svg = svg.replace(
                ' class="w-[200px] h-[250px] md:w-[300px] md:h-[450px]"',
                "",
            )
            with open(out_path, "w", encoding="utf-8") as out:
                out.write(svg)
            print("Wrote", out_path, "bytes", len(svg))
            return
    raise SystemExit("SVG not found")


if __name__ == "__main__":
    main()
