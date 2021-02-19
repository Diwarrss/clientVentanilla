const pkg = require('./package')
require('dotenv').config()

module.exports = {
  mode: 'spa',
  target: 'static', //for site static
  server: {
    port: 8080, // default: 3000
    host: 'localhost' // default: localhost
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Alcaldia | Correspondencia v1',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.7.2/css/all.css'
      }
    ]
  },
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8080',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000/api/v1',
    cookieBaseUrl: process.env.COOKIE_BASE_URL || 'http://localhost:8000',
    filesBaseUrl: process.env.FILES_BASE_URL || 'http://localhost:8000'
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#9e0101',
    height: '5px'
  },

  /*
  ** Global CSS
  */
  css: [
    /* Import Core SCSS */
    '@/assets/scss/style.scss',
    /* Import Custom CSS */
    '@/assets/css/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/laravel-permissions', mode: 'client' },
    { src: '~/plugins/vue-sweetAlert.js', mode: 'client' },
    { src: '~/plugins/vue-unicons', mode: 'client' },
    { src: '~/plugins/vue-elementui', ssr: true },
    { src: '~/plugins/vuelidate' },
    { src: '~/plugins/vue-select', ssr: false },
    { src: '~/plugins/vue-barcode', ssr: false },
    { src: '~/plugins/vue-html2pdf', mode: 'client' },
    { src: '~/plugins/v-drag' },
    { src: '~/plugins/vue-json-excel' },
    { src: '~/plugins/vue-loading-overlay' }
  ],

  router: {
    middleware: ['auth']
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    //Auth Module
    '@nuxtjs/auth',
    //vue-sweetalert2
    'vue-sweetalert2/nuxt',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // With options
    [
      '@nuxtjs/moment',
      {
        locales: ['es'],
        defaultTimezone: 'America/Bogota'
      }
    ]
  ],
  auth: {
    // Options
    redirect: {
      login: '/login', //El usuario será redirigido a esta ruta si es necesario iniciar sesión .
      logout: '/login', //El usuario será redirigido a esta ruta si después de cerrar sesión, la ruta actual está protegida .
      callback: '/login', // El usuario será redirigido a esta ruta después de iniciar sesión . ( rewriteRedirectsreescribirá este camino)
      home: '/' //El usuario será redirigido a esta ruta por el proveedor de identidad después de iniciar sesión .
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'login',
            method: 'post',
            propertyName: false
          }, //url login laravel 7
          user: {
            url: 'user',
            method: 'get',
            propertyName: false
          }, //url get info user auth
          logout: {
            url: '/auth/logout',
            method: 'post'
          }
        },
        tokenRequired: false,
        tokenType: false
      }
    },
    localStorage: false
  },
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.API_BASE_URL,
    /*decimos que las credenciales sean true*/
    credentials: true
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          //loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
