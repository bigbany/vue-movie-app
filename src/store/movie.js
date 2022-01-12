import axios from 'axios'
import _uniqBy from 'lodash/uniqBy'

const _defaultMessage = 'Search for the movie title!'

export default{
  //namespaced : store내에서 movie가 모듈화될 수 있는지를 나타냄.
  namespaced: true,
  // data!
  state: ()=> ({
      movies: [],
      message: _defaultMessage,
      loading: false,
      theMovie: {}
    })
  ,
  //computed!
  getters: {
    // movieIds(state){
    //   return state.movies.map(m=> m.imdbID)
    // }
  },
  // methods!
  mutations:{
    // assignMovies(state, Search){
    //   state.movies= Search
    // },
    updateState(state, payload){
      //['movies','message','loading'] 키가 반환되는 배열이 만들어진다.
      Object.keys(payload).forEach(
        key=>{
          state[key]=payload[key]
        }
      )
    },
    resetMovies(state){
      state.movies=[]
      state.message= _defaultMessage
      state.loading= false
    }
  },
  //비동기 방식
  actions: {
    async searchMovies({commit, state }, payload  ){
      if(state.loading)return
      

      commit('updateState',{
        message: '',
        loading: true
      })

     try{
         // const {title, type, number, year} = payload
      // const OMDB_API_KEY ='7035c60c'
      const res = await _fetchMovies({
        ...payload,
        page: 1
      })
      console.log(res)
      const {Search, totalResults} = res.data
      commit('updateState', {
        movies: _uniqBy(Search,'imdbID')
        // message: 'Hello World!',
        // loading: true
      })
      console.log(totalResults)
      console.log(typeof totalResults)
      
      const total = parseInt(totalResults, 10)
      const pageLength = Math.ceil(total/10)
      
      // 추가 요청을 해야한다.
      if(pageLength>1){
        for(let page = 2; page<= pageLength; page +=1){
          if(page> payload.number /10) break;
          
          const res = await _fetchMovies({
            ...payload,
            page
          }) 
          const {Search} = res.data
          commit('updateState',{
            movies: [...state.movies, ..._uniqBy(Search, 'imdbID')]
          })
        }
      }

     } catch({message}){
      commit('updateState',{
        movies: [],
        message
      })
     } finally{
       commit('updateState', {
         loading: false
       })
     }
    },
    async searchMovieWithId({state, commit},payload){  
      if(state.loading)return
      

      commit('updateState',{
        theMovie: {},
        loading: true
      })
      try{
        const res = await _fetchMovies(payload)
        console.log(res.data)
        commit('updateState',{
          theMovie: res.data
        })
      }
      catch(error){
        commit('updateState',{
          theMovie: {}
        })
      }
      finally{
        commit('updateState',{
          loading: false
        })
      }
    }
  } 
} 

async function _fetchMovies(payload){
 return await axios.post('/.netlify/functions/movie', payload)
}