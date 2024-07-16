document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("formularioProcesso");
    const perguntaInput = document.querySelector("#orgao");
    const siglaInput = document.querySelector("#sigla");
    const categoriaInput = document.querySelector("#categoria");
    const subcategoriaInput = document.querySelector("#subcategoria");
    const responsavelInput = document.querySelector("#responsavel");
    const superiorInput = document.querySelector("#superior");
    const setorInput = document.querySelector("#setor");
    const nomeProcessoInput = document.querySelector("#nomeProcesso");
    const objetivoProcessoInput = document.querySelector("#objetivoProcesso");
    const camposAdicionais = document.getElementById("camposAdicionais");

    let orgaos = {};

    function atualizarCampos(orgaoSelecionado) {
        const orgao = orgaos[orgaoSelecionado];
        if (orgao) {
            siglaInput.value = orgao.sigla;
            categoriaInput.value = orgao.categoria;
            subcategoriaInput.value = orgao.subcategoria;
            camposAdicionais.style.display = "block";
        } else {
            camposAdicionais.style.display = "none";
            siglaInput.value = "";
            categoriaInput.value = "";
            subcategoriaInput.value = "";
        }
    }

    perguntaInput.addEventListener("input", function() {
        atualizarCampos(perguntaInput.value);
    });

    formulario.addEventListener("submit", function(event) {
        event.preventDefault(); 
        if (formulario.checkValidity()) {
            salvarDadosFormularioComoPlanilha();
            window.location.href = 'mapeamento.html'; 
        } else {
            formulario.reportValidity(); 
        }
    });

    function salvarDadosFormularioComoPlanilha() {
        const dados = [
            {
                Responsável: responsavelInput.value,
                Superior: superiorInput.value,
                Órgão: perguntaInput.value,
                Sigla: siglaInput.value,
                Categoria: categoriaInput.value,
                Subcategoria: subcategoriaInput.value,
                Setor: setorInput.value,
                Nome_do_Processo: nomeProcessoInput.value,
                Objetivo_do_Processo: objetivoProcessoInput.value
            }
        ];

        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
        XLSX.writeFile(workbook, "Dados_Formulario.xlsx");
    }

    fetch('../js/orgaos.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar os dados dos órgãos: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const datalist = document.getElementById('orgaos');
        const inputOrgao = document.getElementById('orgao');
        const camposAdicionais = document.getElementById('camposAdicionais');

        datalist.innerHTML = ''; 

        for (let orgao in data) {
            const option = document.createElement('option');
            option.value = orgao; 
            datalist.appendChild(option);
        }

        inputOrgao.addEventListener('input', () => {
            const selectedOrgao = data[inputOrgao.value];
            if (selectedOrgao) {
                document.getElementById('sigla').value = selectedOrgao.sigla;
                document.getElementById('subcategoria').value = selectedOrgao.subcategoria;
                document.getElementById('categoria').value = selectedOrgao.categoria;
                camposAdicionais.style.display = 'block';
            } else {
                camposAdicionais.style.display = 'none';
            }
        });
    })
    .catch(error => console.error('Erro ao carregar os dados dos órgãos:', error));

});
