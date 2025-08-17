export const getPlayerImageUrl = (playerId) => `https://resources.premierleague.com/premierleague/photos/players/110x140/p${playerId}.png`;
export const getTeamBadgeUrl = (teamCode) => `https://resources.premierleague.com/premierleague/badges/25/t${teamCode}.png`;
export const createPlayerMapper = (elementTypes) => (element) => {
    var _a;
    return ({
        id: element.id,
        name: element.web_name,
        image: getPlayerImageUrl(element.id),
        cost: element.now_cost / 10,
        position: ((_a = elementTypes.find((type) => type.id === element.element_type)) === null || _a === void 0 ? void 0 : _a.singular_name_short) || 'Unknown',
        teamId: element.team,
    });
};
export const createTeamMapper = () => (team) => ({
    id: team.id,
    name: team.name,
    badgeImage: getTeamBadgeUrl(team.id),
});
