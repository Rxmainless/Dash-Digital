import pandas as pd
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from transform import (
    filtrar_empresas_tech,
    normalizar_bairro,
    marcar_polo_porto_digital,
    agregar_por_bairro,
    remover_duplicatas,
)


def test_filtra_cnae_de_tecnologia():
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


def test_marcar_polo_identifica_bairro_correto():
    df = pd.DataFrame({
        "nome_bairro": ["Recife", "Boa Viagem"],
    })
    resultado = marcar_polo_porto_digital(df)
    assert resultado.iloc[0]["esta_no_polo_porto_digital"] == True
    assert resultado.iloc[1]["esta_no_polo_porto_digital"] == False


def test_agregar_por_bairro_conta_cnpj_unico():
    df = pd.DataFrame({
        "cnpj": ["111", "111", "222"],
        "bairro_normalizado": ["RECIFE", "RECIFE", "RECIFE"],
        "esta_no_polo_porto_digital": [True, True, True],
    })
    resultado = agregar_por_bairro(df)
    assert resultado.iloc[0]["total_empresas"] == 2


def test_agregar_por_bairro_ignora_fora_do_polo():
    df = pd.DataFrame({
        "cnpj": ["111", "222"],
        "bairro_normalizado": ["RECIFE", "BOA VIAGEM"],
        "esta_no_polo_porto_digital": [True, False],
    })
    resultado = agregar_por_bairro(df)
    assert len(resultado) == 1
    assert resultado.iloc[0]["bairro_normalizado"] == "RECIFE"


def test_remover_duplicatas_preserva_atividades_diferentes():
    df = pd.DataFrame({
        "cnpj": ["111", "111"],
        "cnae": ["6201500", "6202300"],
    })
    resultado = remover_duplicatas(df)
    assert len(resultado) == 2