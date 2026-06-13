async function carregarLista() {
  const response = await fetch("/api/list");
  const animais = await response.json();

  const listContainer = document.getElementById("listContainer");
  listContainer.innerHTML = "";

  animais.forEach(animal => {
    const row = document.createElement("div");
    row.className = "animal-row";

    const number = document.createElement("span");
    number.className = "number";
    number.textContent = animal.numero;

    const checkbox1 = document.createElement("input");
    checkbox1.type = "checkbox";
    checkbox1.className = "checkbox";
    checkbox1.checked = !!animal.vacina1;
    checkbox1.onchange = () => saveData(animal.numero, checkbox1.checked, checkbox2.checked);

    const checkbox2 = document.createElement("input");
    checkbox2.type = "checkbox";
    checkbox2.className = "checkbox";
    checkbox2.checked = !!animal.vacina2;
    checkbox2.onchange = () => saveData(animal.numero, checkbox1.checked, checkbox2.checked);

    row.appendChild(number);
    row.appendChild(checkbox1);
    row.appendChild(checkbox2);

    listContainer.appendChild(row);
  });
}

async function saveData(numero, vacina1, vacina2) {
  await fetch("/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numero, vacina1, vacina2 })
  });
}

function searchNumber() {
  const query = document.getElementById("searchBox").value;
  const rows = document.querySelectorAll(".animal-row");

  rows.forEach(row => {
    if (row.querySelector(".number").textContent === query) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      row.style.backgroundColor = "#ffff99";
      setTimeout(() => row.style.backgroundColor = "", 2000);
    }
  });
}

carregarLista();
