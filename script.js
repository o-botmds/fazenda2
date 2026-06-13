// Configuração do Supabase
const supabaseUrl = "https://mpslimsbytczmksllnys.supabase.co"; // substitua pelo seu Project URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wc2xpbXNieXRjem1rc2xsbnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMzQzNDksImV4cCI6MjA5NjkxMDM0OX0.ZdEXJB533zYJQPI145juiuey9LNu2N_Ps0X3JksFs-8"; // substitua pela sua anon/public key
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const list = document.getElementById("animalList");
const searchBox = document.getElementById("searchBox");

// Renderizar lista
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

// Carregar animais
async function carregarAnimais() {
  const { data, error } = await supabase
    .from("animais")
    .select("id, numero, vacina1, vacina2")
    .order("numero", { ascending: true });

  if (error) {
    console.error("Erro ao carregar:", error);
    return;
  }
  renderList(data);
}

// Chamada inicial
carregarAnimais();

// Busca por número
searchBox.addEventListener("input", async () => {
  const query = searchBox.value.trim();
  let data;

  if (query === "") {
    ({ data } = await supabase
      .from("animais")
      .select("id, numero, vacina1, vacina2")
      .order("numero", { ascending: true }));
  } else {
    ({ data } = await supabase
      .from("animais")
      .select("id, numero, vacina1, vacina2")
      .eq("numero", parseInt(query)));
  }

  renderList(data || []);
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

    if (error) {
      console.error("Erro ao atualizar vacina:", error);
    }
  }
});
