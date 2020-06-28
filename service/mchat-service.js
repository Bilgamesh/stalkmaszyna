module.exports = connection => {

    const getUserByName = async (username = '') => {
        const query = `SELECT * FROM \`phpbb_users\` WHERE \`username\` = '${username}' LIMIT 0 , 1`;
        const { results } = await connection.queryAsync(query);
        if (results.length === 0)
            throw 'User not found';
        const userId = results[0].user_id;
        if (!userId)
            throw 'User not found';
        return {
            userId: +results[0].user_id,
            avatarUrl: `https://www.przegrywy.net/download/file.php?avatar=${results[0].user_avatar}`,
            profileUrl: `https://www.przegrywy.net/memberlist.php?mode=viewprofile&u=${results[0].user_id}`
        };
    };

    const getUserById = async (userId = '') => {
        const query = `SELECT * FROM \`phpbb_users\` WHERE \`user_id\` = '${userId}' LIMIT 0 , 1`;
        const { results } = await connection.queryAsync(query);
        if (results.length === 0)
            throw 'User not found';
        if (!results[0].user_id)
            throw 'User not found';
        return {
            userId: +results[0].user_id,
            avatarUrl: `https://www.przegrywy.net/download/file.php?avatar=${results[0].user_avatar}`,
            profileUrl: `https://www.przegrywy.net/memberlist.php?mode=viewprofile&u=${results[0].user_id}`
        };
    }

    const getUsersByIds = async (userIds = []) => {
        if (userIds.length === 1)
            return getUserById(userIds[0]);
        let query = `SELECT * FROM \`phpbb_users\` WHERE \`user_id\` = '${userIds[0]}'`
        for (const userId of userIds) {
            query += ` OR \`user_id\` = '${userId}'`;
        }
        query += `LIMIT 0 , ${userIds.length}`;
        const { results } = await connection.queryAsync(query);
        if (results.length === 0)
            throw 'User not found';
        if (!results[0].user_id)
            throw 'User not found';
        const users = [];
        for (const result of results) {
            const user = {
                userId: +result.user_id,
                avatarUrl: `https://www.przegrywy.net/download/file.php?avatar=${result.user_avatar}`,
                profileUrl: `https://www.przegrywy.net/memberlist.php?mode=viewprofile&u=${result.user_id}`
            };
            users.push(user);
        }
        return users;
    }

    const getPostsByUserAndKeyword = async (username = '', keyword = '') => {
        const { userId, avatarUrl, profileUrl } = await getUserByName(username);
        const query = `SELECT * FROM \`phpbb_mchat\` WHERE \`user_id\` =${userId} ` +
            `AND \`message\` LIKE '%${keyword}%' ORDER BY \`phpbb_mchat\`.\`message_time\` DESC LIMIT 0 , 100`;
        const { results } = await connection.queryAsync(query);
        if (results.length === 0)
            throw 'Message not found';
        const posts = [...results].map(post => ({
            message: post.message,
            avatarUrl,
            date: post.message_time,
            profileUrl
        }));
        return posts;
    };

    const getPostsByKeyword = async (keyword = '') => {
        const query = `SELECT * FROM \`phpbb_mchat\` WHERE \`message\` LIKE '%${keyword}%' ` +
            `ORDER BY \`phpbb_mchat\`.\`message_time\` DESC LIMIT 0 , 100`;
        const { results } = await connection.queryAsync(query);
        const userIds = [...results].map(post => post.user_id);
        const users = await getUsersByIds(userIds);
        const posts = [...results].map(post => ({
            message: post.message,
            date: post.message_time,
            avatarUrl: users.filter(user => user.userId === post.user_id)[0].avatarUrl,
            profileUrl: users.filter(user => user.userId === post.user_id)[0].profileUrl
        }));
        return posts;
    }

    const getPostsByUser = async (username = '') => {
        const { userId, avatarUrl, profileUrl } = await getUserByName(username);
        const query = `SELECT * FROM \`phpbb_mchat\` WHERE \`user_id\` =${userId} ` +
            `ORDER BY \`phpbb_mchat\`.\`message_time\` DESC LIMIT 0 , 100`;
        const { results } = await connection.queryAsync(query);
        if (results.length === 0)
            throw 'Message not found';
        const posts = [...results].map(post => ({
            message: post.message,
            avatarUrl,
            date: post.message_time,
            profileUrl
        }));
        return posts;
    };

    return { getPostsByUserAndKeyword, getPostsByKeyword, getPostsByUser };
};