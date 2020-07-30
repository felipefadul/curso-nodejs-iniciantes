const assert = require('assert');
const PasswordHelper = require('../helpers/passwordHelper');

const SENHA = 'Felipe@123456'
const HASH = '$2b$04$.sh/2t91d4uWHoH9GR0UwOQcEKoaO4YtsG07v/wR2lqq25ZSZ1Era';

describe('PasswordHelper test suite', function () {
  it('Deve gerar um hash a partir de uma senha', async () => {
    const result = await PasswordHelper.hashPassword(SENHA);

    assert.ok(result.length > 10);
  });

  it('Deve comparar uma senha e seu hash', async () => {
    const result = await PasswordHelper.comparePassword(SENHA, HASH);
    
    assert.ok(result);
  });
});