// ===============================
// ELEMENTOS GLOBAIS
// ===============================

const form = document.getElementById("form-reserva");
const selectVeiculo = document.getElementById("categoria");
const inputDias = document.getElementById("quantidade_dias");
const confirmCar = document.getElementById("confirm-car");
const confirmPrice = document.querySelector(".confirm-price");

const toastLiveExample = document.getElementById("liveToast");
const toastBody = document.querySelector("#liveToast .toast-body");


// ===============================
// RESERVAR CARRO
// ===============================

function fnReservarCarro() {

    let formDados = {
        nome_cliente: document.getElementById("nome_cliente").value,
        email_cliente: document.getElementById("email_cliente").value,
        veiculo_id: selectVeiculo.value,
        quantidade_dias: Number(inputDias.value)
    };

    fetch("http://localhost:3000/agendamentos", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formDados)
    })
    .then(async (res) => {

        const dados = await res.json();

        if (!res.ok) {
            fnMostrarToast(dados.mensagem || "Erro ao realizar reserva", true);
            return;
        }

        fnMostrarToast(
            `Reserva realizada! Total: R$ ${Number(dados.valor_total).toFixed(2).replace(".", ",")}`,
            false
        );

        fnLimparCampos();
    })
    .catch(() => {
        fnMostrarToast("Erro de conexão com o servidor", true);
    });
}


// ===============================
// LIMPAR CAMPOS
// ===============================

function fnLimparCampos() {
    form.reset();
    form.classList.remove("was-validated");
    confirmCar.style.display = "none";
}


// ===============================
// SUBMIT FORMULÁRIO
// ===============================

form.addEventListener("submit", function (e) {

    e.preventDefault();

    if (!this.checkValidity()) {
        this.classList.add("was-validated");
        return;
    }

    fnReservarCarro();
});


// ===============================
// TOAST
// ===============================

function fnMostrarToast(mensagem, isErro) {

    toastBody.textContent = mensagem;

    toastLiveExample.classList.remove("text-bg-success", "text-bg-danger");

    if (isErro) {
        toastLiveExample.classList.add("text-bg-danger");
    } else {
        toastLiveExample.classList.add("text-bg-success");
    }

    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
}


// ===============================
// ATUALIZAR PREÇO DINAMICAMENTE
// ===============================

function atualizarPreco() {

    const optionSelecionada =
        selectVeiculo.options[selectVeiculo.selectedIndex];

    if (!selectVeiculo.value) {
        confirmCar.style.display = "none";
        return;
    }

    const valorDiaria = Number(optionSelecionada.dataset.valor);
    const dias = Number(inputDias.value);

    if (!dias || dias <= 0) {
        confirmCar.style.display = "none";
        return;
    }

    const total = valorDiaria * dias;

    confirmPrice.textContent =
        `R$ ${total.toFixed(2).replace(".", ",")}`;

    confirmCar.style.display = "flex";
}

selectVeiculo.addEventListener("change", atualizarPreco);
inputDias.addEventListener("input", atualizarPreco);


// ===============================
// CARREGAR VEÍCULOS NO SELECT
// ===============================

function carregarVeiculos() {

    fetch("http://localhost:3000/veiculos-select")
        .then(res => res.json())
        .then(dados => {

            selectVeiculo.innerHTML =
                '<option value="">Selecione um veículo</option>';

            dados.forEach(veiculo => {

                const option = document.createElement("option");

                option.value = veiculo.id;
                option.textContent =
                    `${veiculo.modelo} - ${veiculo.categoria}`;

                option.dataset.valor = veiculo.valor_diaria;

                selectVeiculo.appendChild(option);
            });
        })
        .catch(() => {
            fnMostrarToast("Erro ao carregar veículos", true);
        });
}

carregarVeiculos();