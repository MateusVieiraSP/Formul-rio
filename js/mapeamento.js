let etapas = JSON.parse(sessionStorage.getItem('etapas')) || [];
let editIndex = null;
let etapaCounter = etapas.filter(etapa => etapa.type === 'etapa').length;
let subetapaCounter = etapas.filter(etapa => etapa.type === 'subetapa').length;

document.addEventListener('DOMContentLoaded', function() {
    const adicionarOpcaoButton = document.getElementById('btnAdicionarOpcao');
    if (adicionarOpcaoButton) {
        adicionarOpcaoButton.addEventListener('click', adicionarOpcao);
    }

    const processForm = document.getElementById('processForm');
    if (processForm) {
        processForm.onsubmit = function(event) {
            event.preventDefault();
            addEtapa();
        };
    }

    if (document.getElementById('tree-view')) {
        updateTreeView();
    }

    if (window.location.pathname.includes("mapeamento.html")) {
        resetFormToAdding();
    }

    if (window.location.pathname.includes("mapeamento.html")) {
        const indexToEdit = sessionStorage.getItem('editIndex');
        if (indexToEdit !== null) {
            editEtapa(parseInt(indexToEdit));
            sessionStorage.removeItem('editIndex');
        }
    }
});

function goToForm() {
    const formSection = document.getElementById('form-section');
    if (formSection) {
        formSection.style.display = 'block';
    }
    const treeSection = document.getElementById('tree-section');
    if (treeSection) {
        treeSection.style.display = 'none';
    }
}

function goToFormPage() {
    window.location.href = "mapeamento.html";
}

function validateForm() {
    let isValid = true;
    ['etapa', 'objetivo', 'pessoais', 'comunicacao', 'taxonomia', 'informacionais'].forEach(id => {
        if (document.getElementById(id).value.trim() === '') {
            isValid = false;
            showFeedback(`Erro: O campo ${id} é obrigatório.`, 'error');
        }
    });
    return isValid;
}

