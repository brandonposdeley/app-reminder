import React, { useState } from 'react';

import {
    Button,
	Modal,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

import styles from './styles';

const CustomModal = ({
	visible = true,
	onClose,
    dataAlarm,
    showAlert,
    title, 
    setTitle,
    note,
    setNote,
    textError,
    AddAlarm,
}) => {
	return (
		<Modal transparent={true} onRequestClose={onClose} animationType='slide' visible={visible}>
			<TouchableOpacity
				style={styles.overlay}
				activeOpacity={1}
				onPress={onClose}
			>
                <View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<View style={styles.inputContainer}>
                            <Text style={styles.title}>Tu recordatorio</Text>
							<View>
                            <TextInput 
                             placeholder="Titulo"
                             style={styles.input}
                             onChangeText={newText => setTitle(newText)}
                             defaultValue={title}
                              />
                            </View>
                            <View>
                                <TextInput 
                                    placeholder="Descripcion"
                                    style={styles.inputDescription}
                                    onChangeText={newText => setNote(newText)}
                                    defaultValue={note}
                              /> 
                              {textError && <Text style={{textAlign: 'center'}}>todos los campones son obligatoriios</Text>}
                            </View>
                            <Button onPress={() => showAlert(true)} title='agregar hora' />
                            {dataAlarm?.formattedDate &&  <Text>Fecha: {dataAlarm.formattedDate}</Text>}
                            {dataAlarm?.formattedTime &&  <Text>Hora: {dataAlarm.formattedTime}</Text>}
                            <Button onPress={AddAlarm} title='Guardar' />
						</View>
					</View>
				</View>			
            </TouchableOpacity>
		</Modal>
	);
};

export default CustomModal;
