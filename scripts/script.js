const destinos = [

"Lisboa",
"Porto",
"Braga",
"Coimbra",
"Faro",
"Madrid",
"Barcelona",
"Paris",
"Roma",
"Londres",
"Berlim",
"Amesterdão",
"Nova Iorque",
"Tóquio"

];

const input = document.getElementById("destino");
const sugestoes = document.getElementById("sugestoes");

input.addEventListener("input", () => {

const valor = input.value.toLowerCase();

sugestoes.innerHTML = "";

if (valor === "") return;

const resultados = destinos.filter(destino =>
destino.toLowerCase().includes(valor)
);

resultados.forEach(destino => {

const opcao = document.createElement("div");

opcao.classList.add("opcao");

opcao.textContent = destino;

opcao.addEventListener("click", () => {

input.value = destino;

sugestoes.innerHTML = "";

});

sugestoes.appendChild(opcao);

});

});

document.addEventListener("click", (e)=>{

 if(!e.target.closest(".autocomplete-container")){

   sugestoes.innerHTML="";

 }

});
