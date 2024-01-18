export class DishAlreadyExistsError extends Error {
    constructor() {
        super('Dish already exists.');
    }
}
