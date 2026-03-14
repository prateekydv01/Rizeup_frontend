import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./auth.slice.js"
import todoReducer from "./todo.slice.js"
import todoSectionReducer from "./todoSection.slice.js"

const store = configureStore({
    reducer:{
        auth:authReducer,
        todos: todoReducer,
        todoSections: todoSectionReducer,
        
    }
})

export default store;