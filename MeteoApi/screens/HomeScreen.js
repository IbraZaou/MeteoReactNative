import { View, Text, Image, SafeAreaView, Touchable, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import tw from 'twrnc';
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import { TextInput } from "react-native";

import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { MapPinIcon } from 'react-native-heroicons/solid'

export default function HomeScreen() {

    const [showSearch, setShowSearch] = useState(false);
    const [locations, setLocations] = useState([1, 2, 3])

    const handleLocation = (loc) => {
        console.log(loc);
    }


    return (
        <View style={tw`flex-1 justify-center items-center`}>
            <StatusBar style="light" />
            <Image blurRadius={70} source={require('../assets/img/bg.png')}
                style={tw`absolute h-full w-full`} />
            <SafeAreaView style={tw`flex flex-1`}>
                {/* Search section */}
                <View style={tw`relative z-50 mt-12`}>
                    <View style={tw`flex-row justify-end items-center bg-transparent w-75 roundedfull`}>

                        {
                            showSearch ? (
                                <TextInput placeholderTextColor={'lightgray'} placeholder="Rechercher une ville" style={tw`text-center text-white mx-auto my-2`} />

                            ) : null
                        }

                        <TouchableOpacity style={tw`bg-white roundedfull p-3 m-1`} onPress={() => setShowSearch(!showSearch)}>
                            <MagnifyingGlassIcon style={tw`text-black `} />
                        </TouchableOpacity>

                    </View>
                    {
                        locations.length > 0 && showSearch ? (
                            <View style={tw`absolute w-full bg-gray-300 top-16 rounded-3xl`} >
                                {
                                    locations.map((loc, index) => {
                                        let showBorder = index + 1 != locations.length;
                                        let borderClass = showBorder ? tw`border-b-2 border-b-gray-400` : tw``;
                                        return (
                                            <TouchableOpacity key={index} style={[tw`flex-row items-center border-0 p-3 px-4 mb-1`, borderClass]}>
                                                <MapPinIcon style={tw`text-black`} />
                                                <Text style={tw`text-black text-lg ml-2`}>London, United Kingdom </Text>
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
                    <Text style={tw`text-white text-center text-2xl`}>
                        London,
                        <Text style={tw`text-lg font-semibold text-gray-300`}>
                            United Kingdom
                        </Text>
                    </Text>


                    <View style={tw`flex-row justify-center`}>
                        {/* Weather image */}
                        <Image style={tw`w-52 h-52`} source={require('../assets/img/partlycloudy.png')} />
                    </View>

                    {/* Degres */}
                    <View style={tw`my-2`}>
                        <Text style={tw`text-white text-center font-bold text-6xl ml-5`}>
                            24°
                        </Text>
                        <Text style={tw`text-white text-center font-light text-xl tracking-widest ml-5`}>
                            partiellement nuageux
                        </Text>
                    </View>
                    {/* other stats */}
                    <View style={tw`flex flex-row justify-between mx-auto w-60`}>
                        <View style={tw`flex-row items-center my-2`}>
                            <Image style={tw`w-8 h-8`} source={require('../assets/icons/wind.png')} />
                            <Text style={tw`text-white font-semibold text-base ml-2`} >
                                22km
                            </Text>
                        </View>

                        <View style={tw`flex-row items-center my-2`}>
                            <Image style={tw`w-8 h-8`} source={require('../assets/icons/drop.png')} />
                            <Text style={tw`text-white font-semibold text-base ml-2`} >
                                17%
                            </Text>
                        </View>

                        <View style={tw`flex-row items-center my-2`}>
                            <Image style={tw`w-8 h-8`} source={require('../assets/icons/sun.png')} />
                            <Text style={tw`text-white font-semibold text-base ml-2`} >
                                6h00
                            </Text>
                        </View>
                    </View>

                </View>

                {/* forecast for next days */}

                <View style={tw`mb-2 py-3`}>
                    <View style={tw`flex-row items-center mx-5 py-2`}>
                        <CalendarDaysIcon style={tw`h-22 w-22 text-white`} />
                        <Text style={tw`text-white text-base ml-2`}>
                            Prévision quotidienne
                        </Text>
                    </View>


                    <ScrollView
                        horizontal
                        contentContainerStyle={{ paddingHorizontal: 15 }}
                        showsHorizontalScrollIndicator={false}
                        //Problème avec le scrollView et la hauteur
                        style={{ height: 100 }}
                    >

                        <View style={tw`flex justify-center items-center w-24 rounded-3xl py-3 mt-1 bg-white mr-4`} >
                            <Image style={tw`w-8 h-8`} source={require('../assets/img/heavyrain.png')} />
                        </View>

                    </ScrollView>

                </View>
            </SafeAreaView >
        </View >
    )

}