import { View, Text, Image, SafeAreaView, Touchable, TouchableOpacity, ScrollView } from "react-native";
import React, { useCallback, useState } from "react";
import tw from 'twrnc';
import { StatusBar } from "expo-status-bar";
import { TextInput } from "react-native";
import { debounce } from 'lodash';

import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { MapPinIcon } from 'react-native-heroicons/solid'
import { fetchInfoPrevision, fetchLocations } from "../api/meteo";
import { weatherImages } from "../constants";

export default function HomeScreen() {

    const [showSearch, setShowSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [meteo, setMeteo] = useState({});

    const handleLocation = (loc) => {
        console.log('locations', loc);
        setLocations([]);
        setShowSearch(false);
        fetchInfoPrevision({
            cityName: loc.name,
            days: '7'
        }).then(data => {
            setMeteo(data);
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

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200, []));
    const { location, current } = meteo;


    return (
        <View style={tw`flex-1 justify-center items-center`}>
            <StatusBar style="light" />
            <Image blurRadius={70} source={require('../assets/img/bg.png')}
                style={tw`absolute h-full w-full`} />
            <SafeAreaView style={tw`flex flex-1`}>
                {/* Search section */}
                <View style={tw`relative z-50 mt-12`}>
                    <View style={tw`flex-row justify-end items-center border border-slate-400 m-auto bg-transparent w-85 roundedfull`}>

                        {
                            showSearch ? (
                                <TextInput onChangeText={handleTextDebounce} placeholderTextColor={'lightgray'} placeholder="Rechercher une ville" style={tw`text-center text-white mx-auto my-2`} />

                            ) : null
                        }

                        <TouchableOpacity style={tw`bg-white roundedfull p-3 m-1`} onPress={() => setShowSearch(!showSearch)}>
                            <MagnifyingGlassIcon style={tw`text-black `} />
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
                            Prévision quotidienne
                        </Text>
                    </View>


                    <ScrollView
                        horizontal
                        contentContainerStyle={{ height: 100, paddingHorizontal: 15 }}
                    >

                        <View style={tw`flex justify-center items-center w-24 rounded-3xl py-3 mt-1 bg-slate-400 mr-4`} >
                            <Image style={tw`w-8 h-8`} source={require('../assets/img/heavyrain.png')} />
                            <Text style={tw`text-white`}>Lundi</Text>
                            <Text style={tw`text-white text-xl font-semibold`}>13°</Text>
                        </View>

                        <View style={tw`flex justify-center items-center w-24 rounded-3xl py-3 mt-1 bg-slate-400 mr-4`} >
                            <Image style={tw`w-8 h-8`} source={require('../assets/img/heavyrain.png')} />
                            <Text style={tw`text-white`}>Mardi</Text>
                            <Text style={tw`text-white text-xl font-semibold`}>13°</Text>
                        </View>

                        <View style={tw`flex justify-center items-center w-24 rounded-3xl py-3 mt-1 bg-slate-400 mr-4`} >
                            <Image style={tw`w-8 h-8`} source={require('../assets/img/heavyrain.png')} />
                            <Text style={tw`text-white`}>Mercredi</Text>
                            <Text style={tw`text-white text-xl font-semibold`}>13°</Text>
                        </View>
                        <View style={tw`flex justify-center items-center w-24 rounded-3xl py-3 mt-1 bg-slate-400 mr-4`} >
                            <Image style={tw`w-8 h-8`} source={require('../assets/img/heavyrain.png')} />
                            <Text style={tw`text-white`}>Jeudi</Text>
                            <Text style={tw`text-white text-xl font-semibold`}>13°</Text>
                        </View>
                        <View style={tw`flex justify-center items-center w-24 rounded-3xl py-3 mt-1 bg-slate-400 mr-4`} >
                            <Image style={tw`w-8 h-8`} source={require('../assets/img/heavyrain.png')} />
                            <Text style={tw`text-white`}>Vendredi</Text>
                            <Text style={tw`text-white text-xl font-semibold`}>13°</Text>
                        </View>
                        <View style={tw`flex justify-center items-center w-24 rounded-3xl py-3 mt-1 bg-slate-400 mr-4`} >
                            <Image style={tw`w-8 h-8`} source={require('../assets/img/heavyrain.png')} />
                            <Text style={tw`text-white`}>Samedi</Text>
                            <Text style={tw`text-white text-xl font-semibold`}>13°</Text>
                        </View>
                        <View style={tw`flex justify-center items-center w-24 rounded-3xl py-3 mt-1 bg-slate-400 mr-4`} >
                            <Image style={tw`w-8 h-8`} source={require('../assets/img/heavyrain.png')} />
                            <Text style={tw`text-white`}>Dimanche</Text>
                            <Text style={tw`text-white text-xl font-semibold`}>13°</Text>
                        </View>
                    </ScrollView>

                </View>
            </SafeAreaView >
        </View >
    )

}