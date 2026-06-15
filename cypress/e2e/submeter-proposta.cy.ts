import { toCyString } from "../helpers/kebab.helper";

describe("Submeter proposta no sistema", () => {
  beforeEach(() => {
    cy.fixture("submeter-proposta").then((dados) => {
      // Restaura a sessão sem precisar logar novamente
      cy.session(dados.email, () => {
        cy.visit("/");
        cy.typeLogin(dados.email, dados.senha);
        cy.get('[data-cy="user-menu"]').should("be.visible");
      });
      cy.visit("/home");
    });
  });

  context("Criação da proposta", () => {

    // 1 - Criação + Informações iniciais
    // Abre o edital, cria a proposta e preenche as informações iniciais
    it("Criar proposta e preencher informações iniciais", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Acessa a listagem de editais
        cy.get('[data-cy="editais-ver-mais"]').click();

        // Pesquisa o edital e clica nele
        cy.get('.sc-bitYfk').type('Sig Cypress');
        cy.contains('Sig Cypress').click();

        // Visualiza o edital e cria a proposta
        cy.get('.sc-dzsvhq').click();
        cy.get('[data-cy="criar-proposta"]').click();

        // Preenche as informações iniciais
        cy.get('[data-cy="titulo"]').clear().type(dados.titulo);
        cy.get('[data-cy="search-tipo-evento-id"]').clear().type(dados.tipoEvento).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="search-estado-execucao-evento"]').clear().type(dados.estado).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="search-municipio-execucao-evento"]').clear().type(dados.municipio).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="duracao"]').clear().type(dados.duracao);
        cy.get('[data-cy="search-instituicao-executora-id"]').clear().type(dados.instituicaoExecutora).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="search-unidade-executora-id"]').clear().type(dados.unidadeExecutora).trigger("keydown", { key: "Enter" });

        // Salva — a partir daqui a proposta passa a existir
        cy.get('[data-cy="menu-salvar"]').click();
        cy.wait(1000);
      });
    });
  });

  context("Caracterização", () => {

    // 2 - Caracterização: Informações complementares
    it("Preencher informações complementares", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Abre a proposta existente
        cy.get('[data-cy="projetos-ver-mais"]').click();
        cy.get('[aria-label="Editar Proposta"]').click();
        cy.wait(10000);

        // Entra na seção Caracterização
        cy.get('[data-cy="informacoes-complementares"]').click();

        // Seleciona a opção de faturamento
        cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-218-item-startup-faturamento-ano-de-ate-r"]')
          .find('[name="formularioPropostaInformacaoComplementar.pergunta-218"]')
          .click();

        // Preenche a resposta da pergunta 219
        cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-219"]').clear().type(dados.pergunta);
        cy.get('[data-cy="menu-salvar"]').click();
      });
    });
  });

  context("Coordenação", () => {

    // 3 - Coordenação: Dados pessoais (puxados do cadastro)
    it("Verificar endereço carregados do cadastro", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Abre a proposta existente
        cy.get('[data-cy="projetos-ver-mais"]').click();
        cy.get('[aria-label="Editar Proposta"]').click();
        cy.wait(10000);

        // Entra na seção Coordenação (começa em Dados pessoais)
        cy.get('[data-cy="coordenacao"]').click();
        cy.get('[data-cy="dados-pessoais"]').click();

        // Verifica que a raça/cor veio preenchida do cadastro
        cy.get('[data-cy="search-raca-cor-id"]').should("contain.value", dados.raca);

        // Salva e avança
        cy.get('[data-cy="menu-salvar"]').click();
      });
    });

    // 4 - Coordenação: Endereço (puxado do cadastro)
      it("Verificar endereço carregado do cadastro", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Abre a proposta existente
        cy.get('[data-cy="projetos-ver-mais"]').click();
        cy.get('[aria-label="Editar Proposta"]').click();
        cy.wait(10000);

        // Entra na seção Coordenação e avança até Endereço
        cy.get('[data-cy="coordenacao"]').click();
        cy.get('[data-cy="endereco"] > .css-jq9ysz').click();
        // Verifica que o endereço veio preenchido do cadastro
        cy.get('[data-cy="criadoPor.endereco.cep"]').should("have.value", dados.cep);
        cy.get('[data-cy="criadoPor.endereco.numero"]').should("have.value", dados.numero);

        // Salva e avança
        cy.get('[data-cy="menu-salvar"]').click();
      });
    });

      it("Verificar dados academicos carregado do cadastro", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Abre a proposta existente
        cy.get('[data-cy="projetos-ver-mais"]').click();
        cy.get('[aria-label="Editar Proposta"]').click();
        cy.wait(10000);

        // Entra na seção Coordenação e avança até Endereço
        cy.get('[data-cy="coordenacao"]').click();
        cy.get('[data-cy="dados-academicos"]').click();
        // Verifica que o endereço veio preenchido do cadastro
        cy.get('[data-cy="search-instituicao-id"]').should("have.value", dados.instituicaoExecutora);
        cy.get('[data-cy="search-unidade-id"]').should("have.value", dados.unidadeExecutora);
        cy.get('[data-cy="search-nivel-academico-id"]').should("have.value", dados.nivelAcademico);
        // Salva e avança
        cy.get('[data-cy="menu-salvar"]').click();
      });
    });

    // 5 - Coordenação: Dados profissionais (puxados do cadastro)
    it("Verificar dados profissionais carregados do cadastro", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Abre a proposta existente
        cy.get('[data-cy="projetos-ver-mais"]').click();
        cy.get('[aria-label="Editar Proposta"]').click();
        cy.wait(10000);

        // Entra na seção Coordenação e avança até Dados profissionais (4º subitem)
        cy.get('[data-cy="coordenacao"]').click();
        cy.get('[data-cy="dados-profissionais"]').click();

        // Verifica que os dados profissionais vieram preenchidos do cadastro
        cy.get('[data-cy="search-tipo-vinculo-instituciona"]').should("contain.value", dados.vinculo);
        cy.get('[data-cy="criadoPor.vinculoInstitucional.inicioServico"]').should("have.value", dados.inicioVinculo);
        cy.get('[data-cy="search-regime-trabalho-id"]').should("contain.value", dados.regimeTrabalho);
        cy.get('[data-cy="criadoPor.vinculoInstitucional.funcao"]').should("have.value", dados.funcao);
        cy.get('[data-cy="criadoPor.vinculoInstitucional.inicioFuncao"]').should("have.value", dados.inicioFuncao);

        // Salva e avança
        cy.get('[data-cy="menu-salvar"]').click();
      });
    });
  });

  context("Apresentação", () => {

    // 6 - Apresentação: Descrição
    it("Preencher descrição da apresentação", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Abre a proposta existente
        cy.get('[data-cy="projetos-ver-mais"]').click();
        cy.get('[aria-label="Editar Proposta"]').click();
        cy.wait(10000);

        // Entra na seção Apresentação > Descrição
        cy.get('[data-cy="apresentacao"]').click();
        cy.get('[data-cy="descricao"]').click();

        // Seleciona a Opção 1 da pergunta 221
        cy.get('[data-cy="formularioPropostaDescritiva.pergunta-221-item-opcao-1"]').click();

        // Preenche o texto da pergunta 222 (mínimo 10, máximo 20 caracteres)
        cy.get('[data-cy="formularioPropostaDescritiva.pergunta-222"]').clear().type(dados.descricao);

        // Salva e avança
        cy.get('[data-cy="menu-salvar"]').click();
      });
    });

    // 7 - Apresentação: Indicadores de produção
    it("Preencher indicadores de produção", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Abre a proposta existente
        cy.get('[data-cy="projetos-ver-mais"]').click();
        cy.get('[aria-label="Editar Proposta"]').click();
        cy.wait(10000);

        // Entra na seção Apresentação > Indicadores de produção
        cy.get('[data-cy="apresentacao"]').click();
        cy.get('[data-cy="indicadores-de-producao"]').click();

        // Preenche os dois primeiros campos da tabela (Nacional e Internacional da 1ª linha)
        cy.get('tbody input[type="number"]').eq(0).clear().type('2');
        cy.get('tbody input[type="number"]').eq(1).clear().type('1');
        cy.get('tbody input[type="number"]').eq(6).clear().type('1');
        cy.get('tbody input[type="number"]').eq(10).clear().type('3');
        cy.get('tbody input[type="number"]').eq(11).clear().type('2');

        // Salva e avança
        cy.get('[data-cy="menu-salvar"]').click();
      });
    });
  });

  context("Orçamento", () => {

    // 8 - Orçamento: Faixa de financiamento
    it("Selecionar faixa de financiamento do orçamento", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Abre a proposta existente
        cy.get('[data-cy="projetos-ver-mais"]').click();
        cy.get('[aria-label="Editar Proposta"]').click();
        cy.wait(10000);

        // Entra na seção Orçamento
        cy.get('[data-cy="apresentacao"]').click();
        cy.get('[data-cy="orcamento"]').click();
        cy.get('[data-cy="faixa-de-financiamento"]').click(); 

        // Abre o campo de faixa e seleciona a Faixa A
        cy.get('[data-cy="search-faixa-financiamento-id"]').click();
        cy.get('[data-cy="faixa-a-r-500-00-r-10-000-00"]').click();

        // Salva e avança
        cy.get('[data-cy="menu-salvar"]').click();
      });
    });

    // 9 - Orçamento: Bolsa
    it("Adicionar bolsa ao orçamento", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Abre a proposta existente
        cy.get('[data-cy="projetos-ver-mais"]').click();
        cy.get('[aria-label="Editar Proposta"]').click();
        cy.wait(10000);

        // Entra na seção Orçamento > Bolsa
        cy.get('[data-cy="apresentacao"]').click();
        cy.get('[data-cy="orcamento"]').click();
        cy.get('[data-cy="bolsa"]').click();

        // Abre o formulário de nova bolsa
        cy.get('[data-cy="add-button"]').click();

        // Preenche os dados da bolsa
        cy.get('[data-cy="search-modalidade-bolsa-id"]').clear().type(dados.modalidadeBolsa).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="search-nivel-bolsa-id"]').clear().type(dados.nivelBolsa).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="rubricaBolsaForm.quantidade"]').clear().type(dados.quantidadeBolsa);
        cy.get('[data-cy="search-duracao"]').clear().type(dados.duracaoBolsa).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="rubricaBolsa-confirmar"]').click();

        // Salva e avança
        cy.get('[data-cy="menu-salvar"]').click();
      });
    });
  });

  context("Anexos", () => {

    // 10 - Anexos: Documentos pessoais
    it("Adicionar documento pessoal", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Abre a proposta existente
        cy.get('[data-cy="projetos-ver-mais"]').click();
        cy.get('[aria-label="Editar Proposta"]').click();
        cy.wait(10000);

        // Entra na seção Anexos > Documentos pessoais
        cy.get('[data-cy="anexos"]').click();
        cy.get('[data-cy="documentos-pessoais"]').click();

        // Seleciona a categoria do documento
        cy.get('[data-cy="open-select-categories-criado-po"]').click();
        cy.get('[data-cy="documento-de-identificacao-com-f"]').click();

        // Faz upload do arquivo PDF (área de arraste e solte)
        cy.get('input[type="file"]').selectFile('cypress/fixtures/documento-teste.pdf', { force: true });

        // Salva e avança
        cy.get('[data-cy="menu-salvar"]').click();
      });
    });

    // 11 - Anexos: Documentos da proposta
    it("Adicionar documento da proposta", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Abre a proposta existente
        cy.get('[data-cy="projetos-ver-mais"]').click();
        cy.get('[aria-label="Editar Proposta"]').click();
        cy.wait(10000);

        // Entra na seção Anexos > Documentos da proposta
        cy.get('[data-cy="anexos"]').click();
        cy.get('[data-cy="documentos-da-proposta"]').click();

        // Abre o dropdown de categoria do documento
        cy.get('[data-cy="open-select-categories-documento"]').click();
        cy.get('[data-cy="carta-de-apresentacao"]').click();
        // cy.get('[data-cy="???"]').click(); // ← seletor da opção da categoria

        // Faz upload do arquivo PDF (área de arraste e solte)
        cy.get('input[type="file"]').selectFile('cypress/fixtures/documento-teste.pdf', { force: true });
        cy.wait(1000);

        // Salva e avança
        cy.get('[data-cy="menu-salvar"]').click();
      });
    });
  });

  context("Finalização", () => {

    // 12 - Finalização: Termo de aceite e submissão
    it("Aceitar termo, verificar pendências e finalizar a proposta", () => {
      cy.fixture("submeter-proposta").then((dados) => {
        // Abre a proposta existente
        cy.get('[data-cy="projetos-ver-mais"]').click();
        cy.get('[aria-label="Editar Proposta"]').click();
        cy.wait(10000);

        // Entra na seção Finalização > Termo de aceite
        cy.get('[data-cy="finalizacao"]').click();
        cy.get('[data-cy="termo-de-aceite"]').click();

        // Marca o termo de aceite caso ainda não esteja marcado
        cy.get('[data-cy="termo-de-aceite-aceito-box"]').then(($elemento) => {
          if ($elemento.prop("checked") === false) {
            cy.wrap($elemento).click();
          }
        });

        // Verifica as pendências
        cy.get('[data-cy="menu-verificar-pendencias"]').click();

        // Confirma a finalização no botão que abre após a verificação
        cy.get('.emp3m7p0 > .MuiButtonBase-root').click();
        cy.get('[data-cy="sim-continuar-button"]').click();
        cy.get('[data-cy="confirmar-button"]').click();
      });
    });
  });
});