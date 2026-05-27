// ============================================================
// BANCO DE DADOS DE ALUNOS
// Simula um banco de dados usando um array em memória.
// Toda vez que o servidor reiniciar, os dados são apagados.
// ============================================================

// ─────────────────────────────────────────
// "Tabela" de alunos e contador de IDs
// ────────────────────────────────────────

let tabelaDeAlunos = []; // O "let" especificamente nas nessa linah e na 14, por causa de mutabilidade, vamos adicioanr e remover os itens.

// Cada novo aluno recebe um ID único e crescente (1, 2, 3...)
let proximoIdDisponivel = 1; // ID para iniciar o próximo aluno criado, não coloco direto por segurnaça, para evitar que alguém tente criar um aluno com ID 1 manualmente e cause conflito


// ─────────────────────────────────────────
// getAlunos — Retorna todos os alunos cadastrados
// Usada em: listarTodosAlunos() do controller
// ─────────────────────────────────────────
export function getAlunos() {
  return tabelaDeAlunos;
}


// ─────────────────────────────────────────
// buscarAlunoPorId — Busca um aluno pelo ID numérico
// Retorna o objeto do aluno, ou undefined se não existir
// Usada em: atualizarAlunoPorId() do controller
// ─────────────────────────────────────────
export function buscarAlunoPorId(idProcurado) {
  const alunoEncontrado = tabelaDeAlunos.find(
    (aluno) => aluno.id === idProcurado
  ); // a função find retorna o primeiro item que satisfaz a condição, ou undefined se não encontrar, que no caso é se o ID do aluno for igual ao ID procurado
  return alunoEncontrado;
}


// ─────────────────────────────────────────
// buscarAlunoPorNome — Busca um aluno pelo nome (sem distinção de maiúsculas)
// Retorna o objeto do aluno, ou undefined se não existir
// Usada em: criarNovoAluno() do controller para checar duplicatas
// ─────────────────────────────────────────
export function buscarAlunoPorNome(nomeProcurado) {
  const alunoEncontrado = tabelaDeAlunos.find(
    (aluno) => aluno.nome.toLowerCase() === nomeProcurado.toLowerCase()
  ); // filtro usado find, para comparar os nomes sem considerar maiúsculas ou minúsculas, usando toLowerCase() para converter ambos os lados da comparação para letras minúsculas.
  return alunoEncontrado;
}


// ─────────────────────────────────────────
// create — Adiciona um novo aluno na tabela
// Gera o ID automaticamente e retorna o aluno completo (com ID)
// Usada em: criarNovoAluno() do controller
// ─────────────────────────────────────────
export function create(dadosDoAluno) {
  const novoAluno = {
    id: proximoIdDisponivel,
    ...dadosDoAluno,           // espalha: nome, email, curso, nota. atravez do "..." os  Operador Spread, que pega todas as propriedades do objeto dadosDoAluno e as adiciona ao novo objeto novoAluno.
  };

  tabelaDeAlunos.push(novoAluno);
  proximoIdDisponivel++;       // garante que o próximo ID será diferente

  return novoAluno;
}


// ─────────────────────────────────────────
// update — Atualiza os dados de um aluno existente pelo ID
// Retorna o aluno com os dados novos, ou null se o ID não existir
// Usada em: atualizarAlunoPorId() do controller
// ─────────────────────────────────────────
export function update(idDoAluno, dadosAtualizados) {
  const posicaoNoArray = tabelaDeAlunos.findIndex(
    (aluno) => aluno.id === idDoAluno
  ); // usar o findindex para saber a posição, o find normal retornaria o objto inteiro do aluno.

  // findIndex retorna -1 quando não encontra — sinal de que o ID não existe
  const alunoNaoExiste = posicaoNoArray === -1;
  if (alunoNaoExiste) return null;

  // Mantém o ID original e sobrescreve apenas os campos enviados
  tabelaDeAlunos[posicaoNoArray] = {
    ...tabelaDeAlunos[posicaoNoArray],
    ...dadosAtualizados,
  }; // usado a função para espalhar os dados, "o copie tudo e mude o que for necessario"

  return tabelaDeAlunos[posicaoNoArray];
}


// ─────────────────────────────────────────
// remove — Remove um aluno da tabela pelo ID
// Retorna true se removeu, false se o ID não existia
// Usada em: deletarAlunoPorId() do controller
// ─────────────────────────────────────────
export function remove(idDoAluno) {
  const posicaoNoArray = tabelaDeAlunos.findIndex(
    (aluno) => aluno.id === idDoAluno
  ); // usar o findindex para saber a posição, o find normal retornaria o objto inteiro do aluno.

  // findIndex retorna -1 when não encontra — nada para remover
  const alunoNaoExiste = posicaoNoArray === -1;
  if (alunoNaoExiste) return false;

  tabelaDeAlunos.splice(posicaoNoArray, 1); // remove 1 item na posição encontrada
  return true; // Usando o splice para remover o item do array, passando a posição e a quantidade de itens a remover (1 nesse caso)
}
