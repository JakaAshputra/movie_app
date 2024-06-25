import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import MovieItem from '../components/MovieItem'
import type { Movie } from '../types/app'
import { StackActions, useNavigation } from '@react-navigation/native'

const Favorite = (): JSX.Element => {
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
    const navigation = useNavigation()
    const pushNavigation = (movie: Movie) => {
        navigation.dispatch(StackActions.push('MovieDetail', { id: movie.id }))
    }

    useEffect(() => {
        const fetchFavoriteMovies = async () => {
            try {
                const favoriteMoviesData: string | null =
                    await AsyncStorage.getItem('@FavoriteList')
                if (favoriteMoviesData !== null) {
                    const parsedFavoriteMovies: Movie[] =
                        JSON.parse(favoriteMoviesData)
                    setFavoriteMovies(parsedFavoriteMovies)
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchFavoriteMovies()
    }, [favoriteMovies])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Favorite Movies</Text>
            {favoriteMovies.length > 0 ? (
                <FlatList
                    data={favoriteMovies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => pushNavigation(item)}>
                            <MovieItem
                                movie={item}
                                size={styles.movieItem}
                                coverType="poster"
                            />
                        </TouchableOpacity>
                    )}
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <Text style={styles.noFavoriteText}>
                    No favorite movies yet.
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    movieItem: {
        flex: 1,
        margin: 5,
        width: 100,
        height: 150,
    },
    noFavoriteText: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
    },
})

export default Favorite
