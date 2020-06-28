const service = require('../service/mchat-service');
const { keys: localKeys } = require('../keys/user-key.json');

module.exports = connection => {

    const { getPostsByUserAndKeyword, getPostsByKeyword, getPostsByUser } = service(connection);

    const get = async (req, res) => {
        try {
            if (connection.state === 'disconnected')
                return res.sendStatus(503);
            const { username, keyword, key } = req.query;
            if (!username && !keyword)
                return res.status(422).send('Missing username and keyword parameters');
            if (!localKeys.includes(key))
                return res.sendStatus(403);
            if (keyword && username) {
                const posts = await getPostsByUserAndKeyword(username, keyword);
                return res.status(200).json(posts);
            }
            if (keyword) {
                const posts = await getPostsByKeyword(keyword);
                return res.status(200).json(posts);
            }
            if (username) {
                const posts = await getPostsByUser(username);
                return res.status(200).json(posts);
            }
            return res.sendStatus(500);
        } catch (err) {
            console.error(err);
            switch (err) {
                case 'User not found':
                    res.sendStatus(404);
                    break;
                case 'Message not found':
                    res.sendStatus(404);
                    break;
                default:
                    res.sendStatus(500);
                    break;
            }
        }
    };

    return { get };
}