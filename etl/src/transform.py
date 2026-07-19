import pandas as pd
from pathlib import Path

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


def remover_duplicatas(df: pd.DataFrame) -> pd.DataFrame:
    antes = len(df)
    df_limpo = df.drop_duplicates(subset=["cnpj", "cnae"])
    print(f"Linhas duplicadas removidas: {antes - len(df_limpo)}")
    return df_limpo


def marcar_polo_porto_digital(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["bairro_normalizado"] = normalizar_bairro(df["nome_bairro"])
    df["esta_no_polo_porto_digital"] = df["bairro_normalizado"].isin(
        BAIRROS_PORTO_DIGITAL
    )
    return df


def agregar_por_bairro(df: pd.DataFrame) -> pd.DataFrame:
    df_polo = df[df["esta_no_polo_porto_digital"]]
    return (
        df_polo.groupby("bairro_normalizado")["cnpj"]
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
    df_raw = load_latest_raw()
    print(f"Total de linhas carregadas: {len(df_raw)}")

    df_tech = filtrar_empresas_tech(df_raw)
    df_tech = remover_duplicatas(df_tech)
    print(f"Empresas com TI como atividade principal: {df_tech['cnpj'].nunique()}")

    df_tech = marcar_polo_porto_digital(df_tech)
    no_polo = df_tech[df_tech["esta_no_polo_porto_digital"]]["cnpj"].nunique()
    print(f"Dessas, fisicamente nos bairros do Porto Digital: {no_polo}")

    stats_bairro = agregar_por_bairro(df_tech)

    salvar_json(df_tech, "empresas_tech.json")
    salvar_json(stats_bairro, "stats_por_bairro.json")


if __name__ == "__main__":
    main()