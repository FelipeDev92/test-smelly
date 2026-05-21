const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Refatorada (Clean)', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('deve criar um novo usuário com sucesso no sistema', () => {
    const { nome, email, idade } = dadosUsuarioPadrao;

    const usuarioCriado = userService.createUser(nome, email, idade);

    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.nome).toBe(nome);
  });

  test('deve buscar um usuário existente pelo ID corretamente', () => {
    const { nome, email, idade } = dadosUsuarioPadrao;
    const usuarioCriado = userService.createUser(nome, email, idade);

    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    expect(usuarioBuscado).toBeDefined();
    expect(usuarioBuscado.nome).toBe(nome);
    expect(usuarioBuscado.status).toBe('ativo');
  });

  test('deve desativar com sucesso um usuário comum (não administrador)', () => {
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve permitir a desativação de um usuário administrador', () => {
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    const resultado = userService.deactivateUser(usuarioAdmin.id);

    expect(resultado).toBe(false);
  });

  test('deve conter as informações essenciais do usuário no relatório formatado', () => {
    const usuario = userService.createUser('Alice', 'alice@email.com', 28);

    const relatorio = userService.generateUserReport();
    
    expect(relatorio).toContain(`ID: ${usuario.id}`);
    expect(relatorio).toContain('Nome: Alice');
    expect(relatorio).toContain('Status: ativo');
    expect(relatorio.startsWith('--- Relatório de Usuários ---')).toBe(true);
  });
  
  test('deve lançar um erro ao tentar criar um usuário menor de idade', () => {
    const nome = 'Menor';
    const email = 'menor@email.com';
    const idade = 17;

    expect(() => {
      userService.createUser(nome, email, idade);
    }).toThrow('O usuário deve ser maior de idade.');
  });

  test('deve retornar uma lista vazia quando não há usuários cadastrados', () => {
    const relatorio = userService.generateUserReport();
    
    expect(relatorio).toContain('--- Relatório de Usuários ---');
  });
});