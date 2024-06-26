import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import type { Movie } from '../types/app'
import { API_ACCESS_TOKEN } from '@env'
import MovieItem from '../components/movie/MovieItem'
import { StackActions, useNavigation } from '@react-navigation/native'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MovieGenre = ({ route }: any) => {
    const [movies, setMovies] = useState<Movie[]>([])
    const [genreName, setGenreName] = useState<string>('')
    const { id } = route.params
    const navigation = useNavigation()
    const pushNavigation = (movie: Movie) => {
        navigation.dispatch(StackActions.push('MovieDetail', { id: movie.id }))
    }

    useEffect(() => {
        getGenreName()
        getMovieList()
    }, [id])

    const getGenreName = (): void => {
        const url = `https://api.themoviedb.org/3/genre/movie/list?language=en-US`
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_ACCESS_TOKEN}`,
            },
        }
        fetch(url, options)
            .then(async (response) => await response.json())
            .then((response) => {
                const genre = response.genres.find(
                    (genre: { id: number }) => genre.id === id,
                )
                if (genre) {
                    setGenreName(genre.name)
                }
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const getMovieList = (): void => {
        const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${id}`
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_ACCESS_TOKEN}`,
            },
        }
        fetch(url, options)
            .then(async (response) => await response.json())
            .then((response) => {
                setMovies(response.results)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    return (
        <View style={styles.container}>
            <Text>Movies in the {genreName} genre:</Text>
            <FlatList
                data={movies}
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
    movieItem: {
        flex: 1,
        margin: 5,
        width: 100,
        height: 150,
    },
})

export default MovieGenre
