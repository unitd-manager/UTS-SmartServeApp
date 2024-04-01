// import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native'
// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import EHeader from '../../../components/common/EHeader'
// import { commonColor, styles } from '../../../themes';
// import CheckBox from 'react-native-check-box';
// import api from '../../../api/api';
// import EButton from '../../../components/common/EButton';
// import { moderateScale } from '../../../common/constants';

// const Index = ({ route, navigation }) => {
//     const bookingId = route.params.item.booking_id
//     const colors = useSelector(state => state.theme.theme);
//     const [data, setData] = useState();

//     useEffect(() => {
//         api
//             .get('/valuelist/getServiceValueList')
//             .then((res) => {
//                 setData(res.data.data.map(item => ({ ...item, checked: false })));
//             })
//             .catch((error) => {
//                 console.log('Error fetching client details by ID:', error);
//             });
//     }, []);

//     const handleCheckboxChange = (item) => {
//         setData((prevData) =>
//             prevData.map((dataItem) =>
//                 dataItem.key_text === item.key_text ? { ...dataItem, checked: !dataItem.checked } : dataItem
//             )
//         );
//     };

//     const getCheckedItems = () => (data ? data.filter((item) => item.checked) : []);

//     const renderItem = ({ item }) => (
//         <View style={{ ...localStyles.listItem }}>
//             <Text style={{ flex: 1, marginLeft: 10 }}>{item.key_text}</Text>
//             <CheckBox
//                 isChecked={item.checked}
//                 onClick={() => handleCheckboxChange(item)}
//             />
//         </View>
//     );

//     const CollectData = (getCheckedItems) => {
//         console.log("getCheckedItems", getCheckedItems);
//         navigation.navigate('DigiSign', { getCheckedItems, bookingId });
//     };


//     console.log("data",data)
//     return (
//         <View style={{ flex: 1, justifyContent: 'space-between' }}>
//             <View>
//                 <View style={{ backgroundColor: colors.backgroundColor3 }}>
//                     <EHeader title={strings.ServiceList} />
//                     <Text style={{ color: '#fff', fontSize: 16, paddingHorizontal: 20, paddingBottom: 10 }}>{route.params.item.company_name}</Text>
//                 </View>

//                 <FlatList
//                     data={data}
//                     renderItem={renderItem}
//                     keyExtractor={(item) => item.id}
//                 />
//             </View>
//             <EButton
//                     title={'Submit'}
//                     type={'S14'}
//                     color={colors.white}
//                     containerStyle={localStyles.skipBtnContainer}
//                     bgColor={colors.btnColorCard}
//                     onPress={() => CollectData(getCheckedItems())}
//                 />
//         </View>

//     );
// };

// export default Index;

// const localStyles = StyleSheet.create({
//     contentContainerStyle: {
//         ...styles.ph20,
//         ...styles.pb10,
//     },
//     listItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         borderBottomWidth: 1,
//         borderColor: '#ccc',
//         ...styles.ph20,
//         ...styles.p15,
//         marginLeft: 'auto',
//         marginRight: 'auto',
//     },
//     skipBtnContainer: {
//         width: '90%',
//         height: moderateScale(40),
//         borderRadius: moderateScale(5),
//         borderWidth: moderateScale(1),
//         borderColor: commonColor.lightblue,
//         marginLeft: 'auto',
//         marginRight: 'auto',
//         marginBottom:20
//     },
// });


import { View, Text, StyleSheet, FlatList ,Alert} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import EHeader from '../../../components/common/EHeader';
import { commonColor, styles } from '../../../themes';
import CheckBox from 'react-native-check-box';
import api from '../../../api/api';
import EButton from '../../../components/common/EButton';
import { moderateScale } from '../../../common/constants';

