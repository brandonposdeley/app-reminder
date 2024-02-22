import React from 'react';
import { Button, Text, View } from 'react-native';

function Alarm({ data ,deleteFn}) { 
  return (
    <View>
        <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: "center"}}>
            <View>
            <Text style={{fontSize: 20,fontWeight: 'bold'}}>{ data.title.length > 10 ? data.title.slice(0, 15) + '...' : data.title}</Text>
            <Text style={{color: 'gray',fontSize: 15}}>{data.note.length > 10 ? data.note.slice(0, 25) + '...' : data.note}</Text>
            {!data.title && (
              <>
              <Text style={{fontSize: 20,fontWeight: 'bold'}}>{data.time}</Text>
              <Text style={{color: 'gray',fontSize: 15}}>{data.date}</Text>
            </>
            )}
            </View>
            <Button onPress={() => deleteFn(data.id)} color='red' title='Eliminar' />
        </View>
    </View>
  );
}

export default Alarm;
