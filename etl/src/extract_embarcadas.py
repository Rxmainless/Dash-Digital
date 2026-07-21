import json
import requests
from pathlib import Path
from datetime import date

SUPABASE_URL = (
    "https://pemmecmqvyeidrdisrza.supabase.co/rest/v1/"
    "public_startup_embarked_porto_list_view_random"
)
SUPABASE_ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbW1lY21xdnllaWRyZGlzcnphIiwi"
    "cm9sZSI6ImFub24iLCJpYXQiOjE3MTIwODEyMTQsImV4cCI6MjAyNzY1NzIxNH0."
    "_iCpX_E6Vk459af35wjFxnvBGvlX43y7v-y1XfOp6jM"
)

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw"

HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "accept-profile": "public",
}


def fetch_all_embarcadas(page_size: int = 500) -> list[dict]:
    all_records = []
    offset = 0

    headers_with_count = {**HEADERS, "prefer": "count=exact"}

    while True:
        params = {"select": "*", "offset": offset, "limit": page_size}
        resp = requests.get(
            SUPABASE_URL, headers=headers_with_count, params=params, timeout=30
        )
        resp.raise_for_status()

        batch = resp.json()
        all_records.extend(batch)

        content_range = resp.headers.get("content-range", "")
        total_str = content_range.split("/")[-1] if "/" in content_range else ""
        total = int(total_str) if total_str.isdigit() else None

        if total is not None:
            print(f"  Baixadas {len(all_records)} de {total} empresas...")
        else:
            print(f"  Baixadas {len(all_records)} empresas (total desconhecido)...")

        if (total is not None and len(all_records) >= total) or len(batch) < page_size:
            break

        offset += page_size

    return all_records


def limpar_snapshots_antigos(padrao: str, manter: int = 3) -> None:
    arquivos = sorted(RAW_DIR.glob(padrao))
    excedentes = arquivos[:-manter] if len(arquivos) > manter else []

    for arquivo in excedentes:
        arquivo.unlink()
        print(f"  Removido snapshot antigo: {arquivo.name}")


def main():
    print("Baixando diretorio de empresas embarcadas do Porto Digital...")
    records = fetch_all_embarcadas()

    today = date.today().isoformat()
    destination = RAW_DIR / f"embarcadas_{today}.json"
    destination.parent.mkdir(parents=True, exist_ok=True)

    with open(destination, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    print(f"Salvo em {destination} ({len(records)} empresas)")

    limpar_snapshots_antigos("embarcadas_*.json")


if __name__ == "__main__":
    main()