function addEtapa() {
    if (!validateForm()) return;
    etapaCounter++;
    saveCurrentData('etapa', etapaCounter);
    clearForm();
    updateTreeView();
    showFeedback('Etapa adicionada com sucesso!', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Adiciona a rolagem suave ao topo
}

function addSubetapa() {
    if (!validateForm()) return;
    subetapaCounter++;
    saveCurrentData('subetapa', subetapaCounter);
    clearForm();
    updateTreeView();
    showFeedback('Subetapa adicionada com sucesso!', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Adiciona a rolagem suave ao topo
}

function saveCurrentData(type, counter) {
    let formData = {
        type: type,
        number: counter,
        etapa: document.getElementById('etapa').value,
        objetivo: document.getElementById('objetivo').value,
        recursos: getRecursosHumanos(),
        pessoais: document.getElementById('pessoais').value,
        fisicos: getCheckedValues('divRecursosFisicos'),
        tecnologicos: getCheckedValues('divRecursosTecnologicos'),
        comunicacao: document.getElementById('comunicacao').value,
        taxonomia: document.getElementById('taxonomia').value,
        informacionais: document.getElementById('informacionais').value
    };
    console.log('Salvando dados: ', formData); // Log para verificar os dados
    etapas.push(formData);
    sessionStorage.setItem('etapas', JSON.stringify(etapas));
}

function clearForm() {
    const processForm = document.getElementById('processForm');
    if (processForm) {
        processForm.reset();
        document.getElementById('selecoes').innerHTML = '';
    }
}

function updateTreeView() {
    let treeView = document.getElementById('tree-view');
    if (treeView) {
        treeView.innerHTML = '';
        etapas.forEach((etapa, index) => {
            let node = document.createElement('div');
            node.className = 'tree-node';

            let etapaName = etapa.type === 'etapa' ? `Etapa ${etapa.number}` : `Subetapa ${etapa.number}`;
            node.innerHTML = `<div>${etapaName}
                              <button onclick="editEtapa(${index})">Editar</button></div>`;
            treeView.appendChild(node);
        });
    }
}

function editEtapa(index) {
    if (window.location.pathname.includes("mapeamento.html")) {
        let etapa = etapas[index];
        document.getElementById('etapa').value = etapa.etapa;
        document.getElementById('objetivo').value = etapa.objetivo;
        setRecursosHumanos(etapa.recursos);
        document.getElementById('pessoais').value = etapa.pessoais;
        setCheckedValues('divRecursosFisicos', etapa.fisicos);
        setCheckedValues('divRecursosTecnologicos', etapa.tecnologicos);
        document.getElementById('comunicacao').value = etapa.comunicacao;
        document.getElementById('taxonomia').value = etapa.taxonomia;
        document.getElementById('informacionais').value = etapa.informacionais;
        
        // Exibir botões de salvar e cancelar, esconder botões de criar
        const saveChangesButton = document.getElementById('saveChangesButton');
        const cancelChangesButton = document.getElementById('cancelChangesButton');
        const createEtapaButton = document.getElementById('createEtapaButton');
        const createSubetapaButton = document.getElementById('createSubetapaButton');
        const encerrarFormularioButton = document.getElementById('encerrarFormularioButton');
        const editIndicator = document.getElementById('edit-indicator');

        if (saveChangesButton) saveChangesButton.style.display = 'inline-block';
        if (cancelChangesButton) cancelChangesButton.style.display = 'inline-block';
        if (createEtapaButton) createEtapaButton.style.display = 'none';
        if (createSubetapaButton) createSubetapaButton.style.display = 'none';
        if (encerrarFormularioButton) encerrarFormularioButton.style.display = 'none';
        
        if (editIndicator) {
            editIndicator.textContent = `Editando ${etapa.type === 'etapa' ? 'Etapa' : 'Subetapa'} ${etapa.number}`;
            editIndicator.style.display = 'block';
        }

        editIndex = index;
        goToForm();
    } else {
        sessionStorage.setItem('editIndex', index);
        window.location.href = 'mapeamento.html';
    }
}

function updateEtapa(index) {
    if (!validateForm()) return;
    let etapa = {
        type: etapas[index].type,
        number: etapas[index].number, // Certifique-se de que o número seja preservado
        etapa: document.getElementById('etapa').value,
        objetivo: document.getElementById('objetivo').value,
        recursos: getRecursosHumanos(),
        pessoais: document.getElementById('pessoais').value,
        fisicos: getCheckedValues('divRecursosFisicos'),
        tecnologicos: getCheckedValues('divRecursosTecnologicos'),
        comunicacao: document.getElementById('comunicacao').value,
        taxonomia: document.getElementById('taxonomia').value,
        informacionais: document.getElementById('informacionais').value
    };

    console.log('Atualizando dados: ', etapa); // Log para verificar os dados
    etapas[index] = etapa;
    sessionStorage.setItem('etapas', JSON.stringify(etapas));
    window.location.href = 'view.html'; // Redirecionar após salvar
    showFeedback('Etapa alterada com sucesso!', 'success');
    editIndex = null;
}

function saveChanges() {
    if (editIndex !== null) {
        updateEtapa(editIndex);
    }
}

function cancelChanges() {
    resetFormToAdding();
    window.location.href = 'view.html';
}

function resetFormToAdding() {
    clearForm();
    const processForm = document.getElementById('processForm');
    const saveChangesButton = document.getElementById('saveChangesButton');
    const cancelChangesButton = document.getElementById('cancelChangesButton');
    const createEtapaButton = document.getElementById('createEtapaButton');
    const createSubetapaButton = document.getElementById('createSubetapaButton');
    const encerrarFormularioButton = document.getElementById('encerrarFormularioButton');
    const editIndicator = document.getElementById('edit-indicator');

    if (processForm) {
        processForm.onsubmit = function(event) {
            event.preventDefault();
            addEtapa();
        };
    }
    
    if (saveChangesButton) saveChangesButton.style.display = 'none';
    if (cancelChangesButton) cancelChangesButton.style.display = 'none';
    if (createEtapaButton) createEtapaButton.style.display = 'inline-block';
    if (createSubetapaButton) createSubetapaButton.style.display = 'inline-block';
    if (encerrarFormularioButton) encerrarFormularioButton.style.display = 'inline-block';
    
    if (editIndicator) {
        editIndicator.style.display = 'none';
        editIndicator.textContent = '';
    }
}

function encerrarFormulario() {
    window.location.href = 'view.html';
    showFeedback('Formulário encerrado com sucesso!', 'success');
}

function showFeedback(message, type) {
    let feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = type;
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.textContent = '';
        feedback.className = '';
        feedback.style.display = 'none';
    }, 3000);
}

