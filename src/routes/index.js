import { createRouter, createWebHashHistory} from 'vue-router'
import Home from './Home'
import About from './About'
import Movie from './Movie'
import NotFound from './NotFound'

export default createRouter ({
 
  // hash 모드, history 모드 두가지가 있다. (여기선 hash)
  // https://google.com/#/search 이런게 hash 모드 예시 
  history: createWebHashHistory(),
  // routes에서 페이지를 구분한다.
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },

  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '/Movie/:id',
      component: Movie
    },
    {
      path: '/:notFound(.*)',
      component: NotFound

    }
  ]
})