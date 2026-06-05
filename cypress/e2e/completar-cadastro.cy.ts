import { toCyString } from "../helpers/kebab.helper";
 
describe("Completar cadastro no sistema", () => {
  // Realiza login e armazena a sessão antes de cada teste,
  // evitando que o usuário precise autenticar novamente
  beforeEach(() => {
    cy.fixture("completar-cadastro").then((dados) => {
      cy.session(dados.email, () => {
        cy.visit("/");
        cy.typeLogin(dados.email, dados.senha);
        cy.get('[data-cy="user-menu"]').should("be.visible");
      });
    });
  });
 
  context("Completar cadastro com dados válidos", () => {
    it("Completar cadastro com dados válidos", () => {
      cy.fixture("completar-cadastro").then((dados) => {
 
        // Navega até a home e abre o formulário de edição de perfil
        cy.visit("/home");
        cy.get('[data-cy="user-menu"]').click();
        cy.get('[data-cy="editar-perfil"]').click();
 
        // 1 - Dados pessoais
        // Seleciona raça/cor, salva e avança para a próxima etapa
        cy.get('[data-cy="open-raca-cor-id"]').click();
        cy.get('[data-cy="' + toCyString(dados.raca) + '"]').click();
        cy.get('[data-cy="menu-salvar"]').click();
        cy.get('[data-cy="next-button"]').click();
 
        // 2 - Endereço
        // Preenche CEP (o bairro é preenchido automaticamente pela API),
        // informa o número, salva e avança
        cy.get('[data-cy="endereco.cep"]').clear().type(dados.cep);
        cy.get('[data-cy="endereco.bairro"]').click(); // confirma o bairro preenchido automaticamente
        cy.get('[data-cy="endereco.numero"]').clear().type(dados.numero);
        cy.get('[data-cy="menu-salvar"]').click();
        cy.get('[data-cy="next-button"]').click();
 
        // 3 - Dados acadêmicos
        // Preenche instituição, unidade e nível acadêmico via busca com Enter,
        // depois adiciona a grande área de conhecimento e avança
        cy.get('[data-cy="search-instituicao-id"]').clear().type(dados.instituicao).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="search-unidade-id"]').clear().type(dados.unidade).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="search-nivel-academico-id"]').clear().type(dados.nivelAcademico).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="menu-salvar"]').click();
 
        // Abre o modal de área de conhecimento, seleciona a grande área e confirma
        cy.get('[data-cy="add-areas-de-conhecimento"]').click();
        cy.get('[data-cy="search-grande-area-id"]').type(dados.grandeArea).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="areaDeConhecimento-confirmar"]').click();
        cy.get('[data-cy="next-button"]').click();
 
        // 4 - Dados academicos - vinculo institucional
        // Habilita o vínculo institucional se não estiver ativo
        cy.get('[data-cy="possui-vinculo-institucional-box"]').then(($elemento) => {
          if ($elemento.prop("checked") === false) {
            cy.wrap($elemento).click();
          }
        });
        cy.get('[data-cy="search-tipo-vinculo-instituciona"]').clear().type(dados.vinculo).trigger("keydown", { key: "Enter" });
 
        // Habilita o vínculo empregatício se não estiver ativo
        cy.get('[data-cy="possui-vinculo-empregaticio-box"]').then(($elemento) => {
          if ($elemento.prop("checked") === false) {
            cy.wrap($elemento).click();
          }
        });
 
        cy.get('[data-cy="vinculoInstitucional.inicioServico"]').clear().type(dados.inicioVinculo);
        cy.get('[data-cy="search-regime-trabalho-id"]').clear().click().type(dados.regimeTrabalho).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="vinculoInstitucional.funcao"]').clear().type(dados.funcao);
        cy.get('[data-cy="vinculoInstitucional.inicioFuncao"]').clear().type(dados.inicioFuncao);
 
        // Salva o vínculo e finaliza o cadastro
        cy.get('[data-cy="menu-salvar"]').click();
        cy.get('[data-cy="menu-finalizar"]').click();
      });
    });
  });
});