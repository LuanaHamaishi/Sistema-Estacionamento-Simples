interface Veiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null =>
    document.querySelector(query);

  function calcTempo(mil: number) {
    const horas = Math.floor(mil / 3600000);
    const min = Math.floor(mil / 60000);

    return `O tempo total do veículo foi de: 
    ${horas}horas e ${min}minutos`;
  }

  function patio() {
    function ler(): Veiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }

    function salvar(veiculos: Veiculo[]) {
      localStorage.setItem("patio", JSON.stringify(veiculos));
    }

    function adicionar(veiculo: Veiculo, salva?: boolean) {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td>${veiculo.nome}</td>
      <td>${veiculo.placa}</td>
      <td>${veiculo.entrada.toLocaleString().split("T")[0]}</td>
      <td>
      <button class="delete" data-placa="${veiculo.placa}">X</button>
      </td>
      `;

      row.querySelector(".delete")?.addEventListener("click", function () {
        remover(this.dataset.placa, row);
      });

      $("#patio")?.appendChild(row);

      if (salva) salvar([...ler(), veiculo]);
    }

    function remover(placa: string, row: HTMLTableRowElement) {
      const { entrada, nome } = ler().find(
        (veiculo) => veiculo.placa === placa
      );
      const tempo = calcTempo(
        new Date().getTime() - new Date(entrada).getTime()
      );

      if (
        !confirm(
          `O veiculo ${nome} - ${placa} permaneceu por ${tempo}. Deseja encerrar?`
        )
      )
        return;
      row.remove();
      salvar(ler().filter((veiculo) => veiculo.placa !== placa));
      render();
    }

    function render() {
      $("#patio")!.innerHTML = "";
      const patio = ler();

      if (patio.length) {
        patio.forEach((veiculo) => adicionar(veiculo));
      }
    }

    return { ler, adicionar, remover, salvar, render };
  }

  patio().render();
  $("#cadastrar")?.addEventListener("click", () => {
    const nome = $("#nome")?.value;
    const placa = $("#placa")?.value;

    if (!nome || !placa) {
      alert("Preencha todos os campos");
      return;
    }

    patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
  });
})();
