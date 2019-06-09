import cloneDeep from 'lodash.clonedeep'
import firebase from '~/plugins/firebase'

import { firebaseMutations, firebaseAction } from 'vuexfire'

const firestore = firebase.firestore()

if(process.browser){
    const settings= { timestampsInSnapshots: true }
    firestore.settings(settings)
}

const provider = new firebase.auth.GoogleAuthProvider()

export const state = () => ({
    users: [],
    user: null
})

export const getters = {
    users: state => state.users,
    user: state => state.user
}

export const mutations = {
    addUser(state, { user }){
        state.users.push(user)
    },
    addUserPost(state, {user, post}) {
        state.userPosts[user.id].push(post)
    },
    clearUserPosts(state, { user }){
        state.userPosts[user.id] = []
    },
    setCredential(state, { user }){
        state.user = user
    }

}

export const actions = {
    async setCredential({commit}, { user }) {
        if(!user) return
        user = cloneDeep(user)
        const userCollection = firestore.collection('users')
        await userCollection
            .doc(user.email.replace('@', '_at_').replace(/\./g, '_dot_'))
            .set({
                name: user.displayName,
                email: user.email,
                icon: user.photoURL
            })
        commit('setCredential', { user })
    },
    async fetchUsers({commit}, {id}) {
        const user = await this.$axios.$get(`/users/${id}.json`)
        commit('addUser', { user })
    },
    initUsers: firebaseAction(({bindFirebaseRef}) => {
        const usersCollection = firestore.collection('users')
        bindFirebaseRef('users', usersCollection)
    })
}