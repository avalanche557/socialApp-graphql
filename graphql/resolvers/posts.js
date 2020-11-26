const Post = require('../../models/Post')

module.exports = {
    Query: {
        async getPosts() {
            try {
                const post = await Post.find()
                return post
            } catch (err) {
                throw new Error(err)
            }

        }
    }
}