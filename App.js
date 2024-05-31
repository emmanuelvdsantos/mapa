import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
const App = () => {
const [movieTitle, setMovieTitle] = useState('');
const [movieData, setMovieData] = useState(null);
const [location, setLocation] = useState(null);
useEffect(() => {
(async () => {
let { status } = await Location.requestForegroundPermissionsAsync();
if (status !== 'granted') {
Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
return;
}
let locationData = await Location.getCurrentPositionAsync({});
setLocation(locationData);
})();
}, []);
const handleSearch = async () => {
if (movieTitle.trim() === '') {
Alert.alert('Aviso', 'Titulo de filme inválido.');
return;
}
try {
const apiKey = 'YOUR_OMDB_API_KEY'; // Substitua pelo seu próprio API Key
const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;
const response = await fetch(apiUrl);
const data = await response.json();
if (data.Response === 'True') {
setMovieData(data);
} else {
Alert.alert('Erro', 'Filme não encontrado. Verifique se o título foi digitado corretamente e tente novamente.');
}
} catch (error) {
console.error(error);
Alert.alert('Erro', 'Desculpe, houve um problema na busca do filme. Tente novamente.');
}
};
return (
<View>
<Text style={{ fontSize: 30, textAlign: 'center', marginTop: 25 }}>
Buscar Filmes
</Text>
<TextInput
style={{ borderWidth: 1, margin: 10, padding: 8 }}
placeholder="Digite o nome do filme"
value={movieTitle}
onChangeText={(text) => setMovieTitle(text)}
/>
<Button title="Buscar Filme" onPress={handleSearch} />
{location && (
<View>
<Text style={{ fontSize: 20, fontWeight: 'bold' }}>Sua Localização</Text>
<Text>Latitude: {location.coords.latitude}</Text>
<Text>Longitude: {location.coords.longitude}</Text>
<MapView
style={{ width: '100%', height: 180 }}
initialRegion={{
latitude: location.coords.latitude,
longitude: location.coords.longitude,
latitudeDelta: -8.0572,
longitudeDelta: -34.8816,
}}
>
<Marker
coordinate={{
latitude: location.coords.latitude,
longitude: location.coords.longitude,
}}
title="Sua Localização"
/>
</MapView>
</View>
)}
{movieData && (
<View style={{ margin: 20 }}>
<Text style={{ fontSize: 18, fontWeight: 'bold' }}>{movieData.Title}</Text>
<Text>Ano: {movieData.Year}</Text>
<Text>Gênero: {movieData.Genre}</Text>
<Text>Diretor: {movieData.Director}</Text>
<Text>Prêmios: {movieData.Awards}</Text>
</View>
)}
</View>
);
};
export default App;
