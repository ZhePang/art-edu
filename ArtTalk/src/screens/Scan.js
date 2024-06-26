import React, { useState, useEffect, useRef } from 'react'; // Import useEffect and useRef
import { View, StyleSheet, Image, TouchableOpacity, Text, Modal, Button, TextInput, FlatList, Alert, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
const classDescriptions = {
    'Rococo': 'An 18th-century artistic movement and style.',
    'Expressionism': 'A modernist movement focusing on emotional experience rather than appearances.',
    'High Renaissance': 'The period in the history of Western art that traditionally falls in the 15th century in Italy and continues into the early 16th century.',
    'Magic Realism': 'A literary and artistic genre in which realistic narrative and naturalistic technique are combined with surreal elements of dream or fantasy.',
    'Ukiyo-e': 'A genre of Japanese art which flourished from the 17th through 19th centuries and produced woodblock prints and paintings of such subjects as female beauties, kabuki actors, and sumo wrestlers.',
    'Romanticism': 'An artistic, literary, musical, and intellectual movement that originated in Europe toward the end of the 18th century.',
    'Abstract Art': 'Art that does not attempt to represent an accurate depiction of visual reality but instead uses shapes, colors, forms, and gestural marks to achieve its effect.',
    'Op Art': 'A style of visual art that makes use of optical illusions.',
    'Color Field Painting': 'A style of abstract painting characterized chiefly by large areas of flat solid color spread across or stained into the canvas.',
    'Abstract Expressionism': 'An artistic movement that developed in the 1940s, characterized by large-scale abstract painted canvases.',
    'Pop Art': 'An art movement that emerged in the United Kingdom and the United States during the mid- to late-1950s.',
    'Naïve Art (Primitivism)': 'Art created by artists who lack formal education in the arts.',
    'Lyrical Abstraction': 'An artistic style characterized by the use of soft forms, gestural brushstrokes, and lyrical compositions.',
    'Early Renaissance': 'A period in the history of Western art that began in Italy in the 14th century and lasted until the late 15th century.',
    'Pointillism': 'A technique of painting in which small, distinct dots of color are applied in patterns to form an image.',
    'Post-Impressionism': 'An art movement that emerged in the late 19th century as a reaction against Impressionism.',
    'Neoclassicism': 'An artistic movement of the late 18th and early 19th centuries that characterized many works of literature, architecture, music, and visual art.',
    'Concretism': 'An abstract art movement which developed in Brazil in the mid-20th century.',
    'Baroque': 'A highly ornate and often extravagant style of architecture, art, and music that flourished in Europe from the early 17th to the late 18th century.',
    'Surrealism': 'A 20th-century avant-garde movement in art that sought to release the creative potential of the unconscious mind.',
    'Art Informel': 'A style of painting and sculpture that emerged in Europe in the years following World War II.',
    'Art Nouveau (Modern)': 'An international style of art, architecture, and applied art, especially the decorative arts, that was most popular between 1890 and 1910.',
    'Neo-Romanticism': 'A movement in the arts, taking place at the end of the 19th and the beginning of the 20th century, characterized by a return to the emotionalism and sublimity of Romanticism.',
    'Symbolism': 'A late 19th-century art movement of French, Russian, and Belgian origin in poetry and other arts.',
    'Fauvism': 'A style of painting with vivid expressionistic and non-naturalistic use of color that flourished in Paris from 1905.',
    'None': 'A placeholder or absence of a specific artistic movement or style.',
    'Academicism': 'A style of painting and sculpture produced under the influence of European academies or universities.',
    'Northern Renaissance': 'The Renaissance that occurred in Europe north of the Alps.',
    'Impressionism': 'A 19th-century art movement characterized by relatively small, thin, yet visible brush strokes, open composition, emphasis on accurate depiction of light in its changing qualities, ordinary subject matter, and inclusion of movement as a crucial element of human perception and experience.',
    'Realism': 'The attempt to represent subject matter truthfully, without artificiality and avoiding artistic conventions, implausible, exotic, and supernatural elements.',
    'Art Deco': 'A style of visual arts, architecture, and design that first appeared in France just before World War I.',
    'Minimalism': 'An art movement that began in post–World War II Western art, most strongly with American visual arts in the 1960s and early 1970s.',
    'Ink and wash painting': 'A type of East Asian brush painting that uses black ink, typically in various concentrations, on Chinese paper or silk.',
    'Mannerism (Late Renaissance)': 'A style in European art that emerged in the later years of the Italian High Renaissance around 1520.',
    'Cubism': 'An early-20th-century avant-garde art movement that revolutionized European painting and sculpture.',
  };
  


  
  const Scan = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [firstPhoto, setFirstPhoto] = useState(null);
    const [textPhoto, setTextPhoto] = useState(null);
    const [secondPhoto, setSecondPhoto] = useState(null);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [textModalVisible, setTextModalVisible] = useState(false);
    const [decisionModalVisible, setDecisionModalVisible] = useState(false);
    const [chatModalVisible, setChatModalVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef(); // Ref for FlatList to control scroll position

  
    useEffect(() => {
      (async () => {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasPermission(cameraStatus.status === 'granted');
        if (Platform.OS !== 'web') {
          const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (libraryStatus.status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }, []);

    const takeTextPicture = async () => {
      if (cameraRef) {
        const textPhoto = await cameraRef.takePictureAsync();
        setTextPhoto(textPhoto);
        setTextModalVisible(true);
      }
    };
  
    const takePicture = async () => {
      if (cameraRef) {
        const photo = await cameraRef.takePictureAsync();
        console.log(photo);
        setFirstPhoto(photo);
        setPhotoModalVisible(true);
      }
    };
  
    const pickImage = async () => {
      const photo = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(photo);
      if (!photo.canceled) {
        //console.log(photo['assets'][0]);
        setFirstPhoto(photo['assets'][0]);
        console.log(photo['assets'][0]);
        setPhotoModalVisible(true);
      } else {
        alert('You did not select any image.');
      }
    };
  
    const handleDecision = async (option) => {
      if (option === 'add') {
        // Assuming adding a second photo should open the picker again
        const second = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!second.canceled) {
          setSecondPhoto(second['assets'][0]);
          setDecisionModalVisible(false);
          // Process both photos
          await processPhotos(firstPhoto, secondPhoto);
        } else {
          alert('No second image selected, processing first image only.');
          await processPhotos(firstPhoto, null);
        }
      } else {
        // Process only the first photo
        await processPhotos(firstPhoto, null);
      }
    };

    const handleTextDecision = async (option) => {
      processtextPhotos(textPhoto);
      
    };
  
    const processtextPhotos = async (textPhoto) => {
      const manipResult = await manipulateAsync(
        textPhoto.localUri || textPhoto.uri,
        [],
        { compress: 1, format: SaveFormat.JPEG }
      );
 
      const secondFormData = new FormData();
      const secondBlob = await (await fetch(manipResult.uri)).blob();
      secondFormData.append('file', secondBlob, 'secondImage.jpg');
      try{
      const ocrResponse = await fetch('http://127.0.0.1:5000/recognize', {
                  method: 'POST',
                 
                  body: secondFormData,
              });
  
      const ocrResult = await ocrResponse.json();
      console.log('OCR result:', ocrResult);
      updateTextUI(ocrResult);
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Error processing images: ' + error.message);
  }
};

    const processPhotos = async (first, second) => {
      const manipResult = await manipulateAsync(
        first.localUri || first.uri,
        [],
        { compress: 1, format: SaveFormat.JPEG }
      );
 
      const firstFormData = new FormData();
      const firstFetchResponse = await fetch(manipResult.uri);
      const blob = await firstFetchResponse.blob();
      firstFormData.append('file', blob, 'image.jpg');
      
      console.log(firstFetchResponse);
      try {
          // Simultaneous requests to both servers
          const artServerUrl5003 = 'http://127.0.0.1:5003/predict';
          const artServerUrl5001 = 'http://127.0.0.1:5001/predict';
          const requests = [
              fetch(artServerUrl5003, {
                  method: 'POST',
                  
                  body: firstFormData,
              }),
              fetch(artServerUrl5001, {
                  method: 'POST',
                  
                  body: firstFormData,
              })
          ];
  
          const responses = await Promise.all(requests);
          console.log(responses);
          const results = await Promise.all(responses.map(res => res.json()));
  
          const artResult5003 = results[0];
          const artResult5001 = results[1];
  
          console.log('Response from server 5003:', artResult5003);
          console.log('Response from server 5001:', artResult5001);
  
          if (second) {
              const secondFormData = new FormData();
              const secondBlob = await (await fetch(second.uri)).blob();
              secondFormData.append('file', secondBlob, 'secondImage.jpg');
  
              const ocrResponse = await fetch('http://127.0.0.1:5000/recognize', {
                  method: 'POST',
                 
                  body: secondFormData,
              });
  
              const ocrResult = await ocrResponse.json();
              console.log('OCR result:', ocrResult);
              updateUI(artResult5003, artResult5001, ocrResult);

          } else{updateUI(artResult5003, artResult5001, second ? ocrResult : undefined)}
  
          
      } catch (error) {
          console.error('Error processing images:', error);
          alert('Error processing images: ' + error.message);
      }
  };
  const updateTextUI = (ocrResult) => {
    if (ocrResult){
      console.log(ocrResult);
      const ocrMessage = ocrResult ? `OCR Text: ${ocrResult.text}` : 'You can scan the text description to get more accurate response.';
      setMessages([{ id: Date.now(), text: `${ocrMessage}` }]);

    }else{
      console.log(ocrResult);

      const ocrMessage = ocrResult ? `OCR Text: ${ocrResult.text}` : 'You can scan the text description to get more accurate response.';
      setMessages([{ id: Date.now(), text: `${ocrMessage}` }]);


    }
    setChatModalVisible(true);
    setTextModalVisible(false);
};
  const cleanTitle = (originalTitle) => {
    const parts = originalTitle.split('_');
    const title = parts[0].replace('-', ' ').replaceAll(/[^\w\s]/g, ' ');
    const artist = parts[1].replace('-', ' ').replaceAll(/[^\w\s]/g, ' ');
    const time = parts[2];  

    return `${title} by artist ${artist} created in ${time}`;
        
    };
   
  const updateUI = (artResult5003, artResult5001, ocrResult) => {
      console.log(artResult5003);
      console.log(artResult5001);
      //const message5003 = `This artwork is likely to be: ${artResult5003.title}`;
      //const cleanTitle = artResult5003.title.replace(/_/g, ' ').replace(/[^\w\s]/gi, ' ');
      const cleanTitle5003 = cleanTitle(artResult5003.title);
      const message5003 = `This artwork is likely to be: ${cleanTitle5003}`;

      //const message5003 = `This artwork is likely to be: ${cleanTitle}`;

      const artDescription = classDescriptions[artResult5001.class] || "No description available for this class.";
      const artMessage = `The style is likely to be: ${artResult5001.class}. ${artDescription}`;
      if (ocrResult){
        console.log(ocrResult);
        const ocrMessage = ocrResult ? `OCR Text: ${ocrResult.text}` : 'You can scan the text description to get more accurate response.';
        setMessages([{ id: Date.now(), text: `${message5003}\n${artMessage}\n${ocrMessage}` }]);

      }else{
        console.log(ocrResult);

        const ocrMessage = ocrResult ? `OCR Text: ${ocrResult.text}` : 'You can scan the text description to get more accurate response.';
        setMessages([{ id: Date.now(), text: `${message5003}\n${artMessage}\n${ocrMessage}` }]);


      }
      //const ocrMessage = ocrResult ? `OCR Text: ${ocrResult.text}` : 'You can scan the text description to get more accurate response.';
      //setMessages([{ id: Date.now(), text: `${message5003}\n${artMessage}\n${ocrMessage}` }]);
      setChatModalVisible(true);
      setPhotoModalVisible(false);
  };
  
  
  
  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const lastMessage = messages.length > 0 ? messages[messages.length - 1].text : '';

    const messageToSend = { id: Date.now(), text: inputText, owner: 'user' };
    setMessages(messages => [...messages, messageToSend]);

    try {
        const response = await axios.post('http://0.0.0.0:8000/chat/', {
            question: inputText,
            context: lastMessage  // Sending the last message which includes art and OCR results
        });

        if (response.data && response.data.response) {
            setMessages(messages => [
                ...messages,
                { id: Date.now(), text: response.data.response, owner: 'bot' }
            ]);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }

    setInputText('');
};


  
    const handleCloseChat = () => {
      setChatModalVisible(false);
    };
  
    return (
      <View style={styles.container}>
        <Camera style={styles.camera} ref={setCameraRef} />
        <View style={styles.buttonContainer}>
             <TouchableOpacity onPress={takeTextPicture} style={styles.docscanButton}>
                 <MaterialIcons name="document-scanner" size={36} color="#fff" />
             </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <MaterialIcons name="camera" size={36} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <MaterialIcons name="photo-library" size={36} color="#fff" />
          </TouchableOpacity>
        </View>
  
        <Modal
          animationType="slide"
          transparent={false}
          visible={photoModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setPhotoModalVisible(!photoModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <Image source={{ uri: firstPhoto?.uri }} style={styles.modalImage} />
            <Text style={styles.modalText}>What would you like to do with this photo?</Text>
            <Button title="Add a picture of the text description" onPress={() => handleDecision('add')} />
            <Button title="Start chat with this photo" onPress={() => handleDecision('chat')} />
            <Button title="Retake" onPress={() => setPhotoModalVisible(false)} />
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={textModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setTextModalVisible(!textModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <Image source={{ uri: textPhoto?.uri }} style={styles.modalImage} />
            <Text style={styles.modalText}>You have provided a picture of the text description.</Text>
            <Button title="Start chat with this photo" onPress={() => handleTextDecision('chat')} />
            <Button title="Retake" onPress={() => setTextModalVisible(false)} />
          </View>
        </Modal>
  
        <Modal
          animationType="slide"
          transparent={false}
          visible={chatModalVisible}
          onRequestClose={handleCloseChat}
        >
          <View style={styles.chatContainer}>
          <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={[styles.messageBubble, item.owner === 'bot' ? styles.botMessage : styles.userMessage]}>
                                <Text style={styles.messageText}>{item.text}</Text>
                            </View>
                        )}
                        style={styles.chatContainer}
                    />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your message..."
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
            <Button title="Close Chat" style={styles.closeButton} onPress={handleCloseChat} />
          </View>
        </Modal>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalImage: {
    width: 300, 
    height: 300,
    marginBottom: 20,
  },
  
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  messageBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 10,
    marginVertical: 8,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom:5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#00a46c',
    borderRadius: 25,
    padding: 10,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#00a46c',
    borderRadius: 25,
    padding: 10,
    paddingTop:20,
  },
  buttonContainer: { // Adjusted container for buttons
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    //paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop:20,
    justifyContent: 'center',
  },
captureButton: { // Capture button centered
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //marginLeft:35
},
docscanButton:{
  flexGrow: 0,
  alignItems: 'flex-start',
  justifyContent: 'center',
  marginLeft:10
},
uploadButton: { // Upload button right
    flexGrow: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight:10
},
retakeButton: { 
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //marginRight:20
},
aiButton: { 
    flexGrow: 0,
    alignItems: 'center',
    paddingLeft:20,
    justifyContent: 'center',
},
  photo: {
    width: 200,
    height: 200,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#d1e7dd',  // A light green background for bot messages
},
userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#f0f0f0',  // A light grey background for user messages
}
});

export default Scan;
