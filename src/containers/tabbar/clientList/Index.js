import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import EHeader from '../../../components/common/EHeader';
import api from '../../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../../../themes';

const Index = ({ navigation }) => {
  const colors = useSelector(state => state.theme.theme);

  const [clientData, setClientData] = useState([]);
  const [user, setUserData] = useState(null);

  const getUser = async () => {
    let userData = await AsyncStorage.getItem('USER');
    userData = JSON.parse(userData);
    setUserData(userData);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchClientData();
    }
  }, [user]);

  const fetchClientData = () => {
    api
      .post('/booking/getAppBooking', { email: user?.email })
      .then((res) => {
        setClientData(res.data.data);
      })
      .catch((error) => {
        console.log('Error fetching client details by ID:', error);
      });
  };

  const handlePress = (item) => {
    navigation.navigate('ServiceList', { item });
  };

  const ListItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={localStyles.listItem}>
      <View style={localStyles.card}>
        <Text style={localStyles.heading}>{item.company_name}</Text>
        <Text style={localStyles.heading}>{item.phone}</Text>
        <Text>{item.address_street}</Text>
        <Text>{item.address_town}</Text>
        <Text>{item.billing_address_country}-{item.address_po_code}</Text>
        <Text style={[localStyles.heading, { paddingTop: 20 }]}>{item.time}</Text>
        <Text style={localStyles.heading}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={{ backgroundColor: colors.backgroundColor3 }}>
        <EHeader title="Client List" />
      </View>

      <FlatList
        data={clientData}
        keyExtractor={(item) => (item.company_id ? item.company_id.toString() : null)}
        renderItem={({ item }) => <ListItem item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default Index;

const localStyles = StyleSheet.create({
  heading: {
    fontSize: 16,
    color: '##D50000',
    fontWeight: '700',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderColor: '#222',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});
