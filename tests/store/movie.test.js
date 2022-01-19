import movieStore from '~/store/movie'
import _cloneDeep from 'lodash/cloneDeep'
import axios from 'axios'

describe('store/movie.js',()=>{
  let store

  beforeEach(()=>{
    store = _cloneDeep(movieStore)
    // 객체 데이터를 그대로 가져오면 데이터가 오염될 수 있다
    // lodash cloneDeep 으로 안전하게 가져오자 
    store.state = store.state()
    //store.state 에 함수를 실행했으므로 이제 store.state로 
    // 바로 데이터에 접근할 수 있다. 데이터처럼 사용가능
    store.commit = (name, payload)=>{
      store.mutations[name](store.state, payload)
    }
    // store는 객체 데이터일 뿐이다.
    // 메서드들을 등록해야 사용할 수 있다.
    store.dispatch = (name, payload)=>{
      const context = {
        state: store.state,
        commit: store.commit,
        dispatch: store.dispatch
      }
      return store.actions[name](context, payload)
    }
    // test 에서  store.commit, store.dispatch를 사용할 수 있어야한다.
    // actions는 비동기로 작동하기 때문에 return 키워드를 사용해야한다.
  })

  test('영화 데이터를 초기화 합니다.', ()=>{
    store.commit('updateState',{
      movies: [{ imdbID: '1'}],
      message: 'Hello world',
      loading: true
    })
    store.commit('resetMovies')
    expect(store.state.movies).toEqual([])
    expect(store.state.message).toBe('Search for the movie title!')
    expect(store.state.loading).toBe(false)
  
  })

  test('영화 목록을 잘 가져온 경우 데이터를 확인합니다.', async ()=>{
    const res = { data: {
            totalResults: '1',
            Search: [
              {
                imdbID: '1',
                Title: 'Hello',
                Poster: 'hello.jpg',
                Year: '2021'
              }
            ]
          }

    }
    axios.post = jest.fn().mockResolvedValue(res)
    await store.dispatch('searchMovies')
    expect(store.state.movies).toEqual(res.data.Search)
  })


  test('영화 목록을 가져오지 못한 경우 에러 메시지를 확인합니다.',async()=>{
    const errorMessage = 'Network Error.'
    axios.post = jest.fn().mockRejectedValue(new Error(errorMessage))
    await store.dispatch('searchMovies')
    expect(store.state.message).toBe(errorMessage )
  })

  test('영화 아이템이 중복된 경우 고유하게 처리합니다.', async()=>{
    const res = { 
      data: {
      totalResults: '1',
      Search: [
        {
          imdbID: '1',
          Title: 'Hello',
          Poster: 'hello.jpg',
          Year: '2021'
        },
        {
          imdbID: '1',
          Title: 'Hello',
          Poster: 'hello.jpg',
          Year: '2021'
        },
        {
          imdbID: '1',
          Title: 'Hello',
          Poster: 'hello.jpg',
          Year: '2021'
        }
      ]
    } }
    axios.post = jest.fn().mockResolvedValue(res)
    await store.dispatch('searchMovies')
    expect(store.state.movies.length).toBe(1)
  })

  test('단일 영화의 상세정보를 잘 가져온 경우 데이터를 확인합니다.', async()=>{
    const res = { 
      data: {
      totalResults: '1',
      Search: [
        {
          imdbID: '1',
          Title: 'Hello',
          Poster: 'hello.jpg',
          Year: '2021'
        }]
  }}
  axios.post = jest.fn().mockResolvedValue(res)
  await store.dispatch('searchMovieWithId')
  expect(store.state.theMovie).toEqual(res.data)

})
})