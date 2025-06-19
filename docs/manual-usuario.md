# Documentação do CustoChef

## Visão Geral

O CustoChef é uma aplicação web completa desenvolvida para auxiliar estabelecimentos gastronômicos no gerenciamento de produtos, fichas técnicas (receitas) e relatórios. O sistema permite o controle eficiente de insumos, cálculo automático de custos e informações nutricionais, além de fornecer relatórios detalhados para tomada de decisões.

## Estrutura do Sistema

O sistema está organizado em três módulos principais:

### 1. Módulo de Produtos/Insumos

 Este módulo permite o cadastro e gerenciamento de todos os insumos utilizados nas receitas, incluindo:
 - Cadastro de produtos com nome, marca, categoria, unidade de medida, preço e peso por embalagem
- Registro de informações nutricionais
- Listagem, edição e exclusão de produtos
- Filtros e busca para localização rápida de produtos

### 2. Módulo de Fichas Técnicas (Receitas)

Este módulo é o coração do sistema, permitindo:
- Criação de receitas com nome, descrição, categoria e modo de preparo
- Adição de ingredientes com quantidades específicas
- Cálculo automático de custos totais e por porção
- Cálculo automático de informações nutricionais baseado nos ingredientes
- Definição de rendimento e tempo de preparo
- Visualização detalhada das fichas técnicas

### 3. Módulo de Relatórios e Dashboard

Este módulo fornece visualizações e métricas importantes para a gestão do negócio:
- Dashboard com indicadores principais
- Relatórios de custos
- Análise de ingredientes mais utilizados
- Distribuição de categorias de produtos e receitas
- Fichas técnicas mais caras e mais econômicas

## Tecnologias Utilizadas

O sistema foi desenvolvido utilizando tecnologias modernas:
- **Next.js 14.1.0**: Framework React para desenvolvimento de aplicações web
- **React 18.2.0**: Biblioteca JavaScript para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Tailwind CSS**: Framework CSS para estilização
- **LocalStorage**: Armazenamento local para persistência de dados

## Guia de Uso

### Acesso ao Sistema

1. Acesse a página de login (`/login`).
2. Caso seja o primeiro acesso, clique em "Cadastre-se" para criar um usuário.
3. Informe seu email e senha para entrar no sistema. As credenciais ficam armazenadas somente no navegador.

### Controle de Usuários

1. Acesse "Configurações" no menu lateral.
2. Clique em "Controle de Usuários".
3. Utilize o botão "Novo Usuário" para cadastrar novas contas.
4. Exclua usuários indesejados pelo botão "Excluir" na tabela.
5. Altere senhas existentes clicando em "Alterar Senha" ao lado do usuário.
6. Em "Unidades de Medida" é possível cadastrar, editar ou remover siglas utilizadas nos produtos.

### Produtos/Insumos

1. **Listagem de Insumos**:
   - Acesse a página "Insumos" no menu lateral
   - Visualize todos os insumos cadastrados em ordem alfabética
   - Utilize os filtros para encontrar produtos específicos

2. **Cadastro de Novo Insumo**:
   - Clique no botão "Novo Insumo"
   - Preencha todos os campos obrigatórios (nome, categoria, unidade de medida, preço)
   - Adicione informações nutricionais se necessário
   - Clique em "Salvar"

3. **Edição de Insumo**:
   - Na listagem de insumos, clique no botão de edição
   - Atualize as informações necessárias
   - Clique em "Salvar"

4. **Exclusão de Produto**:
   - Na listagem de produtos, clique no botão de exclusão
   - Confirme a exclusão

### Estoque de Insumos

1. **Registrar Compras**:
   - Acesse a página "Estoque de Insumos" no menu lateral
   - Selecione o produto comprado e informe quantidade, preço e fornecedor
   - Clique em "Registrar Entrada" para salvar
2. **Histórico**:
   - A tabela abaixo do formulário mostra todas as entradas realizadas
  - Os preços informados atualizam automaticamente o cadastro do produto e as fichas técnicas relacionadas

