import React, { useEffect, useState } from "react";

//  URL da base da API onde os dados dos alunos estão registrados
const BASE_URL = 'http://localhost:3000/registros'

export function useAlunos() {
    //estados: dados, carregando, erro
    const [registros, setRegistros] = useState([]); // Armazena a lista de alunos (registros) vindos do banco de dados
    const [carregando, setCarregando] = useState(false); // Indica se o sistema está esperando uma resposta da API
    const [erro, setErro] = useState(''); // Armazena mensagens de erro caso alguma requisição falhe

    //funçoes 
        const buscar = async () => { //função buscar, busca todos os alunos cadastrados na API
            setCarregando(true) // Ativa o sinal visual de "carregando"
            try {
                const res = await fetch(BASE_URL) //faz a requisição de busca(GET)
                const dados = await res.json() //converte a resposta do servidor para json
                setRegistros(dados) //salva essa lista no estado "registros"
            } catch {
                setErro('Erro ao buscar registros') //se o servidor falhar, envia mensagem de erro
            } finally {
                setCarregando(false) //desativa o sinal de "carregando" idependente de ter dado certo ou errado
            }
        }
        
        useEffect(() => { // Executa a função 'buscar()' automaticamente assim que a tela/componente carrega pela primeira vez
            buscar()
        }, [])

        const criar = async (dados) => { //função criar, cadastra um novo aluno no banco de dados
            try {
                const res = await fetch(BASE_URL, {  
                    method: 'POST',   // método POST diz que estamos criando algo novo
                    headers: {'Content-Type': 'application/json'},   // avisa à API que estamos enviando um JSON
                    body: JSON.stringify(dados)    // transforma o objeto JavaScript do aluno em texto JSON
                })
                if (!res.ok) {  // Se o servidor retornar um erro (ex: validação de campo)
                    const err = await res.json()
                    throw new Error(err.erro) // dispara um erro com a mensagem que veio do servidor
                }
                await buscar();
            } catch (e) {  // salva o erro no estado para o usuário ver
                setErro(e.message)
                throw e  // repassa o erro adiante para que o componente da tela possa tratá-lo se necessário
            }
        }

        const atualizar = async (id, dados) => { //função atualizar, modifica os dados de um aluno existente com base no seu ID único
        try{  // Faz a requisição enviando o ID na URL
            const res = await fetch(`${BASE_URL}/${id}`, { 
                method: 'PUT', // método PUT diz que estamos substituindo/atualizando um dado
                headers: { 'Content-Type': 'application/json'}, 
                body: JSON.stringify(dados),
            });
        
        if (!res.ok) {   // Se o servidor rejeitar a atualização
            const err = await res.json();
            throw new Error(err.erro || "Erro ao atualizar registro." )
        }
        await buscar(); // Recarrega a lista de alunos para mostrar o dado atualizado na tela
        } catch(e) {
            setErro(e.message);
        }
    };

    const deletar = async (id) => {  //função deletar, remove um aluno do banco de dados usando o seu ID único
        try {
            const res = await fetch(`${BASE_URL}/${id}`, {
                method: 'DELETE' // método DELETE diz para o servidor apagar esse registro
            });
            if (!res.ok) { // se o servidor der erro ao deletar
                const err = await res.json();
                throw new Error(err.erro || 'Erro ao deletar registro.')
            }
            await buscar() // recarrega a lista de alunos para sumir com o aluno deletado da tela
        } catch (e) {
            setErro(e.message);
            throw e; //lança o erro para o componente tratar visualmente 
        }
        
    }

    return { registros, carregando, erro, buscar, criar, atualizar, deletar} // Tudo que for retornado aqui poderá ser usado pelos componentes que importarem esse hook

}