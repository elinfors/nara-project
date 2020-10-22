import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, TouchableOpacity, Image } from "react-native";
import Modal from 'react-native-modal';
var plusBtn = require('../../Components/Images/plusBtn.png')


export default AddModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStage, setCurrentStage] = useState(1)

  const handleNext = () => {
    setCurrentStage(currentStage+1)
    console.log(currentStage)
  }

  const handleBack = () => {
    setCurrentStage(currentStage-1)
    console.log(currentStage)
  }

  const renderText = (stage) => {
    if (stage === 1) {
       return  <Text>this is stage 1</Text>; 
    }
    if(stage === 2){
      return  <Text>This is stage 2 </Text>; 
    }
    if(stage === 3){
      return  <Text>This is stage 3 </Text>; 
    }
}

  return (
    <>
      <TouchableOpacity onPress={() => {setModalVisible(true)}}
        style={backgroundColor='white'}
      >
    <Image source = {plusBtn}/>    
      </TouchableOpacity>

      <View style={styles.container}>
        <Modal
          backdropOpacity={0.3}
          isVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.contentView}
        >
          <View style={styles.content}>
            <Text style={styles.contentTitle}>Hi 👋!</Text>
            <Text>Hello from Overlay!</Text>
 
            {renderText(currentStage)}

            {/*NEXT BUTTON*/}
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={()=>handleNext()}>
              <Text style={styles.buttonTitle}>{currentStage === 3 ? 'Submit': 'Next'}</Text>
            </TouchableOpacity>
          </View>
          
                
        </Modal>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: '90%'
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  contentView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
	buttonStyle: {
    backgroundColor: '#7CA179',
    borderRadius: 100,
    marginBottom:10,
    height: 40,
    width:80,
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
}
});