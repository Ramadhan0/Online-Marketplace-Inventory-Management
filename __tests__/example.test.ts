
const sum = (a: any, b: any) => a + b

describe('sum', () => {
    it('should correctly add two numbers', () => {
        expect(sum(2, 3)).toBe(5);
    });
});