const Index = ({ route, navigation }) => {
    const bookingId = route.params.item.booking_id;
    const colors = useSelector(state => state.theme.theme);
    const [data, setData] = useState([]);
    const [additionalData, setAdditionalData] = useState([]);

    useEffect(() => {
        api.get('/valuelist/getServiceValueList')
            .then((res) => {
                setData(res.data.data);
                const uniqueKeyTexts = [...new Set(res.data.data.map(item => item.key_text))];
                Promise.all(uniqueKeyTexts.map(keyText =>
                    api.post('/valuelist/getServiceValueListKeyText', { key_text: keyText })
                ))
                .then((additionalResponses) => {
                    const updatedAdditionalData = additionalResponses.map((response, index) => ({
                        key_text: uniqueKeyTexts[index],
                        values: response.data.data.map(item => ({ ...item, checked: false }))
                    }));
                    setAdditionalData(updatedAdditionalData);
                })
                .catch((error) => {
                    console.log('Error fetching additional data:', error);
                });
            })
            .catch((error) => {
                console.log('Error fetching service value list:', error);
            });
    }, []);

    const handleCheckboxChange = (keyText, valuelistId) => {
        setAdditionalData(prevData => {
            const updatedData = prevData.map(dataItem => {
                if (dataItem.key_text === keyText) {
                    const updatedValues = dataItem.values.map(val =>
                        val.valuelist_id === valuelistId ? { ...val, checked: !val.checked } : val
                    );
                    return { ...dataItem, values: updatedValues };
                }
                return dataItem;
            });
            return updatedData;
        });
    };

    const getCheckedItems = () => {
        const checkedItems = additionalData.reduce((acc, item) => {
            item.values.forEach(val => {
                if (val.checked) {
                    acc.push(val);
                }
            });
            return acc;
        }, []);
        return checkedItems;
    };

    const renderItem = ({ item }) => (
        <View style={localStyles.listItem}>
            <Text style={{ flex: 1, marginLeft: 20, fontSize: 18 }}>{item.key_text}</Text>
            <View style={{ marginTop: 10, marginLeft: 20 }}>
                {additionalData.map(e => {
                    if (item.key_text === e.key_text) {
                        return e.values.map(value => (
                            <View key={value.valuelist_id} style={{ flexDirection: 'row', alignItems: 'center'}}>
                                <CheckBox
                                    isChecked={value.checked}
                                    onClick={() => handleCheckboxChange(item.key_text, value.valuelist_id)}
                                />
                                <Text key={value.valuelist_id}>{value.value}</Text>
                               
                            </View>
                        ));
                    }
                    return null;
                })}
            </View>
        </View>
    );
    
    const [submitting, setSubmitting] = useState(false);

    const CollectData = () => {
        if (submitting) {
            // If submission is already in progress, return
            return;
        }
    
        setSubmitting(true); // Set submitting flag to true
    
        const checkedItems = getCheckedItems(); // Get the checked items
        if (checkedItems.length > 0) {
            Promise.all(checkedItems.map(item =>
                api.post('/booking/insertBookingService', {
                    booking_id: bookingId,
                    service: item.value, // Save the service title
                    valuelist_id: item.valuelist_id // Assuming this is the ID needed to identify the service
                })
            ))
                .then(() => {
                    alert('Services successfully added.');
                    navigation.navigate('DigiSign', { checkedItems: getCheckedItems(), bookingId });
                })
                .catch(error => {
                    console.log('Error: ', error);
                    Alert.alert('Network connection error.');
                })
                .finally(() => {
                    setSubmitting(false); // Reset submitting flag after completion
                });
        } else {
            // Alert the user if no items are checked
            alert('Please select at least one service.');
            setSubmitting(false); // Reset submitting flag
        }
    };
    
    

    // const CollectData = () => {
    //     navigation.navigate('DigiSign', { getCheckedItems, bookingId });
    // };

    return (
        <View style={{backgroundColor: colors.white,  flex: 1 , justifyContent: 'space-between'}}>
            <View style={{ backgroundColor: colors.backgroundColor3 }}>
                <EHeader title={strings.ServiceList} />
                <Text style={{ color: '#fff', fontSize: 16, paddingHorizontal: 20, paddingBottom: 10 }}>
                    {route.params.item.company_name}
                </Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <EButton
                title={'Submit'}
                type={'S14'}
                color={colors.white}
                containerStyle={localStyles.skipBtnContainer}
                bgColor={colors.btnColorCard}
                onPress={CollectData}
            />
        </View>
    );
};

export default Index;

const localStyles = StyleSheet.create({
    contentContainerStyle: {
        ...styles.ph20,
        ...styles.pb10,
    },
    listItem: {
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        ...styles.ph20,
        ...styles.p15,
        backgroundColor:'white'
    },
    skipBtnContainer: {
        width: '90%',
        height: moderateScale(40),
        borderRadius: moderateScale(5),
        borderWidth: moderateScale(1),
        borderColor: commonColor.lightblue,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 20
    },
});
