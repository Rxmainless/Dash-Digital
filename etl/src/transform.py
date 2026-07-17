import pandas as pd
from pathlib import Path
import json

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

BAIRROS_PORTO_DIGITAL = [
    "RECIFE",
    "SANTO ANTONIO",
    "BOA VISTA",
    "SAO JOSE",
]

CNAE_PREFIXES_TECH = ("62", "63")


def load_latest_raw() -> pd.DataFrame:
    csv_files = sorted(RAW_DIR.glob("empresas_recife_*.csv"))
    if not csv_files:
        raise FileNotFoundError(
            "Nenhum CSV bruto encontrado. Rode extract.py primeiro."
        )
    latest = csv_files[-1]
    print(f"Carregando {latest.name}...")

    return pd.read_csv(latest, sep=";", dtype=str, encoding="utf-8")


def normalizar_bairro(series: pd.Series) -> pd.Series:
    return (
        series.str.strip()
        .str.upper()
        .str.replace(r"\s+", " ", regex=True)
        .str.normalize("NFKD")
        .str.encode("ascii", errors="ignore")
        .str.decode("utf-8")
    )


def filtrar_empresas_tech(df: pd.DataFrame) -> pd.DataFrame:
    cnae_valido = df["cnae"].notna()
    is_tech_cnae = df["cnae"].astype(str).str.startswith(CNAE_PREFIXES_TECH)
    is_atividade_principal = df["atividade_principal"] == "S"

    filtro = cnae_valido & is_tech_cnae & is_atividade_principal
    return df.loc[filtro].copy()


def main():
    df = load_latest_raw()
    print(f"Total de linhas carregadas: {len(df)}")

    df_tech = filtrar_empresas_tech(df)
    print(f"Empresas com TI como atividade principal: {df_tech['cnpj'].nunique()}")

    df_tech["bairro_normalizado"] = normalizar_bairro(df_tech["nome_bairro"])
    df_tech["esta_no_polo_porto_digital"] = df_tech["bairro_normalizado"].isin(
        BAIRROS_PORTO_DIGITAL
    )

    no_polo = df_tech[df_tech["esta_no_polo_porto_digital"]]["cnpj"].nunique()
    print(f"Dessas, fisicamente nos bairros do Porto Digital: {no_polo}")

    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    output_path = PROCESSED_DIR / "empresas_tech.json"

    df_tech.to_json(output_path, orient="records", force_ascii=False, indent=2)
    print(f"Salvo em {output_path}")

if __name__ == "__main__":
    main()