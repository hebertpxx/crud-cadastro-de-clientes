'use strict'

const abrirModal = () => document.getElementById('modal').classList.add('active');

const fecharModal = () => {
    document.getElementById('modal').classList.remove('active');
    limparCampos();
}

const getArmazenamentoLocal = () => JSON.parse( localStorage.getItem('bd_cliente') ) ?? [];
const setArmazenamentoLocal = (bdCliente) => localStorage.setItem('bd_cliente', JSON.stringify(bdCliente));

/////////// CRUD (Create, Read, Update and Delete) ///////////

// Create

const criarCliente = (cliente) => {
    const bdCliente = getArmazenamentoLocal();
    bdCliente.push(cliente);
    setArmazenamentoLocal(bdCliente);
}

// Read

const lerCliente = () => getArmazenamentoLocal();

// Update

const atualizarCliente = (indice, cliente) => {
    const bdCliente = lerCliente();
    bdCliente[indice] = cliente;
    setArmazenamentoLocal(bdCliente);
}

// Delete

const deletarCliente = (indice) => {

    const bdCliente = lerCliente();
    bdCliente.splice(indice, 1);
    setArmazenamentoLocal(bdCliente);

}

/////////// Interação com o layout ///////////

const camposValidos = () => {
    return document.getElementById('modal-form').reportValidity();
};

const limparCampos = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = '');
}

const salvarCliente = () => {

    if (camposValidos()) {

        const cliente = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }

        const indice = document.getElementById('nome').dataset.index;

        if (indice == 'new') {

            criarCliente(cliente);
            alert('Cliente cadastrado com sucesso');
            atualizarTabela();
            fecharModal();

        }else {

            atualizarCliente(indice, cliente);
            atualizarTabela();
            fecharModal();

        }

    }

}

const criarLinha = (cliente, indice) => {

    const novaLinha = document.createElement('tr');
    
    novaLinha.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.email}</td>
        <td>${cliente.celular}</td>
        <td>${cliente.cidade}</td>
        <td>
            <button type="button" id="editar" class="button green" data-action="edite-${indice}">
                <i id="icone-editar" class="fa-solid fa-pencil" data-action="edite-${indice}"></i>
            </button>
            <button type="button" id="excluir" class="button red" data-action="delete-${indice}">
                <i id="icone-deletar" class="fa-solid fa-trash-can" data-action="delete-${indice}"></i>
            </button>
        </td>
    `

    document.querySelector('#tabela-clientes>tbody').appendChild(novaLinha);

}

const limparTabela = () => {
    const linhas = document.querySelectorAll('#tabela-clientes>tbody tr');
    linhas.forEach( linha => linha.parentNode.removeChild(linha) );
}

const atualizarTabela = () => {
    
    const bdCliente = lerCliente();
    limparTabela();
    bdCliente.forEach(criarLinha); //Elemento e índice são enviados à função chamada

}

const preencherCampos = (cliente) => {
    document.getElementById('nome').value = cliente.nome;
    document.getElementById('email').value = cliente.email;
    document.getElementById('celular').value = cliente.celular;
    document.getElementById('cidade').value = cliente.cidade;
    document.getElementById('nome').dataset.index = cliente.indice;
}

const editarCliente = (indice) => {

    const cliente = lerCliente()[indice];
    cliente.indice = indice;
    preencherCampos (cliente, indice);
    abrirModal();

}

const editarOuDeletar = (evento) => {

    if(evento.target.type === 'button' || evento.target.id === 'icone-editar' || evento.target.id === 'icone-deletar'){

        const [acao, indice] = evento.target.dataset.action.split('-');

        if(acao == 'edite') {

            editarCliente(indice);
            atualizarTabela();

        }else{

            const cliente = lerCliente()[indice];
            const resposta = confirm(`Deseja realmente deletar o cliente ${cliente.nome}?`);
            if (resposta) {
                deletarCliente(indice);
                atualizarTabela();
            }

        }

    };

};

atualizarTabela();

//Eventos
document.getElementById('cadastrar-cliente').addEventListener('click', abrirModal);

document.getElementById('fecharModal').addEventListener('click', fecharModal);

document.getElementById('salvar').addEventListener('click', salvarCliente);

document.getElementById('cancelar').addEventListener('click', fecharModal);

document.querySelector('#tabela-clientes>tbody').addEventListener('click', editarOuDeletar);