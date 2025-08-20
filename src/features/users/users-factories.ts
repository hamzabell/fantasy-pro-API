import {faker} from "@faker-js/faker";

export const createPopulatedUser = ({
	id = faker.string.uuid(),
	email = faker.internet.email()
} ={}) => ({
	id,
	email
})
