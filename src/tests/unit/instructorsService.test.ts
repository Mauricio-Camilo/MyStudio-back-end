import { jest } from "@jest/globals";
import { instructorsService } from "./../../services/instructorsService.js";
import { instructorsRepository } from "./../../repositories/instructorsRepository.js";
import { CreateInstructorData, CreateLoginData } from "./../../services/instructorsService.js";
import { tokenProvider } from "../../providers/tokenProvider.js";

describe("instructors service tests suite", () => {

    it ("should register an instructor", async () => {

        const instructor : CreateInstructorData = {
            name: "Instrutor1",
            cpf: "000.000.000-25",
            password: "abcdefg",
        }

        const confirmPassword = instructor.password;

        jest.spyOn(instructorsRepository, 'findCpf').mockImplementationOnce(() : any => {});

        jest.spyOn(instructorsRepository, 'registerInstructor').mockImplementationOnce(() : any => {});

        await instructorsService.registerInstructor(instructor, confirmPassword);

        expect (instructorsRepository.findCpf).toBeCalled();
        expect (instructorsRepository.registerInstructor).toBeCalled();
    });

    it ("should fail to register an instructor", async () => {

        const instructor : CreateInstructorData = {
            name: "Instrutor1",
            cpf: "000.000.000-25",
            password: "abcdefg",
        }

        const confirmPassword = instructor.password;

        jest.spyOn(instructorsRepository, 'findCpf').mockImplementationOnce(() : any => {
            return instructor.cpf
        });

        const promise = instructorsService.registerInstructor(instructor, confirmPassword);

        expect(promise).rejects.toEqual({
            message: "Cpf already exists",
            name: "alreadyExists"
        });
    })

    it("Should make login", async () => {

        const instructor : any = {
            id: 1,
            name: "Instrutor1",
            cpf: "000.000.000-25",
            password: "abcdefg"
        }

        const login : CreateLoginData = {
            cpf: "000.000.000-25",
            password: "abcdefg",
        };

        jest.spyOn(instructorsRepository, 'findCpf').mockImplementationOnce(() : any => {
            return instructor
        });

        jest.spyOn(instructorsService, 'comparePassword').mockImplementationOnce(() : any => {
            return true
        });

        jest.spyOn(tokenProvider, 'encode').mockImplementationOnce(() : any => {});
        
        await instructorsService.signIn(login);

        expect(instructorsRepository.findCpf).toBeCalled();
        expect(instructorsService.comparePassword).toBeCalled();
        expect(tokenProvider.encode).toBeCalled();
    })

    it("Should fail to make login, invalid password", async () => {

        const instructor : any = {
            id: 1,
            name: "Instrutor1",
            cpf: "000.000.000-25",
            password: "abcdefg"
        }

        const login : CreateLoginData = {
            cpf: "000.000.000-25",
            password: "abcdefg",
        };

        jest.spyOn(instructorsRepository, 'findCpf').mockImplementationOnce(() : any => {
            return instructor
        });

        const promise = instructorsService.signIn(login);

        expect(promise).rejects.toEqual({
            message: "Incorrect password",
            name: "notAuthorized"
        });
    })

    it("Should fail to make login, not found cpf", async () => {

        const login : CreateLoginData = {
            cpf: "000.000.000-25",
            password: "abcdefg",
        };

        jest.spyOn(instructorsRepository, 'findCpf').mockImplementationOnce(() : any => {});

        const promise = instructorsService.signIn(login);

        expect(promise).rejects.toEqual({
            message: "Cpf not found",
            name: "notFound"
        });
    })
})
