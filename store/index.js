import moment from '~/plugins/moment'
import firebase from '~/plugins/firebase'
import cloneDeep from 'lodash.clonedeep'
import { firebaseMutations, firebaseAction } from 'vuexfire'

const firestore = firebase.firestore()

if(process.browser){
    const settings= { timestampsInSnapshots: true }
    firestore.settings(settings)
}

const provider = new firebase.auth.GoogleAuthProvider()

export const state = () => ({
    isLoggedIn: false,
    isLoaded: false
})

export const getters = {
    isLoggedIn: state => state.isLoggedIn,
    isLoaded: state => state.isLoaded
}

export const mutations = {
    setIsLoaded(state, next){
        state.isLoaded = !!next
    },
    ...firebaseMutations
}

export const actions = {
    callAuth(){
        firebase.auth().signInWithRedirect(provider)
    },
    loadComplete({ commit }){
        commit('setIsLoaded', true)
    },
    async login({commit }, {id }) {
        const user = await this.$axios.$get(`/users/${id}.json`)
        if(!user.id) throw new Error('Invalid user')
        commit('setUser', { user })
    },
    async register( {commit }, {id} ){
        const payload = {}
        payload[id] = {id}
        await this.$axios.$patch(`/users.json`, payload)
        console.log('register')
        const user = await this.$axios.$get(`/users/${id}.json`)
        if(!user.id) throw new Error('Invlid user')
        commit('setUser', { user })
    },
    async addLikeLogToUser( {commit}, { user, post } ){
        user.likes.push({
            created_at: moment().format(),
            user_id: user.id,
            post_id: post.id
        })
        const newUser = await this.$axios.$put(`/users/${user.id}.json`,user)
        commit('setUser', { user: newUser})
    }
}