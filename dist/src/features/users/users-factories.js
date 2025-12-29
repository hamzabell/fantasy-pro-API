var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { faker } from "@faker-js/faker";
export const createPopulatedUser = (_a = {}) => {
    var { id = faker.string.uuid(), email = faker.internet.email(), password, name = faker.person.fullName(), image = faker.image.avatar() } = _a, rest = __rest(_a, ["id", "email", "password", "name", "image"]);
    return (Object.assign({ id,
        email,
        password,
        name,
        image }, rest));
};
