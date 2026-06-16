import { toCyString } from "../helpers/kebab.helper";
 
describe("Completar cadastro no sistema", () => {
  beforeEach(() => {
    cy.fixture("completar-cadastro").then((dados) => {
      // Restaura a sessão sem precisar logar novamente
      cy.session(dados.email, () => {
        cy.visit("/");
        cy.typeLogin(dados.email, dados.senha);
        cy.get('[data-cy="user-menu"]').should("be.visible");
      });
 
      // Abre o formulário de edição de perfil
      cy.visit("/home");
      cy.get('[data-cy="user-menu"]').click();
      cy.get('[data-cy="editar-perfil"]').click();
    });
  });
 
  context("Completar cadastro com dados válidos", () => {
 
    // 1 - Dados pessoais
    // Seleciona raça/cor, salva e avança para a próxima etapa
    it("Preencher dados pessoais", () => {
      cy.fixture("completar-cadastro").then((dados) => {
        cy.get('[data-cy="open-raca-cor-id"]').click();
        cy.get('[data-cy="' + toCyString(dados.raca) + '"]').click();
        cy.get('[data-cy="menu-salvar"]').click();
        cy.get('[data-cy="next-button"]').click();
      });
    });
 
    // 2 - Endereço
    // Navega até a etapa de endereço clicando em next, depois preenche e avança
    it("Preencher dados de endereço", () => {
      cy.fixture("completar-cadastro").then((dados) => {
        // Avança para a etapa de endereço
        cy.get('[data-cy="next-button"]').click();
 
        cy.get('[data-cy="endereco.cep"]').clear().type(dados.cep);
        cy.get('[data-cy="endereco.bairro"]').click(); // confirma o bairro preenchido automaticamente
        cy.get('[data-cy="endereco.numero"]').clear().type(dados.numero);
        cy.get('[data-cy="menu-salvar"]').click();
        cy.get('[data-cy="next-button"]').click();
      });
    });
 
    // 3 - Dados acadêmicos
    // Navega até a etapa acadêmica clicando em next duas vezes, depois preenche e avança
    it("Preencher dados acadêmicos e áreas de conhecimento", () => {
      cy.fixture("completar-cadastro").then((dados) => {
        // Avança para a etapa acadêmica
        cy.get('[data-cy="next-button"]').click();
        cy.get('[data-cy="next-button"]').click();
 
        cy.get('[data-cy="search-instituicao-id"]').clear().type(dados.instituicao).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="search-unidade-id"]').clear().type(dados.unidade).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="search-nivel-academico-id"]').clear().type(dados.nivelAcademico).trigger("keydown", { key: "Enter" });
 
        // Abre o modal de área de conhecimento, seleciona a grande área e confirma
        cy.get('[data-cy="add-areas-de-conhecimento"]').click();
        cy.get('[data-cy="search-grande-area-id"]').type(dados.grandeArea).trigger("keydown", { key: "Enter" });
        cy.get('[data-cy="areaDeConhecimento-confirmar"]').click();
 
        // Salva somente após confirmar a área de conhecimento
        cy.get('[data-cy="menu-salvar"]').click();
        cy.get('[data-cy="next-button"]').click();
      });
    });
 
    // 4 - Vínculo institucional
    // Navega até a etapa de vínculo clicando em next três vezes, depois preenche e finaliza
    it("Preencher dados de vínculo institucional e finalizar", () => {
      cy.fixture("completar-cadastro").then((dados) => {
        // Avança para a etapa de vínculo
        cy.get('[data-cy="next-button"]').click();
        cy.get('[data-cy="next-button"]').click();
        cy.get('[data-cy="next-button"]').click();
 
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
 