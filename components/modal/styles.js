import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		textAlign: 'center',
		fontSize: 25,
		marginBottom: 10,
	},
	modalContent: {
		flexDirection: 'column',
		width: 300,
		padding: 10,
		paddingVertical: 40,
		backgroundColor: 'white',
		borderRadius: 10,
	},
	inputContainer: {
		gap: 10,
		justifyContent: 'space-around',
	},
	input : {
		borderWidth: 1,
		paddingLeft: 4,
		borderRadius: 5
	},
	inputDescription: {
		borderWidth: 1,
		paddingLeft: 4,
		borderRadius: 5,
		minHeight: 100,
		textAlignVertical: 'top'
	},
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ajusta el color y opacidad del overlay
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default styles;
