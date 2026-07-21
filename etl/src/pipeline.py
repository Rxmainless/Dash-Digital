import shutil
from pathlib import Path

import extract
import extract_embarcadas
import transform
import transform_embarcadas

PROJECT_ROOT = Path(__file__).resolve().parents[2]
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
FRONTEND_DATA_DIR = PROJECT_ROOT / "frontend" / "public" / "data"

FILES_TO_SYNC = [
    "empresas_tech.json",
    "stats_por_bairro.json",
    "hero_stats.json",
    "embarcadas.json",
    "stats_por_area.json",
]


def sync_to_frontend() -> None:
    FRONTEND_DATA_DIR.mkdir(parents=True, exist_ok=True)

    for filename in FILES_TO_SYNC:
        source = PROCESSED_DIR / filename
        if not source.exists():
            print(f"  [aviso] {filename} não encontrado em data/processed/ — pulando.")
            continue

        destination = FRONTEND_DATA_DIR / filename
        shutil.copy2(source, destination)
        print(f"  copiado: {filename}")


def main() -> None:
    print("=== 1/5: Extraindo dados de empresas (Prefeitura) ===")
    extract.main()

    print("\n=== 2/5: Extraindo dados de embarcadas (Porto Digital) ===")
    extract_embarcadas.main()

    print("\n=== 3/5: Transformando dados de empresas ===")
    transform.main()

    print("\n=== 4/5: Transformando dados de embarcadas ===")
    transform_embarcadas.main()

    print("\n=== 5/5: Sincronizando com o frontend ===")
    sync_to_frontend()

    print("\nPipeline concluído.")


if __name__ == "__main__":
    main()