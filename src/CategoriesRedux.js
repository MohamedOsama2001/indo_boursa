import { useParams } from "react-router-dom"

//actions
export const fetchData = () => async dispatch => {
    const response=await fetch('http://127.0.0.1:8000/api/categories')
    const data=await response.json()
    dispatch({type:'SET_DATA',payload:data})    
}
export const fetchSubCategory = () => async dispatch => {
    const response=await fetch('http://127.0.0.1:8000/api/categories')
    const data=await response.json()
    dispatch({type:'SET_DATA',payload:data})    
}
//reducer
const initialState={
    data:[],
    data2:[]
}
export const dataReducer=(state=initialState,action)=>{
    switch(action.type){
        case 'SET_DATA':
            return {...state,data:action.payload}
        case 'SET_DATA2':
            return {...state,data2:action.payload}    
        default:
            return state;    
    }

}