import { InternalServerErrorException, NotFoundException } from "./error.handler";



describe("Error handler unit Test", () => {

    it("Internal server error is created with error code 500", () => {
        const exception = new InternalServerErrorException("Oh my God, this did not work!")
        expect(exception.statusCode).toEqual(500);
    });

    it("Not found exception is created with error code 404", () => {
        const exception = new NotFoundException("Oh my God, this  was not here!")
        expect(exception.statusCode).toEqual(404);
    });
    
});