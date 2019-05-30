import pkg from './package'

require('dotenv').config();

export default {
  mode: 'universal',
  // srcDir: 'app',
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/common.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [

    { src: '~plugins/element-ui', ssr: false }

  ],
  router : {
    middleware: ['auth-cookie']
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
  ],
  axios: {
    baseURL: 'https://nuxt-firebase-5b1c9.firebaseio.com'
  },
  /*
  ** Build configuration
  */
  build: {
   vendor: ['element-ui'],

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
  env: {
    APIKEY: process.env.APIKEY,
    AUTHDOMAIN: process.env.AUTHDOMAIN,
    DATABASEURL: process.env.DATABASEURL,
    PROJECTID: process.env.PROJECTID,
    STORAGEBUCKET: process.env.STORAGEBUCKET,
    MESSAGINGSRNDERID: process.env.MESSAGINGSRNDERID,
    APPID: process.env.APPID
  }
}
