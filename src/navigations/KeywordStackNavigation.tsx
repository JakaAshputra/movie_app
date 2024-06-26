import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import MovieDetail from '../screens/MovieDetail'
import KeywordSearch from '../components/search/KeywordSearch'

const Stack = createNativeStackNavigator()

const KeywordStackNavigation = (): JSX.Element => {
    return (
        <Stack.Navigator initialRouteName="KeywordSearch">
            <Stack.Screen
                name="KeywordSearch"
                component={KeywordSearch}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="MovieDetail" component={MovieDetail} />
        </Stack.Navigator>
    )
}

export default KeywordStackNavigation
