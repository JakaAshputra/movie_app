import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { API_ACCESS_TOKEN } from '@env'
import { Genre, Movie } from '../../types/app'
import MovieItem from '../movies/MovieItem'

const CategorySearch = () => {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    fetchGenres()
  }, [])

  useEffect(() => {
    if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre)
    }
  }, [selectedGenre])

  const fetchGenres = async () => {
    const url = `https://api.themoviedb.org/3/genre/movie/list`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      setGenres(data.genres)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchMoviesByGenre = async (genreId: number) => {
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      const movies = data.results
      setMovies(movies)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Category Search</Text>
      <View style={styles.genreList}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={[
              styles.genreItem,
              selectedGenre === genre.id
                ? styles.selectedGenreItem
                : styles.unselectedGenreItem,
            ]}
            onPress={() => setSelectedGenre(genre.id)}
          >
            <Text style={styles.genreText}>{genre.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.moviesContainer}>
        {movies.map((movie) => (
          <MovieItem
            key={movie.id}
            movie={movie}
            size={styles.movieItem}
            coverType="poster"
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  genreList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genreItem: {
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedGenreItem: {
    backgroundColor: '#8978A4',
  },
  unselectedGenreItem: {
    backgroundColor: '#C0B4D5',
  },
  genreText: {
    color: '#fff',
  },
  moviesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  movieItem: {
    width: 110,
    height: 200,
    marginBottom: 16,
  },
})

export default CategorySearch