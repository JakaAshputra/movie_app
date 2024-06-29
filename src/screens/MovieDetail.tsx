import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet,ScrollView,ImageBackground,TouchableOpacity,Alert, } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { API_ACCESS_TOKEN } from "@env";
import { FontAwesome } from '@expo/vector-icons'
import { Movie, MovieListProps } from '../types/app'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import MovieList from '../components/movies/MovieList'
import AsyncStorage from '@react-native-async-storage/async-storage'

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params
  const [movieDetail, setMovieDetail] = useState<Movie>()
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false) // State untuk favorit
  const navigation = useNavigation()

   useEffect(() => {
    getMovieDetail()
    checkIsFavorite()
  }, [])

  const getMovieDetail = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}`
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
        console.log(response)
        setMovieDetail(response)
        setLoading(false)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
        setLoading(false)
      })
  }

  const checkIsFavorite = async (): Promise<void> => {
    try {
      const storedData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      if (storedData !== null) {
        const favoriteList: Movie[] = JSON.parse(storedData)
        const isFav: boolean = favoriteList.some((item) => item.id === id)
        setIsFavorite(isFav)
      }
    } catch (error) {
      console.log('Error checking favorite:', error)
    }
  }

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const storedData: string | null =
        await AsyncStorage.getItem('@FavoriteList')
      let favMovieList: Movie[] = []

      if (storedData !== null) {
        favMovieList = [...JSON.parse(storedData), movie]
      } else {
        favMovieList = [movie]
      }

      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList))
      setIsFavorite(true)
      // Alert.alert('Success', 'Added to favorites!')
    } catch (error) {
      console.log('Error adding to favorite:', error)
      // Alert.alert('Error', 'Failed to add to favorites.')
    }
  }

  const removeFavorite = async (): Promise<void> => {
    try {
      const storedData: string | null =
        await AsyncStorage.getItem('@FavoriteList')

      if (storedData !== null) {
        let favMovieList: Movie[] = JSON.parse(storedData)
        favMovieList = favMovieList.filter((item) => item.id !== id)

        await AsyncStorage.setItem(
          '@FavoriteList',
          JSON.stringify(favMovieList),
        )
        setIsFavorite(false)
        // Alert.alert('Success', 'Removed from favorites!')
      }
    } catch (error) {
      console.log(error)
      // Alert.alert('Error', 'Failed to remove from favorites.')
    }
  }

  const handleFavorite = (event: any): void => {
    event.persist() // Persist the event to prevent issues with event pooling

    if (isFavorite) {
      // Remove from favorites
      removeFavorite()
    } else {
      // Add to favorites
      if (movieDetail) {
        addFavorite(movieDetail)
      }
    }
  }

  const movieLists: MovieListProps[] = [
    {
      title: 'Recommendations',
      path: `/movie/${id}/recommendations`,
      coverType: 'poster',
    },
  ]

  const handleBack = (): void => {
    navigation.goBack()
  }

 return (
    <>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Feather name="arrow-left" size={28} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Movie Detail</Text>
      </View> */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <ImageBackground
            resizeMode="cover"
            style={styles.backgroundImage}
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movieDetail?.backdrop_path || movieDetail?.poster_path}`,
            }}
          >
            <LinearGradient
              colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
              locations={[0.6, 0.8]}
              style={styles.gradientStyle}
            >
              <View style={styles.rowBgTop}>
                <View style={styles.colBgTop}>
                  <Text style={styles.movieTitle}>{movieDetail?.title}</Text>
                  <View style={styles.ratingContainer}>
                    <FontAwesome name="star" size={16} color="yellow" />
                    <Text style={styles.rating}>
                      {movieDetail?.vote_average.toFixed(1)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={handleFavorite}
                  style={styles.coverIcon}
                >
                  <FontAwesome
                    name={isFavorite ? 'heart' : 'heart-o'}
                    size={28}
                    color="pink"
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>

          <Text style={styles.overview}>{movieDetail?.overview}</Text>
          <View style={styles.detailContainer}>
            <View style={styles.detailColumn}>
              <Text style={styles.subDesc}>Original Language</Text>
              <Text style={styles.textDesc}>
                {movieDetail?.original_language}
              </Text>
              <Text style={styles.subDesc}>Release Date</Text>
              <Text style={styles.textDesc}>
                {movieDetail?.release_date.toString()}
              </Text>
            </View>
            <View style={styles.detailColumn}>
              <Text style={styles.subDesc}>Popularity</Text>
              <Text style={styles.textDesc}>{movieDetail?.popularity}</Text>
              <Text style={styles.subDesc}>Vote Count</Text>
              <Text style={styles.textDesc}>{movieDetail?.vote_count}</Text>
            </View>
          </View>

          <View style={styles.movieListsContainer}>
            {movieLists.map((movieList) => (
              <MovieList
                key={movieList.title}
                title={movieList.title}
                path={movieList.path}
                coverType={movieList.coverType}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 16,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    marginLeft: 12,
  },
  backgroundImage: {
    width: '100%',
    height: 250,
  },
  movieTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gradientStyle: {
    padding: 8,
    height: '100%',
    width: '100%',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    color: 'yellow',
    fontWeight: '700',
    marginLeft: 4,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 16,
  },
  detailColumn: {
    flex: 1,
    marginRight: 16,
  },
  overview: {
    fontSize: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  textDesc: {
    fontSize: 16,
    marginBottom: 8,
  },
  subDesc: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
   movieListsContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  rowBgTop: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  colBgTop: {
    flex: 1,
  },
  coverIcon: {
    textAlign: 'right',
    marginBottom: 12,
  },
})

export default MovieDetail;