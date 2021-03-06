import React, { useState, useContext, useEffect} from 'react';
import { StyleSheet, View, ScrollView, Button, Text, TouchableOpacity,
     Image, TextInput, ShadowPropTypesIOS, Animated, 
     FlatList, Keyboard } from "react-native";
import { Slider } from 'react-native-elements';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {firebase} from '../../Firebase/config';
import moment from 'moment';
import styles from './stylesCompForm';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ProgressBar from './progressBar'

// CONTEXT
import {ModalVisibleContext} from '../../../App'
import {CurrentMealContext} from '../../../App'
import {CurrentUserContext} from '../../../App'

export default CompForm = () => {
    const {modalVisible, setModalVisible, toggleVisible} = useContext(ModalVisibleContext)
    const {currentMeal, setCurrentMeal, currentStage, setCurrentStage} = useContext(CurrentMealContext)
    const userContext = useContext(CurrentUserContext)
    const [didEat, setDidEat] = useState('comp')

    // STATES TO SEND TO FIREBASE
    const [compType, setCompType] = useState('')
    const [compTime, setCompTime] = useState('')
    const [feelRate, setFeelRate] = useState('')
    const [compWith, setCompWith] = useState('')
    const [compAt, setCompAt] = useState('')
    const [comment, setComment] = useState('')

    // "HELP-STATES"
    const [commentHelp, setCommentHelp] = useState('')

    const feeling = {1: 'Depressed', 2: 'Sad', 3: 'Neutral', 4:'Good', 5:'Happy'}



    const handleNext = () => {
        if(currentStage === 1 && compType === ''){
            alert('Please fill out how you compensated')
        }
        else if(currentStage === 2 && (compTime === '' ||feelRate === '' ||compWith === '' ||compAt === '')){
            alert('You need to fill out all the questions')
        }
        else{
            setCurrentStage(currentStage+1)
        }
    }

    
    const handleBack = () => {
        setCurrentStage(currentStage-1)
    }

    const handleType = (type) =>{
        setCompType(type)
    }
    const handleComment = () =>{
        setComment(commentHelp)
        //setCommentHelp('')
        Keyboard.dismiss()
    }

    const handleClose = () => {
        setModalVisible(false)
        setCurrentStage(0)
      }

    const handleSubmit = () =>{

        var mealsRef = firebase.firestore().collection('users').doc(userContext.user.uid).collection('comp')
        .doc(moment().utcOffset('+01:00').format('YYYY-MM-DD')).collection('compToday')
        mealsRef.add({
            compType: compType,
            compTime: compTime,
            feelRate: feelRate,
            compWith: compWith,
            compAt: compAt,
            comment: comment,
            timestamp: moment().utcOffset('+01:00').format('YYYY-MM-DD HH:mm:ss'),
            date: moment().utcOffset('+01:00').format('YYYY-MM-DD'),
            type: 'compensation'
        })
        .then(function(){
            console.log('success')
        })
        .catch(function(error){
            console.log('error: ', error)
        })

    setCurrentStage(currentStage+1)
    setTimeout(() => {
        setModalVisible(false)
        setCurrentStage(0)
      }, 1500);
        
    }

    const renderText = (stage) =>{
        if (stage === 1) {
            return (<>
                <View style={styles.typeView}>
                    <Text>How did you compensate?</Text>
                    <View style={styles.stage1BtnView}>
                        <TouchableOpacity 
                            style={compType === 'training' ? styles.buttonStyle : styles.buttonStyleInactive}
                            onPress={()=>handleType('training')}>
                            <Text style={compType === 'training' ? styles.buttonTitle : styles.buttonTitleInactive}>Training</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={compType === 'purgation' ? styles.buttonStyle : styles.buttonStyleInactive}
                            onPress={()=>handleType('purgation')}>
                            <Text style={compType === 'purgation' ? styles.buttonTitle : styles.buttonTitleInactive}>Purgation</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.stage1BtnView}>
                        <TouchableOpacity 
                            style={compType === 'regurgitation' ? styles.buttonStyle : styles.buttonStyleInactive}
                            onPress={()=>handleType('regurgitation')}>
                            <Text style={compType === 'regurgitation' ? styles.buttonTitle : styles.buttonTitleInactive}>Regurgitation</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={compType === 'binge' ? styles.buttonStyle : styles.buttonStyleInactive}
                            onPress={()=>handleType('binge')}>
                            <Text style={compType === 'binge' ? styles.buttonTitle : styles.buttonTitleInactive}>Binge-eating</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </>)
        }
        if (stage === 2) {
            return (<>
        <View style={{height:'90%'}}>
          {/* SECTION */}
          <View style={styles.section}>
             {/* HEADLINE */}
            <View style={styles.sectionHeadline}>
                <Text>When did you compensate?</Text>
            </View>
            {/* SECTION CONTENT (BUTTONS) */}
            <View style={styles.sectionContent}>
                <TouchableOpacity 
                        style={compTime === 'I just did' ? styles.buttonStyle : styles.buttonStyleInactive}
                        onPress={()=>setCompTime('I just did')}>
                        <Text style={compTime === 'I just did' ? styles.buttonTitle : styles.buttonTitleInactive}>
                            I just did</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={compTime === 'Less than 1 hour ago' ? styles.buttonStyle : styles.buttonStyleInactive}
                        onPress={()=>setCompTime('Less than 1 hour ago')}>
                        <Text style={compTime === 'Less than 1 hour ago' ? styles.buttonTitle : styles.buttonTitleInactive}>
                            Less than 1 hour ago</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={compTime === 'More than 1 hour ago' ? styles.buttonStyle : styles.buttonStyleInactive}
                        onPress={()=>setCompTime('More than 1 hour ago')}>
                        <Text style={compTime === 'More than 1 hour ago' ? styles.buttonTitle : styles.buttonTitleInactive}>
                            More than 1 hour ago</Text>
                    </TouchableOpacity>
                </View>
            {/* END SECTION */}
            </View>

            {/* SECTION */}
          <View style={styles.section}>
             {/* HEADLINE */}
            <View style={styles.sectionHeadline}>
                <Text>How are you feeling overall?</Text>
            </View>
            {/* SECTION CONTENT (SLIDER) */}
            <View style={styles.sectionContent}>
                <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
                    <Slider
                    value={feelRate}
                    onValueChange={value => setFeelRate(value)}
                    maximumValue={5}
                    minimumValue={1}
                    step={1}
                    trackStyle={{ height: 7, backgroundColor: 'transparent' }}
                    thumbStyle={{ height: 20, width: 20, backgroundColor: '#A3C39D' }}
                    />
                    <Text style={{alignSelf:'center', fontSize:10}}>Value: {feeling[feelRate.toString()]}</Text>
                </View>
            </View>
            {/* END SECTION */}
            </View>

          {/* SECTION */}
          <View style={styles.section}>
             {/* HEADLINE */}
            <View style={styles.sectionHeadline}>
                <Text>Who were you with when this occured?</Text>
            </View>
            {/* SECTION CONTENT (BUTTONS) */}
            <View style={styles.sectionContent}>
                <TouchableOpacity 
                        style={compWith === 'myself' ? styles.buttonStyle : styles.buttonStyleInactive}
                        onPress={()=>setCompWith('myself')}>
                        <Text style={compWith === 'myself' ? styles.buttonTitle : styles.buttonTitleInactive}>Myself</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={compWith === 'friends' ? styles.buttonStyle : styles.buttonStyleInactive}
                        onPress={()=>setCompWith('friends')}>
                        <Text style={compWith === 'friends' ? styles.buttonTitle : styles.buttonTitleInactive}>Friends</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={compWith === 'family' ? styles.buttonStyle : styles.buttonStyleInactive}
                        onPress={()=>setCompWith('family')}>
                        <Text style={compWith === 'family' ? styles.buttonTitle : styles.buttonTitleInactive}>Family</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={compWith === 'other' ? styles.buttonStyle : styles.buttonStyleInactive}
                        onPress={()=>setCompWith('other')}>
                        <Text style={compWith === 'other' ? styles.buttonTitle : styles.buttonTitleInactive}>Other</Text>
                    </TouchableOpacity>
                </View>
            {/* END SECTION */}
            </View>

          {/* SECTION */}
          <View style={styles.section}>
             {/* HEADLINE */}
            <View style={styles.sectionHeadline}>
                <Text>Where were you when you compensated?</Text>
            </View>
            {/* SECTION CONTENT (BUTTONS) */}
            <View style={styles.sectionContent}>
                <TouchableOpacity 
                        style={compAt === 'home' ? styles.buttonStyle : styles.buttonStyleInactive}
                        onPress={()=>setCompAt('home')}>
                        <Text style={compAt === 'home' ? styles.buttonTitle : styles.buttonTitleInactive}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={compAt === 'school' ? styles.buttonStyle : styles.buttonStyleInactive}
                        onPress={()=>setCompAt('school')}>
                        <Text style={compAt === 'school' ? styles.buttonTitle : styles.buttonTitleInactive}>School</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={compAt === 'work' ? styles.buttonStyle : styles.buttonStyleInactive}
                        onPress={()=>setCompAt('work')}>
                        <Text style={compAt === 'work' ? styles.buttonTitle : styles.buttonTitleInactive}>Work</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={compAt === 'other' ? styles.buttonStyle : styles.buttonStyleInactive}
                        onPress={()=>setCompAt('other')}>
                        <Text style={compAt === 'other' ? styles.buttonTitle : styles.buttonTitleInactive}>Other</Text>
                    </TouchableOpacity>
                </View>
            {/* END SECTION */}
            </View>

            </View>
            </>)
        }
        if (stage === 3) {
            return (<>
            <View style={styles.commentView}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Text>Is there anything you would like to elaborate on?</Text>
                    <TextInput
                                style={styles.inputComment}
                                placeholder='Comment the compensation'
                                placeholderTextColor="#aaaaaa"
                                onChangeText = {text => setCommentHelp(text)}
                                onSubmitEditing={()=>handleComment()}
                                value = {commentHelp}
                                returnKeyType="done"
                                autoCorrect={false}
                                multiline={true}
                                //onSubmitEditing={Keyboard.dismiss}
                            />
                </TouchableWithoutFeedback>
            </View>
            </>)
        }
        if(stage === 4){
            return  (<>
            <View style={styles.submitView}>
                <Text style={{fontSize:17}}>Compensation Submitted</Text>
                <Ionicons name={'ios-checkmark-circle-outline'} size={80} color={'#7CA179'} />
            </View>
            </>)
          }

    }

    return(
        <>
        <View style={styles.ModalView}>

            <View style={styles.headlineView}>
            <TouchableOpacity onPress={()=>handleBack()}>
                <Ionicons name={'ios-arrow-back'} size={30} color={'black'} />
            </TouchableOpacity>
            <Text style={styles.modalHeadline}>COMPENSATION</Text>
            <TouchableOpacity onPress={()=>handleClose()}>
                <Ionicons name={'ios-close'} size={40} color={'black'} />
            </TouchableOpacity>
            </View>
            <ProgressBar style={{alignSelf:'flex-start'}} props={didEat}></ProgressBar>

            <View style={styles.constumContentView}>

                {renderText(currentStage)}
            </View>

            {/*SUBMIT BUTTON*/}
            {currentStage === 3 ?
            <View style={styles.nextBtnView}>
                <TouchableOpacity
                    style={styles.nextBtn}
                    onPress={()=>handleSubmit()}>
                    <Text style={styles.nextBtnTitle}>Submit</Text>
                </TouchableOpacity>
            </View>
            :
            currentStage === 4 ?
            <View></View>
            :
            /*NEXT BUTTON*/
            <View style={styles.nextBtnView}>
                <TouchableOpacity
                style={styles.nextBtn}
                onPress={()=>handleNext()}>
                <Text style={styles.nextBtnTitle}>Next</Text>
                </TouchableOpacity>
            </View>
            }

        </View>
        </>
    )

}

