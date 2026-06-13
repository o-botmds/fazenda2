import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = "https://SEU-PROJETO.supabase.co";
const supabaseKey = "CHAVE_PUBLICA";
const supabase = createClient(supabaseUrl, supabaseKey);

const list = document.getElementById("animalList");
const searchBox = document.getElementById("searchBox");

// Função para renderizar lista
function renderList(animais) {
  list.innerHTML = "";
  animais.forEach(animal => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>Animal nº ${animal.numero}</span>
      <div class="checkbox-group">
        <label><input type="checkbox" data-animal="${animal.id}" data-vacina="1" ${animal.vacina1 ? "checked" : ""}> Vacina 1</label>
        <label><input type="checkbox" data-animal="${animal.id}" data-vacina="2" ${animal.vacina2 ? "checked" : ""}> Vacina 2</label>
      </div>
    `;
    list.appendChild(li);
  });
}

// Carregar animais do banco
async function carregarAnimais() {
  const { data, error } = await supabase
    .from("animais")
    .select("id, numero, vacina1, vacina2");

  if (error) {
    console.error(error);
    return;
  }
  renderList(data);
}

carregarAnimais();

// Busca
searchBox.addEventListener("input", async () => {
  const query = searchBox.value.trim();
  const { data } = await supabase
    .from("animais")
    .select("id, numero, vacina1, vacina2")
    .ilike("numero", `%${query}%`);

  renderList(data);
});

// Atualizar vacina ao marcar checkbox
list.addEventListener("change", async (e) => {
  if (e.target.type === "checkbox") {
    const animalId = e.target.dataset.animal;
    const vacinaTipo = e.target.dataset.vacina;
    const aplicada = e.target.checked;

    const coluna = vacinaTipo === "1" ? "vacina1" : "vacina2";

    const { error } = await supabase
      .from("animais")
      .update({ [coluna]: aplicada })
      .eq("id", animalId);

    if (error) console.error(error);
  }
});
