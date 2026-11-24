// Test placeholder : vérifie que Jest + ts-jest fonctionnent.
// À remplacer par de vrais tests (auth, rôles, progression...).
const double = (value: number): number => value * 2;

describe('example', () => {
  it('runs a test through ts-jest', () => {
    expect([1, 2, 3].map((value) => double(value))).toEqual([2, 4, 6]);
  });
});