### Produção

1. **Registrar Produção**:
   - Acesse a página "Produção" no menu lateral
   - Escolha a ficha técnica desejada, a quantidade total e o peso de cada unidade
 - O sistema calcula as unidades geradas e desconta os insumos do estoque
  - Clique em "Registrar Produção" para registrar a entrada das unidades produzidas
  - O valor de custo calculado é exibido no formulário e registrado no histórico
2. **Histórico**:
   - Abaixo do formulário é exibida a lista de produções já realizadas

### Estoque de Produção

1. **Ajustar Quantidades**:
   - No menu lateral, acesse "Estoque de Produção"
   - Escolha a ficha técnica desejada e indique se é entrada ou saída de unidades
   - Informe a quantidade e clique em "Registrar" para atualizar o saldo
2. **Consultar Saldo**:
  - A tabela "Estoque Atual" mostra a quantidade disponível de cada ficha técnica produzida

### Preços de Venda

1. **Definir Margens de Lucro**:
   - No menu lateral, acesse "Preços de Venda"
   - Selecione o lote produzido desejado
   - Informe apenas as porcentagens de lucro para até três estratégias
   - Os preços calculados ficam ocultos no formulário e são mostrados somente na lista
   - Clique em "Salvar Estratégia" para registrar ou atualizar
2. **Histórico de Estratégias**:
   - Abaixo do formulário é exibida a lista de estratégias salvas com data no formato `dd/mm/aaaa`
   - Utilize o botão **Alterar** para carregar os valores novamente e ajustá-los

### Fichas Técnicas

1. **Listagem de Fichas Técnicas**:
   - Acesse a página "Fichas Técnicas" no menu lateral
   - Visualize todas as fichas técnicas cadastradas
   - Utilize os filtros para encontrar fichas específicas

2. **Criação de Nova Ficha Técnica**:
   - Clique no botão "Nova Ficha Técnica"
   - Preencha as informações básicas (nome, categoria, descrição, modo de preparo)
   - Adicione ingredientes clicando em "Adicionar Ingrediente"
   - Para cada ingrediente, selecione o produto, a quantidade e a unidade
   - Defina o rendimento total e a unidade de rendimento
   - Clique em "Salvar"

3. **Visualização de Ficha Técnica**:
   - Na listagem de fichas técnicas, clique no nome da ficha
   - Visualize todas as informações, incluindo ingredientes, custos e informações nutricionais

4. **Edição de Ficha Técnica**:
   - Na visualização da ficha técnica, clique em "Editar"
   - Atualize as informações necessárias
   - Clique em "Salvar"

### Relatórios

1. **Dashboard**:
   - Acesse a página inicial para visualizar o dashboard com métricas resumidas

2. **Relatórios Detalhados**:
   - Acesse a página "Relatórios" no menu lateral
   - Selecione o tipo de relatório desejado (Completo, Custos, Ingredientes, Receitas)
   - Visualize as informações detalhadas
   - Utilize os botões de exportação para salvar os relatórios em PDF ou Excel

## Manutenção e Suporte

### Armazenamento de Dados

O sistema utiliza localStorage para persistência de dados, o que significa que:
- Os dados são armazenados no navegador do usuário
- Os dados não são compartilhados entre diferentes dispositivos
- É recomendável fazer backups periódicos dos dados

### Limitações Atuais

- O sistema conta com autenticação básica de usuários, mas as credenciais ficam armazenadas localmente
- Não há sincronização de dados entre diferentes dispositivos

### Próximas Versões

Estão planejadas para versões futuras:
- Diferentes níveis de permissão para usuários
- Banco de dados remoto para sincronização entre dispositivos
- Exportação de relatórios em diferentes formatos
- Controle de estoque
- Planejamento de produção

## Suporte Técnico

Para suporte técnico ou dúvidas sobre o sistema, entre em contato através do email: suporte@sistemagastronomico.com.br

---

Documentação criada em: Abril de 2025
