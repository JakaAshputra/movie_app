import React, { useEffect, useState } from 'react'
import { 
  ScrollView, 
  Text, 
  View, 
  StyleSheet,
  ImageBackground, 
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome } from '@expo/vector-icons'
import { API_ACCESS_TOKEN } from '@env'
import type { Movie } from '../types/app'
import MovieList from '../components/MovieList'

const MovieDetail = ({ route }: any): JSX.Element => {
  const [detailMovie, setDetailMovie] = useState<Movie | null>(null)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const { id } = route.params

  useEffect(() => {
    getMovieDetail()
    // checkIsFavorite(id).then(setIsFavorite)
}, [id])

  const getMovieDetail = () : void => {
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`
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
            setDetailMovie(response)
        })
        .catch((errorResponse) => {
            console.log(errorResponse)
        })
  }

  const checkIsFavorite = async (id: number): Promise<boolean> => {
    try {
        const initialData: string | null =
            await AsyncStorage.getItem('@FavoriteList')
        if (initialData !== null) {
            const favMovieList: Movie[] = JSON.parse(initialData)
            return favMovieList.some((movie) => movie.id === id)
        }
        return false
    } catch (error) {
        console.log(error)
        return false
    }
}

if (!detailMovie) {
    return (
        <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    )
}

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem(
        '@FavoriteList'
      )
      // console.log(initialData)
      console.log("ini movie", movie)
  
      let favMovieList: Movie[] = []
  
      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie]
      } else {
        favMovieList = [movie]
      }
  
      await AsyncStorage.setItem(
        '@FavoriteList', 
        JSON.stringify(favMovieList)
      )
      setIsFavorite(true)
      
    } catch (error) {
      console.log(error)
    }
  }

  const removeFavorite = async (movieId: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem(
        '@FavoriteList'
      )
      // console.log(initialData)
      if (initialData !== null) {
        const favMovieList: Movie[] = JSON.parse(initialData)
        const upatedFavMovieList = favMovieList.find(
          (movie) => movie.id === movieId,
        )
        // console.log("update", upatedFavMovieList)
        await AsyncStorage.setItem(
          '@FavoriteList', 
          JSON.stringify(upatedFavMovieList),
        )
        setIsFavorite(false)
      }
    } catch (error) {
      console.log('Error removing favorite:', error)
      console.log("id", movieId)
    }
  }

  if (!detailMovie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
<ScrollView>
  <View style={styles.container}>
      <ImageBackground
        style={styles.poster}
        resizeMode="cover"
        source={{
          uri: `https://image.tmdb.org/t/p/w500${detailMovie.poster_path}`,
        }}
      >
        <LinearGradient
        colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
        locations={[0.6, 0.8]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{detailMovie.title}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="yellow" />
            <Text style={styles.rating}>{detailMovie.vote_average.toFixed(1)}</Text>
          </View>
        </View>
        <View style={styles.favoriteIcon}>
                        <FontAwesome
                            name={isFavorite ? 'heart' : 'heart-o'}
                            size={24}
                            color="pink"
                            onPress={() => {
                                if (isFavorite) {
                                    removeFavorite(detailMovie.id)
                                } else {
                                    addFavorite(detailMovie)
                                }
                            }}
                        />
                    </View>
      </LinearGradient>
      </ImageBackground>
      
      <Text style={styles.overview}>{detailMovie.overview}</Text>

      <View style={styles.additionalInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.boldText}>Original Language:</Text>
              <Text style={styles.infoText}>{detailMovie.original_language}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.boldText}>Release Date:</Text>
              <Text style={styles.infoText}>
                {new Date(detailMovie.release_date).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      weekday: 'short',
                    },
               )}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.boldText}>Popularity:</Text>
              <Text style={styles.infoText}>{detailMovie.popularity}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.boldText}>Vote Count:</Text>
              <Text style={styles.infoText}>{detailMovie.vote_count}</Text>
              {/* <Text style={styles.infoText}>{detailMovie.id}</Text> */}
            </View>
      </View>
  </View>
  <View style={styles.container}>
    <MovieList
      title="Recommendations"
      path={`/movie/${id}/recommendations?language=en-US&page=1`}
      coverType="poster"
    />
  </View>
</ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  poster: {
    width: '100%',
    height: 400,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  overview: {
    fontSize: 16,
    color: '#0d0c0c',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: 'yellow',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  recommendations: {
    marginTop: 24,
    marginBottom: 24,
  },
  recommendationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  movieList: {
    paddingLeft: 4,
  },
  purpleLabel: {
    width: 20,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8978A4',
    marginRight: 12,
  },
  header: {
    marginLeft: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },
  additionalInfo: {
    flexDirection: 'row',
    flexWrap:'wrap',
    marginBottom: 4,
    width: '100%',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  infoText: {
    color: '#0d0c0c',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  infoItem: {
    paddingHorizontal: 10,
    width: '50%',
  },
  favoriteIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
})

export default MovieDetail