function getCheckedValues(containerId) {
    let container = document.getElementById(containerId);
    let checkboxes = container.querySelectorAll('input[type="checkbox"]');
    let checkedValues = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkedValues.push(checkbox.name);
        }
    });
    return checkedValues.join('; ');
}

function setCheckedValues(containerId, values) {
    let container = document.getElementById(containerId);
    let checkboxes = container.querySelectorAll('input[type="checkbox"]');
    let valuesArray = values.split('; ');
    checkboxes.forEach(checkbox => {
        checkbox.checked = valuesArray.includes(checkbox.name);
    });
}

function getRecursosHumanos() {
    let selecoesDiv = document.getElementById('selecoes');
    let divs = selecoesDiv.querySelectorAll('[data-value]');
    let recursos = [];
    divs.forEach(div => {
        let quantidade = div.querySelector('.quantidade-input').value;
        recursos.push(`${div.getAttribute('data-value')}: ${quantidade}`);
    });
    return recursos.join('; ');
}

function setRecursosHumanos(recursos) {
    let selecoesDiv = document.getElementById('selecoes');
    selecoesDiv.innerHTML = '';
    if (recursos) {
        recursos.split('; ').forEach(recurso => {
            let [nome, quantidade] = recurso.split(': ');
            var div = document.createElement('div');
            div.setAttribute('data-value', nome.trim());
            div.innerHTML = `
                <label>${nome.trim()}: </label>
                <input type="number" class="quantidade-input" name="${nome.trim()}" placeholder="Quantidade" value="${quantidade.trim()}" min="1">
                <button type="button" class="btn-remover-quantidade" onclick="removerOpcao(this)">Remover</button>
            `;
            selecoesDiv.appendChild(div);
        });
    }
}

function adicionarOpcao() {
    var input = document.getElementById('inputRecursosHumanos');
    var selecoesDiv = document.getElementById('selecoes');
    var opcao = input.value.trim();

    if (opcao && !document.querySelector(`[data-value="${opcao}"]`)) {
        var div = document.createElement('div');
        div.setAttribute('data-value', opcao);
        div.innerHTML = `
            <label>${opcao}: </label>
            <input type="number" class="quantidade-input" name="${opcao}" placeholder="Quantidade" min="1">
            <button type="button" class="btn-remover-quantidade" onclick="removerOpcao(this)">Remover</button>
        `;
        selecoesDiv.appendChild(div);
    } else {
        alert('Por favor, insira um recurso válido e não repetido.');
    }
    input.value = '';
}

window.removerOpcao = function(button) {
    var div = button.parentNode;
    div.parentNode.removeChild(div);
};

function addBackToFormButton() {
    let treeSection = document.getElementById('tree-section');
    if (treeSection) {
        let backButton = document.createElement('button');
        backButton.textContent = 'Voltar ao Formulário';
        backButton.onclick = goToFormPage;
        treeSection.appendChild(backButton);
    }
}

function clearData() {
    etapas = [];
    sessionStorage.removeItem('etapas');
    updateTreeView();
}
