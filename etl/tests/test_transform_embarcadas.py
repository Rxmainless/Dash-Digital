import pandas as pd
import pytest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from transform_embarcadas import (
    validar_schema,
    limpar_registros,
    agregar_por_area,
)


def test_validar_schema_aceita_colunas_corretas():
    df = pd.DataFrame({
        "id": [1],
        "name": ["Empresa X"],
        "primary_area": ["Comunicação"],
        "company_type": ["Startup"],
    })
    validar_schema(df)


def test_validar_schema_rejeita_coluna_faltando():
    df = pd.DataFrame({
        "id": [1],
        "name": ["Empresa X"],
    })
    with pytest.raises(ValueError, match="Schema do diretório de embarcadas mudou"):
        validar_schema(df)


def test_limpar_registros_preenche_company_type_nulo():
    df = pd.DataFrame({
        "id": [1],
        "name": ["Empresa X"],
        "primary_area": ["Comunicação"],
        "company_type": [None],
    })
    resultado = limpar_registros(df)
    assert len(resultado) == 1
    assert resultado.iloc[0]["company_type"] == "Não informado"


def test_limpar_registros_descarta_sem_nome():
    df = pd.DataFrame({
        "id": [1, 2],
        "name": ["Empresa X", ""],
        "primary_area": ["Comunicação", "Comunicação"],
        "company_type": ["Startup", "Startup"],
    })
    resultado = limpar_registros(df)
    assert len(resultado) == 1
    assert resultado.iloc[0]["name"] == "Empresa X"


def test_agregar_por_area_conta_id_unico():
    df = pd.DataFrame({
        "id": [1, 2, 3],
        "primary_area": ["Comunicação", "Comunicação", "Saúde Humana"],
    })
    resultado = agregar_por_area(df)

    comunicacao = resultado[resultado["primary_area"] == "Comunicação"]
    assert comunicacao.iloc[0]["total_empresas"] == 2