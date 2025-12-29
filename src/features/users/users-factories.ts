import {faker} from "@faker-js/faker";

export const createPopulatedUser = ({
	id = faker.string.uuid(),
	email = faker.internet.email(),
    password,
    name = faker.person.fullName(),
    image = faker.image.avatar(),
    ...rest
}: any ={}) => ({
	id,
	email,
    password,
    name,
    image,
    ...rest
})
