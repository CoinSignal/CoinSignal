import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator
} from 'react-native';
import { fetchTopCryptos } from '../services/api';
import { COLORS } from '../constants/colors';

export default function HomeScreen({ navigation }) {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchTopCryptos();
    setCryptos(data);
    setLoading(false);
  };
// Add this import at the top
import AsyncStorage from '@react-native-async-storage/async-storage';

// Add this state at the top with other states
const [watchlist, setWatchlist] = useState([]);

// Add this function after loadData
const loadWatchlist = async () => {
  try {
    const saved = await AsyncStorage.getItem('watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const toggleWatchlist = async (coinId) => {
  try {
    let newWatchlist;
    if (watchlist.includes(coinId)) {
      newWatchlist = watchlist.filter(id => id !== coinId);
    } else {
      newWatchlist = [...watchlist, coinId];
    }
    setWatchlist(newWatchlist);
    await AsyncStorage.setItem('watchlist', JSON.stringify(newWatchlist));
  } catch (error) {
    console.error('Error:', error);
  }
};

// Update useEffect to call loadWatchlist
useEffect(() => {
  loadData();
  loadWatchlist();
}, []);

// Replace renderItem with this:
const renderItem = ({ item }) => {
  const change = item.price_change_percentage_24h || 0;
  const isUp = change >= 0;
  const isInWatchlist = watchlist.includes(item.id);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardMain}
        onPress={() => navigation.navigate('Details', { coin: item })}
      >
        <View style={styles.left}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.symbol}>{item.symbol.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.right}>
          <Text style={styles.price}>${item.current_price.toFixed(2)}</Text>
          <Text style={[styles.change, { color: isUp ? COLORS.success : COLORS.danger }]}>
            {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
          </Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.starBtn}
        onPress={() => toggleWatchlist(item.id)}
      >
        <Text style={styles.starIcon}>{isInWatchlist ? '★' : '☆'}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Add these new styles to StyleSheet
const styles = StyleSheet.create({
  // ... existing styles ...
  cardMain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starBtn: {
    padding: 15,
    justifyContent: 'center',
  },
  starIcon: {
    fontSize: 24,
    color: '#FFD700',
  },
});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CoinSignal</Text>
        <Text style={styles.subtitle}>Top Cryptocurrencies</Text>
      </View>
      
      <FlatList
        data={cryptos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  symbol: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
});