import pandas as pd
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from transform import filtrar_empresas_tech, normalizar_bairro


def test_filtra_cnae_de_tecnologia():
    """CNAE começando com 62 (TI) deve passar; CNAE de comércio (47) não."""
    df = pd.DataFrame({
        "cnae": ["6201500", "4753900"],
        "atividade_principal": ["S", "S"],
    })
    resultado = filtrar_empresas_tech(df)
    assert len(resultado) == 1
    assert resultado.iloc[0]["cnae"] == "6201500"


def test_ignora_atividade_nao_principal():
    df = pd.DataFrame({
        "cnae": ["6201500"],
        "atividade_principal": ["N"],
    })
    resultado = filtrar_empresas_tech(df)
    assert len(resultado) == 0


def test_deduplicacao_caso_cesar():
    df = pd.DataFrame({
        "cnpj": ["1203327000719"] * 10,
        "cnae": ["6202300"] * 10,
    })
    resultado = df.drop_duplicates(subset=["cnpj", "cnae"])
    assert len(resultado) == 1


def test_normaliza_bairro_com_espacos_multiplos():
    entrada = pd.Series(["Cohab   Ibura de Cima", "Boa Vista"])
    resultado = normalizar_bairro(entrada)
    assert resultado.iloc[0] == "COHAB IBURA DE CIMA"
    assert resultado.iloc[1] == "BOA VISTA"