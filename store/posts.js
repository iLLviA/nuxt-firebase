import moment from '~/plugins/moment'

export const state = () => ({
    posts: []
})

export const getters = {
    posts: state => {
        return state.posts.map(post => {
            post.user = state.users.find(user => user.email === post.from)
        })
    },
    post: state => {
        const post = state.post
        if(!post) return null
        post.user = state.users.find(user => user.email === post.from)
    }
}

export const mutations = {
    addPost(state, { post }){
        console.log(state)
        state.posts.push(post)
    },
    updatePost(state, { post }){
        state.posts = state.posts.map((p) => (p.id === post.id ? post : p))
    },
    clearPosts(state) {
        state.posts = []
    },
    savePost(state, { post }){
        state.post = post
    }
}

export const actions = {
    async initSingle({ commit },{ id }){
        const snapshot = await firestore
        .collection('post')
        .doc(id)
        .get()
        commit('savePost', { post: snapshot.data() })
    },
    initPost: fireAction(({bindFirebaseRef}) => {
        const postsCollection = firestore
            .collection('posts')
            .orderBy('createdAt', 'desc')
        bindFirebaseRef('posts', postsCollection)
    }),
    addPost: firebaseAction((ctx, {id, email, body, createAt }) => {
        firestore
            .collection('post')
            .doc(`${id}`)
            .set({
                id,
                from: email,
                body,
                createAt
            })
    }),
    async publishPost({ commit }, { payload }){
        const user = await this.$axios.$get(`/users/${payload.user.id}.json`)
        const post_id = ( await this.$axios.$post('/posts.json', payload)).name
        const created_at = moment().format()
        const post = { id: post_id, ...payload, created_at }
        const putData = { id: post_id, ...payload, created_at }
        delete putData.user
        await this.$axios.$put(`/users/${user.id}/posts.json`, [
            ...(user.posts || []),
            putData
        ])
        commit('addPost', { post })
    },      
    async fetchPosts({ commit }) {
        const posts = await this.$axios.$get(`/posts.json`)
        commit('clearPosts')
        Object.entries(posts).reverse().forEach(([id, content]) => commit('addPost', {post: { id, ...content}}))
    },
    async fetchPost({ commit },{ id }){
        const post = await this.$axios.$get(`/posts/${id}.json`)
        commit('addPost', { post: {...post, id } })
    },
    async addLikeToPost({commit},{user, post}){
        post.likes.push({
            created_at: moment().format(),
            user_id: user.id,
            post_id: post.id
        })
        const newPost = await this.$axios.$put(`/posts/${post.id}.json`, post)
        console.log("Like!!")
        commit('updatePost', { post: newPost })
    },
    async removeLikePost({commit},{post,user}){
        post.likes = post.likes.filter( l => l.user_id !== user.id ) || []
        const newPost = await this.$axios.$put(`/posts/${post.id}.json`, post)
        commit('updatePost', {post:newPost})
        console.log("unLiked!!")
    }
}