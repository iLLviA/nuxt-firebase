import moment from '~/plugins/moment'

export const state = () => ({
    posts: []
})

export const getters = {
    posts: (state) => state.posts
}

export const mutations = {
    addPost(state, { post }){
        console.log(post,1234)
        state.posts.push(post)
    },
    updatePost(state, { post }){
        state.posts = state.posts.map((p) => (p.id === post.id ? post : p))
    },
    clearPosts(state) {
        state.post = []
    }
}

export const actions = {
    async publishPost({ commit }, { payload }){
        const user = await this.$axios.$get(`/users/${payload.user.id}.json`)
        const post_id = ( await this.$axios.$post('/posts.json', payload)).name
        const created_at = moment().format()
        const post = { id: post_id, ...payload, created_at }
        const putData = { id: post_id, ...payload, created_at }
        delete putData.user
        console.log(payload)
        await this.$axios.$put(`/users/${user.id}/posts.json`, [
            ...(user.posts || []),
            putData
        ])
        commit('addPost', { post })
    },
    async fetchPosts({ commit }) {
        const posts = await this.$axios.$get(`/posts.json`)
        // Object.entries(posts).reverse().forEach(([id, content]) => console.log(content))
        commit('clearPosts')
        Object.entries(posts).reverse().forEach(([id, content]) => commit('addPost', {post: { id, ...content}}))
    },
    async fetchPost({ commit },{ id }){
        const post = await this.$axios.$get(`/posts/${id}.json`)
        commit('addPost', { post: {...post, id } })
    }
}