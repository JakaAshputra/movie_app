import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, StyleSheet, FlatList, ImageBackground } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome } from '@expo/vector-icons'
import { API_ACCESS_TOKEN } from '@env'
import MovieItem from '../components/movies/MovieItem'

const coverImageSize = {
  backdrop: {
    width: 280,
    height: 160,
  },
  poster: {
    width: 100,
    height: 160,
  },
}

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params
  const [movieDetail, setMovieDetail] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<Movie[]>([])

  useEffect(() => {
    fetchMovieDetail()
    fetchRecommendations()
  }, [])

  const fetchMovieDetail = async () : Promise<void> => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`
      const options = {
        headers: {
          Authorization: `Bearer ${API_ACCESS_TOKEN}`
        }
      }
      const response = await fetch(url, options)
      const data = await response.json()
      setMovieDetail(data)
    } catch (error) {
      console.error('Error fetching movie detail:', error)
    }
  }

  const fetchRecommendations = async () : Promise<void> => {
    try {
      const url = `https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`
      const options = {
        headers: {
          Authorization: `Bearer ${API_ACCESS_TOKEN}`
        }
      }
      const response = await fetch(url, options)
      const data = await response.json()
      setRecommendations(data.results)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  if (!movieDetail) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
<ScrollView>
  <View style={styles.container}>
      {/* Konten MovieDetail */}
      <ImageBackground
        style={styles.poster}
        resizeMode="cover"
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`,
        }}
      >
        <LinearGradient
        colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
        locations={[0.6, 0.8]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{movieDetail.title}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="yellow" />
            <Text style={styles.rating}>{movieDetail.vote_average.toFixed(1)}</Text>
          </View>
        </View>
      </LinearGradient>
      </ImageBackground>
      
      <Text style={styles.overview}>{movieDetail.overview}</Text>

      <View style={styles.additionalInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.boldText}>Original Language:</Text>
              <Text style={styles.infoText}>{movieDetail.original_language}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.boldText}>Release Date:</Text>
              <Text style={styles.infoText}>{movieDetail.release_date}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.boldText}>Popularity:</Text>
              <Text style={styles.infoText}>{movieDetail.popularity}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.boldText}>Vote Count:</Text>
              <Text style={styles.infoText}>{movieDetail.vote_count}</Text>
            </View>
      </View>

      {/* MovieList untuk recommendations */}
      {recommendations.length > 0 && (
        <View style={styles.recommendations}>
          <View style={styles.header}>
            <View style={styles.purpleLabel}></View>
            <Text style={styles.recommendationTitle}>Recommendation</Text>
          </View>
          <FlatList
            style={styles.movieList}
            contentContainerStyle={{ paddingHorizontal: 16 }} // Padding horizontal untuk FlatList
            data={recommendations}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <MovieItem
                movie={item}
                size={coverImageSize.poster}
                coverType="poster"
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}
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
})

export default MovieDetail
