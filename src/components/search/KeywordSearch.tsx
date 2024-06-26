import React, { useEffect, useState } from 'react'
import {
    View,
    TextInput,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { API_ACCESS_TOKEN } from '@env'
import type { Movie } from '../../types/app'
import MovieItem from '../movie/MovieItem'
import { StackActions } from '@react-navigation/native'

const KeywordSearch = ({ navigation }: any): JSX.Element => {
    const [keyword, setKeyword] = useState('')
    const [movies, setMovies] = useState<Movie[]>([])
    const pushNavigation = (movie: Movie) => {
        navigation.dispatch(StackActions.push('MovieDetail', { id: movie.id }))
    }

    useEffect(() => {
        getMovieList()
    }, [])

    const getMovieList = (): void => {
        const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=en-US&page=1`
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
                // console.log('API Response:', response)
                setMovies(response.results)
            })
            .catch((errorResponse) => {
                console.error(errorResponse)
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <FontAwesome
                    name="search"
                    size={20}
                    color="gray"
                    style={styles.icon}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Input title movie here"
                    placeholderTextColor="gray"
                    onChangeText={(text) => setKeyword(text)}
                    onSubmitEditing={() => getMovieList()}
                    value={keyword}
                />
            </View>
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
                style={{ height: 610, marginTop: 10 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    inputContainer: {
        height: 50,
        backgroundColor: '#edebeb',
        borderRadius: 30,
        width: 365,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    icon: {
        position: 'absolute',
        right: 20,
        top: 12,
    },
    input: {
        flex: 1,
        height: '100%',
    },
    movieItem: {
        margin: 5,
        width: 100,
        height: 150,
    },
})

export default KeywordSearch
