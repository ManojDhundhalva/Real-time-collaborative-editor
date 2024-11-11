const getUser = `
SELECT username, emailid, firstname, lastname, user_timestamp
FROM users
WHERE id = $1;
`;

const updateUser = `
UPDATE users
SET firstname = $1, lastname = $2, updated_on = CURRENT_TIMESTAMP
WHERE id = $3;
`;

module.exports = {
    getUser,
    updateUser,
};
