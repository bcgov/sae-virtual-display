const auth = require('../auth');

const token = '123';

describe('middleware/auth', () => {
  it('should attach a token to the request object', async () => {
    const req = {};
    const next = jest.fn();
    const cb = auth({
      token,
    });

    cb(req, {}, next);
    expect(req.token).toEqual(token);
    expect(next).toHaveBeenCalled();
  });
});
