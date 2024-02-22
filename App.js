
import React, { 
  useState,
  useEffect,
  useRef
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ToastAndroid,
  Platform
} from 'react-native';

import Alarm from './components/alarm';
import Screen from './components/screen';

import { format } from 'date-fns';
import * as Device from 'expo-device'
import { Ionicons } from '@expo/vector-icons';
import * as Notifications  from 'expo-notifications';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import ImageAlarm from './assets/alarm.png'
import CustomModal from './components/modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function schedulePushNotification(date) {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { date: date },
  });
  return identifier

}

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('my-key', jsonValue);
  } catch (e) {
    // saving error
  }
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('my-key');
    if(jsonValue){
      return JSON.parse(jsonValue);

    }else{
      return [];
    }
  } catch (e) {
    // error reading value
  }
};

export default function App() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [textError, setTextError] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [expoPushToken,setExpoPushToken] = useState()
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const  [modalVisible,setModalVisible] = useState(false)
  const [alarms, setAlarms] = useState([]);
  const [dataAlarm,setDataAlarm] = useState({})
  const [dataDate,setDate] = useState('')

const handleDateConfirm = async (date) => {
  const formattedDate = format(date, 'MM/dd/yyyy');
  const formattedTime = format(date, 'hh:mm a');
  setDataAlarm({formattedDate,formattedTime})
  setDate(date)

};

const AddAlarm = async () => {
  if(![title,note].includes('')){
    if( typeof dataAlarm.formattedDate === 'string' ){
      const identifier = await schedulePushNotification(dataDate)
      const newDate = {title,note, date: dataAlarm.formattedDate, time: dataAlarm.formattedTime,id: alarms.length + 1,identifier}
      setAlarms(prevAlarms => [...prevAlarms, newDate]);
      storeData([...alarms,newDate])
      setDatePickerVisibility(false)
      setModalVisible(false)
      setTitle('')
      setNote('')
      setDataAlarm({})
    }else{
      setAlarms(prevAlarms => [...prevAlarms, {title,note,id: alarms.length + 1, }]);
      storeData([...alarms,{title,note,id: alarms.length + 1}])
      setDatePickerVisibility(false)
      setModalVisible(false) 
      setTitle('')
      setNote('')
      setDataAlarm({})
    }
  }else{
    setTextError(true)
  }


}

const removeAlarm = (id) => {
  Alert.alert(
    'Eliminar recordatorio',
    '¿Estas seguro que quieras eliminar este recordatorio?',
    [
      {
        text: "OK",
        onPress: () => showToast(id),
        style: 'destructive'
      },
      {
        text: "Cancelar",
        style: 'cancel'
      }
    ]
  )
}

const showToast = async (id) => {
  const deleted = alarms.filter((alarm) => alarm.id !== id)
  setAlarms(deleted);
  storeData(deleted)


  const fieldate = alarms.find(alarm => alarm.id === id);
  if (fieldate.identifier !== undefined) {
    await Notifications.cancelScheduledNotificationAsync(fieldate.identifier);
  }

  ToastAndroid.show(
    'recordatorio eliminado',
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM
  )
}

const registerForPushNotificationsAsync = async () => {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
      return;
  }
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}

const renderItem = ({ item }) => (
  <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
    <Alarm data={item} deleteFn={removeAlarm}/>
  </View>
);

useEffect(() => {
  registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    setNotification(notification);
  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    console.log(response);
  });

  const dataLocal = getData().then(data =>   setAlarms(data)  ) 

  return () => {
    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  };
}, []);

  return (
    <Screen>
      <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 20 }}>Recordatorios</Text>
      <View style={{flexDirection: "row",justifyContent: "center",borderRadius: 1000}}>
        <Image style={{width: 100,height: 100,borderRadius: 100,marginTop: 16}} source={ImageAlarm} />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <Text>{expoPushToken}</Text>
      <FlatList
        data={alarms && alarms.length > 0 ? alarms : []}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={{ width: '100%' }}
      /> 
    </View>
    <CustomModal 
      showAlert={setDatePickerVisibility} 
      visible={modalVisible}
      onClose={() => setModalVisible(false)}  
      title={title}
      setTitle={setTitle}
      note={note}
      setNote={setNote}
      dataAlarm={dataAlarm}
      textError={textError}
      AddAlarm={AddAlarm}
    />
      <View style={{ position: 'absolute', bottom: 10,width: '100%',justifyContent: 'center',alignItems: "center"}}>
        <TouchableOpacity  onPress={()=> setModalVisible(true)} style={{backgroundColor: 'blue',padding: 20,borderRadius: 50}}>
            <Ionicons name="add-outline" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}