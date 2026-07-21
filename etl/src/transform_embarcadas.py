import json
import pandas as pd
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

COLUNAS_OBRIGATORIAS = ["id", "name", "primary_area", "company_type"]


def load_latest_raw_embarcadas() -> pd.DataFrame:
    json_files = sorted(RAW_DIR.glob("embarcadas_*.json"))
    if not json_files:
        raise FileNotFoundError(
            "Nenhum JSON de embarcadas encontrado. Rode extract_embarcadas.py primeiro."
        )
    latest = json_files[-1]
    print(f"Carregando {latest.name}...")

    with open(latest, encoding="utf-8") as f:
        records = json.load(f)

    return pd.DataFrame(records)


def validar_schema(df: pd.DataFrame) -> None:
    faltando = [col for col in COLUNAS_OBRIGATORIAS if col not in df.columns]
    if faltando:
        raise ValueError(
            f"Schema do diretório de embarcadas mudou. Colunas ausentes: {faltando}. "
            f"Colunas disponíveis: {list(df.columns)}"
        )


def limpar_registros(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df = df[df["name"].notna() & (df["name"].str.strip() != "")]

    df["company_type"] = df["company_type"].fillna("Não informado")
    df["primary_area"] = df["primary_area"].fillna("Não informado")
    df["description"] = df.get("description", pd.Series(dtype=str)).fillna("")

    return df


def agregar_por_area(df: pd.DataFrame) -> pd.DataFrame:
    return (
        df.groupby("primary_area")["id"]
        .nunique()
        .sort_values(ascending=False)
        .reset_index(name="total_empresas")
    )


def salvar_json(df: pd.DataFrame, filename: str) -> Path:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    output_path = PROCESSED_DIR / filename
    df.to_json(output_path, orient="records", force_ascii=False, indent=2)
    print(f"Salvo em {output_path}")
    return output_path


def main() -> None:
    df_raw = load_latest_raw_embarcadas()
    print(f"Total de registros carregados: {len(df_raw)}")

    validar_schema(df_raw)

    df_limpo = limpar_registros(df_raw)
    print(f"Registros válidos após limpeza: {len(df_limpo)}")

    stats_area = agregar_por_area(df_limpo)
    print(f"Áreas de atuação distintas: {len(stats_area)}")

    salvar_json(df_limpo, "embarcadas.json")
    salvar_json(stats_area, "stats_por_area.json")


if __name__ == "__main__":
    main()