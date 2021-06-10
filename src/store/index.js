import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mapObject: null
  },
  mutations: {
    SET_NEW_MAPOBJECT(state, newMapObject){
      state.mapObject = newMapObject;
    }
  },
  actions: {
    action_set_new_mapObject(context, mapObject){
      context.commit('SET_NEW_MAPOBJECT', mapObject)
    }
  },
  getters:{
    getter_get_mapObject: (state) => {
      return state.mapObject;
    }
  },
  modules: {
  }
})
