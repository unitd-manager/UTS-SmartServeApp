import { View, Text, TouchableHighlight, StyleSheet,Alert } from 'react-native'
import React, { createRef } from 'react'
import { useSelector } from 'react-redux';
import EHeader from '../../../components/common/EHeader';
import SignatureCapture from 'react-native-signature-capture';
import api from '../../../api/api';
import EText from '../../../components/common/EText';

const Index = ({ route,navigation }) => {
    const checkedItems = route.params.checkedItems;
    const bookingId = route.params.bookingId

    const colors = useSelector(state => state.theme.theme);

    const sign = createRef();

    const saveSign = () => {
        sign.current.saveImage();
    };

    const resetSign = () => {
        sign.current.resetImage();
    };

    const _onSaveEvent = (result) => {

        api
            .post('/booking/insertMedia', {
                img_encode:result.encoded,
                record_id:bookingId,
                room_name:"BookingPicture"
               
            })
            .then(() => {
                console.log('Signature uploaded successfully');
                alert('Signature Captured Successfully');
                navigation.navigate('ClientList');

            })
            .catch(error => {
                console.log('Error: ', error);
                Alert.alert('Network connection error.');
            });

        // alert('Signature Captured Successfully');
        // console.log("encoded", result.encoded);
        // console.log("pathName", dynamicSavePath);
    };

    const _onDragEvent = () => {
        console.log('dragged');
    };

   


    return (
        <View>
            <View style={{ backgroundColor: colors.backgroundColor3 }}>
                <EHeader title="Digi Sign" />
            </View>

            <View style={{ backgroundColor: colors.btnColorCard, paddingHorizontal: 20, paddingVertical: 15 }}>
                <EText type={'s16'} color={colors.white}>List of works completed</EText>
            </View>

            <View style={{ marginHorizontal: 10 }}>
                {Array.isArray(checkedItems) && checkedItems.map((item, i) => <View style={{ backgroundColor: colors.white, padding: 12, marginVertical: 5 }}>
                    <Text key={i}>{item.value}</Text>
                </View>)}
            </View>

            <View>
                <View style={{ backgroundColor: colors.btnColorCard, paddingHorizontal: 20, paddingVertical: 15,marginTop:30 }}>
                    <EText type={'s16'} color={colors.white}>Signature Capture Extended</EText>
                </View>

                <SignatureCapture
                    style={{ ...styles.signature }}
                    ref={sign}
                    onSaveEvent={_onSaveEvent}
                    onDragEvent={_onDragEvent}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    minStrokeWidth={4}
                    maxStrokeWidth={4}
                    viewMode={"portrait"}
                    backgroundColor="#d2d2d2"
                    strokeColor="#222222"
                    // savePath="http://43.228.126.245/smartco-api/storage/uploads/"
                />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableHighlight
                        style={styles.buttonStyle}
                        onPress={() => {
                            saveSign();
                        }}>
                        <Text style={{ color:'#fff' }}>Save</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.buttonStyle}
                        onPress={() => {
                            resetSign();
                        }}>
                        <Text style={{ color:'#fff' }}>Reset</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    signature: {
        borderColor: '#000033',
        borderWidth: 1,
        justifyContent: "center", alignItems: "center",
        height: 200, width: '90%', marginLeft: 'auto', marginRight: 'auto',
        marginTop:30
    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: '#D50000',
        margin: 10
    }
});