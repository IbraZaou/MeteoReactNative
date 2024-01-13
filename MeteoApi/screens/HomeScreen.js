import { View, Text, Image, SafeAreaView, Touchable, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import tw from 'twrnc';
import { StatusBar } from "expo-status-bar";
import { TextInput } from "react-native";
import { debounce } from 'lodash';

import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { MapPinIcon } from 'react-native-heroicons/solid'
import { fetchInfoPrevision, fetchLocations } from "../api/meteo";
import { weatherImages } from "../constants";
import { getData, storeData } from "../utils/asyncStorage";

export default function HomeScreen() {

    const [showSearch, setShowSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [meteo, setMeteo] = useState({});
    const [chargement, setChargement] = useState(false);

    const handleLocation = (loc) => {
        console.log('locations', loc);
        setLocations([]);
        setShowSearch(false);
        setChargement(true);
        fetchInfoPrevision({
            cityName: loc.name,
            days: '7'
        }).then(data => {
            setMeteo(data);
            setChargement(false);
            storeData('ville', loc.name)
            console.log('prévision: ', data);
        })
    }


    const handleSearch = value => {
        // Fetch locations
        if (value.length > 2) {
            fetchLocations({ cityName: value }).then(data => {
                setLocations(data);
            })
        }
    }

    useEffect(() => {
        fetchMeteoData();
    }, [])

    const fetchMeteoData = async () => {
        let maVille = await getData('ville');
        let cityName = 'Lyon';
        if (maVille) cityName = maVille;
        fetchInfoPrevision({
            cityName: 'Lyon',
            days: '7'
        }).then(data => {
            setMeteo(data);
            setChargement(false);
        })
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200, []));
    const { location, current } = meteo;


    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={tw`flex-1 relative`}>
                <StatusBar style="light" />
                <Image blurRadius={70} source={require('../assets/img/bg.png')}
                    style={tw`absolute h-full w-full`} />
                {
                    chargement ? (
                        <View style={tw`flex-1 flex-row justify-center items-center`}>
                            <Text style={tw`text-white text-lg`}>Chargement...</Text>
                        </View>
                    ) : (
                        <SafeAreaView style={tw`flex flex-1`}>
                            {/* Search section */}
                            <View style={tw`relative z-50 mt-12`}>
                                <View style={tw`flex-row `}>

                                    {
                                        showSearch ? (
                                            <TextInput onChangeText={handleTextDebounce} placeholderTextColor={'lightgray'} placeholder="Rechercher une ville" style={tw`text-center text-white mx-auto my-2 justify-end items-center m-auto bg-transparent w-60 roundedfull py-3 border border-slate-400`} />

                                        ) : null
                                    }

                                    <TouchableOpacity style={tw`bg-white roundedfull absolute right-1 p-3 m-1`} onPress={() => setShowSearch(!showSearch)}>
                                        <MagnifyingGlassIcon style={tw`text-black`} />
                                    </TouchableOpacity>

                                </View>
                                {
                                    locations.length > 0 && showSearch ? (
                                        <View style={tw`absolute bg-gray-300 top-16 rounded-3xl left-5 w-85 `} >
                                            {
                                                locations.map((loc, index) => {
                                                    let showBorder = index + 1 != locations.length;
                                                    let borderClass = showBorder ? tw`border-b-2 border-b-gray-400` : tw``;
                                                    return (
                                                        <TouchableOpacity onPress={() => handleLocation(loc)} key={index} style={[tw`flex-row items-center border-0 p-3 px-4 mb-1`, borderClass]}>
                                                            <MapPinIcon style={tw`text-black`} />
                                                            <Text style={tw`text-black text-lg ml-2`}>{loc.name} - {loc.country}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>
                                    ) : null
                                }
                            </View>
                            {/* Forecast section */}
                            <View style={tw`mx-4 flex justify-around flex-1 mb-2`}>
                                {/* Location */}
                                {location ? (
                                    <Text style={tw`text-white text-center text-2xl`}>
                                        {location.name},
                                        <Text style={tw`text-lg font-semibold text-gray-300`}>
                                            {" " + location.country}
                                        </Text>
                                    </Text>
                                ) : (
                                    <Text style={tw`text-white text-center text-2xl`}>Loading location...</Text>
                                )}


                                <View style={tw`flex-row justify-center`}>
                                    {/* Weather image */}
                                    <Image style={tw`w-52 h-52`} source={weatherImages[current?.condition?.text || 'other']} />
                                </View>

                                {/* Degres */}
                                <View style={tw`my-2`}>
                                    <Text style={tw`text-white text-center font-bold text-6xl ml-5`}>
                                        {current?.temp_c}°
                                    </Text>
                                    <Text style={tw`text-white text-center font-light text-xl tracking-widest ml-5`}>
                                        {current?.condition?.text}
                                    </Text>
                                </View>
                                {/* other stats */}
                                <View style={tw`flex flex-row justify-between mx-auto w-75`}>
                                    <View style={tw`flex-row items-center my-2`}>
                                        <Image style={tw`w-8 h-8`} source={require('../assets/icons/wind.png')} />
                                        <Text style={tw`text-white font-semibold text-base ml-2`} >
                                            {current?.wind_kph}km
                                        </Text>
                                    </View>

                                    <View style={tw`flex-row items-center my-2`}>
                                        <Image style={tw`w-8 h-8`} source={require('../assets/icons/drop.png')} />
                                        <Text style={tw`text-white font-semibold text-base ml-2`} >
                                            {current?.humidity}%
                                        </Text>
                                    </View>

                                    <View style={tw`flex-row items-center my-2`}>
                                        <Image style={tw`w-8 h-8`} source={require('../assets/icons/sun.png')} />
                                        <Text style={tw`text-white font-semibold text-base ml-2`} >
                                            {meteo?.forecast?.forecastday[0]?.astro?.sunrise}
                                        </Text>
                                    </View>
                                </View>

                            </View>

                            {/* forecast for next days */}

                            <View style={tw`mb-2 flex-0.3 py-3`}>
                                <View style={tw`flex-row items-center mx-5 py-2`}>
                                    <CalendarDaysIcon style={tw`h-22 w-22 text-white`} />
                                    <Text style={tw`text-white text-base ml-2`}>
                                        Prévision pour la semaine
                                    </Text>
                                </View>


                                <ScrollView
                                    horizontal
                                    contentContainerStyle={{ height: 120, paddingHorizontal: 5 }}
                                    showsHorizontalScrollIndicator={false}
                                >

                                    {
                                        meteo?.forecast?.forecastday?.map((item, index) => {
                                            let date = new Date(item.date);
                                            let options = { weekday: 'long' };
                                            let dayName = date.toLocaleDateString('fr-FR', options);
                                            dayName = dayName.split(',')[0];

                                            return (
                                                <View key={index} style={tw`flex justify-center items-center w-24 rounded-3xl px-4 text-center py-3 mt-1 bg-transparent border border-slate-400 mr-4`} >
                                                    <Text style={tw`text-white text-center`}>{dayName}</Text>

                                                    <Image style={tw`w-8 h-8`} source={weatherImages[item?.day?.condition?.text || 'other']} />
                                                    <Text style={tw`text-white text-xl font-semibold`}>{item?.day?.avgtemp_c}°</Text>
                                                </View>
                                            )

                                        })
                                    }
                                </ScrollView>

                            </View>
                        </SafeAreaView >
                    )
                }

            </View >
        </KeyboardAvoidingView>
    )

}