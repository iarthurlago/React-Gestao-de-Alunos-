import * as BancoDeDados from '../data/alunos.js';
// ============================================================
// Controle DE ALUNOS
// Recebe a requisição (req) e devolve a resposta (res)
// Toda validação acontece aqui antes de tocar no banco
// ============================================================


// ─────────────────────────────────────────
// GET /alunos — Retorna todos os alunos
// ─────────────────────────────────────────
function listarTodosAlunos(req, res) {
  const listaDeAlunos = BancoDeDados.getAlunos(); // (função do src/data/alunos.js)
  return res.status(200).json(listaDeAlunos);   
}


// ─────────────────────────────────────────
// POST /alunos — Cadastra um novo aluno
// ─────────────────────────────────────────
function criarNovoAluno(req, res) {
  const { nome, email, curso, nota } = req.body;

  // ── Validação 1 ── Campo obrigatório (HTTP 400)
  // Nenhum dos três campos principais pode chegar vazio ou ausente
  const camposObrigatoriosFaltando = !nome || !email || !curso;
  if (camposObrigatoriosFaltando) {
    return res.status(400).json({
      erro: 'Nome, email e curso são obrigatórios.',
    });
  }

  // ── Validação 2 ── Tamanho máximo do nome (HTTP 400)
  // Evita nomes absurdamente longos que poluem o banco
  const LIMITE_CARACTERES_NOME = 100;
  const nomeExcedeuLimite = nome.length > LIMITE_CARACTERES_NOME;
  if (nomeExcedeuLimite) {
    return res.status(400).json({
      erro: `Nome não pode ter mais de ${LIMITE_CARACTERES_NOME} caracteres.`,
    });
  }

  // ── Validação 3 ── Conflito: aluno com mesmo nome já existe (HTTP 409)
  // 409 Conflict = o dado que você quer criar já existe no sistema
  const alunoJaCadastrado = BancoDeDados.buscarAlunoPorNome(nome); // (função do src/data/alunos.js)
  if (alunoJaCadastrado) {
    return res.status(409).json({
      erro: 'Já existe um aluno cadastrado com esse nome.',
    });
  }

  // ── Validação 4 ── Regra de negócio: nota fora do intervalo permitido (HTTP 422)
  // 422 Unprocessable = os dados chegaram certos, mas a regra do sistema não permite
  const notaFoiInformada = nota !== undefined && nota !== null && nota !== '';
  const notaEstaForaDoIntervalo = notaFoiInformada && (nota < 0 || nota > 10);
  if (notaEstaForaDoIntervalo) {
    return res.status(422).json({
      erro: `A nota deve ser um valor entre 0 e 10.`,
    });
  }

  // Todas as validações passaram — cria o aluno no banco
  const dadosDoNovoAluno = {
    nome,
    email,
    curso,
    nota: notaFoiInformada ? Number(nota) : null, // if implícito(ternario): para legigilidade, converte a nota para número se foi informada, senão deixa null
  };
  const alunoRecentementeCriado = BancoDeDados.create(dadosDoNovoAluno); // (função do src/data/alunos.js)

  return res.status(201).json(alunoRecentementeCriado);
}


// ─────────────────────────────────────────
// PUT /alunos/:id — Atualiza um aluno existente
// ─────────────────────────────────────────
function atualizarAlunoPorId(req, res) {
  const idDoAluno = parseInt(req.params.id);
  const { nome, email, curso, nota } = req.body;

  // ── Validação 5 ── Aluno não encontrado (HTTP 404)
  // Antes de tentar editar, confirma que o ID existe no banco
  const alunoExistente = BancoDeDados.buscarAlunoPorId(idDoAluno); // (função do src/data/alunos.js)
  if (!alunoExistente) {
    return res.status(404).json({
      erro: `Nenhum aluno encontrado com o ID ${idDoAluno}.`,
    });
  }

  // ── Validação 1 (repetida) ── Campos obrigatórios na edição também (HTTP 400)
  const camposObrigatoriosFaltando = !nome || !email || !curso;
  if (camposObrigatoriosFaltando) {
    return res.status(400).json({
      erro: 'Nome, email e curso são obrigatórios.',
    });
  }

  // ── Validação 4 (repetida) ── Nota fora do intervalo na edição também (HTTP 422)
  const notaFoiInformada = nota !== undefined && nota !== null && nota !== '';
  const notaEstaForaDoIntervalo = notaFoiInformada && (nota < 0 || nota > 10);
  if (notaEstaForaDoIntervalo) {
    return res.status(422).json({
      erro: `A nota deve ser um valor entre 0 e 10.`,
    });
  }

  // Todas as validações passaram — atualiza o aluno no banco
  const dadosAtualizados = {
    nome,
    email,
    curso,
    nota: notaFoiInformada ? Number(nota) : null,
  };
  const alunoAtualizado = BancoDeDados.update(idDoAluno, dadosAtualizados); // (função do src/data/alunos.js)

  return res.status(200).json(alunoAtualizado);
}


// ─────────────────────────────────────────
// DELETE /alunos/:id — Remove um aluno pelo ID
// ─────────────────────────────────────────
function deletarAlunoPorId(req, res) {
  const idDoAluno = parseInt(req.params.id);

  // ── Validação 5 (repetida) ── Aluno não encontrado (HTTP 404)
  // BancoDeDados.remove() retorna false se o ID não existir no array
  const remocaoFoiBemSucedida = BancoDeDados.remove(idDoAluno); // (função do src/data/alunos.js)
  if (!remocaoFoiBemSucedida) {
    return res.status(404).json({
      erro: `Nenhum aluno encontrado com o ID ${idDoAluno}.`,
    });
  }

  return res.status(200).json({
    mensagem: `Aluno de ID ${idDoAluno} deletado com sucesso.`,
  });
}


// ─────────────────────────────────────────
// Exporta as funções para o alunoRoutes.js
// ─────────────────────────────────────────
module.exports = {
  listarTodosAlunos,
  criarNovoAluno,
  atualizarAlunoPorId,
  deletarAlunoPorId,
};