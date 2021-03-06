import React, {useState, useEffect, useContext, createContext} from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView} from 'react-native'
import { Card, Divider } from 'react-native-elements';
import {firebase} from '../Firebase/config'
import styles from './styles'
import {CurrentUserContext} from '../../App'
import {ModalVisibleContext} from '../../App'
import {CurrentMealContext} from '../../App'
import {MealPlanContext} from '../../App'
import {RegMealContext} from '../../App'
import Ionicons from 'react-native-vector-icons/Ionicons';

import moment from 'moment';



export default function HomeScreen({navigation}) {



    const [currentUser, setCurrentUser] = useState(null)
    const {modalVisible, setModalVisible, toggleVisible} = useContext(ModalVisibleContext)
    const {currentMeal, setCurrentMeal, currentStage, setCurrentStage} = useContext(CurrentMealContext)
    const {mealPlan, setMealPlan} = useContext(MealPlanContext)
    const userContext = useContext(CurrentUserContext)

    // CONTEXT FOR CLICKED MEAL THAT ARE ALREADY REGISTERD
    const {regMeal, setRegMeal} = useContext(RegMealContext)



    //const [Food, setFood] = useState('')
    //const [Mood, setMood] = useState('')

    const [todayMealsList, setTodayMealsList] = useState([])
    const [todayMealsObj, setTodayMealsObj] = useState({})
    const [extraSnack, setExtraSnack] = useState([])
    const [todayComp, setTodayComp] = useState([])


    //const userId = props.extraData.uid
    const userId = useContext(CurrentUserContext)
    //console.log(userId)


    useEffect(()=>{
        var allMeals = firebase.firestore().collection('users').doc(userContext.user.uid)
        .collection('meals').doc(moment().utcOffset('+01:00').format('YYYY-MM-DD')).collection('mealsToday')
        var mealObj = {}
        allMeals.onSnapshot(function(querySnapshot){
            var mealList = []
            
            querySnapshot.forEach(function(doc){
                //if(doc.data().date === moment().utcOffset('+01:00').format('YYYY-MM-DD')){
                    mealList.push(doc.data().type)
                    mealObj[doc.id] = doc.data()
                    
               // }
            })
            setTodayMealsList(mealList)
            setTodayMealsObj(mealObj)
        })

        var TodaysExtraSnack = firebase.firestore().collection('users').doc(userContext.user.uid)
        .collection('extraSnack').doc(moment().utcOffset('+01:00').format('YYYY-MM-DD')).collection('mealsToday')
        TodaysExtraSnack.onSnapshot(function(querySnapshot){
            var extraSnackList = []

            querySnapshot.forEach(function(doc){
                extraSnackList.push(doc.data())
            })
            setExtraSnack(extraSnackList)
        })

        var TodaysComp = firebase.firestore().collection('users').doc(userContext.user.uid)
        .collection('comp').doc(moment().utcOffset('+01:00').format('YYYY-MM-DD')).collection('compToday')
        TodaysComp.onSnapshot(function(querySnapshot){
            var todayCompList = []

            querySnapshot.forEach(function(doc){
                todayCompList.push(doc.data())
            })
            setTodayComp(todayCompList)
        })
        
    },[])

   function addMeal(meal_type){
       if(todayMealsList.includes(meal_type.id)){
        Object.keys(todayMealsObj).forEach(function(item){
            //console.log(todayMealsObj[item].type)
            if(meal_type.id === todayMealsObj[item].type){
                setRegMeal(todayMealsObj[item])
                setModalVisible(true)
                setCurrentStage(10)
            }
        })
       }
       else if(meal_type.type ==='Extra Snack'){
        extraSnack.forEach(function(item){
            if(meal_type.timestamp === item.timestamp){
                setRegMeal(item)
                setModalVisible(true)
                setCurrentStage(10)
            }
        })
       }
       else if(meal_type.type === 'compensation'){
        todayComp.forEach(function(item){
            if(meal_type.timestamp === item.timestamp){
                setRegMeal(item)
                setModalVisible(true)
                setCurrentStage(11)
            }
        })
       }
       else{
        setModalVisible(true)
        setCurrentMeal(meal_type.id)
        setCurrentStage(1) 
       }
   }

   const mealDone = (mealType) =>{
    if(todayMealsList.includes(mealType)){
        return true
    }
    else{
        return false
    }
   }

   function mealCardStyle(mealType){
    var style = 0
    if(todayMealsList.includes(mealType)){
        Object.keys(todayMealsObj).forEach(function(meal){
            if(mealType === todayMealsObj[meal].type){
                if(todayMealsObj[meal].didEat === true){
                    console.log(todayMealsObj[meal])
                    style = 2
                }
                else{
                    style = 1
                }
            }
           })
    }
    else{
        style = 0
    }
    return style
   }

   mealPlanList = (mealPlan) => {
    mealPlan.sort((a, b) => (a.time.substr(0,2) > b.time.substr(0,2)) ? 1 
        : (a.time.substr(0,2) === b.time.substr(0,2)) 
        ? ((a.time.substr(3,4) > b.time.substr(3,4)) 
        ? 1 : -1) : -1)
    //(a.color === b.color) ? ((a.size > b.size) ? 1 : -1) : -1 )
  
    return mealPlan.map(meal => {
        console.log(mealCardStyle(meal.id))

      return (
        <TouchableOpacity
                    //style={ mealDone(meal.id) ? ( mealEaten(meal.id) ? styles.mealCardDone : styles.mealCardNotEaten ):styles.mealCard}
                    style={mealCardStyle(meal.id) === 2 ? styles.mealCardDone :
                        mealCardStyle(meal.id) === 1 ? styles.mealCardNotEaten: styles.mealCard}
                    onPress={() => addMeal(meal)}>
                    <Text style={ mealDone(meal.id) ? styles.cardTitleDone:styles.cardTitle}>{ mealDone(meal.id)? '':'ADD '} {meal.name.toUpperCase()}</Text>
            </TouchableOpacity>
      );
      
    });
  };

const extraMealsList = (extra) =>{
    return extra.map(meal =>{
        return (
            <TouchableOpacity
                    style={styles.mealCardDone}
                    onPress={() => addMeal(meal)}>
                    <Text style={styles.cardTitleDone}>EXTRA</Text>
            </TouchableOpacity>
        );
    });
  };

  const todayCompList = (comp) =>{
    return comp.map(item =>{
        return (
            <TouchableOpacity
                    style={styles.mealCardComp}
                    onPress={() => addMeal(item)}>
                    <Text style={styles.cardTitleDone}>COMPENSATION</Text>
            </TouchableOpacity>
        );
    });
  };

    useEffect(()=>{
        setCurrentUser(userId.user.uid)
        setMealPlan(mealPlan)
    }, [])

    return (
        <View>

            <View>
            <ScrollView style={styles.scrollView}>
                {/*<View style={styles.headlineBackground}>*/}
                <Text style={styles.description}>Register today’s meals here! </Text>
                {/*</View>*/}
            <View>
                {mealPlanList(mealPlan)}
            </View>
            <Divider style={{marginTop:10, marginBottom:10}}></Divider>
            <Text style={styles.description}>{extraSnack.length === 0 ? '' : 'Snacks that were not in meal plan'}</Text>
            <View>
                {extraMealsList(extraSnack)}
            </View>
             <Text style={styles.description}>{todayComp.length === 0 ? '' : 'Registered compensation'}</Text>
            <View>
                {todayCompList(todayComp)}
            </View>
            </ScrollView>
            </View>
           
{/*
            <TouchableOpacity
                    style={styles.mealCard}
                    onPress={() => {addMeal('Breakfast')}}>
                    <Text style={styles.cardTitle}>Breakfast</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={styles.mealCard}
                    onPress={() => {addMeal('Morning snack')}}>
                    <Text style={styles.cardTitle}>Morning snack</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={styles.mealCard}
                    onPress={() => {addMeal('Lunch')}}>
                    <Text style={styles.cardTitle}>Lunch</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={styles.mealCard}
                    onPress={() => {addMeal('Afternoon snack')}}>
                    <Text style={styles.cardTitle}>Afternoon snack</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={styles.mealCard}
                    onPress={() => {addMeal('Dinner')}}>
                    <Text style={styles.cardTitle}>Dinner</Text>
            </TouchableOpacity>
            <TouchableOpacity
                    style={styles.mealCard}
                    onPress={() => {addMeal('Evening snack')}}>
                    <Text style={styles.cardTitle}>Evening snack</Text>
            </TouchableOpacity>

    */}

        </View>
    );
};
