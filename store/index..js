export const state = () => ({
    isLoaggendIn: false,
    user: null
})

export const getters = {
    isLoaggendIn: (state) => state.isLoaggendIn,
    user: (state) => state.user
}

export const mutations = {
    setUser(state, {user}) {
        state.user = user
        state.isLoaggendIn = true
    }

}

export const actions = {
    async login({commit }, {id }) {
        const user = await this.$axios.$get(`/users/${id}.json`)
        if(!user.id) throw new Error('Invalid user')
        commit('setUser', { user })
    },

    async register( {commit }, {id} ){
        const payload = {}
        payload[id] = {id}
        await this.$axios.$patch(`/users.json`, payload)
        const user = await this.$axios.$get(`/user/${id}.json`)
        if(!user.id) throw new Error('Invlid user')
        commit('setUser', { user })
    }
}