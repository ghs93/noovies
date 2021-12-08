import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, View } from "react-native";
import Swiper from "react-native-swiper";
import { useQuery } from "react-query";
import styled from "styled-components/native";
import { moviesApi } from "../api";
import HMedia from "../components/HMedia";
import Slider from "../components/Slider";
import VMedia from "../components/VMedia";

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ListTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
`;

const TrendingScroll = styled.FlatList`
  margin-top: 20px;
`;

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 20px;
`;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const VSeparator = styled.View`
  width: 20px;
`;
const HSeparator = styled.View`
  height: 20px;
`;

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { isLoading: nowPlayingLoading, data: nowPlayingData } = useQuery(
    "nowPlaying",
    moviesApi.nowPlaying
  );
  const { isLoading: trendingLoading, data: trendingData } = useQuery(
    "trending",
    moviesApi.trending
  );
  const { isLoading: upcomingLoading, data: upcomingData } = useQuery(
    "upcoming",
    moviesApi.upcoming
  );

  const onRefresh = async () => {};
  const renderVMedia = ({ item }) => (
    <VMedia
      posterPath={item.poster_path}
      originalTitle={item.original_title}
      voteAverage={item.vote_average}
    />
  );
  const renderHMedia = ({ item }) => (
    <HMedia
      posterPath={item.poster_path}
      originalTitle={item.original_title}
      overview={item.overview}
      releaseDate={item.release_date}
    />
  );
  const movieKeyExtractor = (item) => item.id + "";
  const loading = nowPlayingLoading || trendingLoading || upcomingLoading;
  return loading ? (
    <Loader>
      <ActivityIndicator color="red" />
    </Loader>
  ) : (
    <FlatList
      ListHeaderComponent={
        <>
          <Swiper
            horizontal
            loop
            autoplay
            autoplayTimeout={3.5}
            showsButtons={false}
            showsPagination={false}
            containerStyle={{
              width: "100%",
              height: SCREEN_HEIGHT / 4,
              marginBottom: 40,
            }}
          >
            {nowPlayingData.results.map((movie) => (
              <Slider
                key={movie.id}
                backdropPath={movie.backdrop_path}
                posterPath={movie.poster_path}
                originalTitle={movie.original_title}
                voteAverage={movie.vote_average}
                overview={movie.overview}
              />
            ))}
          </Swiper>
          <ListTitle>Trending Movies</ListTitle>
          <ListContainer>
            <TrendingScroll
              data={trendingData.results}
              keyExtractor={movieKeyExtractor}
              contentContainerStyle={{ paddingHorizontal: 30 }}
              horizontal
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={VSeparator}
              renderItem={renderVMedia}
            ></TrendingScroll>
          </ListContainer>

          <ComingSoonTitle>Coming Soon</ComingSoonTitle>
        </>
      }
      data={upcomingData.results}
      keyExtractor={movieKeyExtractor}
      ItemSeparatorComponent={HSeparator}
      renderItem={renderHMedia}
    ></FlatList>
  );
};

export default Movies;
