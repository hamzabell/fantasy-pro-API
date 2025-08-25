import { faker } from "@faker-js/faker";
export const createPopulatedPowerUp = ({ name = faker.commerce.productName(), description = faker.lorem.sentence(), price = faker.finance.amount(), tokenId = faker.string.numeric(), contractAddress = faker.finance.ethereumAddress(), metadataUri = faker.internet.url(), imageUrl = faker.image.url(), isActive = true, isFeatured = faker.datatype.boolean(), categoryId = undefined, // Don't include categoryId by default to avoid validation issues
 } = {}) => {
    // Only include categoryId if it's not null/undefined
    const powerUp = {
        name,
        description,
        price,
        tokenId,
        contractAddress,
        metadataUri,
        imageUrl,
        isActive,
        isFeatured
    };
    // Only add categoryId if it's provided (not null/undefined)
    if (categoryId !== undefined && categoryId !== null) {
        powerUp.categoryId = categoryId;
    }
    return powerUp;
};
