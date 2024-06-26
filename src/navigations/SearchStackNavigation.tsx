import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import Search from '../screens/Search'
import MovieDetail from '../screens/MovieDetail'
import MovieGenre from '../screens/MovieGenre'

const Stack = createNativeStackNavigator()

const SearchStackNavigation = (): JSX.Element => {
    return (
        <Stack.Navigator initialRouteName="Search">
            <Stack.Screen
                name="Search"
                component={Search}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="MovieDetail" component={MovieDetail} />
            <Stack.Screen name="MovieGenre" component={MovieGenre} />
        </Stack.Navigator>
    )
}

export default SearchStackNavigation
