import requests
from pathlib import Path
from datetime import date

CKAN_BASE_URL = "https://dados.recife.pe.gov.br/api/3"
RESOURCE_ID = "6d5e72aa-3f4b-4dc3-817c-0e0305cef538" 

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw"


def get_resource_download_url(resource_id: str) -> str:
    resp = requests.get(
        f"{CKAN_BASE_URL}/action/resource_show",
        params={"id": resource_id},
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()

    if not data.get("success"):
        raise RuntimeError(f"CKAN retornou erro: {data}")

    return data["result"]["url"]


def download_csv(url: str, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)

    with requests.get(url, stream=True, timeout=120) as resp:
        resp.raise_for_status()
        with open(destination, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)


def main():
    print("Consultando URL atual do recurso no CKAN...")
    csv_url = get_resource_download_url(RESOURCE_ID)
    print(f"URL encontrada: {csv_url}")

    today = date.today().isoformat()
    destination = RAW_DIR / f"empresas_recife_{today}.csv"

    print(f"Baixando para {destination}...")
    download_csv(csv_url, destination)
    print("Download concluído.")


if __name__ == "__main__":
    main()