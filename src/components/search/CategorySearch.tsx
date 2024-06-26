/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ACCESS_TOKEN } from '@env'
import React, { useEffect, useState } from 'react'
import {
    FlatList,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native'
import type { MovieCategoryProps } from '../../types/app'
import { StackActions } from '@react-navigation/native'

const CategorySearch = ({ navigation }: any): JSX.Element => {
    const [genres, setGenres] = useState<MovieCategoryProps[]>([])
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
    const pushNavigation = () => {
        navigation.dispatch(
            StackActions.push('MovieGenre', { id: selectedGenre }),
        )
    }

    useEffect(() => {
        getMovieGenres()
    }, [])

    const getMovieGenres = (): void => {
        const url = `https://api.themoviedb.org/3/genre/movie/list?language=en`
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
                setGenres(response.genres)
                // console.log(response.genres)
            })
            .catch((errorResponse) => {
                console.error(errorResponse)
            })
    }

    const handleGenreSelect = (genreId: number): void => {
        setSelectedGenre(genreId)
        console.log(genreId)
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={genres}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.genreItem,
                            selectedGenre === item.id &&
                                styles.selectedGenreItem,
                        ]}
                        onPress={() => handleGenreSelect(item.id)}
                    >
                        <Text
                            style={[
                                styles.genreText,
                                selectedGenre === item.id &&
                                    styles.selectedGenreText,
                            ]}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
                numColumns={2}
                style={styles.genreContainer}
            />
            <View style={styles.buttonWrapper}>
                <TouchableOpacity>
                    <Text onPress={pushNavigation}>Search</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    genreContainer: {
        marginTop: 12,
    },
    genreItem: {
        borderRadius: 10,
        backgroundColor: '#C0B4D5',
        marginVertical: 6,
        marginHorizontal: 6,
        width: 150,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedGenreItem: {
        backgroundColor: '#8978A4',
    },
    genreText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    selectedGenreText: {
        color: '#fff',
    },
    buttonWrapper: {
        borderRadius: 20,
        backgroundColor: '#C0B4D5',
        width: 300,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
    },
})

export default CategorySearch
